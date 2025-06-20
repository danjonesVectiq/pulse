
import React, { useState, useMemo } from 'react';
import { System, Category, StatusEntry, DateRange, AvailabilityStatus } from '../../types';
import { DateFilterControls } from './DateFilterControls';
import { SystemTimelineBar } from './SystemTimelineBar';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
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
    <Card className="mb-6">
      <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
        <div className="w-2 h-2 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full mr-3"></div>
        Status Legend
      </h3>
      <div className="flex flex-wrap gap-3">
        {Object.entries(AvailabilityStatus).map(([key, value]) => {
          if (value === AvailabilityStatus.UNKNOWN && !statusEntries.some(e => e.status === AvailabilityStatus.UNKNOWN)) { // Only show Unknown if relevant
            // return null;
          }
          return (
          <div key={key} className="flex items-center bg-white/5 rounded-lg px-3 py-2 border border-white/10">
            <span className={`w-3 h-3 rounded-full mr-2 ${STATUS_COLORS[value as AvailabilityStatus]} shadow-lg`}></span>
            <span className="text-sm text-gray-200 font-medium">{value}</span>
          </div>
        );
        })}
      </div>
    </Card>
  );


  if (systems.length === 0 || categories.length === 0) {
    return (
      <Card className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <InformationCircleIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-100 mb-3">Welcome to System Pulse!</h2>
        <p className="text-gray-400 leading-relaxed">
          No systems or categories found. Please add categories and systems in the management pages to get started.
        </p>
      </Card>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-1 h-8 bg-gradient-to-b from-sky-400 to-blue-500 rounded-full"></div>
        <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text tracking-tight">
          System Status Dashboard
        </h2>
      </div>
      
      <DateFilterControls onDateRangeChange={handleDateRangeChange} initialDateRange={{start: initialStartDate, end: initialEndDate}} />

      <Legend />

      {categorizedSystems.length === 0 && (
        <Card className="text-center">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <InformationCircleIcon className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-400">No systems match the current categories or systems list is empty. Add systems or check category assignments.</p>
        </Card>
      )}

      {categorizedSystems.map(category => (
        <Card key={category.id} className="overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-100 flex items-center">
              <div className="w-2 h-2 bg-sky-400 rounded-full mr-3"></div>
              {category.name}
            </h3>
            <Badge variant="info">{category.systems.length} systems</Badge>
          </div>
          {category.systems.length === 0 ? (
             <p className="text-sm text-gray-400 text-center py-8">No systems in this category.</p>
          ) : (
            <div className="space-y-6">
            {category.systems.sort((a,b) => a.name.localeCompare(b.name)).map(system => {
              const systemEntries = statusEntries.filter(entry => entry.systemId === system.id);
              const isExpanded = expandedSystems.has(system.id);
              
              return (
                <div key={system.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-gray-200">{system.name}</h4>
                    <Badge>{systemEntries.length} entries</Badge>
                  </div>
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
                    className="text-sm text-sky-400 hover:text-sky-300 mt-3 flex items-center transition-colors"
                  >
                    <svg className={`w-4 h-4 mr-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {isExpanded ? 'Hide' : 'Show'} Status Entries ({systemEntries.length})
                  </button>
                  {isExpanded && (
                    <div className="mt-4 space-y-3 bg-white/5 p-4 rounded-lg border border-white/10">
                      {systemEntries.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">No status entries</p>
                      ) : (
                        systemEntries.sort((a,b) => b.date.localeCompare(a.date)).map(entry => (
                          <div key={entry.id} className="bg-white/5 rounded-lg p-3 border-l-4 border-l-sky-400">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-gray-200">{parseDateString(entry.date).toLocaleDateString('en-AU')}</div>
                              <Badge variant={entry.status === AvailabilityStatus.OPERATIONAL ? 'success' : 
                                           entry.status === AvailabilityStatus.DEGRADED ? 'warning' : 
                                           entry.status === AvailabilityStatus.MAINTENANCE ? 'info' : 'error'}>
                                {entry.status}
                              </Badge>
                            </div>
                            {entry.description && <div className="text-gray-400 text-sm">{entry.description}</div>}
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
        </Card>
      ))}
    </div>
  );
};
    