import { useState, useEffect, useCallback } from 'react';
import { technicienService } from '../services/api';

const useTechniciens = () => {
  const [techniciens, setTechniciens] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await technicienService.getAll();
      setTechniciens(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { techniciens, loading, error, refresh: fetchData };
};

export default useTechniciens;
