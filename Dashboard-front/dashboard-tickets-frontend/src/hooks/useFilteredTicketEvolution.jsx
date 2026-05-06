import { useState, useCallback } from 'react';
import { ticketsService } from '../services/api';

const useFilteredTicketEvolution = () => {
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFilteredData = useCallback(async (dateDebut, dateFin, priorite) => {
    if (!dateDebut || !dateFin || !priorite || priorite === 'tous') {
      setFilteredData(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Map frontend priority values to backend values
      const priorityMap = {
        'critique': 'Critique',
        'majeur': 'Majeur', 
        'mineur': 'Mineur'
      };
      
      const backendPriority = priorityMap[priorite] || priorite;
      
      const response = await ticketsService.getEvolutionFiltered(dateDebut, dateFin, backendPriority);
      
      // The API now returns an array directly, not an object with evolutionParJour property
      setFilteredData(response.data);
    } catch (err) {
      console.error('Error fetching filtered evolution data:', err);
      setError(err.message || 'Erreur lors du chargement des données filtrées');
      setFilteredData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    filteredData, 
    loading, 
    error, 
    fetchFilteredData 
  };
};

export default useFilteredTicketEvolution;