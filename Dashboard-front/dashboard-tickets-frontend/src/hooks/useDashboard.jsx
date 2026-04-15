import { useState, useEffect } from 'react';
import { ticketsService } from '../services/api';

const useDashboard = () => {
  const [stats,        setStats]        = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [lastUpdated,  setLastUpdated]  = useState(null);

  const fetchData = async () => {
    try {
      const [total, ouverts, enCours, resolus, tempsResolution, resolutionMoyenne] =
        await Promise.all([
          ticketsService.getTotal(),             // → Long
          ticketsService.getOuverts(),           // → { nombreTicketsOuverts }
          ticketsService.getEnCours(),           // → { nombreTicketsEnCours }
          ticketsService.getResolus(),           // → { nombreTicketsResolus }
          ticketsService.getTempsResolution(),   // → List<TempsResolutionDTO>
          ticketsService.getResolutionMoyenne(), // → TempsResolutionMoyenDTO
        ]);

      setStats({
        total:             total.data,
        ouverts:           ouverts.data.nombreTicketsOuverts,
        enCours:           enCours.data.nombreTicketsEnCours,
        resolus:           resolus.data.nombreTicketsResolus,
        tempsResolution:   tempsResolution.data,   // liste par technicien
        resolutionMoyenne: resolutionMoyenne.data, // temps moyen global
        parJour:           [],                     // à brancher quand l'endpoint existe
      });

      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh automatique toutes les 30s
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error, lastUpdated, refresh: fetchData };
};

export default useDashboard;