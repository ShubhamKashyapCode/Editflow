import React from 'react';
import { ProjectStage, WORKFLOW_STAGES } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'purple' | 'blue' | 'cyan' | 'slate';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs font-semibold'
  };

  const variantClasses = {
    default: 'bg-[#1A1A1C] text-slate-300 border-[#1F2023]',
    slate: 'bg-[#1A1A1C] text-slate-400 border-[#1F2023]',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    purple: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    blue: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border tracking-wide whitespace-nowrap ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StageBadge: React.FC<{ stage: ProjectStage; size?: 'xs' | 'sm' | 'md' }> = ({ stage, size = 'sm' }) => {
  const stageInfo = WORKFLOW_STAGES.find((s) => s.id === stage);
  const label = stageInfo ? stageInfo.label : stage;

  const colorMap: Record<ProjectStage, 'default' | 'success' | 'warning' | 'danger' | 'purple' | 'blue' | 'cyan'> = {
    inquiry: 'slate' as any,
    qualification: 'blue',
    proposal: 'purple',
    payment: 'emerald' as any,
    brief: 'cyan',
    assets: 'blue',
    editing: 'purple',
    review: 'amber' as any,
    revisions: 'warning',
    delivery: 'success',
    testimonial: 'purple',
    retainer: 'success'
  };

  return (
    <Badge variant={colorMap[stage] || 'default'} size={size}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 inline-block" />
      {label}
    </Badge>
  );
};
