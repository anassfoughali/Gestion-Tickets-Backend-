import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const COLORS = ['#0B1F3A', '#2784c1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#C9A84C'];

const TechnicianPerformanceChart = ({ data = [], metric = 'resolution' }) => {
  const isClosedMetric = metric === 'closed';

  if (!data || data.length === 0) return (
    <div className="flex items-center justify-center h-64 p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
      <p className="text-sm text-gray-400">Aucune donnée disponible</p>
    </div>
  );

  const chartData = data
    .map((d) => ({
      name:  d.technicien || d.name || 'N/A',
      value: isClosedMetric
        ? Math.round(d.closedTickets || d.count || d.total || 0)
        : Math.round(d.tempsMoyenHeures || d.avgResolutionTime || 0),
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, isClosedMetric ? 5 : 8);

  return (
    <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
      <h3 className="mb-1 text-sm font-semibold text-gray-700">Performance Techniciens</h3>
      <p className="mb-4 text-xs text-gray-400">
        {isClosedMetric
          ? 'Top 5 techniciens par tickets clotures'
          : 'Temps moyen de resolution par technicien (heures)'}
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis
            type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
            allowDecimals={false}
            tickFormatter={(v) => (isClosedMetric ? `${v}` : `${v}h`)}
          />
          <YAxis
            dataKey="name" type="category" tick={{ fontSize: 10 }} tickLine={false}
            axisLine={false} width={100}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            formatter={(v) => [isClosedMetric ? `${v}` : `${v}h`, isClosedMetric ? 'Tickets clotures' : 'Temps moyen']}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TechnicianPerformanceChart;