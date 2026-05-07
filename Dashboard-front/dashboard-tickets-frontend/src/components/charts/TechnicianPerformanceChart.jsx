import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import './PremiumChart.css';

const COLORS = ['#6366F1', '#8B5CF6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#C9A84C'];

// Premium color palette
const PREMIUM_COLORS = {
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    light: '#9CA3AF',
  },
  grid: 'rgba(0, 0, 0, 0.05)',
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="premium-tooltip">
      <div className="tooltip-content">
        {payload.map((entry, index) => (
          <div key={index} className="tooltip-item">
            <span 
              className="tooltip-dot" 
              style={{ backgroundColor: entry.fill }}
            />
            <span className="tooltip-label">{entry.payload.name}:</span>
            <span className="tooltip-value">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TechnicianPerformanceChart = ({ data = [], metric = 'resolution' }) => {
  const isClosedMetric = metric === 'closed';

  if (!data || data.length === 0) return (
    <div className="premium-chart-card empty-state" style={{ minHeight: '320px' }}>
      <p className="empty-text">Aucune donnée disponible</p>
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
    <div className="premium-chart-card">
      <div className="header-content">
        <h3 className="chart-title">Performance Techniciens</h3>
        <p className="chart-subtitle">
          {isClosedMetric
            ? 'Top 5 techniciens par tickets clôturés'
            : 'Temps moyen de résolution par technicien (heures)'}
        </p>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={PREMIUM_COLORS.grid} 
              horizontal={false} 
            />
            <XAxis
              type="number" 
              tick={{ fontSize: 12, fill: PREMIUM_COLORS.text.secondary, fontWeight: 500 }}
              tickLine={false} 
              axisLine={{ stroke: PREMIUM_COLORS.grid }}
              allowDecimals={false}
              tickFormatter={(v) => (isClosedMetric ? `${v}` : `${v}h`)}
            />
            <YAxis
              dataKey="name" 
              type="category" 
              tick={{ fontSize: 12, fill: PREMIUM_COLORS.text.secondary, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: PREMIUM_COLORS.grid }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[0, 8, 8, 0]}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TechnicianPerformanceChart;