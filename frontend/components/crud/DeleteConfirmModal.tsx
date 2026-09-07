'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { LineCardData } from '@/types/line';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  line: LineCardData | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  line,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen || !line) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#12151b] border border-neutral-800 rounded-xl max-w-md w-full shadow-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Delete Station Line</h3>
            <p className="text-xs text-neutral-400">This action will remove the card from the dashboard.</p>
          </div>
        </div>

        <div className="p-3 rounded-md bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
          Are you sure you want to delete station <span className="font-bold text-white">{line.code}</span> (Order {line.order})?
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md shadow-md transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : 'Delete Station'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
