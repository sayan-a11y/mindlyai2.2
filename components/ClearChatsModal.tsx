'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ClearChatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  chatCount: number;
}

export default function ClearChatsModal({
  isOpen,
  onClose,
  onConfirm,
  chatCount,
}: ClearChatsModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-chats-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-150"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-2xl p-6 flex flex-col space-y-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 id="clear-chats-title" className="text-base font-semibold text-[#09090B] dark:text-[#F4F4F5]">
                Delete all chats?
              </h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                Permanent workspace action
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message body */}
        <div className="text-xs leading-relaxed text-[#52525B] dark:text-[#D4D4D8] space-y-2">
          <p>
            This will permanently delete{' '}
            <strong className="text-neutral-900 dark:text-neutral-100 font-semibold">
              {chatCount} {chatCount === 1 ? 'conversation' : 'conversations'}
            </strong>
            , all generated responses, and uploaded attachments.
          </p>
          <p className="text-red-600 dark:text-red-400 font-medium">
            This action cannot be undone. Custom folders will be preserved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#F4F4F5] dark:border-[#27272A]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-[#27272A] dark:text-[#E4E4E7] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow-sm"
          >
            <Trash2 size={14} />
            <span>Delete all chats</span>
          </button>
        </div>
      </div>
    </div>
  );
}
