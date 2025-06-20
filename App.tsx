
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Category, System, StatusEntry, DateRange } from './types';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { StatusEntryFormPage } from './components/data-entry/StatusEntryFormPage';
import { ManagePage } from './components/management/SystemManagementPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { APP_TITLE, DEFAULT_CATEGORIES, DEFAULT_STATUS_ENTRIES, DEFAULT_SYSTEMS, NAVIGATION_LINKS } from './constants';
import { MenuIcon, XIcon, HeartIcon } from './components/icons/Icons';

const App: React.FC = () => {
  const [systems, setSystems] = useLocalStorage<System[]>('systems', DEFAULT_SYSTEMS);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', DEFAULT_CATEGORIES);
  const [statusEntries, setStatusEntries] = useLocalStorage<StatusEntry[]>('statusEntries', DEFAULT_STATUS_ENTRIES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const addStatusEntry = (entry: Omit<StatusEntry, 'id'>) => {
    setStatusEntries(prev => [...prev, { ...entry, id: Date.now().toString() }]);
  };

  const deleteStatusEntry = (entryId: string) => {
    setStatusEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const addSystem = (system: Omit<System, 'id'>) => {
    setSystems(prev => [...prev, { ...system, id: Date.now().toString() }]);
  };

  const updateSystem = (updatedSystem: System) => {
    setSystems(prev => prev.map(s => s.id === updatedSystem.id ? updatedSystem : s));
  };

  const deleteSystem = (systemId: string) => {
    setSystems(prev => prev.filter(s => s.id !== systemId));
    // Optionally, also delete related status entries or handle them
    setStatusEntries(prev => prev.filter(entry => entry.systemId !== systemId));
  };
  
  const addCategory = (category: Omit<Category, 'id'>) => {
    setCategories(prev => [...prev, { ...category, id: Date.now().toString() }]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };

  const deleteCategory = (categoryId: string) => {
    // Before deleting a category, ensure systems are not orphaned or re-assign them.
    // For simplicity, we'll prevent deletion if systems are using it.
    const isCategoryInUse = systems.some(system => system.categoryId === categoryId);
    if (isCategoryInUse) {
      alert("Cannot delete category: It is currently assigned to one or more systems.");
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const Sidebar: React.FC = () => (
    <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 text-white p-6 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col`}>
      <h1 className="text-2xl font-bold mb-8 text-transparent bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text flex items-center">
        <HeartIcon className="w-6 h-6 mr-2" />
        {APP_TITLE}
      </h1>
      <nav className="flex-grow space-y-2">
        <ul className="space-y-1">
          {NAVIGATION_LINKS.map(link => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                  location.pathname === link.path 
                    ? 'bg-gradient-to-r from-sky-500/20 to-blue-500/20 text-sky-400 border border-sky-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <link.icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                  location.pathname === link.path ? 'scale-110' : 'group-hover:scale-105'
                }`} />
                <span className="font-medium">{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} System Pulse
        </div>
      </div>
    </aside>
  );


  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-900/80 backdrop-blur-xl border-b border-white/10 p-4 md:hidden flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-100">{NAVIGATION_LINKS.find(l => l.path === location.pathname)?.name || APP_TITLE}</h1>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="text-gray-300 hover:text-gray-100 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<DashboardPage systems={systems} categories={categories} statusEntries={statusEntries} />} />
            <Route path="/entry" element={<StatusEntryFormPage systems={systems} categories={categories} statusEntries={statusEntries} addStatusEntry={addStatusEntry} deleteStatusEntry={deleteStatusEntry} />} />
            <Route path="/manage" element={<ManagePage systems={systems} categories={categories} addSystem={addSystem} updateSystem={updateSystem} deleteSystem={deleteSystem} addCategory={addCategory} updateCategory={updateCategory} deleteCategory={deleteCategory} />} />
          </Routes>
        </main>
      </div>
       {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App;
