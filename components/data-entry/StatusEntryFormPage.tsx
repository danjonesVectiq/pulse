
import React, { useState } from 'react';
import { System, Category, StatusEntry, AvailabilityStatus } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { AVAILABILITY_STATUS_OPTIONS } from '../../constants';
import { getTodayDateString, parseDateString } from '../../utils/dateUtils';
import { InformationCircleIcon, PlusCircleIcon } from '../icons/Icons';

interface StatusEntryFormPageProps {
  systems: System[];
  categories: Category[];
  statusEntries: StatusEntry[];
  addStatusEntry: (entry: Omit<StatusEntry, 'id'>) => void;
  deleteStatusEntry: (entryId: string) => void;
}

export const StatusEntryFormPage: React.FC<StatusEntryFormPageProps> = ({ systems, categories, statusEntries, addStatusEntry, deleteStatusEntry }) => {
  const [selectedSystemId, setSelectedSystemId] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [status, setStatus] = useState<AvailabilityStatus>(AvailabilityStatus.OPERATIONAL);
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!selectedSystemId || !date || !status) {
      setError('Please fill in all required fields: System, Date, and Status.');
      return;
    }

    addStatusEntry({
      systemId: selectedSystemId,
      date,
      status,
      description
    });

    setSuccessMessage(`Status entry for "${systems.find(s=>s.id === selectedSystemId)?.name}" on ${parseDateString(date).toLocaleDateString('en-AU')} added successfully!`);
    
    // Reset form partially for easier subsequent entries
    // setSelectedSystemId(''); // Keep system for multiple entries?
    setDescription('');
    // setDate(getTodayDateString()); // Or keep date?
    // setStatus(AvailabilityStatus.OPERATIONAL);
  };

  const selectedSystem = systems.find(s => s.id === selectedSystemId);
  const selectedCategory = selectedSystem ? categories.find(c => c.id === selectedSystem.categoryId) : null;


  if (systems.length === 0) {
     return (
      <Card className="text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <InformationCircleIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-100 mb-3">No Systems Available</h2>
        <p className="text-gray-400 leading-relaxed">
          You need to add systems before you can log status entries. Please go to "Manage Systems" to add a system.
        </p>
      </Card>
    );
  }


  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-1 h-8 bg-gradient-to-b from-sky-400 to-blue-500 rounded-full"></div>
          <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text">
            Log System Status
          </h2>
        </div>
        <p className="text-gray-400">Record the current status of your systems</p>
      </div>
      
      <Card>
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-sm flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-300 rounded-lg text-sm flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            label="System"
            required
            value={selectedSystemId}
            onChange={(e) => setSelectedSystemId(e.target.value)}
            placeholder="Select a System"
            options={[
              ...categories.flatMap(category => 
                systems.filter(s => s.categoryId === category.id).map(system => ({
                  value: system.id,
                  label: `${system.name} (${category.name})`
                }))
              ),
              ...systems.filter(s => !s.categoryId || !categories.find(c=>c.id === s.categoryId)).map(system => ({
                value: system.id,
                label: `${system.name} (Uncategorised)`
              }))
            ]}
          />
          {selectedCategory && (
            <p className="text-xs text-gray-400 mt-2 flex items-center">
              <div className="w-2 h-2 bg-sky-400 rounded-full mr-2"></div>
              Category: {selectedCategory.name}
            </p>
          )}

          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <Select
            label="Status"
            required
            value={status}
            onChange={(e) => setStatus(e.target.value as AvailabilityStatus)}
            options={AVAILABILITY_STATUS_OPTIONS.map(opt => ({
              value: opt,
              label: opt
            }))}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">Description</label>
            <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="block w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm text-gray-200 placeholder-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:bg-white/10 transition-all duration-200 pl-4 pr-4 py-3 resize-none"
            placeholder="Optional: Provide more details about the status..."
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={<PlusCircleIcon className="w-5 h-5" />}
            className="w-full"
          >
            Add Status Entry
          </Button>
        </form>
      </Card>

      {statusEntries.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
            <div className="w-2 h-2 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full mr-3"></div>
            Recent Status Entries
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {statusEntries.sort((a,b) => b.date.localeCompare(a.date)).slice(0, 10).map(entry => {
              const system = systems.find(s => s.id === entry.systemId);
              return (
                <div key={entry.id} className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-gray-200 mb-1">{system?.name}</div>
                    <div className="text-sm text-gray-400">{parseDateString(entry.date).toLocaleDateString('en-AU')} • {entry.status}</div>
                  </div>
                  <Button
                    onClick={() => deleteStatusEntry(entry.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
    