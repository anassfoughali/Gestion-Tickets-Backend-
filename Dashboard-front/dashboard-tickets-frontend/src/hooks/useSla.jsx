import { useState, useEffect } from 'react';
import { slaService } from '../services/api';

const useSla = () => {
  const [sla,     setSla]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    slaService.getStats()
      .then((res) => {
        setSla(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { sla, loading, error };
};

export default useSla;