import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar  from "../components/layout/Topbar";
import KpiCard from "../components/cards/KpiCard";
import TicketsPerDayChart  from "../components/charts/TicketsPerDayChart";
import TechnicianPerformanceChart from "../components/charts/TechnicianPerformanceChart";
import ResolutionTimeChart  from "../components/charts/ResolutionTimeChart";
import useDashboard from "../hooks/useDashboard";
import {
  FiList, FiCheckCircle, FiClock,
  FiAlertCircle, FiTrendingUp, FiRefreshCw,
  FiLock
} from "react-icons/fi";
import { statusBadge, priorityBadge, priorityLabel } from "../utils/statusHelpers";

const BLUE = "#2784c1";

const toArray = (val) => (Array.isArray(val) ? val : []);
const toStr   = (val) => {
  if (val === null || val === undefined) return 'N/A';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
};

const Dashboard = () => {
  const { stats, loading, error, lastUpdated, refresh } = useDashboard();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-t-transparent animate-spin"
             style={{ borderColor: BLUE, borderTopColor: "transparent" }} />
        <p className="text-gray-500">Chargement des données...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 text-center bg-white shadow rounded-xl">
        <p className="font-semibold text-red-500">❌ Erreur de connexion</p>
        <p className="mt-1 text-sm text-gray-400">{error}</p>
        <p className="mt-2 text-xs text-gray-400">Vérifiez que Spring Boot tourne sur le port 8080</p>
      </div>
    </div>
  );

  const parJour  = toArray(stats?.parJour);
  const parTechnicien = toArray(stats?.tempsResolution);
  const topTechniciensCloture = toArray(stats?.topTechniciensCloture);
  const ticketsRecents = toArray(stats?.ticketsRecents).slice(0, 6);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 space-y-5 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Tableau de Bord</h1>
              <p className="text-sm text-gray-500">Vue globale des performances en temps réel</p>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 bg-white border rounded-lg shadow-sm">
                  <FiRefreshCw className="animate-pulse" style={{ color: BLUE }} />
                  <span>Mis à jour : {lastUpdated.toLocaleTimeString()}</span>
                </div>
              )}
              <button
                onClick={refresh}
                className="px-3 py-2 text-xs font-medium text-white rounded-lg shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: BLUE }}
              >
                Actualiser
              </button>
            </div>
          </div>

          {/* KPI Cards - Optimized 6-card layout */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            <KpiCard title="Total Tickets"  value={stats?.total}            subtitle="Total"         icon={<FiList />}        color="indigo" />
            <KpiCard title="Ouverts"        value={stats?.ouverts}          subtitle="En attente"    icon={<FiAlertCircle />} color="red"    />
            <KpiCard title="Résolus"        value={stats?.resolus}          subtitle="Résolus"      icon={<FiCheckCircle />} color="green"  />
            <KpiCard title="Clôturés"       value={stats?.clotures}         subtitle="Clôturés"      icon={<FiLock />}        color="blue"   />
            <KpiCard title="En Cours"       value={stats?.enCours}          subtitle="En traitement" icon={<FiClock />}       color="yellow" />
            <KpiCard title="Temps Moyen"    value={stats?.resolutionMoyenne ? `${stats.resolutionMoyenne}h` : 'N/A'} subtitle="Résolution" icon={<FiTrendingUp />} color="purple" />
          </div>

          {/* Charts Row 1 - Enhanced spacing */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <TicketsPerDayChart data={parJour}   />
            <TechnicianPerformanceChart data={topTechniciensCloture} metric="closed" />
          </div>

          {/* Charts Row 2 - Optimized layout */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ResolutionTimeChart data={parTechnicien} />
            </div>

            {/* Tickets Récents */}
            <div className="p-5 bg-white border border-gray-100 shadow-sm lg:col-span-2 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Tickets Récents</h3>
                  <p className="text-xs text-gray-400">Derniers tickets enregistrés</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-green-500">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Temps réel
                </span>
              </div>
              {ticketsRecents.length === 0 ? (
                <p className="py-8 text-sm text-center text-gray-400">Aucun ticket récent disponible</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-400 uppercase border-b">
                        <th className="pb-3 font-medium text-left">N° Ticket</th>
                        <th className="pb-3 font-medium text-left">Objet</th>
                        <th className="pb-3 font-medium text-left">Technicien</th>
                        <th className="pb-3 font-medium text-left">Priorité</th>
                        <th className="pb-3 font-medium text-left">Statut</th>
                        <th className="pb-3 font-medium text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {ticketsRecents.map((t, idx) => (
                        <tr key={t.issueID || idx} className="transition hover:bg-gray-50">
                          <td className="py-3 font-mono text-xs font-semibold" style={{ color: BLUE }}>{toStr(t.issueID)}</td>
                          <td className="max-w-xs py-3 text-gray-700 truncate">{toStr(t.briefDescription)}</td>
                          <td className="py-3 text-xs text-gray-500">{toStr(t.technicien)}</td>
                          <td className="py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityBadge(t.priority)}`}>
                              {priorityLabel(t.priority)}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge(t.status)}`}>
                              {toStr(t.status)}
                            </span>
                          </td>
                          <td className="py-3 text-xs text-gray-400">{toStr(t.requestDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;