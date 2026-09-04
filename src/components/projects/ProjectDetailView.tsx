import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkflowTracker } from './WorkflowTracker';
import { ProjectModal } from './ProjectModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { StageBadge, Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Film,
  Users,
  CheckSquare,
  FileText,
  FolderArchive,
  History,
  CreditCard,
  PackageCheck,
  Edit2,
  Trash2,
  Plus,
  ExternalLink,
  AlertTriangle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const ProjectDetailView: React.FC = () => {
  const {
    activeProjectId,
    projects,
    clients,
    tasks,
    payments,
    briefs,
    assets,
    revisions,
    deliveries,
    settings,
    setCurrentView,
    updateProject,
    deleteProject,
    toggleTaskStatus,
    addTask,
    addRevision,
    addPayment
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'workflow' | 'tasks' | 'brief' | 'assets' | 'revisions' | 'payments' | 'delivery' | 'notes'
  >('workflow');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // New task inline state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date().toISOString().split('T')[0]);

  // New revision state
  const [newRevisionNotes, setNewRevisionNotes] = useState('');
  const [newRevisionTimestampList, setNewRevisionTimestampList] = useState('');

  const project = projects.find((p) => p.id === activeProjectId);
  const client = clients.find((c) => c.id === project?.clientId);

  if (!project) {
    return (
      <div className="p-8 text-center max-w-xl mx-auto space-y-4">
        <Film className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-white">Project Not Found</h3>
        <p className="text-sm text-slate-400">
          The requested project could not be found or has been deleted.
        </p>
        <button
          onClick={() => setCurrentView('projects')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  // Real Calculated Metrics
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectPayments = payments.filter((p) => p.projectId === project.id);
  const projectBrief = briefs.find((b) => b.projectId === project.id);
  const projectAssets = assets.find((a) => a.projectId === project.id);
  const projectRevisions = revisions.filter((r) => r.projectId === project.id);
  const projectDelivery = deliveries.find((d) => d.projectId === project.id);

  const now = new Date();
  const deadlineDate = new Date(project.finalDeadline);
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const revisionsUsed = project.revisionsUsed || projectRevisions.length;
  const isRevisionLimitReached = revisionsUsed >= project.revisionLimit;

  // Handle inline quick task creation
  const handleQuickAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await addTask({
      projectId: project.id,
      title: newTaskTitle.trim(),
      dueDate: newTaskDueDate,
      priority: 'Medium',
      status: 'Pending'
    });
    setNewTaskTitle('');
  };

  // Handle logging a client revision round
  const handleLogRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRevisionNotes.trim()) return;

    const currentRound = revisionsUsed + 1;
    await addRevision({
      projectId: project.id,
      roundNumber: currentRound,
      clientFeedback: newRevisionNotes.trim(),
      timestampNotes: newRevisionTimestampList.trim() || undefined,
      requestedAt: new Date().toISOString().split('T')[0],
      status: 'In Progress',
      editorResponse: 'Working on feedback changes.'
    });

    await updateProject(project.id, {
      revisionsUsed: currentRound,
      status: 'revisions'
    });

    setNewRevisionNotes('');
    setNewRevisionTimestampList('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('projects')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Back to projects"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {project.name}
              </h2>
              <StageBadge stage={project.status} size="sm" />
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {client ? `${client.name} (${client.company})` : 'Independent Client'} •{' '}
              {project.projectType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium rounded-xl border border-slate-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Project</span>
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
            title="Delete project"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Project Value */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Contract Value
          </span>
          <div className="text-lg sm:text-xl font-black text-emerald-400">
            {settings.currencySymbol}
            {project.projectValue.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Payment: {project.paymentStatus}
          </span>
        </div>

        {/* First Draft */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            First Cut Due
          </span>
          <div className="text-base sm:text-lg font-bold text-white">
            {project.firstDraftDeadline}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Internal target</span>
        </div>

        {/* Final Deadline */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Final Delivery
          </span>
          <div className="text-base sm:text-lg font-bold text-white">
            {project.finalDeadline}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Client hard cutoff</span>
        </div>

        {/* Days Remaining */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Days Remaining
          </span>
          <div
            className={`text-lg sm:text-xl font-black ${
              diffDays <= 2
                ? 'text-rose-400'
                : diffDays <= 5
                ? 'text-amber-400'
                : 'text-indigo-400'
            }`}
          >
            {diffDays <= 0 ? 'Due Today' : `${diffDays} Days`}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {diffDays < 0 ? 'Past deadline' : 'On schedule'}
          </span>
        </div>

        {/* Revisions Used / Cap */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Revision Quota
          </span>
          <div
            className={`text-lg sm:text-xl font-black ${
              isRevisionLimitReached ? 'text-rose-400' : 'text-purple-400'
            }`}
          >
            {revisionsUsed} / {project.revisionLimit}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {isRevisionLimitReached ? 'Cap reached' : 'Rounds available'}
          </span>
        </div>

        {/* Raw Assets */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Footage / Assets
          </span>
          <div className="text-base sm:text-lg font-bold text-white truncate">
            {project.assetsStatus}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Sync & prep</span>
        </div>
      </div>

      {/* Embedded 12-Stage Visualizer */}
      <WorkflowTracker project={project} />

      {/* Workspaces & Deep Tabs */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
          {[
            { id: 'workflow', label: 'Overview & Notes', icon: Film },
            { id: 'tasks', label: `Tasks (${projectTasks.length})`, icon: CheckSquare },
            { id: 'brief', label: 'Creative Brief', icon: FileText },
            { id: 'assets', label: 'Assets & Media', icon: FolderArchive },
            { id: 'revisions', label: `Revisions (${revisionsUsed})`, icon: History },
            { id: 'payments', label: `Payments (${projectPayments.length})`, icon: CreditCard },
            { id: 'delivery', label: 'QC & Delivery', icon: PackageCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & NOTES */}
        {activeTab === 'workflow' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Production Notes & Creative Context
              </h3>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {project.notes ||
                  'No project notes added yet. Use Edit Project to add editorial style guidelines, target durations, or pacing references.'}
              </div>

              {/* Client Snapshot */}
              {client && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Associated Client
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{client.name}</h4>
                      <p className="text-xs text-slate-400">{client.company} • {client.email}</p>
                    </div>
                    <Badge variant="purple" size="xs">{client.clientType}</Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Quick Shortcuts
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="w-full px-3 py-2 text-left text-xs sm:text-sm font-medium rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-between"
                >
                  <span>Add Checklist Task</span>
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => setActiveTab('revisions')}
                  className="w-full px-3 py-2 text-left text-xs sm:text-sm font-medium rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-between"
                >
                  <span>Log Client Feedback</span>
                  <History className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => setActiveTab('delivery')}
                  className="w-full px-3 py-2 text-left text-xs sm:text-sm font-medium rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-between"
                >
                  <span>Run Quality Control Checklist</span>
                  <PackageCheck className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TASKS */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            {/* Inline Quick Add Task */}
            <form
              onSubmit={handleQuickAddTask}
              className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800"
            >
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Cut rough assembly, sync multicam audio, source SFX risers..."
                className="flex-1 w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-950/40 shrink-0"
              >
                Add Task
              </button>
            </form>

            {/* Task List */}
            {projectTasks.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 text-slate-400">
                <CheckSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-medium">No tasks logged for this project yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {projectTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={t.status === 'Completed'}
                        onChange={() => toggleTaskStatus(t.id)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span
                        className={`text-xs sm:text-sm font-medium truncate ${
                          t.status === 'Completed'
                            ? 'line-through text-slate-500'
                            : 'text-slate-200'
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-400">Due: {t.dueDate}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.priority === 'Urgent'
                            ? 'bg-rose-500/20 text-rose-300'
                            : t.priority === 'High'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CLIENT BRIEF */}
        {activeTab === 'brief' && (
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Client Video Brief</h3>
                <p className="text-xs text-slate-400">Creative requirements and style goals.</p>
              </div>
              <Badge variant="blue" size="sm">{project.projectType}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Core Objective & Hook
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {projectBrief?.projectGoal ||
                    'Captivate viewers in first 5 seconds, explain tech features with snappy pacing, and drive conversions to sponsor link.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Target Duration & Aspect Ratio
                </span>
                <p className="text-xs sm:text-sm text-slate-200">
                  {projectBrief?.targetDuration || '8 - 12 Minutes'} • Aspect: {projectBrief?.aspectRatio || '16:9 Landscape'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Sound Design & Music Direction
                </span>
                <p className="text-xs sm:text-sm text-slate-200">
                  {projectBrief?.musicPreferences || 'Upbeat lo-fi synthwave, subtle whooshes, risers on topic transitions, punchy UI sound effects.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Reference Videos & Benchmarks
                </span>
                <p className="text-xs sm:text-sm text-indigo-400 underline">
                  {projectBrief?.referenceLinks?.[0] || 'https://youtube.com/watch?v=sample-reference'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ASSETS & MEDIA */}
        {activeTab === 'assets' && (
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Footage & Media Checklist</h3>
                <p className="text-xs text-slate-400">Tracking raw assets received from creator.</p>
              </div>
              <Badge variant="purple" size="sm">Status: {project.assetsStatus}</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: 'A-Roll Talking Head Footage', received: projectAssets?.footageReceived },
                { name: 'B-Roll & Screen Recordings', received: projectAssets?.bRollReceived },
                { name: 'WAV Audio & Microphones', received: projectAssets?.audioReceived },
                { name: 'Brand Logos & Fonts', received: projectAssets?.graphicsReceived }
              ].map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">{item.name}</span>
                  <CheckCircle2 className={`w-4 h-4 ${item.received ? 'text-emerald-400' : 'text-slate-600'}`} />
                </div>
              ))}
            </div>

            {projectAssets?.driveLink && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <FolderArchive className="w-4 h-4 text-indigo-400" />
                  <span>Cloud Folder: <strong className="text-white">{projectAssets.driveLink}</strong></span>
                </div>
                <a
                  href={projectAssets.driveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                >
                  <span>Open Folder</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: REVISIONS */}
        {activeTab === 'revisions' && (
          <div className="space-y-4">
            {/* Revision Limit Guard Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                isRevisionLimitReached
                  ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                  : 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300'
              }`}
            >
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold">
                  Revision Guard: Round {revisionsUsed} of {project.revisionLimit} used.
                </p>
                <p className="opacity-80 mt-0.5">
                  {isRevisionLimitReached
                    ? 'The client revision limit has been reached. Any additional rounds require an extra editing fee.'
                    : `Client has ${project.revisionLimit - revisionsUsed} revision round(s) remaining under the agreed contract.`}
                </p>
              </div>
            </div>

            {/* Log New Revision Form */}
            <form
              onSubmit={handleLogRevision}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3"
            >
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Log New Revision Feedback Round
              </h4>
              <textarea
                rows={3}
                required
                value={newRevisionNotes}
                onChange={(e) => setNewRevisionNotes(e.target.value)}
                placeholder="Client feedback notes: 'Pacing feels slow in the middle, trim the intro by 10 seconds, adjust music volume during voiceover...'"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={newRevisionTimestampList}
                onChange={(e) => setNewRevisionTimestampList(e.target.value)}
                placeholder="Timestamps: 01:24 (cut silence), 03:45 (fix color grade), 07:12 (add zoom)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-950/30"
                >
                  Record Revision Round #{revisionsUsed + 1}
                </button>
              </div>
            </form>

            {/* Past Revision Rounds */}
            <div className="space-y-3">
              {projectRevisions.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 uppercase">
                      Round #{rev.roundNumber} • {rev.requestedAt}
                    </span>
                    <Badge variant={rev.status === 'Completed' ? 'success' : 'warning'} size="xs">
                      {rev.status}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200">{rev.clientFeedback}</p>
                  {rev.timestampNotes && (
                    <p className="text-[11px] text-slate-400 font-mono bg-slate-900 p-2 rounded-lg">
                      Timestamps: {rev.timestampNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Project Financials</h3>
                <p className="text-xs text-slate-400">Milestone deposits and final invoice balances.</p>
              </div>
              <Badge variant={project.paymentStatus === 'Paid' ? 'success' : 'warning'} size="sm">
                {project.paymentStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Agreed</span>
                <span className="text-lg font-black text-white">
                  {settings.currencySymbol}{project.projectValue.toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Deposit Received</span>
                <span className="text-lg font-black text-emerald-400">
                  {settings.currencySymbol}
                  {projectPayments
                    .filter((p) => p.status === 'Paid')
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Balance</span>
                <span className="text-lg font-black text-amber-400">
                  {settings.currencySymbol}
                  {projectPayments
                    .filter((p) => p.status !== 'Paid')
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>

            {/* Existing Payment Records */}
            <div className="space-y-2 pt-2">
              {projectPayments.map((pay) => (
                <div key={pay.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {settings.currencySymbol}{pay.amount.toLocaleString()} ({pay.invoiceReference || 'Milestone'})
                    </span>
                    <span className="text-[11px] text-slate-400">Due: {pay.dueDate} • {pay.paymentMethod}</span>
                  </div>
                  <Badge variant={pay.status === 'Paid' ? 'success' : 'warning'} size="xs">
                    {pay.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: QC & DELIVERY */}
        {activeTab === 'delivery' && (
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Quality Control & Master Export</h3>
                <p className="text-xs text-slate-400">Run the post-production QC checklist before handoff.</p>
              </div>
              <Badge variant={project.deliveryStatus === 'Delivered' ? 'success' : 'blue'} size="sm">
                {project.deliveryStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Audio levels normalized to -14 LUFS (no clipping or background buzz)',
                'Color grading checked across SDR & HDR displays',
                'Captions & Subtitles spell-checked and frame-synced',
                'LUT and thumbnail clean frame exported at native resolution',
                'Music & SFX commercial licenses cleared and verified',
                'Final master rendered in ProRes 422 or High-Bitrate H.265'
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 pt-4">
              <span className="text-xs font-bold text-white block">Master Delivery Link</span>
              <input
                type="text"
                readOnly
                value="https://frame.io/project/sample-master-delivery-v1"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-indigo-300 font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* Edit Project Modal */}
      <ProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={async (data) => {
          await updateProject(project.id, data);
        }}
        projectToEdit={project}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          await deleteProject(project.id);
          setCurrentView('projects');
        }}
        title="Delete Video Project"
        message={`Are you sure you want to delete "${project.name}"? This will permanently remove its workflow history, briefs, and associated logs from your local database.`}
        confirmLabel="Delete Project"
        isDestructive={true}
      />
    </div>
  );
};
