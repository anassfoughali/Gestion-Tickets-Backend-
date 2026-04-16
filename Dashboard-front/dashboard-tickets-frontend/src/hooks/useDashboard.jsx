import { useState, useEffect, useCallback } from 'react';
import { ticketsService, slaService } from '../services/api';

const isClosedStatus = (status = '') => {
  const s = String(status).toLowerCase().trim();
  return (
    s.includes('clotur') ||
    s.includes('clotur') ||
    s.includes('ferm') ||
    s.includes('resolu') ||
    s.includes('resolu') ||
    s.includes('closed')
  );
};

const parseTicketDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  const directDate = new Date(value);
  if (!Number.isNaN(directDate.getTime())) return directDate;

  if (typeof value === 'string') {
    const m = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (m) {
      const [, dd, mm, yyyy] = m;
      const normalized = new Date(`${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T00:00:00`);
      return Number.isNaN(normalized.getTime()) ? null : normalized;
    }
  }

  return null;
};

const useDashboard = () => {
  const [stats,        setStats]        = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [lastUpdated,  setLastUpdated]  = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        total,
        ouverts,
        enCours,
        resolus,
        tempsResolution,
        resolutionMoyenne,
        allTickets,
        parJour,
        slaResult,
      ] =
        await Promise.all([
          ticketsService.getTotal(),             // → Long
          ticketsService.getOuverts(),           // → { nombreTicketsOuverts }
          ticketsService.getEnCours(),           // → { nombreTicketsEnCours }
          ticketsService.getResolus(),           // → { nombreTicketsResolus }
          ticketsService.getTempsResolution(),   // → List<TempsResolutionDTO>
          ticketsService.getResolutionMoyenne(), // → TempsResolutionMoyenDTO
          ticketsService.getAll(),
          ticketsService.getStatsParJour(),
          slaService.getStats().catch(() => ({ data: null })),
        ]);

      const tickets = Array.isArray(allTickets.data) ? allTickets.data : [];

      const ticketsRecents = [...tickets]
        .sort((a, b) => {
          const dateA = parseTicketDate(a.requestDate)?.getTime() || 0;
          const dateB = parseTicketDate(b.requestDate)?.getTime() || 0;
          return dateB - dateA;
        })
        .slice(0, 6);

      const closedByTech = tickets.reduce((acc, t) => {
        if (!isClosedStatus(t?.status)) return acc;
        const key = (t?.technicien || 'N/A').toString().trim() || 'N/A';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const topTechniciensCloture = Object.entries(closedByTech)
        .map(([technicien, closedTickets]) => ({ technicien, closedTickets }))
        .sort((a, b) => b.closedTickets - a.closedTickets)
        .slice(0, 5);

      const clotures = tickets.filter((t) => {
        const s = String(t?.status || '').toLowerCase().trim();
        return s.includes('clotur') || s.includes('ferm');
      }).length;

      const rm = resolutionMoyenne.data;
      const resolutionMoyenneValue =
        typeof rm === 'number' ? rm :
        (rm?.tempsMoyenHeures ?? rm?.tempsMoyen ?? rm?.avgResolutionTime ?? rm?.duree ?? rm?.value ?? null);

      const slaRaw = slaResult?.data;
      const slaCompliance =
        typeof slaRaw === 'number' ? `${slaRaw}%` :
        (slaRaw?.tauxConformite ?? slaRaw?.compliance ?? slaRaw?.slaCompliance ?? slaRaw?.taux ?? null);

      setStats({
        total:             total.data,
        ouverts:           ouverts.data.nombreTicketsOuverts,
        enCours:           enCours.data.nombreTicketsEnCours,
        resolus:           resolus.data.nombreTicketsResolus,
        clotures,
        tempsResolution:   tempsResolution.data,   // liste par technicien
        resolutionMoyenne: resolutionMoyenneValue, // temps moyen global (number or null)
        slaCompliance,
        parJour:           Array.isArray(parJour.data) ? parJour.data : [],
        ticketsRecents,
        topTechniciensCloture,
      });

      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Refresh automatique toutes les 30s
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { stats, loading, error, lastUpdated, refresh: fetchData };
};

export default useDashboard;