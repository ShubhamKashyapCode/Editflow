import React from 'react';
import { Project, ProjectStage, WORKFLOW_STAGES } from '../../types';
import { useApp } from '../../context/AppContext';
import { ProgressBar } from '../common/ProgressBar';
import {
  MessageSquare,
  UserCheck,
  ScrollText,
  CreditCard,
  FileText,
  FolderArchive,
  Film,
  Eye,
  History,
  PackageCheck,
  Star,
  Sparkles,
  Check,
  Clock
} from 'lucide-react';

interface WorkflowTrackerProps {
  project: Project;
}

export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({ project }) => {
  const { toggleProjectStage, advanceProjectStage } = useApp();

  const stageIcons: Record<ProjectStage, React.ComponentType<{ className?: string }>> = {
    inquiry: MessageSquare,
    qualification: UserCheck,
    proposal: ScrollText,
    payment: CreditCard,
    brief: FileText,
    assets: FolderArchive,
    editing: Film,
    review: Eye,
    revisions: History,
    delivery: PackageCheck,
    testimonial: Star,
    retainer: Sparkles
  };

  // Calculate real progress
  const completedStages = WORKFLOW_STAGES.filter(
    (s) => project.stages?.[s.id]?.isCompleted
  );
  const completedCount = completedStages.length;
  const progressPercent = Math.round((completedCount / WORKFLOW_STAGES.length) * 100);

  const currentStageIndex = WORKFLOW_STAGES.findIndex((s) => s.id === project.status);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
      {/* Header Progress Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              12-STAGE VIDEO EDITING WORKFLOW
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {progressPercent}% Complete
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any milestone to mark complete or reopen. Click "Advance" to move to next stage.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-300">
          <span className="text-indigo-400 font-bold">{completedCount}</span> of 12 stages completed
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar progress={progressPercent} size="sm" color="indigo" />

      {/* Visual Workflow Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
        {WORKFLOW_STAGES.map((stage, idx) => {
          const stageState = project.stages?.[stage.id];
          const isCompleted = stageState?.isCompleted;
          const isCurrent = project.status === stage.id;
          const Icon = stageIcons[stage.id];

          return (
            <div
              key={stage.id}
              onClick={() => toggleProjectStage(project.id, stage.id)}
              className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] group relative select-none ${
                isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                  : isCurrent
                  ? 'bg-indigo-950/30 border-indigo-500/60 ring-1 ring-indigo-500/40 text-white shadow-lg shadow-indigo-950/20'
                  : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              {/* Step number and status indicator */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase">
                  Step {stage.stepNumber}
                </span>

                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black animate-in zoom-in-50 duration-200 shadow-md shadow-emerald-950/40">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] text-slate-500">
                    {stage.stepNumber}
                  </div>
                )}
              </div>

              {/* Icon & Label */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : isCurrent
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold tracking-tight truncate">{stage.label}</span>
              </div>

              {/* Timestamp / Status Info */}
              <div className="text-[10px] text-slate-400 truncate pt-1 border-t border-slate-800/60 flex items-center gap-1">
                {isCompleted ? (
                  <span className="text-emerald-400 flex items-center gap-1 truncate">
                    <Check className="w-2.5 h-2.5" />
                    {stageState?.completedAt
                      ? new Date(stageState.completedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'Done'}
                  </span>
                ) : isCurrent ? (
                  <span className="text-indigo-300 font-semibold flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 animate-spin" /> In Progress
                  </span>
                ) : (
                  <span className="text-slate-500">Upcoming</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
