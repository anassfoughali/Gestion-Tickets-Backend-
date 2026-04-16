import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const BLUE = '#2784c1';
const GREEN = '#10b981';

const TicketEvolutionChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-72 p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
        <p className="text-sm text-gray-400">Aucune donnee disponible sur les 30 derniers jours</p>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
      <h3 className="mb-1 text-sm font-semibold text-gray-700">Evolution des tickets (30 jours)</h3>
      <p className="mb-4 text-xs text-gray-400">Comparaison entre tickets crees et tickets clotures</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="dayLabel"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            allowDecimals={false}
            domain={[0, 10]}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            formatter={(value, name) => [value, name === 'totalTickets' ? 'Tickets' : 'Tickets clotures']}
          />
          <Legend
            formatter={(value) => (value === 'totalTickets' ? 'Tickets' : 'Tickets clotures')}
            wrapperStyle={{ fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="totalTickets"
            name="totalTickets"
            stroke={BLUE}
            strokeWidth={2}
            dot={{ r: 2, fill: BLUE }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="closedTickets"
            name="closedTickets"
            stroke={GREEN}
            strokeWidth={2}
            dot={{ r: 2, fill: GREEN }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TicketEvolutionChart;

