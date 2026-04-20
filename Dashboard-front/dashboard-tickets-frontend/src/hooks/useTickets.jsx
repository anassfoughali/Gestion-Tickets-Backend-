import { useState, useEffect, useCallback } from 'react';
import { ticketsService } from '../services/api';

const useTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [evolutionData, setEvolutionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, statsRes] = await Promise.allSettled([
        ticketsService.getAll(),
        ticketsService.getStatsParJour(),
      ]);

      if (listRes.status === 'fulfilled') {
        setTickets(Array.isArray(listRes.value.data) ? listRes.value.data : []);
      } else {
        setError(listRes.reason?.message ?? 'Erreur chargement tickets');
      }

      if (statsRes.status === 'fulfilled') {
        setEvolutionData(Array.isArray(statsRes.value.data) ? statsRes.value.data : []);
      }
      // evolutionData stays [] on failure — chart falls back gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { tickets, evolutionData, loading, error, refresh: fetchData };
};

export default useTickets;