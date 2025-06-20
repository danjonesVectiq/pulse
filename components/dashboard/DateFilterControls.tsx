
import React, { useState, useEffect } from 'react';
import { DateRange } from '../../types';
import { formatDateToString, getMonthDateRange, parseDateString } from '../../utils/dateUtils';
import { CalendarDaysIcon } from '../icons/Icons';

interface DateFilterControlsProps {
  onDateRangeChange: (range: DateRange) => void;
  initialDateRange: DateRange;
}

type FilterType = 'month' | 'custom';

export const DateFilterControls: React.FC<DateFilterControlsProps> = ({ onDateRangeChange, initialDateRange }) => {
  const [filterType, setFilterType] = useState<FilterType>('month');
  
  const currentYear = new Date().getUTCFullYear();
  const currentMonth = new Date().getUTCMonth(); // 0-indexed

  const [selectedMonth, setSelectedMonth] = useState<string>(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`);
  const [customStartDate, setCustomStartDate] = useState<string>(formatDateToString(initialDateRange.start));
  const [customEndDate, setCustomEndDate] = useState<string>(formatDateToString(initialDateRange.end));

  useEffect(() => {
    if (filterType === 'month') {
      const [year, monthNum] = selectedMonth.split('-').map(Number);
      onDateRangeChange(getMonthDateRange(year, monthNum - 1));
    } else {
      try {
          const start = parseDateString(customStartDate);
          const end = parseDateString(customEndDate);
          if (start <= end) {
            onDateRangeChange({ start, end });
          }
      } catch (e) {
        console.error("Invalid custom date:", e);
      }
    }
  }, [filterType, selectedMonth, customStartDate, customEndDate]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    if (type === 'start') {
      setCustomStartDate(e.target.value);
    } else {
      setCustomEndDate(e.target.value);
    }
  };

  const monthOptions = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const y = date.getFullYear();
    const m = date.getMonth();
    const monthValue = `${y}-${String(m + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleString('en-AU', { month: 'long', year: 'numeric' });
    monthOptions.push({ value: monthValue, label: monthLabel });
  }

  return (
    <div className="p-4 bg-gray-800 shadow rounded-lg mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-gray-200">
            <input 
              type="radio" 
              name="filterType" 
              value="month" 
              checked={filterType === 'month'} 
              onChange={() => setFilterType('month')}
              className="form-radio h-4 w-4 text-sky-600 border-gray-500 focus:ring-sky-500"
              aria-label="Filter by month"
            />
            <span className="ml-2">Monthly</span>
          </label>
          <label className="flex items-center text-gray-200">
            <input 
              type="radio" 
              name="filterType" 
              value="custom" 
              checked={filterType === 'custom'} 
              onChange={() => setFilterType('custom')}
              className="form-radio h-4 w-4 text-sky-600 border-gray-500 focus:ring-sky-500"
              aria-label="Filter by custom date range"
            />
            <span className="ml-2">Custom Range</span>
          </label>
        </div>

        {filterType === 'month' && (
          <div className="flex items-center">
            <label htmlFor="month-select" className="sr-only">Select Month</label>
            <div className="relative">
                <select
                id="month-select"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="block w-full appearance-none bg-gray-700 border border-gray-500 text-gray-200 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                aria-label="Select month for filtering"
                >
                {monthOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                    <CalendarDaysIcon className="h-5 w-5"/>
                </div>
            </div>
          </div>
        )}

        {filterType === 'custom' && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="relative">
              <label htmlFor="custom-start-date" className="sr-only">Custom Start Date</label>
              <input 
                type="date"
                id="custom-start-date" 
                value={customStartDate}
                onChange={(e) => handleCustomDateChange(e, 'start')}
                className="bg-gray-700 border border-gray-500 text-gray-200 py-2 px-3 rounded-md focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                aria-label="Custom start date for filtering"
              />
            </div>
            <span className="text-gray-400 hidden sm:inline" aria-hidden="true">-</span>
             <div className="relative">
              <label htmlFor="custom-end-date" className="sr-only">Custom End Date</label>
              <input 
                type="date" 
                id="custom-end-date"
                value={customEndDate}
                onChange={(e) => handleCustomDateChange(e, 'end')}
                className="bg-gray-700 border border-gray-500 text-gray-200 py-2 px-3 rounded-md focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                aria-label="Custom end date for filtering"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
