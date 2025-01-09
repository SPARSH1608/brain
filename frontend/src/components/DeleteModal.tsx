import React from 'react';
import { X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  theme?: 'light' | 'dark';
}

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  theme = 'dark',
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center 
        ${theme === 'dark' ? 'bg-black/50' : 'bg-gray-100/50'} backdrop-blur-sm
      `}
    >
      <div
        className={`
          w-full max-w-md rounded-xl p-6 border 
          ${
            theme === 'dark'
              ? 'bg-zinc-900 border-zinc-800 text-white'
              : 'bg-white border-zinc-200 text-zinc-900'
          }
        `}
      >
        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
        <p
          className={`mb-6 ${
            theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'
          }`}
        >
          Are you sure you want to delete this content? This action cannot be
          undone.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            className={`px-4 py-2 text-sm rounded-lg transition-colors
              ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-zinc-800'
              }`}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
