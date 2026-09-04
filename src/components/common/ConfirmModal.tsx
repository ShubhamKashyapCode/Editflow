import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 ${isDestructive ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-300 leading-relaxed pt-1">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F2023]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-[#1A1A1C] hover:bg-[#252528] rounded-lg border border-[#1F2023] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-sm ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
