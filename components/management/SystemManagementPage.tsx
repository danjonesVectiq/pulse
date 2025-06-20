
import React, { useState } from 'react';
import { System, Category } from '../../types';
import { Modal } from '../common/Modal';
import { PencilIcon, PlusCircleIcon, TrashIcon, TableCellsIcon, CogIcon } from '../icons/Icons';

interface ManagePageProps {
  systems: System[];
  categories: Category[];
  addSystem: (system: Omit<System, 'id'>) => void;
  updateSystem: (system: System) => void;
  deleteSystem: (systemId: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
}

const SystemForm: React.FC<{
  system?: System;
  categories: Category[];
  onSave: (system: Omit<System, 'id'> | System) => void;
  onCancel: () => void;
}> = ({ system, categories, onSave, onCancel }) => {
  const [name, setName] = useState(system?.name || '');
  const [categoryId, setCategoryId] = useState(system?.categoryId || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('System name cannot be empty.');
      return;
    }
    if (!categoryId) {
        setError('Please select a category.');
        return;
    }
    onSave(system ? { ...system, name, categoryId } : { name, categoryId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label htmlFor="systemName" className="block text-sm font-medium text-gray-200">System Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="systemName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-500 bg-gray-700 text-gray-200 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-200">Category <span className="text-red-500">*</span></label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-500 bg-gray-700 text-gray-200 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {categories.length === 0 && <p className="text-xs text-yellow-300 mt-1">No categories available. Please add categories first.</p>}
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-600 hover:bg-gray-500 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          {system ? 'Save Changes' : 'Add System'}
        </button>
      </div>
    </form>
  );
};

const CategoryForm: React.FC<{
  category?: Category;
  onSave: (category: Omit<Category, 'id'> | Category) => void;
  onCancel: () => void;
}> = ({ category, onSave, onCancel }) => {
  const [name, setName] = useState(category?.name || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
        setError('Category name cannot be empty.');
        return;
    }
    onSave(category ? { ...category, name } : { name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-200">Category Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="categoryName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-500 bg-gray-700 text-gray-200 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-600 hover:bg-gray-500 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          {category ? 'Save Changes' : 'Add Category'}
        </button>
      </div>
    </form>
  );
};

export const ManagePage: React.FC<ManagePageProps> = ({ systems, categories, addSystem, updateSystem, deleteSystem, addCategory, updateCategory, deleteCategory }) => {
  const [activeTab, setActiveTab] = useState<'systems' | 'categories'>('systems');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<System | undefined>(undefined);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  const openAddModal = () => {
    setEditingSystem(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (system: System) => {
    setEditingSystem(system);
    setIsModalOpen(true);
  };

  const handleSaveSystem = (systemData: Omit<System, 'id'> | System) => {
    if ('id' in systemData) {
      updateSystem(systemData as System);
    } else {
      addSystem(systemData as Omit<System, 'id'>);
    }
    setIsModalOpen(false);
  };

  const handleSaveCategory = (categoryData: Omit<Category, 'id'> | Category) => {
    if ('id' in categoryData) {
      updateCategory(categoryData as Category);
    } else {
      addCategory(categoryData as Omit<Category, 'id'>);
    }
    setIsModalOpen(false);
  };

  const handleDeleteSystem = (systemId: string) => {
    if (window.confirm("Are you sure you want to delete this system? This will also remove its status history.")) {
      deleteSystem(systemId);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const isCategoryInUse = systems.some(system => system.categoryId === categoryId);
    if (isCategoryInUse) {
      alert("Cannot delete category: It is currently assigned to one or more systems. Please reassign systems before deleting.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory(categoryId);
    }
  };
  
  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'N/A';
  };

  const getSystemCountForCategory = (categoryId: string): number => {
    return systems.filter(system => system.categoryId === categoryId).length;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-100">System Configuration</h2>
      
      <div className="border-b border-gray-600">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('systems')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'systems'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <CogIcon className="w-5 h-5 inline mr-2" />
            Systems
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <TableCellsIcon className="w-5 h-5 inline mr-2" />
            Categories
          </button>
        </nav>
      </div>

      {activeTab === 'systems' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-200">Systems</h3>
            <button
              onClick={openAddModal}
              disabled={categories.length === 0}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add System
            </button>
          </div>
          {categories.length === 0 && (
            <p className="text-sm text-yellow-300 bg-yellow-900 p-3 rounded-md">
              Warning: No categories found. You must add categories before you can add systems.
            </p>
          )}

          {systems.length === 0 ? (
            <p className="text-gray-400">No systems configured yet. Click "Add System" to get started.</p>
          ) : (
            <div className="bg-gray-800 shadow overflow-hidden rounded-lg">
              <ul role="list" className="divide-y divide-gray-600">
                {systems.sort((a,b) => a.name.localeCompare(b.name)).map((system) => (
                  <li key={system.id} className="px-4 py-4 sm:px-6 hover:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-md font-medium text-sky-400 truncate">{system.name}</p>
                        <p className="text-sm text-gray-300">Category: {getCategoryName(system.categoryId)}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex space-x-2">
                        <button
                          onClick={() => openEditModal(system)}
                          className="p-1 text-gray-400 hover:text-sky-600 focus:outline-none"
                          title="Edit System"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSystem(system.id)}
                          className="p-1 text-gray-400 hover:text-red-600 focus:outline-none"
                          title="Delete System"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-200">Categories</h3>
            <button
              onClick={() => {
                setEditingCategory(undefined);
                setIsModalOpen(true);
              }}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2"/>
              Add Category
            </button>
          </div>

          {categories.length === 0 ? (
            <p className="text-gray-400">No categories configured yet. Click "Add Category" to get started.</p>
          ) : (
            <div className="bg-gray-800 shadow overflow-hidden rounded-lg">
              <ul role="list" className="divide-y divide-gray-600">
                {categories.sort((a,b)=>a.name.localeCompare(b.name)).map((category) => (
                  <li key={category.id} className="px-4 py-4 sm:px-6 hover:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-md font-medium text-sky-400 truncate">{category.name}</p>
                        <p className="text-sm text-gray-300">Systems: {getSystemCountForCategory(category.id)}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setIsModalOpen(true);
                          }}
                          className="p-1 text-gray-400 hover:text-sky-600 focus:outline-none"
                          title="Edit Category"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-1 text-gray-400 hover:text-red-600 focus:outline-none"
                          title="Delete Category"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          activeTab === 'systems' 
            ? (editingSystem ? 'Edit System' : 'Add New System')
            : (editingCategory ? 'Edit Category' : 'Add New Category')
        }
      >
        {activeTab === 'systems' ? (
          <SystemForm
            system={editingSystem}
            categories={categories}
            onSave={handleSaveSystem}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : (
          <CategoryForm
            category={editingCategory}
            onSave={handleSaveCategory}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};
    