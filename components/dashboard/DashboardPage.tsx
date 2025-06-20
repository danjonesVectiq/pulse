
import React, { useState, useMemo } from 'react';
import { System, Category, StatusEntry, DateRange, AvailabilityStatus } from '../../types';
import { DateFilterControls } from './DateFilterControls';
import { SystemTimelineBar } from './SystemTimelineBar';
import { STATUS_COLORS, STATUS_TEXT_COLORS } from '../../constants';
import { InformationCircleIcon } from '../icons/Icons';
import { Tooltip } from '../common/Tooltip';
import { subDays, getTodayDateString, parseDateString } from '../../utils/dateUtils';


interface DashboardPageProps {
  systems: System[];
  categories: Category[];
  statusEntries: StatusEntry[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ systems, categories, statusEntries }) => {
  const initialEndDate = new Date();
  const initialStartDate = subDays(initialEndDate, 29);

  const [dateRange, setDateRange] = useState<DateRange>({ start: initialStartDate, end: initialEndDate });
  const [expandedSystems, setExpandedSystems] = useState<Set<string>>(new Set());

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
  };
  
  const categorizedSystems = useMemo(() => {
    return categories.map(category => ({
      ...category,
      systems: systems.filter(system => system.categoryId === category.id)
    })).filter(category => category.systems.length > 0) // Only show categories with systems
    .sort((a,b) => a.name.localeCompare(b.name));
  }, [categories, systems]);

  const Legend: React.FC = () => (
    <div className="p-4 bg-gray-800 shadow rounded-lg mb-6">
      <h3 className="text-lg font-semibold text-gray-100 mb-3">Legend</h3>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {Object.entries(AvailabilityStatus).map(([key, value]) => {
          if (value === AvailabilityStatus.UNKNOWN && !statusEntries.some(e => e.status === AvailabilityStatus.UNKNOWN)) { // Only show Unknown if relevant
            // return null;
          }
          return (
          <div key={key} className="flex items-center">
            <span className={`w-4 h-4 rounded-sm mr-2 ${STATUS_COLORS[value as AvailabilityStatus]}`}></span>
            <span className={`text-sm ${STATUS_TEXT_COLORS[value as AvailabilityStatus]}`}>{value}</span>
          </div>
        );
        })}
      </div>
    </div>
  );


  if (systems.length === 0 || categories.length === 0) {
    return (
      <div className="text-center p-10">
        <InformationCircleIcon className="w-16 h-16 text-sky-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-100 mb-2">Welcome to the Dashboard!</h2>
        <p className="text-gray-300">
          No systems or categories found. Please add categories and systems in the management pages to get started.
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-100 tracking-tight">System Status Dashboard</h2>
      
      <DateFilterControls onDateRangeChange={handleDateRangeChange} initialDateRange={{start: initialStartDate, end: initialEndDate}} />

      <Legend />

      {categorizedSystems.length === 0 && (
        <div className="text-center p-6 bg-gray-800 shadow rounded-lg">
          <InformationCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-300">No systems match the current categories or systems list is empty. Add systems or check category assignments.</p>
        </div>
      )}

      {categorizedSystems.map(category => (
        <section key={category.id} className="bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-100 mb-4 border-b pb-2 border-gray-600">{category.name}</h3>
          {category.systems.length === 0 ? (
             <p className="text-sm text-gray-400">No systems in this category.</p>
          ) : (
            <div className="space-y-5">
            {category.systems.sort((a,b) => a.name.localeCompare(b.name)).map(system => {
              const systemEntries = statusEntries.filter(entry => entry.systemId === system.id);
              const isExpanded = expandedSystems.has(system.id);
              
              return (
                <div key={system.id}>
                  <h4 className="text-md font-medium text-gray-200 mb-2">{system.name}</h4>
                  <SystemTimelineBar 
                    system={system} 
                    allStatusEntries={statusEntries} 
                    dateRange={dateRange} 
                  />
                  <button 
                    onClick={() => {
                      const newExpanded = new Set(expandedSystems);
                      if (isExpanded) {
                        newExpanded.delete(system.id);
                      } else {
                        newExpanded.add(system.id);
                      }
                      setExpandedSystems(newExpanded);
                    }}
                    className="text-sm text-sky-600 hover:text-sky-800 mt-2"
                  >
                    {isExpanded ? 'Hide' : 'Show'} Status Entries ({systemEntries.length})
                  </button>
                  {isExpanded && (
                    <div className="mt-2 space-y-2 bg-gray-700 p-3 rounded">
                      {systemEntries.length === 0 ? (
                        <p className="text-sm text-gray-400">No status entries</p>
                      ) : (
                        systemEntries.sort((a,b) => b.date.localeCompare(a.date)).map(entry => (
                          <div key={entry.id} className={`text-sm border-l-4 pl-3 ${STATUS_COLORS[entry.status].replace('bg-', 'border-')}`}>
                            <div className="font-medium text-gray-200">{parseDateString(entry.date).toLocaleDateString('en-AU')} - {entry.status}</div>
                            {entry.description && <div className="text-gray-300">{entry.description}</div>}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          )}
        </section>
      ))}
    </div>
  );
};
    