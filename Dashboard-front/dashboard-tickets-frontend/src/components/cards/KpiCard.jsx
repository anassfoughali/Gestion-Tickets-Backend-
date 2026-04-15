import React from 'react';

const colorMap = {
  navy:   'bg-[#0B1F3A]',
  gold:   'bg-[#C9A84C]',
  green:  'bg-emerald-500',
  red:    'bg-red-500',
  yellow: 'bg-amber-500',
  blue:   'bg-blue-500',
  teal:   'bg-teal-500',
};

const KpiCard = ({ title, value, icon, color, subtitle }) => (
  <div className="flex items-center gap-4 p-5 transition bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
    <div className={`${colorMap[color] || 'bg-[#0B1F3A]'} h-12 w-12 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value ?? '—'}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  </div>
);

export default KpiCard;