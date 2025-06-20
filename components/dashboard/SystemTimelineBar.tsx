
import React from 'react';
import { System, StatusEntry, AvailabilityStatus, DateRange } from '../../types';
import { STATUS_COLORS } from '../../constants';
import { getDaysInRange, formatDateToString, parseDateString } from '../../utils/dateUtils';


interface SystemTimelineBarProps {
  system: System;
  allStatusEntries: StatusEntry[];
  dateRange: DateRange;
}

interface DailyStatusInfo {
  date: string; // YYYY-MM-DD
  status: AvailabilityStatus;
  description: string;
}

export const SystemTimelineBar: React.FC<SystemTimelineBarProps> = ({ system, allStatusEntries, dateRange }) => {
  const daysInPeriod = getDaysInRange(dateRange.start, dateRange.end);

  const getStatusForDay = (day: Date): DailyStatusInfo => {
    const dayString = formatDateToString(day);
    
    const systemEntries = allStatusEntries.filter(entry => entry.systemId === system.id);
    const relevantEntries = systemEntries
      .filter(entry => entry.date <= dayString)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (relevantEntries.length > 0) {
      return {
        date: dayString,
        status: relevantEntries[0].status,
        description: relevantEntries[0].description,
      };
    }
    
    return {
      date: dayString,
      status: AvailabilityStatus.UNKNOWN,
      description: 'No status reported for this period.',
    };
  };

  const dailyStatuses: DailyStatusInfo[] = daysInPeriod.map(day => getStatusForDay(day));
  
  // Group consecutive days with same status
  const statusRanges: Array<{start: string, end: string, status: AvailabilityStatus, description: string}> = [];
  let currentRange: {start: string, end: string, status: AvailabilityStatus, description: string} | null = null;
  
  dailyStatuses.forEach((dailyStatus) => {
    if (!currentRange || currentRange.status !== dailyStatus.status) {
      if (currentRange) statusRanges.push(currentRange);
      currentRange = {
        start: dailyStatus.date,
        end: dailyStatus.date,
        status: dailyStatus.status,
        description: dailyStatus.description
      };
    } else {
      currentRange.end = dailyStatus.date;
    }
  });
  if (currentRange) statusRanges.push(currentRange);

  if (daysInPeriod.length === 0) {
    return <div className="text-sm text-gray-400">No data for selected period.</div>;
  }

  return (
    <div className="w-full bg-gray-600 rounded overflow-hidden" style={{ height: '30px' }}>
      <div className="flex h-full">
        {dailyStatuses.map((dailyStatus, index) => {
          const range = statusRanges.find(r => r.status === dailyStatus.status && dailyStatus.date >= r.start && dailyStatus.date <= r.end);
          const tooltipText = range?.start === range?.end 
            ? `${parseDateString(range.start).toLocaleDateString('en-AU')}: ${range.status} - ${range.description}`
            : `${parseDateString(range?.start || dailyStatus.date).toLocaleDateString('en-AU')} - ${parseDateString(range?.end || dailyStatus.date).toLocaleDateString('en-AU')}: ${range?.status || dailyStatus.status} - ${range?.description || dailyStatus.description}`;
          
          const width = `${100 / daysInPeriod.length}%`;
          return (
            <div
              key={`${system.id}-${dailyStatus.date}-${index}`}
              className={`h-full ${STATUS_COLORS[dailyStatus.status]} cursor-pointer`}
              style={{ width }}
              title={tooltipText}
            />
          );
        })}
      </div>
    </div>
  );
};
    