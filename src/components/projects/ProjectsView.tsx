import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStage, WORKFLOW_STAGES } from '../../types';
import { ProjectModal } from './ProjectModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { StageBadge, Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { EmptyState } from '../common/EmptyState';
import {
  Film,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Calendar,
  Clock,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    clients,
    settings,
    addProject,
    deleteProject,
    navigateToProjectDetail,
    loadDemo
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [clientFilter, setClientFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'deadline' | 'value' | 'created' | 'name'>('deadline');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const now = new Date();

  // Filter and sort logic
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.projectType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.notes && p.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStage = stageFilter === 'ALL' || p.status === stageFilter;
        const matchesClient = clientFilter === 'ALL' || p.clientId === clientFilter;

        return matchesSearch && matchesStage && matchesClient;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.finalDeadline).getTime() - new Date(b.finalDeadline).getTime();
        }
        if (sortBy === 'value') {
          return b.projectValue - a.projectValue;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [projects, searchQuery, stageFilter, clientFilter, sortBy]);

  const handleSaveNewProject = async (
    data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'stages'>
  ) => {
    await addProject(data);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Projects & Production
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Track video cuts, editorial milestones, revision caps, and delivery schedules.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-950/30 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Project</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-3.5 rounded-xl bg-[#111112] border border-[#1F2023]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, type, or notes..."
            className="w-full pl-9 pr-4 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Stage Filter */}
          <div className="flex items-center gap-1.5 bg-[#1A1A1C] border border-[#1F2023] rounded-lg px-2.5 py-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#111112]">All Stages (12)</option>
              {WORKFLOW_STAGES.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#111112]">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Client Filter */}
          <div className="flex items-center gap-1.5 bg-[#1A1A1C] border border-[#1F2023] rounded-lg px-2.5 py-1.5 shrink-0">
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#111112]">All Clients</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#111112]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-[#1A1A1C] border border-[#1F2023] rounded-lg px-2.5 py-1.5 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="deadline" className="bg-[#111112]">Final Deadline</option>
              <option value="value" className="bg-[#111112]">Project Value</option>
              <option value="name" className="bg-[#111112]">Project Name</option>
              <option value="created" className="bg-[#111112]">Date Created</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#1A1A1C] border border-[#1F2023] rounded-lg p-0.5 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={Film}
          title="No Projects Found"
          description={
            projects.length === 0
              ? 'Your video editing pipeline is currently clear. Create your first project to start tracking stages, deadlines, and revisions.'
              : 'No projects match your active search filters.'
          }
          actionLabel="+ Create Project"
          onAction={() => setIsCreateOpen(true)}
          secondaryActionLabel={projects.length === 0 ? 'Load Sample Projects' : undefined}
          onSecondaryAction={projects.length === 0 ? loadDemo : undefined}
        />
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const client = clients.find((c) => c.id === project.clientId);
            const deadlineDate = new Date(project.finalDeadline);
            const diffDays = Math.ceil(
              (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );

            // Calculate stage completion
            const completedStagesCount = Object.values(project.stages || {}).filter(
              (s: any) => s?.isCompleted
            ).length;
            const progressPct = Math.round((completedStagesCount / 12) * 100);

            return (
              <div
                key={project.id}
                onClick={() => navigateToProjectDetail(project.id)}
                className="p-5 rounded-xl bg-[#111112] border border-[#1F2023] hover:border-[#2C2D31] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <span className="text-[11px] font-medium text-indigo-400 tracking-wide block truncate">
                        {client?.name || 'Independent Client'}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                        {project.name}
                      </h3>
                    </div>
                    <StageBadge stage={project.status} size="xs" />
                  </div>

                  {/* Project Type & Contract Value */}
                  <div className="flex items-center justify-between py-2 border-y border-[#1F2023] my-3 text-xs">
                    <span className="text-slate-400">{project.projectType}</span>
                    <span className="font-bold text-emerald-400">
                      {settings.currencySymbol}
                      {project.projectValue.toLocaleString()}
                    </span>
                  </div>

                  {/* Workflow Progress */}
                  <div className="space-y-1.5 my-3">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Workflow Progress ({completedStagesCount}/12)</span>
                      <span className="text-slate-300 font-medium">{progressPct}%</span>
                    </div>
                    <ProgressBar progress={progressPct} size="xs" color="indigo" />
                  </div>
                </div>

                {/* Card Footer: Deadlines & Revision Quota */}
                <div className="pt-3 border-t border-[#1F2023] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock
                      className={`w-3.5 h-3.5 ${
                        diffDays <= 2
                          ? 'text-rose-400'
                          : diffDays <= 5
                          ? 'text-amber-400'
                          : 'text-slate-500'
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        diffDays <= 2
                          ? 'text-rose-400'
                          : diffDays <= 5
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {diffDays <= 0 ? 'Due Today' : `${diffDays}d remaining`}
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-slate-500">
                    Rev: {project.revisionsUsed || 0}/{project.revisionLimit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-xl bg-[#111112] border border-[#1F2023] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#1A1A1C] border-b border-[#1F2023] text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Project</th>
                  <th className="px-4 py-3.5">Client</th>
                  <th className="px-4 py-3.5">Workflow Stage</th>
                  <th className="px-4 py-3.5">Deadline</th>
                  <th className="px-4 py-3.5">Contract Value</th>
                  <th className="px-4 py-3.5">Payment</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2023] text-slate-300">
                {filteredProjects.map((project) => {
                  const client = clients.find((c) => c.id === project.clientId);

                  return (
                    <tr
                      key={project.id}
                      onClick={() => navigateToProjectDetail(project.id)}
                      className="hover:bg-[#1A1A1C]/50 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3.5 font-bold text-white max-w-xs truncate">
                        {project.name}
                        <span className="block text-[11px] font-normal text-slate-400">
                          {project.projectType}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium">{client?.name || '—'}</td>
                      <td className="px-4 py-3.5">
                        <StageBadge stage={project.status} size="xs" />
                      </td>
                      <td className="px-4 py-3.5 font-medium whitespace-nowrap">
                        {project.finalDeadline}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-emerald-400 whitespace-nowrap">
                        {settings.currencySymbol}
                        {project.projectValue.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant={project.paymentStatus === 'Paid' ? 'success' : 'warning'}
                          size="xs"
                        >
                          {project.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1">
                          Workspace <ChevronRight className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleSaveNewProject}
      />

      <ConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={async () => {
          if (projectToDelete) {
            await deleteProject(projectToDelete.id);
            setProjectToDelete(null);
          }
        }}
        title="Delete Video Project"
        message={`Are you sure you want to delete "${projectToDelete?.name}"?`}
        confirmLabel="Delete Project"
        isDestructive={true}
      />
    </div>
  );
};
