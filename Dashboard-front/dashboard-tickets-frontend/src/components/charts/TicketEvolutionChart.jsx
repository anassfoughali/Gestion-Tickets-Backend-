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
import { FiDownload, FiFileText } from 'react-icons/fi';

const BLUE = '#2784c1';
const GREEN = '#10b981';

const TicketEvolutionChart = ({ data = [], chartRef }) => {
  const internalRef = React.useRef(null);
  const containerRef = chartRef || internalRef;

  const handleExportPNG = () => {
    const container = containerRef.current;
    if (!container) return;
    const svg = container.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const bbox = svg.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = bbox.width || 800;
    canvas.height = bbox.height || 300;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `evolution-tickets-${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 'image/png');
    };
    img.src = url;
  };

  const handleExportPDF = () => {
    const container = containerRef.current;
    if (!container) return;
    const svg = container.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const bbox = svg.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = bbox.width || 800;
    canvas.height = bbox.height || 300;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const imgData = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        // eslint-disable-next-line no-alert
        alert("Le navigateur a bloqué la fenêtre popup. Veuillez autoriser les popups pour ce site.");
        return;
      }
      const scriptTag = 'script';
      printWindow.document.write(
        '<html><head><title>Evolution des tickets</title></head>' +
        '<body style="margin:0;padding:20px;font-family:sans-serif;">' +
        '<h2 style="margin-bottom:16px;">Evolution des tickets (30 jours)</h2>' +
        `<img src="${imgData}" style="max-width:100%;" />` +
        `<${scriptTag}>window.onload=function(){window.print();window.close();}</${scriptTag}>` +
        '</body></html>'
      );
      printWindow.document.close();
    };
    img.src = url;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-72 p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
        <p className="text-sm text-gray-400">Aucune donnee disponible sur les 30 derniers jours</p>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Evolution des tickets (30 jours)</h3>
          <p className="text-xs text-gray-400">Comparaison entre tickets créés et tickets clôturés</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportPNG}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <FiDownload size={12} />
            Export PNG
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg transition"
            style={{ backgroundColor: '#0B1F3A' }}
          >
            <FiFileText size={12} />
            Export PDF
          </button>
        </div>
      </div>
      <div ref={containerRef} className="mt-4">
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
              domain={[0, 'auto']}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              formatter={(value, name) => [value, name === 'totalTickets' ? 'Tickets' : 'Tickets clôturés']}
            />
            <Legend
              formatter={(value) => (value === 'totalTickets' ? 'Tickets' : 'Tickets clôturés')}
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
    </div>
  );
};

export default TicketEvolutionChart;

