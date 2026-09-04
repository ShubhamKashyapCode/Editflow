import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 - 100
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'blue';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'indigo',
  size = 'sm',
  showLabel = false,
  className = ''
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const colorClasses = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1">
          <span>Progress</span>
          <span className="text-white">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${colorClasses[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
