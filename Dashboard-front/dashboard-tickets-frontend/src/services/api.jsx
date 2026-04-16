import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const pick = (...values) => values.find((v) => v !== undefined && v !== null);

const normalizeTicket = (t = {}) => ({
  issueID: pick(t.issueID, t.issueId, t.IssueId, t.IssueID),
  briefDescription: pick(t.briefDescription, t.object, t.description, t.Description),
  technicien: pick(t.technicien, t.technician, t.description, t.Description),
  status: pick(t.status, t.Status),
  priority: pick(t.priority, t.priorite, t.Priorite),
  requestDate: pick(t.requestDate, t.date_reception, t.dateReception, t.request_date),
  closeDate: pick(t.closeDate, t.date_cloture, t.dateCloture),
  resolutionDuration: pick(t.resolutionDuration, t.duree_resolution, t['durée_resolution']),
  client: pick(t.client, t.Client),
});

const normalizeDayStat = (d = {}) => ({
  date: pick(d.date, d.day, d.jour),
  total: Number(pick(d.total, d.count, d.nombre, d.crees) || 0),
  clotures: Number(pick(d.clotures, d.closed, d.resolved) || 0),
});

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
  getTempsResolution:   () => api.get('/tickets/temps-resolution'),// → List<TempsResolutionDTO>
  getResolutionMoyenne: () => api.get('/tickets/resolution'),      // → TempsResolutionMoyenDTO
  getStatsParJour:      () => api.get('/tickets/stats-par-jour').then((res) => ({
    ...res,
    data: Array.isArray(res.data) ? res.data.map(normalizeDayStat) : [],
  })),
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