import axios from 'axios';
import { normalizePriority } from '../utils/statusHelpers';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const pick = (...values) => values.find((v) => v !== undefined && v !== null);

const normalizeTicket = (t = {}) => ({
  // Ticket number — DTO field: IssueId
  issueID: pick(t.IssueId, t.issueID, t.issueId, t.IssueID),
  // Brief description — DTO field: object
  briefDescription: pick(t.object, t.briefDescription),
  // Support group / type
  issueType: pick(t.issueType) ?? null,
  // Technician — DTO field: description (Jackson serialises Description → description)
  technicien: pick(t.description, t.Description, t.technicien, t.technician) ?? null,
  // Status — DTO field: Status
  status: pick(t.Status, t.status),
  // Priority — DTO field: Priorite
  priority: normalizePriority(
    pick(t.Priorite, t.priority, t.priorite, t.priorityId, t.PriorityID, t.Priority)
  ),
  // Creation date — DTO field: date_reception
  requestDate: pick(t.date_reception, t.requestDate, t.dateReception),
  // Close date — DTO field: date_cloture
  closeDate: pick(t.date_cloture, t.closeDate, t.dateCloture),
  // Resolution duration — DTO field: durée_resolution
  resolutionDuration: pick(t['durée_resolution'], t.duree_resolution, t.resolutionDuration),
  // Client name — DTO field: client (AddressMatchcode)
  client: pick(t.client, t.Client),
});

const normalizeDayStat = (d = {}) => {
  const countValue =
    d.nbr_crees ?? d.total ?? d.count ?? d.nombre ?? d.crees ??
    d.nombreTickets ?? d.ticketCount ?? d.ticketsCount ??
    d.nbTickets ?? d.nb ?? d.compteur ?? d.quantity ??
    d.totalTickets ?? d.ticketsOuverts ?? d.created ?? 0;

  const cloturesValue =
    d.nbr_clotures ?? d.clotures ?? d.closed ?? d.resolved ?? d.nombreClotures ??
    d.nbClotures ?? d.closedTickets ?? d.clotured ?? 0;

  return {
    date: d.date ?? d.day ?? d.jour ?? d.requestDate ?? '',
    total: Number(countValue) || 0,
    clotures: Number(cloturesValue) || 0,
  };
};

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('jwt_token');
      sessionStorage.removeItem('user_info');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  subscribeToStats: (onData, onError) => {
    const token = sessionStorage.getItem('jwt_token');
    const eventSource = new EventSource(
      `${API_BASE_URL}/dashboard/stats/stream${token ? `?token=${token}` : ''}`
    );
    eventSource.addEventListener('dashboard', (e) => {
      try { onData(JSON.parse(e.data)); } catch (err) { console.error('Parse error', err); }
    });
    eventSource.onerror = (e) => { console.error('SSE error', e); if (onError) onError(e); };
    return () => eventSource.close();
  }
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_info');
  },
};

export const ticketsService = {
  getAll:               () => api.get('/tickets/list').then((res) => ({
    ...res,
    data: Array.isArray(res.data) ? res.data.map(normalizeTicket) : [],
  })),
  getTotal:             () => api.get('/tickets/total'),           // → Long
  getOuverts:           () => api.get('/tickets/ouverts'),         // → TicketsOuvertsDTO
  getEnCours:           () => api.get('/tickets/en-cours'),        // → TicketsEnCoursDTO
  getResolus:           () => api.get('/tickets/resolus'),         // → TicketsResolusDTO
  getClotures:          () => api.get('/tickets/clotures'),        // → TicketsClouresDTO
  getTempsResolution:   () => api.get('/tickets/temps-resolution'),// → List<TempsResolutionDTO>
  getResolutionMoyenne: () => api.get('/tickets/resolution'),      // → TempsResolutionMoyenDTO
  getStatsParJour:      () => api.get('/tickets/stats-par-jour').then((res) => {
    if (process.env.NODE_ENV === 'development' && Array.isArray(res.data) && res.data.length > 0) {
      console.log('[API] stats-par-jour raw sample:', JSON.stringify(res.data[0]));
    }
    return {
      ...res,
      data: Array.isArray(res.data) ? res.data.map(normalizeDayStat) : [],
    };
  }),
};

export const technicienService = {
  getAll:           () => api.get('/techniciens'),
  getStatsGlobales: () => api.get('/techniciens/stats-globales'),
  getStats: (groupId) => api.get(`/techniciens/${groupId}`),
};

export const rapportsService = {
  getAll: () => api.get('/tickets/list').then((res) => ({
    ...res,
    data: Array.isArray(res.data) ? res.data.map(normalizeTicket) : [],
  })),
};

export const slaService = {
  getStats: () => api.get('/sla/stats'),
};

export default api;