import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-xl border border-dashed border-[#1F2023] bg-[#111112]/60 my-4">
      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1.5 leading-relaxed">{description}</p>
      
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="px-4 py-2 bg-[#1A1A1C] hover:bg-[#252528] text-slate-300 text-xs font-medium rounded-lg transition-colors border border-[#1F2023]"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
