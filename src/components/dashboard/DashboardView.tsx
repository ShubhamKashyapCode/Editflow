import React from 'react';
import { useApp } from '../../context/AppContext';
import { WORKFLOW_STAGES, ProjectStage } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { StageBadge, Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  Users,
  Film,
  CreditCard,
  DollarSign,
  Clock,
  CheckSquare,
  Sparkles,
  Plus,
  ChevronRight,
  CalendarDays,
  Bot,
  ArrowRight
} from 'lucide-react';

interface DashboardViewProps {
  onOpenNewProject?: () => void;
  onOpenNewClient?: () => void;
  onOpenNewTask?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewProject,
  onOpenNewClient,
  onOpenNewTask
}) => {
  const {
    settings,
    clients,
    projects,
    tasks,
    payments,
    retainers,
    toggleTaskStatus,
    navigateToProjectDetail,
    setCurrentView,
    loadDemo
  } = useApp();

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const in7DaysStr = new Date(now.getTime() + 7 * 86400000).toISOString().split('T')[0];

  // Dynamic greeting based on time of day
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const displayName = settings.name || 'Alex';

  // Date display
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // Real Calculated KPIs
  const totalClients = clients.length;
  const activeProjects = projects.filter((p) => p.status !== 'retainer');
  const activeProjectsCount = activeProjects.length;

  const totalRevenue = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const pendingPaymentsAmount = payments
    .filter((p) => p.status === 'Pending' || p.status === 'Overdue')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const projectsDueSoon = projects.filter(
    (p) => p.finalDeadline && p.finalDeadline >= todayStr && p.finalDeadline <= in7DaysStr && p.deliveryStatus !== 'Delivered'
  );

  const tasksDueToday = tasks.filter(
    (t) => t.dueDate === todayStr && t.status !== 'Completed'
  );

  const todayAndOverdueTasks = tasks.filter(
    (t) => t.status !== 'Completed' && t.dueDate <= todayStr
  );

  // Project count per workflow stage
  const stageCounts: Record<ProjectStage, number> = {
    inquiry: 0,
    qualification: 0,
    proposal: 0,
    payment: 0,
    brief: 0,
    assets: 0,
    editing: 0,
    review: 0,
    revisions: 0,
    delivery: 0,
    testimonial: 0,
    retainer: 0
  };

  projects.forEach((p) => {
    if (stageCounts[p.status] !== undefined) {
      stageCounts[p.status]++;
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1F2023]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {greeting}, {displayName} 👋
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {dateFormatted} • {settings.businessName || 'Video Studio'} Client Operations
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
          <button
            onClick={onOpenNewClient}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#1A1A1C] hover:bg-[#252528] text-slate-300 text-xs font-medium rounded-lg border border-[#1F2023] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Clients */}
        <div
          onClick={() => setCurrentView('clients')}
          className="bg-[#111112] border border-[#1F2023] rounded-xl p-4 flex flex-col justify-between hover:border-[#2C2D31] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Clients</span>
            <Users className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">{totalClients}</div>
            <span className="text-[10px] text-slate-500 mt-1 block">Active roster</span>
          </div>
        </div>

        {/* Active Projects */}
        <div
          onClick={() => setCurrentView('projects')}
          className="bg-[#111112] border border-[#1F2023] rounded-xl p-4 flex flex-col justify-between hover:border-[#2C2D31] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">In Production</span>
            <Film className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">{activeProjectsCount}</div>
            <span className="text-[10px] text-slate-500 mt-1 block">Active timelines</span>
          </div>
        </div>

        {/* Pending Payments */}
        <div
          onClick={() => setCurrentView('payments')}
          className="bg-[#111112] border border-[#1F2023] rounded-xl p-4 flex flex-col justify-between hover:border-[#2C2D31] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Pending</span>
            <CreditCard className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400 tracking-tight">
              {settings.currencySymbol}
              {pendingPaymentsAmount.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Invoices awaiting</span>
          </div>
        </div>

        {/* Revenue */}
        <div
          onClick={() => setCurrentView('reports')}
          className="bg-[#111112] border border-[#1F2023] rounded-xl p-4 flex flex-col justify-between hover:border-[#2C2D31] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Collected</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">
              {settings.currencySymbol}
              {totalRevenue.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Paid to date</span>
          </div>
        </div>

        {/* Projects Due Soon */}
        <div
          onClick={() => setCurrentView('calendar')}
          className="bg-[#111112] border border-[#1F2023] rounded-xl p-4 flex flex-col justify-between hover:border-[#2C2D31] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Due This Week</span>
            <Clock className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-400 tracking-tight">
              {projectsDueSoon.length}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Within 7 days</span>
          </div>
        </div>

        {/* Tasks Due Today */}
        <div
          onClick={() => setCurrentView('tasks')}
          className="bg-[#111112] border border-[#1F2023] rounded-xl p-4 flex flex-col justify-between hover:border-[#2C2D31] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Tasks Today</span>
            <CheckSquare className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {tasksDueToday.length}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Action items</span>
          </div>
        </div>
      </div>

      {/* PROJECT PIPELINE (12 STAGES) */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#111112] border border-[#1F2023]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <h3 className="text-xs font-semibold text-white tracking-wider uppercase">
              Project Pipeline
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1A1C] text-slate-400 border border-[#1F2023]">
              12 Stages
            </span>
          </div>
          <button
            onClick={() => setCurrentView('projects')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>All Projects</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Visual Pipeline Stage Columns */}
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 pt-1">
          {WORKFLOW_STAGES.map((stage) => {
            const count = stageCounts[stage.id];
            const hasProjects = count > 0;

            return (
              <div
                key={stage.id}
                onClick={() => setCurrentView('projects')}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center cursor-pointer transition-all ${
                  hasProjects
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-white shadow-sm'
                    : 'bg-[#1A1A1C]/50 border-[#1F2023] text-slate-500 hover:text-slate-300 hover:bg-[#1A1A1C]'
                }`}
              >
                <span className="text-[9px] font-semibold text-slate-500 mb-0.5">
                  #{stage.stepNumber}
                </span>
                <span className="text-[11px] font-medium truncate max-w-full">{stage.label}</span>
                <span
                  className={`mt-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    hasProjects ? 'bg-indigo-600 text-white' : 'bg-[#1F2023] text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid: Projects Table & Right Sidebar (Tasks, Deadlines, Retainers) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Projects Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111112] border border-[#1F2023] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#1F2023] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Active Projects</h3>
              </div>
              <button
                onClick={() => setCurrentView('projects')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
              >
                <span>View Roster</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={Film}
                  title="No Projects Yet"
                  description="Start tracking your first video editing project from inquiry to delivery."
                  actionLabel="+ Create Project"
                  onAction={onOpenNewProject}
                  secondaryActionLabel="Load Sample Data"
                  onSecondaryAction={loadDemo}
                />
              </div>
            ) : (
              <div className="divide-y divide-[#1F2023]">
                {projects.slice(0, 5).map((project) => {
                  const client = clients.find((c) => c.id === project.clientId);
                  const completedStagesCount = Object.values(project.stages || {}).filter(
                    (s: any) => s?.isCompleted
                  ).length;
                  const progressPct = Math.round((completedStagesCount / 12) * 100);

                  return (
                    <div
                      key={project.id}
                      onClick={() => navigateToProjectDetail(project.id)}
                      className="p-4 hover:bg-[#1A1A1C]/50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                            {project.name}
                          </h4>
                          <StageBadge stage={project.status} size="xs" />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 truncate">
                          {client?.name || 'Client'} • {project.projectType} • {settings.currencySymbol}
                          {project.projectValue?.toLocaleString()}
                        </p>
                      </div>

                      <div className="w-full sm:w-44 shrink-0 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Workflow Progress</span>
                          <span className="text-slate-300 font-medium">{progressPct}%</span>
                        </div>
                        <ProgressBar progress={progressPct} size="xs" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Retainer Opportunities Spotlight */}
          <div className="bg-[#111112] border border-[#1F2023] rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Retainer Pipeline</h3>
              </div>
              <button
                onClick={() => setCurrentView('retainers')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
              >
                <span>Retainer Tracker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {retainers.length === 0 ? (
              <div className="text-center py-6 text-slate-500 border border-dashed border-[#1F2023] rounded-lg bg-[#1A1A1C]/20">
                <p className="text-xs text-slate-400">
                  Complete client deliverables to surface automated monthly retainer upsell opportunities.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {retainers.slice(0, 3).map((ret) => {
                  const client = clients.find((c) => c.id === ret.clientId);
                  return (
                    <div
                      key={ret.id}
                      onClick={() => setCurrentView('retainers')}
                      className="p-3 rounded-lg bg-[#1A1A1C] border border-[#1F2023] hover:border-[#2C2D31] cursor-pointer transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-white truncate block">
                          {client?.name || 'Creator'} ({client?.company || 'YouTube Channel'})
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {ret.projectsCompleted} videos edited • Potential {settings.currencySymbol}
                          {ret.suggestedMonthlyValue}/mo
                        </span>
                      </div>
                      <Badge variant={ret.offerStatus === 'Won' ? 'success' : 'purple'} size="xs">
                        {ret.offerStatus}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: AI Assistant banner + Tasks + Deadlines */}
        <div className="space-y-6">
          {/* AI Creative Assistant Banner */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-5 shadow-lg shadow-indigo-950/40 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">AI Assistant</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Generate Client Brief & Pitch</h4>
                <p className="text-xs text-indigo-100/90 mt-1 leading-relaxed">
                  Draft client emails, calculate revision scopes, and outline video project briefs instantly.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('ai-assistant')}
                className="mt-2 bg-white text-indigo-600 font-semibold px-3.5 py-2 rounded-lg text-xs hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Launch Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="bg-[#111112] border border-[#1F2023] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Today's Tasks</h3>
              </div>
              <button
                onClick={onOpenNewTask}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Task</span>
              </button>
            </div>

            {todayAndOverdueTasks.length === 0 ? (
              <div className="text-center py-6 text-slate-500 border border-dashed border-[#1F2023] rounded-lg bg-[#1A1A1C]/20">
                <p className="text-xs text-slate-400">All tasks completed for today!</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {todayAndOverdueTasks.slice(0, 4).map((task) => {
                  const isOverdue = task.dueDate < todayStr;

                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#1A1A1C] border border-[#1F2023] hover:border-[#2C2D31] transition-colors gap-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={task.status === 'Completed'}
                          onChange={() => toggleTaskStatus(task.id)}
                          className="w-3.5 h-3.5 rounded border-[#1F2023] bg-[#111112] text-indigo-600 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-xs font-medium text-slate-300 truncate">
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isOverdue && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Overdue
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                            task.priority === 'Urgent'
                              ? 'bg-rose-500/20 text-rose-300'
                              : task.priority === 'High'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-[#111112] text-slate-400'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-[#111112] border border-[#1F2023] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Upcoming Deadlines</h3>
              </div>
              <button
                onClick={() => setCurrentView('calendar')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
              >
                <span>Calendar</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {projectsDueSoon.length === 0 ? (
              <div className="text-center py-5 text-slate-500 border border-dashed border-[#1F2023] rounded-lg bg-[#1A1A1C]/20">
                <p className="text-xs text-slate-400">No urgent deadlines this week.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {projectsDueSoon.slice(0, 3).map((project) => {
                  const client = clients.find((c) => c.id === project.clientId);
                  const daysLeft = Math.ceil(
                    (new Date(project.finalDeadline).getTime() - now.getTime()) / 86400000
                  );

                  return (
                    <div
                      key={project.id}
                      onClick={() => navigateToProjectDetail(project.id)}
                      className="p-2.5 rounded-lg bg-[#1A1A1C] border border-[#1F2023] hover:border-[#2C2D31] cursor-pointer transition-colors flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">
                          {project.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate">
                          {client?.name}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          daysLeft <= 1
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {daysLeft <= 0 ? 'Today' : `${daysLeft}d left`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
