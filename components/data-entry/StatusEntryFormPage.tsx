
import React, { useState } from 'react';
import { System, Category, StatusEntry, AvailabilityStatus } from '../../types';
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
      <div className="text-center p-10 bg-gray-800 shadow rounded-lg max-w-lg mx-auto">
        <InformationCircleIcon className="w-16 h-16 text-sky-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-100 mb-2">No Systems Available</h2>
        <p className="text-gray-300">
          You need to add systems before you can log status entries. Please go to "Manage Systems" to add a system.
        </p>
      </div>
    );
  }


  return (
    <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">Log System Status</h2>
      
      {error && <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-md text-sm">{error}</div>}
      {successMessage && <div className="mb-4 p-3 bg-green-900 text-green-200 rounded-md text-sm">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="systemId" className="block text-sm font-medium text-gray-200 mb-1">System <span className="text-red-500">*</span></label>
          <select
            id="systemId"
            value={selectedSystemId}
            onChange={(e) => setSelectedSystemId(e.target.value)}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border border-gray-500 text-gray-200 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm"
          >
            <option value="">Select a System</option>
            {categories.map(category => (
              <optgroup label={category.name} key={category.id}>
                {systems.filter(s => s.categoryId === category.id).map(system => (
                  <option key={system.id} value={system.id}>{system.name}</option>
                ))}
              </optgroup>
            ))}
             {systems.filter(s => !s.categoryId || !categories.find(c=>c.id === s.categoryId)).map(system => (
                <option key={system.id} value={system.id}>{system.name} (Uncategorised)</option>
            ))}
          </select>
          {selectedCategory && <p className="text-xs text-gray-400 mt-1">Category: {selectedCategory.name}</p>}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-200 mb-1">Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 block w-full pl-3 pr-3 py-2 text-base bg-gray-700 border border-gray-500 text-gray-200 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-200 mb-1">Status <span className="text-red-500">*</span></label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as AvailabilityStatus)}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border border-gray-500 text-gray-200 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm"
          >
            {AVAILABILITY_STATUS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full pl-3 pr-3 py-2 text-base bg-gray-700 border border-gray-500 text-gray-200 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm"
            placeholder="Optional: Provide more details about the status..."
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition duration-150 ease-in-out"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2"/>
            Add Status Entry
          </button>
        </div>
      </form>

      {statusEntries.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Recent Status Entries</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {statusEntries.sort((a,b) => b.date.localeCompare(a.date)).slice(0, 10).map(entry => {
              const system = systems.find(s => s.id === entry.systemId);
              return (
                <div key={entry.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-200">{system?.name} - {parseDateString(entry.date).toLocaleDateString('en-AU')}</div>
                    <div className="text-xs text-gray-400">{entry.status}</div>
                  </div>
                  <button
                    onClick={() => deleteStatusEntry(entry.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
    