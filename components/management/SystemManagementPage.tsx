
import React, { useState } from 'react';
import { System, Category } from '../../types';
import { Modal } from '../common/Modal';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Badge } from '../common/Badge';
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-sm flex items-center">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      
      <Input
        label="System Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter system name"
      />
      
      <Select
        label="Category"
        required
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        placeholder="Select a category"
        options={categories.map(cat => ({
          value: cat.id,
          label: cat.name
        }))}
      />
      
      {categories.length === 0 && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 rounded-lg text-sm">
          No categories available. Please add categories first.
        </div>
      )}
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          {system ? 'Save Changes' : 'Add System'}
        </Button>
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-sm flex items-center">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      
      <Input
        label="Category Name"
        required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          {category ? 'Save Changes' : 'Add Category'}
        </Button>
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
      <div className="flex items-center space-x-4">
        <div className="w-1 h-8 bg-gradient-to-b from-sky-400 to-blue-500 rounded-full"></div>
        <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text tracking-tight">
          System Configuration
        </h2>
      </div>
      
      <Card className="p-0 overflow-hidden">
        <nav className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('systems')}
            className={`flex-1 py-4 px-6 font-medium text-sm transition-all duration-200 ${
              activeTab === 'systems'
                ? 'bg-sky-500/10 text-sky-400 border-b-2 border-sky-500'
                : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center">
              <CogIcon className="w-5 h-5 mr-2" />
              Systems
            </div>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-4 px-6 font-medium text-sm transition-all duration-200 ${
              activeTab === 'categories'
                ? 'bg-sky-500/10 text-sky-400 border-b-2 border-sky-500'
                : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center">
              <TableCellsIcon className="w-5 h-5 mr-2" />
              Categories
            </div>
          </button>
        </nav>
        
        <div className="p-6">
          {activeTab === 'systems' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-200">Systems</h3>
                  <p className="text-gray-400 text-sm mt-1">Manage your monitored systems</p>
                </div>
                <Button
                  onClick={openAddModal}
                  disabled={categories.length === 0}
                  variant="primary"
                  icon={<PlusCircleIcon className="w-5 h-5" />}
                >
                  Add System
                </Button>
              </div>
              
              {categories.length === 0 && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 rounded-lg text-sm">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Warning: No categories found. You must add categories before you can add systems.
                  </div>
                </div>
              )}

              {systems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CogIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400">No systems configured yet. Click "Add System" to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                {systems.sort((a,b) => a.name.localeCompare(b.name)).map((system) => (
                  <div key={system.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-200 mb-1">{system.name}</h4>
                        <div className="flex items-center">
                          <Badge variant="info">{getCategoryName(system.categoryId)}</Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => openEditModal(system)}
                          variant="ghost"
                          size="sm"
                          icon={<PencilIcon className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteSystem(system.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          icon={<TrashIcon className="w-4 h-4" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-200">Categories</h3>
                  <p className="text-gray-400 text-sm mt-1">Organize your systems into categories</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingCategory(undefined);
                    setIsModalOpen(true);
                  }}
                  variant="primary"
                  icon={<PlusCircleIcon className="w-5 h-5" />}
                >
                  Add Category
                </Button>
              </div>

              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TableCellsIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400">No categories configured yet. Click "Add Category" to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                {categories.sort((a,b)=>a.name.localeCompare(b.name)).map((category) => (
                  <div key={category.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-200 mb-1">{category.name}</h4>
                        <Badge>{getSystemCountForCategory(category.id)} systems</Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            setEditingCategory(category);
                            setIsModalOpen(true);
                          }}
                          variant="ghost"
                          size="sm"
                          icon={<PencilIcon className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteCategory(category.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          icon={<TrashIcon className="w-4 h-4" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

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
    