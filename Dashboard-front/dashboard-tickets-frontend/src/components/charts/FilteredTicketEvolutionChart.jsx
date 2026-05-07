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
import { FiDownload, FiFileText, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './PremiumChart.css';

// Colors matching the reference image with better visibility
const COLORS = {
  arrived: {
    fill: 'rgba(34, 197, 94, 0.3)',    // More visible green fill
    stroke: '#16A34A',                  // Darker green stroke
  },
  closed: {
    fill: 'rgba(239, 68, 68, 0.3)',    // More visible red fill  
    stroke: '#DC2626',                  // Darker red stroke
  },
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    light: '#6B7280',
  },
  grid: 'rgba(0, 0, 0, 0.08)',
  background: '#FAFAFA',
};

// Number of days to show per page
const DAYS_PER_PAGE = 15;

// Custom Tooltip Component with exact same style
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

// Custom Legend Component with exact same style
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

const FilteredTicketEvolutionChart = ({ 
  data, 
  dateDebut, 
  dateFin, 
  priorite, 
  loading = false 
}) => {
  const cardRef = React.useRef(null);
  const [currentPage, setCurrentPage] = React.useState(0);

  const captureCanvas = async () => {
    const exportButtons = cardRef.current?.querySelector('.export-buttons');
    const pagination = cardRef.current?.querySelector('.pagination-controls');
    
    if (exportButtons) exportButtons.style.display = 'none';
    if (pagination) pagination.style.display = 'none';

    return html2canvas(cardRef.current, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    }).then((canvas) => {
      if (exportButtons) exportButtons.style.display = 'flex';
      if (pagination) pagination.style.display = 'flex';
      return canvas;
    });
  };

  const handleExportPNG = async () => {
    if (!cardRef.current) return;
    const canvas = await captureCanvas();
    canvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `evolution-tickets-filtered-${dateDebut}-${dateFin}-${priorite}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 'image/png');
  };

  const handleExportPDF = async () => {
    if (!cardRef.current) return;
    const canvas = await captureCanvas();
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ 
      orientation: 'landscape', 
      unit: 'px', 
      format: [canvas.width / 2, canvas.height / 2] 
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`evolution-tickets-filtered-${dateDebut}-${dateFin}-${priorite}.pdf`);
  };

  // Transform API data for area chart with pagination
  const { chartData, totalPages, currentPageData } = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return { chartData: [], totalPages: 0, currentPageData: [] };
    
    // Format dates for better display (YYYY-MM-DD -> DD/MM)
    const formatDateLabel = (dateStr) => {
      const [, month, day] = dateStr.split('-');
      return `${day}/${month}`;
    };
    
    const allData = data.map(dayData => ({
      date: formatDateLabel(dayData.date),
      fullDate: dayData.date,
      'Tickets arrivés': dayData.ticketsArrivés || 0,
    }));

    const totalPages = Math.ceil(allData.length / DAYS_PER_PAGE);
    const startIndex = currentPage * DAYS_PER_PAGE;
    const endIndex = startIndex + DAYS_PER_PAGE;
    const currentPageData = allData.slice(startIndex, endIndex);

    return { 
      chartData: allData, 
      totalPages, 
      currentPageData 
    };
  }, [data, currentPage]);

  // Reset page when data changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [data]);

  // Calculate max value for better Y-axis scaling (based on current page)
  const maxValue = React.useMemo(() => {
    if (!currentPageData.length) return 10;
    const maxArrived = Math.max(...currentPageData.map(d => d['Tickets arrivés']));
    // Add 20% padding and round to nice number
    const paddedMax = Math.ceil(maxArrived * 1.2);
    return Math.max(paddedMax, 5); // Minimum of 5 for visibility
  }, [currentPageData]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  if (loading) {
    return (
      <div className="premium-chart-card empty-state">
        <p className="empty-text">Chargement des données filtrées...</p>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="premium-chart-card empty-state">
        <p className="empty-text">
          Aucune donnée disponible pour la période et priorité sélectionnées
        </p>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="premium-chart-card">
      {/* Header */}
      <div className="chart-header">
        <div className="header-content">
          <h3 className="chart-title">
            Évolution des tickets arrivés ({data.length} jours)
          </h3>
          <p className="chart-subtitle">
            Nombre de tickets arrivés par jour - Priorité: {priorite}
          </p>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft size={14} />
              Précédent
            </button>
            
            <span className="text-xs text-gray-600">
              Page {currentPage + 1} sur {totalPages} • 
              Affichage des jours {currentPage * DAYS_PER_PAGE + 1} à {Math.min((currentPage + 1) * DAYS_PER_PAGE, chartData.length)}
            </span>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
              <FiChevronRight size={14} />
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            {DAYS_PER_PAGE} jours par page
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart 
            data={currentPageData} 
            margin={{ top: 20, right: 30, bottom: 60, left: 20 }}
          >
            {/* Grid with better visibility */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={COLORS.grid}
              vertical={false}
            />

            {/* X Axis - Show ALL days without skipping */}
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: COLORS.text.secondary, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.grid }}
              interval={0} // Show ALL ticks
              angle={-45}
              textAnchor="end"
              height={80}
            />

            {/* Y Axis with better scaling */}
            <YAxis 
              allowDecimals={false}
              domain={[0, maxValue]}
              tick={{ fontSize: 12, fill: COLORS.text.secondary, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.grid }}
            />

            {/* Tooltip */}
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: COLORS.arrived.stroke, strokeWidth: 1, strokeOpacity: 0.3 }}
            />

            {/* Legend */}
            <Legend 
              content={<CustomLegend />}
              wrapperStyle={{ paddingTop: '20px' }}
            />

            {/* Areas with better visibility and stroke width */}
            <Area
              type="monotone"
              dataKey="Tickets arrivés"
              stroke={COLORS.arrived.stroke}
              fill={COLORS.arrived.fill}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FilteredTicketEvolutionChart;