import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { FiDownload, FiFileText } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './PremiumChart.css';

// Premium color palette - Bleu ciel et Vert
const COLORS = {
  primary: '#06B6D4',      // Bleu ciel (Cyan)
  secondary: '#10B981',    // Vert (Green)
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    light: '#9CA3AF',
  },
  grid: 'rgba(0, 0, 0, 0.05)',
  background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFBFC 100%)',
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

// Custom Legend Component
const CustomLegend = ({ payload }) => {
  return (
    <div className="custom-legend">
      {payload.map((entry, index) => (
        <div key={index} className="legend-item">
          <span 
            className="legend-dot" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="legend-label">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const PremiumTicketEvolutionChart = ({ data = [], chartRef }) => {
  const internalRef = React.useRef(null);
  const containerRef = chartRef || internalRef;
  const cardRef = React.useRef(null);

  const captureCanvas = () =>
    html2canvas(cardRef.current || containerRef.current, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    });

  const handleExportPNG = () => {
    if (!cardRef.current && !containerRef.current) return;
    captureCanvas().then((canvas) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `evolution-tickets-${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }, 'image/png');
    });
  };

  const handleExportPDF = () => {
    if (!cardRef.current && !containerRef.current) return;
    captureCanvas().then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ 
        orientation: 'landscape', 
        unit: 'px', 
        format: [canvas.width / 2, canvas.height / 2] 
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`evolution-tickets-${new Date().toISOString().slice(0, 10)}.pdf`);
    });
  };

  if (!data || data.length === 0) {
    return (
      <div className="premium-chart-card empty-state">
        <p className="empty-text">Aucune donnée disponible sur les 30 derniers jours</p>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="premium-chart-card">
      {/* Header */}
      <div className="chart-header">
        <div className="header-content">
          <h3 className="chart-title">Évolution des tickets (30 jours)</h3>
          <p className="chart-subtitle">Comparaison entre tickets créés et tickets clôturés</p>
        </div>
        <div className="export-buttons">
          <button
            onClick={handleExportPNG}
            className="export-btn export-btn-secondary"
            aria-label="Export PNG"
          >
            <FiDownload size={14} />
            <span>Export PNG</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="export-btn export-btn-primary"
            aria-label="Export PDF"
          >
            <FiFileText size={14} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div ref={containerRef} className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart 
            data={data} 
            margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
          >
            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorClotures" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8} />
                <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.1} />
              </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={COLORS.grid}
              vertical={false}
            />

            {/* Axes */}
            <XAxis 
              dataKey="dayLabel" 
              tick={{ fontSize: 12, fill: COLORS.text.secondary, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.grid }}
              interval="preserveStartEnd"
            />
            <YAxis 
              allowDecimals={false}
              domain={[0, 'auto']}
              tick={{ fontSize: 12, fill: COLORS.text.secondary, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.grid }}
            />

            {/* Tooltip */}
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: COLORS.primary, strokeWidth: 1, strokeOpacity: 0.3 }}
            />

            {/* Legend */}
            <Legend 
              content={<CustomLegend />}
              wrapperStyle={{ paddingTop: '20px' }}
            />

            {/* Areas */}
            <Area
              type="monotone"
              dataKey="totalTickets"
              name="Tickets créés"
              stroke={COLORS.primary}
              strokeWidth={3}
              fill="url(#colorTickets)"
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
            <Area
              type="monotone"
              dataKey="closedTickets"
              name="Tickets clôturés"
              stroke={COLORS.secondary}
              strokeWidth={3}
              fill="url(#colorClotures)"
              dot={{ r: 0, fill: COLORS.secondary }}
              activeDot={{ 
                r: 6, 
                fill: COLORS.secondary,
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

export default PremiumTicketEvolutionChart;
