import React from "react";
import Topbar  from "../components/layout/Topbar";
import HamburgerMenu from "../components/layout/HamburgerMenu";
import useTickets from "../hooks/useTickets";
import KpiCard from "../components/cards/KpiCard";
import TicketEvolutionChart from "../components/charts/TicketEvolutionChart";
import {
  statusBadge,
  priorityBadge,
  isCloture,
  isResolu,
  isEnCours,
  isOuvert,
  normalizePriority,
  priorityLabel,
} from "../utils/statusHelpers";
import {
  FiRefreshCw, FiDownload, FiList, FiCheckCircle, FiClock,
  FiAlertCircle, FiTrendingUp, FiChevronLeft, FiChevronRight
} from "react-icons/fi";

const BLUE = "#2784c1";
const ROWS_PER_PAGE = 10;

const toStr = (val) => {
  if (val === null || val === undefined) return "—";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
};

const isClosedStatus = (status = "") => isCloture(status) || isResolu(status);

const parseTicketDate = (value) => {
  if (!value) return null;
  const d1 = new Date(value);
  if (!Number.isNaN(d1.getTime())) return d1;

  if (typeof value === "string") {
    // Handle "dd/mm/yyyy", "dd/mm/yyyy HH:mm", "dd-mm-yyyy HH:mm", etc.
    const m = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:[\s,T]+(\d{1,2}):(\d{2}))?/);
    if (m) {
      const [, dd, mm, yyyy, hh = "00", min = "00"] = m;
      const d2 = new Date(
        `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}T${hh.padStart(2, "0")}:${min.padStart(2, "0")}:00`
      );
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

const FILTERS = [
  { key: "tous",    label: "Tous" },
  { key: "resolu",  label: "🟢 Résolus" },
  { key: "cloture", label: "🔵 Clôturés" },
  { key: "ouvert",  label: "🔴 Ouverts" },
  { key: "encours", label: "🟡 En Cours" },
];

const PRIORITY_FILTERS = [
  { key: "tous", label: "Toutes priorites" },
  { key: "critique", label: "Critique" },
  { key: "majeur", label: "Majeur" },
  { key: "mineur", label: "Mineur" },
];

const Tickets = () => {
  const [activeFilter, setActiveFilter] = React.useState("tous");
  const [activePriorityFilter, setActivePriorityFilter] = React.useState("tous");
  const [currentPage, setCurrentPage] = React.useState(1);
  const { tickets, evolutionData, loading, error, refresh } = useTickets();
  const chartRef = React.useRef(null);

  const filteredByStatus = React.useMemo(() => {
    switch (activeFilter) {
      case "resolu":  return tickets.filter((t) => isResolu(t?.status));
      case "cloture": return tickets.filter((t) => isCloture(t?.status));
      case "ouvert":  return tickets.filter((t) => isOuvert(t?.status));
      case "encours": return tickets.filter((t) => isEnCours(t?.status));
      default:        return tickets;
    }
  }, [tickets, activeFilter]);

  const filteredTickets = React.useMemo(() => {
    if (activePriorityFilter === "tous") return filteredByStatus;
    return filteredByStatus.filter((t) => normalizePriority(t?.priority) === activePriorityFilter);
  }, [filteredByStatus, activePriorityFilter]);

  const stats = React.useMemo(() => {
    return filteredTickets.reduce(
      (acc, t) => {
        if (isCloture(t?.status)) acc.closed += 1;
        else if (isResolu(t?.status)) acc.resolved += 1;
        else if (isOuvert(t?.status)) acc.open += 1;
        else if (isEnCours(t?.status)) acc.inProgress += 1;
        return acc;
      },
      { total: filteredTickets.length, open: 0, inProgress: 0, closed: 0, resolved: 0 }
    );
  }, [filteredTickets]);

  const closureRate = stats.total > 0 ? `${Math.round(((stats.closed + stats.resolved) / stats.total) * 100)}%` : "0%";

  // Map API data ({ date, total, clotures }) to chart format ({ dayLabel, totalTickets, closedTickets })
  const chartEvolutionData = React.useMemo(() => {
    if (evolutionData.length > 0) {
      return evolutionData.map((d) => {
        let label = d.date ?? '';
        // Convert ISO "yyyy-mm-dd" → "dd/mm"
        const iso = String(label).match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (iso) label = `${iso[3]}/${iso[2]}`;
        return {
          dayLabel: label,
          totalTickets: Number(d.total) || 0,
          closedTickets: Number(d.clotures) || 0,
        };
      });
    }
    // Fallback: compute from ticket list when API data is not yet available
    let anchor = new Date(0);
    tickets.forEach((t) => {
      const d = parseTicketDate(t?.requestDate);
      if (d && !Number.isNaN(d.getTime()) && d > anchor) anchor = d;
    });
    if (anchor.getTime() === 0) anchor = new Date();
    anchor.setHours(0, 0, 0, 0);

    const days = [];
    const dayMap = {};
    for (let i = 29; i >= 0; i -= 1) {
      const d = new Date(anchor);
      d.setDate(anchor.getDate() - i);
      const key = toDayKey(d);
      const row = { dayKey: key, dayLabel: toDayLabel(d), totalTickets: 0, closedTickets: 0 };
      days.push(row);
      dayMap[key] = row;
    }
    tickets.forEach((t) => {
      const d = parseTicketDate(t?.requestDate);
      if (!d || Number.isNaN(d.getTime())) return;
      d.setHours(0, 0, 0, 0);
      const row = dayMap[toDayKey(d)];
      if (!row) return;
      row.totalTickets += 1;
      if (isClosedStatus(t?.status)) row.closedTickets += 1;
    });
    return days;
  }, [evolutionData, tickets]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / ROWS_PER_PAGE));

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const paginatedTickets = React.useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredTickets.slice(start, start + ROWS_PER_PAGE);
  }, [filteredTickets, currentPage]);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i += 1) {
      pages.push(i);
    }
    return pages;
  };

  const handleExportExcel = () => {
    const headers = ["N° Ticket", "Objet", "Client", "Technicien", "Type", "Priorité", "Statut", "Date Création", "Date Clôture", "Durée (h)"];
    const rows = filteredTickets.map((t) => [
      toStr(t.issueID),
      toStr(t.briefDescription),
      toStr(t.client),
      toStr(t.description),
      toStr(t.issueType),
      priorityLabel(t.priority),
      toStr(t.status),
      toStr(t.requestDate),
      toStr(t.closeDate),
      toStr(t.resolutionDuration),
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
    link.download = `tickets-${new Date().toISOString().slice(0, 10)}.xls`;
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
      <HamburgerMenu />
      <div className="flex flex-col flex-1 w-full">
        <Topbar />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto" style={{ paddingLeft: '80px' }}>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Tickets</h1>
              <p className="text-sm text-gray-500">Liste et analyse des tickets</p>
            </div>
            <button
              onClick={refresh}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white rounded-lg shadow-sm transition"
              style={{ backgroundColor: BLUE }}
            >
              <FiRefreshCw size={14} />
              Actualiser
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            <KpiCard title="Total Tickets" value={stats.total}     subtitle="Sélection courante" icon={<FiList />}        color="indigo" />
            <KpiCard title="Ouverts"       value={stats.open}      subtitle="À traiter"           icon={<FiAlertCircle />} color="red"    />
            <KpiCard title="En Cours"      value={stats.inProgress} subtitle="Traitement"         icon={<FiClock />}       color="yellow" />
            <KpiCard title="Résolus"       value={stats.resolved}  subtitle="Terminés"            icon={<FiCheckCircle />} color="green"  />
            <KpiCard title="Taux Clôture"  value={closureRate}     subtitle="Sur sélection"       icon={<FiTrendingUp />}  color="blue"   />
          </div>

          {/* Table */}
          <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              {/* Filter pills */}
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => { setActiveFilter(f.key); setCurrentPage(1); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
                      activeFilter === f.key
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {PRIORITY_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => { setActivePriorityFilter(f.key); setCurrentPage(1); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
                      activePriorityFilter === f.key
                        ? "bg-[#0B1F3A] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {/* Export button */}
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white rounded-lg shadow-sm transition"
                style={{ backgroundColor: "#0B1F3A" }}
              >
                <FiDownload size={14} />
                Export Excel
              </button>
            </div>

            {tickets.length === 0 ? (
              <p className="py-12 text-sm text-center text-gray-400">Aucun ticket disponible</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase border-b">
                      <th className="pb-3 font-medium text-left">N° Ticket</th>
                      <th className="pb-3 font-medium text-left">Objet</th>
                      <th className="pb-3 font-medium text-left">Client</th>
                      <th className="pb-3 font-medium text-left">Technicien</th>
                      <th className="pb-3 font-medium text-left">Type</th>
                      <th className="pb-3 font-medium text-left">Priorité</th>
                      <th className="pb-3 font-medium text-left">Statut</th>
                      <th className="pb-3 font-medium text-left">Date Création</th>
                      <th className="pb-3 font-medium text-left">Date Clôture</th>
                      <th className="pb-3 font-medium text-left">Durée (h)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedTickets.map((t, idx) => (
                      <tr key={t.issueID || idx} className="transition hover:bg-gray-50">
                        <td className="py-3 font-mono text-xs font-semibold" style={{ color: BLUE }}>
                          {toStr(t.issueID)}
                        </td>
                        <td className="max-w-xs py-3 text-gray-700 truncate">{toStr(t.briefDescription)}</td>
                        <td className="py-3 text-xs text-gray-500">{toStr(t.client)}</td>
                        <td className="py-3 text-xs text-gray-500">{toStr(t.technicien)}</td>
                        <td className="py-3 text-xs text-gray-500">{toStr(t.issueType)}</td>
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
                        <td className="py-3 text-xs text-gray-400">{toStr(t.closeDate)}</td>
                        <td className="py-3 text-xs text-gray-400">{toStr(t.resolutionDuration)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Affichage {filteredTickets.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1}–
                {Math.min(currentPage * ROWS_PER_PAGE, filteredTickets.length)} sur {filteredTickets.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 text-gray-500 bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  <FiChevronLeft size={14} />
                </button>
                {getPageNumbers().map((n) => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`w-7 h-7 text-xs font-medium rounded-lg transition ${
                      n === currentPage
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-gray-500 bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          <TicketEvolutionChart data={chartEvolutionData} chartRef={chartRef} />

        </main>
      </div>
    </div>
  );
};

export default Tickets;