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

// Premium gradient colors based on priority
const getPriorityColors = (priorite) => {
  const priorityLower = priorite?.toLowerCase() || '';
  
  if (priorityLower === 'critique') {
    return {
      stroke: '#DC2626',                  // Rouge vif
      gradientStart: 'rgba(220, 38, 38, 0.4)',
      gradientEnd: 'rgba(220, 38, 38, 0.05)',
      shadow: 'rgba(220, 38, 38, 0.4)',
    };
  } else if (priorityLower === 'majeur') {
    return {
      stroke: '#1E40AF',                  // Bleu navy
      gradientStart: 'rgba(30, 64, 175, 0.4)',
      gradientEnd: 'rgba(30, 64, 175, 0.05)',
      shadow: 'rgba(30, 64, 175, 0.4)',
    };
  } else if (priorityLower === 'mineur') {
    return {
      stroke: '#10B981',                  // Vert émeraude
      gradientStart: 'rgba(16, 185, 129, 0.4)',
      gradientEnd: 'rgba(16, 185, 129, 0.05)',
      shadow: 'rgba(16, 185, 129, 0.4)',
    };
  }
  
  // Couleur par défaut (vert)
  return {
    stroke: '#10B981',
    gradientStart: 'rgba(16, 185, 129, 0.4)',
    gradientEnd: 'rgba(16, 185, 129, 0.05)',
    shadow: 'rgba(16, 185, 129, 0.4)',
  };
};

const COLORS = {
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    light: '#9CA3AF',
  },
  grid: 'rgba(156, 163, 175, 0.2)',
  background: '#FFFFFF',
};

// Number of days to show per page
const DAYS_PER_PAGE = 15;

// Custom Tooltip Component with premium styling
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      border: '1px solid rgba(229, 231, 235, 0.8)',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
    }}>
      <p style={{
        margin: '0 0 8px 0',
        fontSize: '13px',
        fontWeight: '600',
        color: COLORS.text.primary,
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
        paddingBottom: '6px',
      }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: entry.color,
              display: 'inline-block',
              boxShadow: `0 0 8px ${entry.color}40`,
            }} />
            <span style={{
              fontSize: '12px',
              color: COLORS.text.secondary,
              fontWeight: '500',
            }}>
              {entry.name}:
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: '700',
              color: COLORS.text.primary,
              marginLeft: 'auto',
            }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom Legend Component with premium styling
