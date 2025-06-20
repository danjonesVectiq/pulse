
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
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_50%)]"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-sky-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-spin-slow"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          {/* Logo Animation */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 bg-gradient-to-br from-sky-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-500 hover:rotate-6 group">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-purple-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <HeartIcon className="w-16 h-16 text-white relative z-10 animate-pulse" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-12 max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span className="text-transparent bg-gradient-to-r from-white via-sky-200 to-blue-300 bg-clip-text animate-gradient">
                System
              </span>
              <br />
              <span className="text-transparent bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 bg-clip-text animate-gradient-reverse">
                Pulse
              </span>
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-sky-400 to-purple-600 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
              Monitor your infrastructure with
              <span className="text-transparent bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text font-semibold"> real-time insights</span>
              <br />
              and beautiful visualizations
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl w-full">
            <div className="group">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Real-time Monitoring</h3>
                <p className="text-gray-400 leading-relaxed">Track system status with live updates and instant notifications when issues arise.</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Beautiful Analytics</h3>
                <p className="text-gray-400 leading-relaxed">Visualize your system health with stunning charts and intuitive dashboards.</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Lightning Fast</h3>
                <p className="text-gray-400 leading-relaxed">Built for performance with instant loading and smooth interactions.</p>
              </div>
            </div>
          </div>
    );
  }

          {/* CTA Section */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <a 
                href="#/manage" 
                className="group relative px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-sky-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <span className="relative flex items-center">
                  <PlusCircleIcon className="w-5 h-5 mr-2" />
                  Get Started
                </span>
              </a>
              <a 
                href="#/entry" 
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                Log Status
              </a>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              Start monitoring your systems in under 2 minutes
            </p>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-4 h-4 bg-sky-400 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-2000"></div>
          <div className="absolute bottom-40 left-20 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-3000"></div>
          <div className="absolute bottom-20 right-10 w-5 h-5 bg-indigo-400 rounded-full animate-bounce delay-500"></div>
        </div>
      </div>
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
    