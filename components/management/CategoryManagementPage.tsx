
import React, { useState } from 'react';
import { Category, System } from '../../types';
import { Modal } from '../common/Modal';
import { PencilIcon, PlusCircleIcon, TrashIcon } from '../icons/Icons';

interface CategoryManagementPageProps {
  categories: Category[];
  systems: System[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
}

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


export const CategoryManagementPage: React.FC<CategoryManagementPageProps> = ({ categories, systems, addCategory, updateCategory, deleteCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  const openAddModal = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = (categoryData: Omit<Category, 'id'> | Category) => {
    if ('id' in categoryData) {
      updateCategory(categoryData as Category);
    } else {
      addCategory(categoryData as Omit<Category, 'id'>);
    }
    setIsModalOpen(false);
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
  
  const getSystemCountForCategory = (categoryId: string): number => {
    return systems.filter(system => system.categoryId === categoryId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-100">Categories</h2>
        <button
          onClick={openAddModal}
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
                      onClick={() => openEditModal(category)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <CategoryForm
          category={editingCategory}
          onSave={handleSaveCategory}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
    