const CustomLegend = ({ payload }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '24px',
      marginTop: '16px',
    }}>
      {payload.map((entry, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          backgroundColor: 'rgba(249, 250, 251, 0.8)',
          borderRadius: '8px',
          border: '1px solid rgba(229, 231, 235, 0.5)',
        }}>
          <span style={{
            width: '12px',
            height: '12px',
            borderRadius: '3px',
            backgroundColor: entry.color,
            display: 'inline-block',
            boxShadow: `0 0 8px ${entry.color}40`,
          }} />
          <span style={{
            fontSize: '13px',
            fontWeight: '600',
            color: COLORS.text.primary,
          }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const SimpleTicketEvolutionChart = ({ 
  data, 
  dateDebut, 
  dateFin, 
  priorite, 
  loading = false 
}) => {
  const cardRef = React.useRef(null);
  const [currentPage, setCurrentPage] = React.useState(0);

  // Get colors based on priority
  const priorityColors = React.useMemo(() => getPriorityColors(priorite), [priorite]);

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
      link.download = `tickets-arrives-${dateDebut}-${dateFin}-${priorite}.png`;
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
    pdf.save(`tickets-arrives-${dateDebut}-${dateFin}-${priorite}.pdf`);
  };

  // Transform API data for line chart with pagination
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
      <div style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(229, 231, 235, 0.8)',
        padding: '60px 20px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: `3px solid ${getPriorityColors(priorite).gradientEnd}`,
          borderTopColor: getPriorityColors(priorite).stroke,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{
          marginTop: '16px',
          fontSize: '14px',
          color: COLORS.text.secondary,
          fontWeight: '500',
        }}>
          Chargement des données filtrées...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    const emptyColors = getPriorityColors(priorite);
    return (
      <div style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(229, 231, 235, 0.8)',
        padding: '60px 20px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 16px',
          backgroundColor: emptyColors.gradientEnd,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={emptyColors.stroke} strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        </div>
        <p style={{
          fontSize: '15px',
          fontWeight: '600',
          color: COLORS.text.primary,
          margin: '0 0 8px 0',
        }}>
          Aucune donnée disponible
        </p>
        <p style={{
          fontSize: '13px',
          color: COLORS.text.secondary,
          margin: 0,
        }}>
          Aucun ticket trouvé pour la période et priorité sélectionnées
        </p>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="premium-chart-card" style={{
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(229, 231, 235, 0.8)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div className="chart-header" style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
        background: 'rgba(255, 255, 255, 0.8)',
      }}>
        <div className="header-content">
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: COLORS.text.primary,
            margin: '0 0 4px 0',
            letterSpacing: '-0.01em',
          }}>
            Évolution des tickets arrivés ({data.length} jours)
          </h3>
          <p style={{
            fontSize: '13px',
            color: COLORS.text.secondary,
            margin: 0,
            fontWeight: '500',
          }}>
            Nombre de tickets arrivés par jour - Priorité: <span style={{
              fontWeight: '600',
              color: priorityColors.stroke,
            }}>{priorite}</span>
          </p>
        </div>
        <div className="export-buttons" style={{
          display: 'flex',
          gap: '8px',
        }}>
          <button
            onClick={handleExportPNG}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: '600',
              color: COLORS.text.secondary,
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(229, 231, 235, 0.8)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F9FAFB';
              e.currentTarget.style.borderColor = COLORS.text.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = 'rgba(229, 231, 235, 0.8)';
            }}
            aria-label="Export PNG"
          >
            <FiDownload size={14} />
            <span>PNG</span>
          </button>
          <button
            onClick={handleExportPDF}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#FFFFFF',
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(31, 41, 55, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#111827';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(31, 41, 55, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1F2937';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(31, 41, 55, 0.4)';
            }}
            aria-label="Export PDF"
          >
            <FiFileText size={14} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '16px 24px',
          padding: '12px 16px',
          backgroundColor: 'rgba(249, 250, 251, 0.8)',
          borderRadius: '10px',
          border: '1px solid rgba(229, 231, 235, 0.5)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                color: currentPage === 0 ? COLORS.text.light : COLORS.text.secondary,
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(229, 231, 235, 0.8)',
                borderRadius: '6px',
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 0 ? 0.5 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              <FiChevronLeft size={14} />
              Précédent
            </button>
            
            <span style={{
              fontSize: '12px',
              color: COLORS.text.secondary,
              fontWeight: '500',
            }}>
              Page <span style={{ fontWeight: '700', color: COLORS.text.primary }}>{currentPage + 1}</span> sur {totalPages} • 
              Jours {currentPage * DAYS_PER_PAGE + 1}-{Math.min((currentPage + 1) * DAYS_PER_PAGE, chartData.length)}
            </span>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                color: currentPage === totalPages - 1 ? COLORS.text.light : COLORS.text.secondary,
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(229, 231, 235, 0.8)',
                borderRadius: '6px',
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages - 1 ? 0.5 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              Suivant
              <FiChevronRight size={14} />
            </button>
          </div>
          
          <div style={{
            fontSize: '11px',
            color: COLORS.text.light,
            fontWeight: '500',
          }}>
            {DAYS_PER_PAGE} jours par page
          </div>
        </div>
      )}

      {/* Chart */}
      <div style={{ padding: '20px 24px' }}>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart 
            data={currentPageData} 
            margin={{ top: 20, right: 30, bottom: 60, left: 20 }}
          >
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="colorTicketsArrived" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={priorityColors.stroke} stopOpacity={0.4} />
                <stop offset="95%" stopColor={priorityColors.stroke} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            {/* Grid with subtle styling */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={COLORS.grid}
              vertical={false}
              strokeOpacity={0.5}
            />

            {/* X Axis - Show ALL days without skipping */}
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: COLORS.text.secondary, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.grid, strokeWidth: 1 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />

            {/* Y Axis with better scaling */}
            <YAxis 
              allowDecimals={false}
              domain={[0, maxValue]}
              tick={{ fontSize: 11, fill: COLORS.text.secondary, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.grid, strokeWidth: 1 }}
            />

            {/* Tooltip */}
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ 
                stroke: priorityColors.stroke, 
                strokeWidth: 2, 
                strokeOpacity: 0.2,
                strokeDasharray: '5 5',
              }}
            />

            {/* Legend */}
            <Legend 
              content={<CustomLegend />}
              wrapperStyle={{ paddingTop: '20px' }}
            />

            {/* Area Chart with smooth gradient */}
            <Area
              type="monotone"
              dataKey="Tickets arrivés"
              stroke={priorityColors.stroke}
              strokeWidth={2.5}
              fill="url(#colorTicketsArrived)"
              dot={false}
              activeDot={{ 
                r: 5, 
                fill: priorityColors.stroke,
                stroke: '#fff',
                strokeWidth: 2,
                filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))',
              }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimpleTicketEvolutionChart;