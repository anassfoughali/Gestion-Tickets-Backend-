import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import './PremiumChart.css';

// Premium Palette
const COLORS = ['#6366F1', '#8B5CF6', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#C9A84C'];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#1f2937" fontSize={11} fontWeight="600">
        {payload.name.length > 14 ? payload.name.slice(0, 14) + '…' : payload.name}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#6b7280" fontSize={12} fontWeight="700">
        {value}h
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 12} outerRadius={outerRadius + 15}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

const ResolutionTimeChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!data || data.length === 0) return (
    <div className="premium-chart-card empty-state" style={{ minHeight: '320px' }}>
      <p className="empty-text">Aucune donnée disponible</p>
    </div>
  );

  const chartData = data
    .map((t) => ({
      name:  t.technicien || t.name || 'N/A',
      value: Math.round(t.tempsMoyenHeures || t.avgResolutionTime || 0),
    }))
    .filter((t) => t.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);


  return (
    <div className="premium-chart-card">
      <div className="header-content">
        <h3 className="chart-title">Temps Moyen Résolution</h3>
        <p className="chart-subtitle">Top 5 techniciens (heures)</p>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie 
              activeIndex={activeIndex} 
              activeShape={renderActiveShape}
              data={chartData} 
              cx="50%" 
              cy="50%"
              innerRadius={60} 
              outerRadius={85} 
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center mt-3 gap-x-4 gap-y-2">
          {chartData.map((entry, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70"
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span 
                className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }} 
              />
              <span className="text-xs font-medium text-gray-600 truncate max-w-[90px]">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResolutionTimeChart;