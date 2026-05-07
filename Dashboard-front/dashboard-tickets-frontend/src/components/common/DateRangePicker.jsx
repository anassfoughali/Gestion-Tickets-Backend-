import React from 'react';
import { FiCalendar } from 'react-icons/fi';

const DateRangePicker = ({ 
  dateDebut, 
  dateFin, 
  onDateDebutChange, 
  onDateFinChange, 
  disabled = false 
}) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get date 30 days ago as default start date
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const defaultStartDate = thirtyDaysAgo.toISOString().split('T')[0];

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <FiCalendar className="text-gray-500" size={16} />
      
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-600">Du:</label>
        <input
          type="date"
          value={dateDebut || defaultStartDate}
          onChange={(e) => onDateDebutChange(e.target.value)}
          disabled={disabled}
          max={today}
          className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-600">Au:</label>
        <input
          type="date"
          value={dateFin || today}
          onChange={(e) => onDateFinChange(e.target.value)}
          disabled={disabled}
          min={dateDebut || defaultStartDate}
          max={today}
          className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;