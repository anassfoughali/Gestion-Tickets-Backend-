import React from "react";
import Topbar from "../components/layout/Topbar";
import HamburgerMenu from "../components/layout/HamburgerMenu";
import useTickets from "../hooks/useTickets";
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
  FiRefreshCw,
  FiDownload,
  FiX,
  FiTrendingUp,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const BLUE = "#2784c1";
const ROWS_PER_PAGE = 10;
const MIN_LABEL_PERCENT = 0.05;

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

const toDayLabel = (date) =>
  `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;

const getTechnicien = (t) => t?.description || t?.technicien || "";

/* ── Small KPI card used inside the modal - Premium Design ────────────── */
const ModalKpiCard = ({ value, label, color, icon }) => (
  <div className="relative flex flex-col flex-1 min-w-0 p-5 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
    {/* Top accent line */}
    <div 
      className="absolute top-0 left-0 right-0 h-1 opacity-80"
      style={{ background: `linear-gradient(90deg, ${color}, ${color}dd)` }}
    />
    
    {/* Decorative background circle */}
    <div 
      className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-5"
      style={{ backgroundColor: color }}
    />
    
    {/* Icon with gradient background */}
    <div 
      className="flex items-center justify-center w-10 h-10 mb-3 rounded-xl shadow-sm relative z-10"
      style={{ 
        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
        color: color 
      }}
    >
      {icon}
    </div>
    
    {/* Value with gradient text */}
    <p 
      className="text-3xl font-black tracking-tight leading-none mb-1 relative z-10"
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {value}
    </p>
    
    {/* Label */}
    <p className="text-xs font-medium text-gray-500 relative z-10">{label}</p>
  </div>
);

/* ── Technician performance modal ─────────────────────────────────────── */
const TechnicienModal = ({ technicien, tickets, onClose }) => {
  const pieRef = React.useRef(null);
  const chartRef = React.useRef(null);

  const techTickets = React.useMemo(
    () => tickets.filter((t) => getTechnicien(t) === technicien),
    [tickets, technicien]
  );

  /* KPIs */
  const resolus = techTickets.filter((t) => isResolu(t?.status)).length;
  const clotures = techTickets.filter((t) => isCloture(t?.status)).length;
  const ouverts = techTickets.filter((t) => isOuvert(t?.status)).length;
  const durations = techTickets
    .map((t) => parseFloat(t?.resolutionDuration))
    .filter((v) => !Number.isNaN(v) && v > 0);
  const avgDuration =
    durations.length > 0
      ? `${(durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1)}h`
      : "—";

  /* Pie data */
  const autresStatuts = Math.max(0, techTickets.length - clotures - ouverts);
  const pieData = [
    { name: "Clôturés", value: clotures, color: "#10b981" },
    { name: "Ouverts", value: ouverts, color: "#3b82f6" },
    { name: "Autres", value: autresStatuts, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  /* Evolution data for this technician (last 30 days) */
  const techEvolutionData = React.useMemo(() => {
    let mostRecentDate = new Date(0);
    techTickets.forEach((t) => {
      const d = parseTicketDate(t?.requestDate);
      if (d && !Number.isNaN(d.getTime()) && d > mostRecentDate) mostRecentDate = d;
    });
    if (mostRecentDate.getTime() === 0) mostRecentDate = new Date();
    mostRecentDate.setHours(0, 0, 0, 0);

    const days = [];
    const dayMap = {};
    for (let i = 29; i >= 0; i -= 1) {
      const d = new Date(mostRecentDate);
      d.setDate(mostRecentDate.getDate() - i);
      const key = toDayKey(d);
      const row = { dayKey: key, dayLabel: toDayLabel(d), totalTickets: 0, closedTickets: 0 };
      days.push(row);
      dayMap[key] = row;
    }
    techTickets.forEach((t) => {
      const d = parseTicketDate(t?.requestDate);
      if (!d || Number.isNaN(d.getTime())) return;
      d.setHours(0, 0, 0, 0);
      const row = dayMap[toDayKey(d)];
      if (!row) return;
      row.totalTickets += 1;
      if (isClosedStatus(t?.status)) row.closedTickets += 1;
    });
    return days;
  }, [techTickets]);

  /* Pie label renderer */
  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < MIN_LABEL_PERCENT) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  /* Export pie chart */
  const captureAndExport = async (type) => {
    if (!pieRef.current) return;
    const canvas = await html2canvas(pieRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
    });
    if (type === "png") {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `pie-${technicien}-${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }, "image/png");
    } else {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`pie-${technicien}-${new Date().toISOString().slice(0, 10)}.pdf`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)"
      }}
      onClick={onClose}
    >
      <div
        className="max-w-2xl w-full bg-white rounded-2xl p-6 overflow-y-auto"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ backgroundColor: "#dbeafe" }}
            >
              <FiTrendingUp size={20} style={{ color: BLUE }} />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{technicien}</p>
              <p className="text-xs text-gray-500">Performance individuelle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* KPI Cards */}
        <div className="flex gap-3 mb-6">
          <ModalKpiCard
            value={resolus}
            label="Résolus"
            color="#10b981"
            icon={<FiCheckCircle size={20} />}
          />
          <ModalKpiCard
            value={clotures}
            label="Clôturés"
            color="#2784c1"
            icon={<FiCheckCircle size={20} />}
          />
          <ModalKpiCard
            value={ouverts}
            label="Ouverts"
            color="#ef4444"
            icon={<FiAlertCircle size={20} />}
          />
          <ModalKpiCard
            value={avgDuration}
            label="Tps Moyen"
            color="#8b5cf6"
            icon={<FiClock size={20} />}
          />
        </div>

        {/* Pie Chart */}
        <div className="p-4 mb-4 bg-gray-50 border border-gray-100 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">Répartition par statut</p>
              <p className="text-xs text-gray-400">Total : {techTickets.length} tickets</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => captureAndExport("png")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition"
              >
                <FiDownload size={12} />
                PNG
              </button>
              <button
                onClick={() => captureAndExport("pdf")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition"
              >
                <FiDownload size={12} />
                PDF
              </button>
            </div>
          </div>
          <div ref={pieRef}>
            {pieData.length === 0 ? (
              <p className="py-8 text-sm text-center text-gray-400">Aucune donnée</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                    label={renderPieLabel}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color, fontSize: 12 }}>
                        {value}: {entry.payload.value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Evolution Chart */}
        <TicketEvolutionChart data={techEvolutionData} chartRef={chartRef} />

        {/* Footer */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Techniciens page ────────────────────────────────────────────── */
const Techniciens = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filterTech, setFilterTech] = React.useState("tous");
  const [filterClient, setFilterClient] = React.useState("tous");
  const [modalTech, setModalTech] = React.useState(null);
  const { tickets, loading, error, refresh } = useTickets();

  /* Deduplicated technician list */
  const techList = React.useMemo(
    () => [...new Set(tickets.map(getTechnicien).filter(Boolean))].sort(),
    [tickets]
  );

  /* Apply technician filter */
  const filteredByTech = React.useMemo(
    () => (filterTech === "tous" ? tickets : tickets.filter((t) => getTechnicien(t) === filterTech)),
    [tickets, filterTech]
  );

  /* Deduplicated client list (from already-filtered-by-tech tickets) */
  const clientList = React.useMemo(
    () => [...new Set(filteredByTech.map((t) => t?.client).filter(Boolean))].sort(),
    [filteredByTech]
  );

  /* Apply client filter */
  const filteredTickets = React.useMemo(
    () =>
      filterClient === "tous"
        ? filteredByTech
        : filteredByTech.filter((t) => t?.client === filterClient),
    [filteredByTech, filterClient]
  );

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
    const headers = [
      "N° Ticket", "Objet", "Client", "Technicien", "Type",
      "Priorité", "Statut", "Date Création", "Date Clôture", "Durée (h)",
    ];
    const rows = filteredTickets.map((t) => [
      toStr(t.issueID),
      toStr(t.briefDescription),
      toStr(t.client),
      toStr(getTechnicien(t)),
      toStr(t.issueType),
      priorityLabel(t.priority),
      toStr(t.status),
      toStr(t.requestDate),
      toStr(t.closeDate),
      toStr(t.resolutionDuration),
    ]);

    const tableRows = [headers, ...rows]
      .map(
        (cols) =>
          `<tr>${cols
            .map((c) => `<td>${String(c).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>`)
            .join("")}</tr>`
      )
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
    link.download = `techniciens-${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading)
    return (
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

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 text-center bg-white shadow rounded-xl">
          <p className="font-semibold text-red-500">❌ Erreur de connexion</p>
          <p className="mt-1 text-sm text-gray-400">{error}</p>
          <p className="mt-2 text-xs text-gray-400">Vérifiez que Spring Boot tourne sur le port 8080</p>
        </div>
      </div>
    );

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <HamburgerMenu />
        <div className="flex flex-col flex-1 w-full">
          <Topbar />
          <main className="flex-1 p-6 space-y-6 overflow-y-auto" style={{ paddingLeft: '80px' }}>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-800">Techniciens</h1>
                <p className="text-sm text-gray-500">Tickets et performance par technicien</p>
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

            {/* Table */}
            <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                {/* Dropdown filters */}
                <div className="flex flex-wrap gap-2">
                  <select
                    value={filterTech}
                    onChange={(e) => {
                      setFilterTech(e.target.value);
                      setFilterClient("tous");
                      setCurrentPage(1);
                    }}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                  >
                    <option value="tous">Tous les techniciens</option>
                    {techList.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterClient}
                    onChange={(e) => {
                      setFilterClient(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                  >
                    <option value="tous">Tous les clients</option>
                    {clientList.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
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
                        <tr
                          key={t.issueID || idx}
                          className="transition cursor-pointer hover:bg-blue-50"
                          onClick={() => setModalTech(getTechnicien(t))}
                        >
                          <td className="py-3 font-mono text-xs font-semibold" style={{ color: BLUE }}>
                            {toStr(t.issueID)}
                          </td>
                          <td className="max-w-xs py-3 text-gray-700 truncate">
                            {toStr(t.briefDescription)}
                          </td>
                          <td className="py-3 text-xs text-gray-500">{toStr(t.client)}</td>
                          <td className="py-3 text-xs text-gray-500">{toStr(getTechnicien(t))}</td>
                          <td className="py-3 text-xs text-gray-500">{toStr(t.issueType)}</td>
                          <td className="py-3">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityBadge(
                                t.priority
                              )}`}
                            >
                              {priorityLabel(t.priority)}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge(
                                t.status
                              )}`}
                            >
                              {toStr(t.status)}
                            </span>
                          </td>
                          <td className="py-3 text-xs text-gray-400">{toStr(t.requestDate)}</td>
                          <td className="py-3 text-xs text-gray-400">{toStr(t.closeDate)}</td>
                          <td className="py-3 text-xs text-gray-400">
                            {toStr(t.resolutionDuration)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Affichage{" "}
                  {filteredTickets.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1}–
                  {Math.min(currentPage * ROWS_PER_PAGE, filteredTickets.length)} sur{" "}
                  {filteredTickets.length}
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
                          ? "text-white"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                      }`}
                      style={n === currentPage ? { backgroundColor: BLUE } : {}}
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

          </main>
        </div>
      </div>

      {/* Technician performance modal */}
      {modalTech && (
        <TechnicienModal
          technicien={modalTech}
          tickets={tickets}
          onClose={() => setModalTech(null)}
        />
      )}
    </>
  );
};

export default Techniciens;