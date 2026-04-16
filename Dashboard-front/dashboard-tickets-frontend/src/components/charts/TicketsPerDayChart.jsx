import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

const BLUE = '#2784c1';

const TicketsPerDayChart = ({ data = [] }) => {
  if (!data || data.length === 0) return (
    <div className="flex items-center justify-center h-64 p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
      <p className="text-sm text-gray-400">Aucune donnée disponible</p>
    </div>
  );

  const chartData = data.map((d) => ({
    label: d.date || d.jour || d.day || '',
    count: Number(d.total ?? d.count ?? d.nombre ?? 0),
  }));

  return (
    <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
      <h3 className="mb-1 text-sm font-semibold text-gray-700">Tickets par Jour</h3>
      <p className="mb-4 text-xs text-gray-400">Évolution quotidienne des tickets</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={BLUE} stopOpacity={0.25} />
              <stop offset="95%" stopColor={BLUE} stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            formatter={(v) => [v, 'Tickets']}
          />
          <Area
            type="monotone" dataKey="count" name="Tickets"
            stroke={BLUE} strokeWidth={2}
            fill="url(#colorCount)" dot={{ r: 3, fill: BLUE }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TicketsPerDayChart;