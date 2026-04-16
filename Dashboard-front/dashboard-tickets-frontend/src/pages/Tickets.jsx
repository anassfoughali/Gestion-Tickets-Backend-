import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar  from "../components/layout/Topbar";
import useTickets from "../hooks/useTickets";
import KpiCard from "../components/cards/KpiCard";
import TicketEvolutionChart from "../components/charts/TicketEvolutionChart";
import { statusBadge, priorityBadge } from "../utils/statusHelpers";
import { FiRefreshCw, FiDownload, FiList, FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp } from "react-icons/fi";

const BLUE = "#2784c1";

const toStr = (val) => {
  if (val === null || val === undefined) return "—";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
};

const isClosedStatus = (status = "") => {
  const s = String(status).toLowerCase().trim();
  return s.includes("clotur") || s.includes("ferm") || s.includes("resolu") || s.includes("closed");
};

const getStatusGroup = (status = "") => {
  const s = String(status).toLowerCase().trim();
  if (isClosedStatus(s)) return "closed";
  if (s.includes("ouvert") || s.includes("nouveau")) return "open";
  if (s.includes("cours") || s.includes("affect") || s.includes("attente") || s.includes("escalad")) return "inProgress";
  return "other";
};

const parseTicketDate = (value) => {
  if (!value) return null;
  const d1 = new Date(value);
  if (!Number.isNaN(d1.getTime())) return d1;

  if (typeof value === "string") {
    const m = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (m) {
      const [, dd, mm, yyyy] = m;
      const d2 = new Date(`${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}T00:00:00`);
      if (!Number.isNaN(d2.getTime())) return d2;
    }
  }

  return null;
};

const toDayKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const toDayLabel = (date) => `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;

const Tickets = () => {
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [currentPage, setCurrentPage] = React.useState(1);
  const { tickets, loading, error, refresh } = useTickets();

  const uniqueStatuses = React.useMemo(() => {
    const set = new Set();
    tickets.forEach((t) => {
      if (t?.status) set.add(String(t.status));
    });
    return ["ALL", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [tickets]);

  const filteredTickets = React.useMemo(() => {
    if (statusFilter === "ALL") return tickets;
    return tickets.filter((t) => String(t?.status || "") === statusFilter);
  }, [tickets, statusFilter]);

  const stats = React.useMemo(() => {
    return filteredTickets.reduce(
      (acc, t) => {
        const group = getStatusGroup(t?.status);
        if (group === "closed") acc.closed += 1;
        else if (group === "open") acc.open += 1;
        else if (group === "inProgress") acc.inProgress += 1;
        else acc.other += 1;
        return acc;
      },
      { total: filteredTickets.length, open: 0, inProgress: 0, closed: 0, other: 0 }
    );
  }, [filteredTickets]);

  const closureRate = stats.total > 0 ? `${Math.round((stats.closed / stats.total) * 100)}%` : "0%";

  const monthlyEvolution = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    const dayMap = {};
    for (let i = 29; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = toDayKey(d);
      const row = { dayKey: key, dayLabel: toDayLabel(d), totalTickets: 0, closedTickets: 0 };
      days.push(row);
      dayMap[key] = row;
    }

    tickets.forEach((t) => {
      const d = parseTicketDate(t?.requestDate);
      if (!d) return;
      d.setHours(0, 0, 0, 0);
      const row = dayMap[toDayKey(d)];
      if (!row) return;
      row.totalTickets += 1;
      if (isClosedStatus(t?.status)) row.closedTickets += 1;
    });

    return days;
  }, [tickets]);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / ITEMS_PER_PAGE));

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const paginatedTickets = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTickets.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTickets, currentPage]);

  const handleReanalyze = () => {
    setCurrentPage(1);
    refresh();
  };

  const handleExportExcel = () => {
    const headers = ["IssueID", "Description", "Statut", "Priorite", "Technicien", "Date"];
    const rows = filteredTickets.map((t) => [
      toStr(t.issueID),
      toStr(t.briefDescription),
      toStr(t.status),
      toStr(t.priority),
      toStr(t.technicien),
      toStr(t.requestDate),
    ]);

    const tableRows = [headers, ...rows]
      .map((cols) => `<tr>${cols.map((c) => `<td>${String(c).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>`).join("")}</tr>`)
      .join("");

    const html = `
      <html>
        <head><meta charset="utf-8" /></head>
        <body><table>${tableRows}</table></body>
      </html>
    `;

    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tickets-performance-${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div
          className="w-12 h-12 mx-auto mb-4 border-4 rounded-full animate-spin"
          style={{ borderColor: BLUE, borderTopColor: "transparent" }}
        />
        <p className="text-gray-500">Chargement des tickets...</p>
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Tickets Performance</h1>
              <p className="text-sm text-gray-500">KPI, analyse et evolution des tickets</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReanalyze}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white rounded-lg shadow-sm transition"
                style={{ backgroundColor: BLUE }}
              >
                <FiRefreshCw size={14} />
                Reanalyser les donnees
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white rounded-lg shadow-sm transition"
                style={{ backgroundColor: "#0B1F3A" }}
              >
                <FiDownload size={14} />
                Export Excel
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            <KpiCard title="Total Tickets" value={stats.total} subtitle="Selection courante" icon={<FiList />} color="indigo" />
            <KpiCard title="Ouverts" value={stats.open} subtitle="A traiter" icon={<FiAlertCircle />} color="red" />
            <KpiCard title="En Cours" value={stats.inProgress} subtitle="Traitement" icon={<FiClock />} color="yellow" />
            <KpiCard title="Clotures" value={stats.closed} subtitle="Termines" icon={<FiCheckCircle />} color="green" />
            <KpiCard title="Taux Cloture" value={closureRate} subtitle="Sur selection" icon={<FiTrendingUp />} color="blue" />
          </div>

          {/* Table */}
          <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-end md:justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Detail des tickets</h3>
              <div>
                <label className="block mb-1 text-xs font-medium tracking-wide text-gray-500 uppercase">Filtrer par statut</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2784c1]/30"
                >
                  {uniqueStatuses.map((s) => (
                    <option key={s} value={s}>{s === "ALL" ? "Tous" : s}</option>
                  ))}
                </select>
              </div>
            </div>
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
                      <th className="pb-3 font-medium text-left">Technicien</th>
                      <th className="pb-3 font-medium text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedTickets.map((t, idx) => (
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
                            {toStr(t.priority)}
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

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Affichage {(filteredTickets.length === 0) ? 0 : ((currentPage - 1) * ITEMS_PER_PAGE + 1)}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredTickets.length)} sur {filteredTickets.length} tickets
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg disabled:opacity-50"
                >
                  Precedent
                </button>
                <span className="text-xs text-gray-500">Page {currentPage}/{totalPages}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>

          <TicketEvolutionChart data={monthlyEvolution} />

        </main>
      </div>
    </div>
  );
};

export default Tickets;