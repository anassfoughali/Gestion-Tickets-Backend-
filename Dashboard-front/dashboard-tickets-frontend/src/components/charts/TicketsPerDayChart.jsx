import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import './PremiumChart.css';

// Premium color palette
const COLORS = {
  primary: '#6366F1',      // Indigo
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    light: '#9CA3AF',
  },
  grid: 'rgba(0, 0, 0, 0.05)',
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="premium-tooltip">
      <p className="tooltip-date">{label}</p>
      <div className="tooltip-content">
        {payload.map((entry, index) => (
          <div key={index} className="tooltip-item">
            <span 
              className="tooltip-dot" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="tooltip-label">{entry.name}:</span>
            <span className="tooltip-value">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TicketsPerDayChart = ({ data = [] }) => {
  if (!data || data.length === 0) return (
    <div className="premium-chart-card empty-state" style={{ minHeight: '320px' }}>
      <p className="empty-text">Aucune donnée disponible</p>
    </div>
  );

  const chartData = data.map((d) => ({
    label: d.date || d.jour || d.day || '',
    count: Number(d.total ?? d.count ?? d.nombre ?? 0),
  }));

  return (
    <div className="premium-chart-card">
      <div className="header-content">
        <h3 className="chart-title">Tickets par Jour</h3>
        <p className="chart-subtitle">Évolution quotidienne des tickets</p>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <defs>
              <linearGradient id="colorCountPremium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={COLORS.grid}
              vertical={false}
            />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 11, fill: COLORS.text.secondary, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.grid }}
              height={40}
            />
            <YAxis 
              allowDecimals={false} 
              tick={{ fontSize: 11, fill: COLORS.text.secondary, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.grid }}
              width={40}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: COLORS.primary, strokeWidth: 1, strokeOpacity: 0.3 }}
            />
            <Area
              type="monotone" 
              dataKey="count" 
              name="Tickets"
              stroke={COLORS.primary} 
              strokeWidth={3}
              fill="url(#colorCountPremium)" 
              dot={{ r: 0, fill: COLORS.primary }}
              activeDot={{ 
                r: 6, 
                fill: COLORS.primary,
                stroke: '#fff',
                strokeWidth: 2,
              }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TicketsPerDayChart;