
import React from 'react';
import { XIcon } from '../icons/Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100 flex items-center">
            <div className="w-2 h-2 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full mr-3"></div>
            {title}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-200 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
    