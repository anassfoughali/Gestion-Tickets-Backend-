import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar  from "../components/layout/Topbar";
import { rapportsService } from "../services/api";
import { statusBadge, priorityBadge, priorityLabel } from "../utils/statusHelpers";
import { FiRefreshCw } from "react-icons/fi";

const BLUE = "#2784c1";

const toStr = (val) => {
  if (val === null || val === undefined) return "—";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
};

const Rapports = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await rapportsService.getAll();
      setTickets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div
          className="w-12 h-12 mx-auto mb-4 border-4 rounded-full animate-spin"
          style={{ borderColor: BLUE, borderTopColor: "transparent" }}
        />
        <p className="text-gray-500">Chargement des rapports...</p>
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

  // Summary counts — single pass
  const counts = tickets.reduce(
    (acc, t) => {
      const s = (t.status || "").toLowerCase().trim();
      if (s.includes("résolu") || s.includes("resolu")) acc.resolus += 1;
      else if (s.includes("ouvert") || s.includes("nouveau")) acc.ouverts += 1;
      else if (s.includes("cours") || s.includes("affect") || s.includes("attente") || s.includes("escalad")) acc.enCours += 1;
      else acc.autres += 1;
      return acc;
    },
    { resolus: 0, ouverts: 0, enCours: 0, autres: 0 }
  );
  const total   = tickets.length;
  const { resolus, ouverts, enCours } = counts;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Rapports</h1>
              <p className="text-sm text-gray-500">Synthèse globale des tickets</p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white rounded-lg shadow-sm transition"
              style={{ backgroundColor: BLUE }}
            >
              <FiRefreshCw size={14} />
              Actualiser
            </button>
          </div>

          {/* Summary KPI cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Total",  value: total, bg: "bg-blue-50", color: BLUE  },
              { label: "Ouverts",  value: ouverts, bg: "bg-red-50", color: "#ef4444" },
              { label: "En Cours", value: enCours, bg: "bg-amber-50",  color: "#f59e0b" },
              { label: "Résolus", value: resolus, bg: "bg-emerald-50",color: "#10b981" },
            ].map((k) => (
              <div key={k.label} className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">{k.label}</p>
                <p className="mt-1 text-3xl font-bold" style={{ color: k.color }}>{k.value}</p>
              </div>
            ))}
          </div>

          {/* Tickets table */}
          <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Détail des tickets</h3>
            {tickets.length === 0 ? (
              <p className="py-12 text-sm text-center text-gray-400">Aucun ticket disponible</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase border-b">
                      <th className="pb-3 font-medium text-left">IssueID</th>
                      <th className="pb-3 font-medium text-left">Description</th>
                      <th className="pb-3 font-medium text-left">Statut</th>
                      <th className="pb-3 font-medium text-left">Priorité</th>
                      <th className="pb-3 font-medium text-left">Technicien Description</th>
                      <th className="pb-3 font-medium text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tickets.map((t, idx) => (
                      <tr key={t.issueID || idx} className="transition hover:bg-gray-50">
                        <td className="py-3 font-mono text-xs font-semibold" style={{ color: BLUE }}>
                          {toStr(t.issueID)}
                        </td>
                        <td className="max-w-xs py-3 text-gray-700 truncate">
                          {toStr(t.briefDescription)}
                        </td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge(t.status)}`}>
                            {toStr(t.status)}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityBadge(t.priority)}`}>
                            {priorityLabel(t.priority)}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-gray-500">{toStr(t.technicien)}</td>
                        <td className="py-3 text-xs text-gray-400">{toStr(t.requestDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default Rapports;