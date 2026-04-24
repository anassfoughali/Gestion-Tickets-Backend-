import React from 'react';
import { FiAward, FiTrendingUp } from 'react-icons/fi';
import './PremiumChart.css';

const PODIUM_COLORS = {
  1: { bg: '#FFD700', text: '#B8860B', medal: '🥇' },
  2: { bg: '#C0C0C0', text: '#696969', medal: '🥈' },
  3: { bg: '#CD7F32', text: '#8B4513', medal: '🥉' },
  4: { bg: '#6366F1', text: '#4F46E5', medal: '🏅' },
  5: { bg: '#8B5CF6', text: '#7C3AED', medal: '🏅' },
};

const TechnicianPodiumChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="premium-chart-card empty-state" style={{ minHeight: '400px' }}>
        <p className="empty-text">Aucune donnée disponible</p>
      </div>
    );
  }

  // Sort and get top 5
  const topTechnicians = [...data]
    .map((d) => ({
      name: d.technicien || d.name || 'N/A',
      count: Math.round(d.closedTickets || d.count || d.total || 0),
    }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (topTechnicians.length === 0) {
    return (
      <div className="premium-chart-card empty-state" style={{ minHeight: '400px' }}>
        <p className="empty-text">Aucun ticket clôturé</p>
      </div>
    );
  }

  // Calculate max for percentage bars
  const maxCount = topTechnicians[0]?.count || 1;

  return (
    <div className="premium-chart-card">
      <div className="header-content">
        <div className="flex items-center gap-2">
          <FiAward className="text-yellow-500" size={20} />
          <h3 className="chart-title">Top 5 Techniciens</h3>
        </div>
        <p className="chart-subtitle">Classement par nombre de tickets clôturés</p>
      </div>

      <div className="podium-container" style={{ padding: '20px 10px' }}>
        {topTechnicians.map((tech, index) => {
          const rank = index + 1;
          const colors = PODIUM_COLORS[rank];
          const percentage = (tech.count / maxCount) * 100;

          return (
            <div
              key={index}
              className="podium-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                marginBottom: '10px',
                borderRadius: '12px',
                backgroundColor: rank === 1 ? '#FFF9E6' : rank === 2 ? '#F5F5F5' : rank === 3 ? '#FFF4E6' : '#F8F9FF',
                border: `2px solid ${colors.bg}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Rank Badge */}
              <div
                style={{
                  minWidth: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: colors.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                {colors.medal}
              </div>

              {/* Technician Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1F2937',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tech.name}
                  </span>
                  {rank === 1 && (
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#FFD700',
                        color: '#B8860B',
                        fontWeight: '600',
                      }}
                    >
                      MEILLEUR
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: colors.bg,
                      borderRadius: '4px',
                      transition: 'width 1s ease-out',
                    }}
                  />
                </div>
              </div>

              {/* Count Badge */}
              <div
                style={{
                  minWidth: '60px',
                  textAlign: 'center',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: colors.bg,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                  {tech.count}
                </div>
                <div style={{ fontSize: '10px', color: 'white', opacity: 0.9 }}>
                  tickets
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: '#F9FAFB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FiTrendingUp style={{ color: '#10B981' }} size={16} />
          <span style={{ fontSize: '12px', color: '#6B7280' }}>
            Total clôturés: <strong>{topTechnicians.reduce((sum, t) => sum + t.count, 0)}</strong>
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
          Mis à jour en temps réel
        </span>
      </div>
    </div>
  );
};

export default TechnicianPodiumChart;
