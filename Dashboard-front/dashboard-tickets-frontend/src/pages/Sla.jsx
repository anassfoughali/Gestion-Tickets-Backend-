import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar  from "../components/layout/Topbar";
import useSla  from "../hooks/useSla";
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { FiShield, FiCheckCircle, FiAlertTriangle, FiClock, FiTrendingUp } from "react-icons/fi";

const BLUE = "#2784c1";
const GREEN = "#10b981";
const ORANGE = "#f59e0b";
const RED = "#ef4444";

// ── Gauge radiale pour le taux global SLA ──────────────
const SlaGauge = ({ value = 0 }) => {
  const color = value >= 90 ? GREEN : value >= 70 ? ORANGE : RED;
  const data  = [{ name: "SLA", value, fill: color }];

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
      <h3 className="mb-1 text-sm font-semibold text-gray-700">Taux de Conformité SLA</h3>
      <p className="mb-4 text-xs text-gray-400">Objectif : ≥ 90 %</p>
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="70%" outerRadius="90%"
            startAngle={220} endAngle={-40}
            data={data}
          >
            <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#f3f4f6" }} />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Valeur centrale */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black" style={{ color }}>{value}%</span>
          <span className="text-xs text-gray-400 mt-1">
            {value >= 90 ? "✅ Conforme" : value >= 70 ? "⚠️ À surveiller" : "❌ Non conforme"}
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Pie : répartition Conforme vs Non conforme ──────────
const SlaRepartitionChart = ({ conforme = 0, nonConforme = 0 }) => {
  const data = [
    { name: "Conforme", value: conforme },
    { name: "Non conforme", value: nonConforme },
  ];
  const COLORS = [GREEN, RED];

  return (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
      <h3 className="mb-1 text-sm font-semibold text-gray-700">Répartition SLA</h3>
      <p className="mb-4 text-xs text-gray-400">Tickets conformes vs non conformes</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// ── Bar : SLA par technicien ─────────────────────────────
const SlaTechChart = ({ data = [] }) => {
  const normalized = data.map((d) => ({
    name:d.technicien || d.name || "N/A",
    taux:d.slaRate || d.taux || 0,
    conforme:d.conforme || 0,
    nonConforme:d.nonConforme|| 0,
  }));

  return (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
      <h3 className="mb-1 text-sm font-semibold text-gray-700">SLA par Technicien Description</h3>
      <p className="mb-4 text-xs text-gray-400">Taux de conformité individuel (%)</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={normalized} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend />
          <Bar dataKey="taux" name="Taux SLA (%)" fill={BLUE} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ── Tableau détail tickets hors SLA ─────────────────────
const SlaTable = ({ tickets = [] }) => {
  if (!tickets.length) return (
    <div className="flex items-center justify-center h-32 bg-white border border-gray-100 shadow-sm rounded-xl">
      <p className="text-sm text-gray-400">✅ Aucun ticket hors SLA</p>
    </div>
  );

  return (
    <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
      <h3 className="mb-1 text-sm font-semibold text-gray-700">Tickets Hors SLA</h3>
      <p className="mb-4 text-xs text-gray-400">Tickets ayant dépassé le délai de résolution</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase border-b">
              <th className="pb-3 font-medium text-left">N° Ticket</th>
              <th className="pb-3 font-medium text-left">Objet</th>
              <th className="pb-3 font-medium text-left">Technicien Description</th>
              <th className="pb-3 font-medium text-left">Priorité</th>
              <th className="pb-3 font-medium text-left">Délai dépassé</th>
              <th className="pb-3 font-medium text-left">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tickets.map((t, i) => (
              <tr key={t.issueID || i} className="hover:bg-gray-50 transition">
                <td className="py-3 font-mono text-xs font-semibold" style={{ color: BLUE }}>{t.issueID || "—"}</td>
                <td className="py-3 text-gray-700 max-w-xs truncate">{t.briefDescription || "—"}</td>
                <td className="py-3 text-xs text-gray-500">{t.technicien || "—"}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                    t.priority?.toLowerCase() === "critique" ? "bg-red-100 text-red-700 border-red-200" :
                    t.priority?.toLowerCase() === "majeur"   ? "bg-orange-100 text-orange-700 border-orange-200" :
                    "bg-green-100 text-green-700 border-green-200"
                  }`}>{t.priority || "—"}</span>
                </td>
                <td className="py-3 text-xs font-semibold text-red-500">{t.delaiDepasse || t.overdue || "—"}</td>
                <td className="py-3">
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-700">
                    {t.status || "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Page principale SLA ─────────────────────────────────
const Sla = () => {
  const { sla, loading, error } = useSla();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-t-transparent animate-spin"
             style={{ borderColor: BLUE, borderTopColor: "transparent" }} />
        <p className="text-gray-500">Chargement des données SLA...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 text-center bg-white shadow rounded-xl">
        <p className="font-semibold text-red-500">❌ Erreur de connexion</p>
        <p className="mt-1 text-sm text-gray-400">{error}</p>
      </div>
    </div>
  );

  // Extraction sécurisée des données
  const tauxGlobal   = sla?.tauxConformite   ?? sla?.slaRate        ?? 0;
  const totalTickets = sla?.totalTickets     ?? 0;
  const conforme     = sla?.ticketsConformes ?? sla?.conforme        ?? 0;
  const nonConforme  = sla?.ticketsHorsSla   ?? sla?.nonConforme     ?? 0;
  const tempsMoyen   = sla?.tempsMoyenRes    ?? sla?.avgResolution   ?? 0;
  const parTech      = sla?.parTechnicien    ?? [];
  const horsSlaTick  = sla?.ticketsHorsSlaDetails ?? [];

  const kpis = [
    { title: "Taux SLA Global",value: `${tauxGlobal}%`,  icon: <FiShield />,       color: tauxGlobal >= 90 ? "green" : "orange" },
    { title: "Tickets Conformes",   value: conforme,           icon: <FiCheckCircle />,  color: "green"  },
    { title: "Tickets Hors SLA",    value: nonConforme,        icon: <FiAlertTriangle />,color: "red"    },
    { title: "Total Analysés",      value: totalTickets,       icon: <FiTrendingUp />,   color: "blue"   },
    { title: "Temps Moyen (h)",     value: `${tempsMoyen}h`,   icon: <FiClock />,        color: "yellow" },
  ];

  const colorMap = {
    blue: BLUE, green: GREEN, red: RED, orange: ORANGE, yellow: "#f59e0b",
  };

  const bgMap = {
    blue: "bg-blue-50", green: "bg-green-50", red: "bg-red-50",
    orange: "bg-orange-50", yellow: "bg-yellow-50",
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">

          {/* Header */}
          <div>
            <h1 className="text-xl font-bold text-gray-800">SLA — Accord de Niveau de Service</h1>
            <p className="text-sm text-gray-500">Suivi de la conformité des délais de résolution</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {kpis.map((k) => (
              <div key={k.title}
                className="flex items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${bgMap[k.color]}`}
                     style={{ color: colorMap[k.color] }}>
                  {k.icon}
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">{k.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{k.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <SlaGauge value={tauxGlobal} />
            </div>
            <div className="lg:col-span-2">
              <SlaRepartitionChart conforme={conforme} nonConforme={nonConforme} />
            </div>
          </div>

          {/* Charts Row 2 */}
          {parTech.length > 0 && (
            <SlaTechChart data={parTech} />
          )}

          {/* Tableau tickets hors SLA */}
          <SlaTable tickets={horsSlaTick} />

        </main>
      </div>
    </div>
  );
};

export default Sla;