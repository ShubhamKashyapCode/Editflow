import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { TaskModal } from './TaskModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  CheckSquare,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Clock,
  AlertTriangle,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  CheckCircle2,
  Film
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const { tasks, projects, addTask, updateTask, deleteTask, toggleTaskStatus, loadDemo } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [groupBy, setGroupBy] = useState<'none' | 'status' | 'priority'>('status');

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const handleSaveTask = async (data: Omit<Task, 'id' | 'createdAt'>) => {
    if (taskToEdit) {
      await updateTask(taskToEdit.id, data);
      setTaskToEdit(null);
    } else {
      await addTask(data);
    }
  };

  const renderTaskCard = (task: Task) => {
    const isCompleted = task.status === 'Completed';
    const isOverdue = task.dueDate < todayStr && !isCompleted;
    const isDueToday = task.dueDate === todayStr && !isCompleted;
    const project = projects.find((p) => p.id === task.projectId);

    return (
      <div
        key={task.id}
        className={`p-3.5 rounded-lg border transition-all flex items-start justify-between gap-3 group ${
          isCompleted
            ? 'bg-[#111112]/40 border-[#1F2023]/60 opacity-60'
            : isOverdue
            ? 'bg-rose-950/10 border-rose-500/30'
            : 'bg-[#1A1A1C] border-[#1F2023] hover:border-[#2C2D31]'
        }`}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => toggleTaskStatus(task.id)}
            className="w-3.5 h-3.5 mt-0.5 rounded border-[#1F2023] bg-[#111112] text-indigo-600 focus:ring-0 cursor-pointer shrink-0"
          />

          <div className="min-w-0 flex-1">
            <p
              className={`text-xs sm:text-sm font-medium leading-snug truncate ${
                isCompleted ? 'line-through text-slate-500' : 'text-slate-200'
              }`}
            >
              {task.title}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-500">
              {project && (
                <span className="flex items-center gap-1 text-indigo-400 font-medium truncate">
                  <Film className="w-3 h-3 shrink-0" />
                  <span className="truncate max-w-[140px]">{project.name}</span>
                </span>
              )}

              {task.category && (
                <span className="px-1.5 py-0.2 rounded bg-[#111112] border border-[#1F2023] text-slate-400 text-[10px]">
                  {task.category}
                </span>
              )}

              <span
                className={`flex items-center gap-1 font-medium ${
                  isOverdue
                    ? 'text-rose-400 font-bold'
                    : isDueToday
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-500'
                }`}
              >
                <Calendar className="w-3 h-3" />
                {isOverdue ? `Overdue (${task.dueDate})` : isDueToday ? 'Today' : task.dueDate}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
              task.priority === 'Urgent'
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                : task.priority === 'High'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                : task.priority === 'Medium'
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                : 'bg-[#111112] text-slate-400 border border-[#1F2023]'
            }`}
          >
            {task.priority}
          </span>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <button
              onClick={() => setTaskToEdit(task)}
              className="p-1 rounded text-slate-500 hover:text-white"
              title="Edit task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTaskToDelete(task)}
              className="p-1 rounded text-slate-500 hover:text-rose-400"
              title="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Action Items & Tasks
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Organize daily editorial duties: rough assemblies, sound design passes, client deliveries.
          </p>
        </div>

        <button
          onClick={() => {
            setTaskToEdit(null);
            setIsCreateOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-950/30 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-3.5 rounded-xl bg-[#111112] border border-[#1F2023]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title or category..."
            className="w-full pl-9 pr-4 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#1A1A1C] border border-[#1F2023] rounded-lg px-2.5 py-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#111112]">All Statuses</option>
              <option value="Pending" className="bg-[#111112]">Pending</option>
              <option value="In Progress" className="bg-[#111112]">In Progress</option>
              <option value="Completed" className="bg-[#111112]">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-[#1A1A1C] border border-[#1F2023] rounded-lg px-2.5 py-1.5 shrink-0">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#111112]">All Priorities</option>
              <option value="Urgent" className="bg-[#111112]">Urgent</option>
              <option value="High" className="bg-[#111112]">High</option>
              <option value="Medium" className="bg-[#111112]">Medium</option>
              <option value="Low" className="bg-[#111112]">Low</option>
            </select>
          </div>

          {/* Group By */}
          <div className="flex items-center gap-1.5 bg-[#1A1A1C] border border-[#1F2023] rounded-lg px-2.5 py-1.5 shrink-0">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as any)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="status" className="bg-[#111112]">Group: Status Columns</option>
              <option value="priority" className="bg-[#111112]">Group: Priority</option>
              <option value="none" className="bg-[#111112]">Group: Flat List</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Content */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No Tasks Found"
          description={
            tasks.length === 0
              ? 'Your task queue is completely clear. Schedule an edit pass, audio sync, or client delivery.'
              : 'No tasks match your active filters.'
          }
          actionLabel="+ Add Task"
          onAction={() => {
            setTaskToEdit(null);
            setIsCreateOpen(true);
          }}
          secondaryActionLabel={tasks.length === 0 ? 'Load Sample Tasks' : undefined}
          onSecondaryAction={tasks.length === 0 ? loadDemo : undefined}
        />
      ) : groupBy === 'status' ? (
        /* 3-Column Status Board */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['Pending', 'In Progress', 'Completed'] as TaskStatus[]).map((colStatus) => {
            const colTasks = filteredTasks.filter((t) => t.status === colStatus);
            return (
              <div
                key={colStatus}
                className="p-4 rounded-xl bg-[#111112] border border-[#1F2023] flex flex-col min-h-[400px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1F2023]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      {colStatus}
                    </span>
                    <span className="text-xs px-2 py-0.2 rounded-full font-bold bg-[#1A1A1C] text-slate-400 border border-[#1F2023]">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-10 text-slate-600 text-xs">
                      No {colStatus.toLowerCase()} tasks
                    </div>
                  ) : (
                    colTasks.map(renderTaskCard)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : groupBy === 'priority' ? (
        /* Priority Grouped */
        <div className="space-y-6">
          {(['Urgent', 'High', 'Medium', 'Low'] as TaskPriority[]).map((pri) => {
            const priTasks = filteredTasks.filter((t) => t.priority === pri);
            if (priTasks.length === 0) return null;

            return (
              <div key={pri} className="p-4 rounded-xl bg-[#111112] border border-[#1F2023] space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg ${
                      pri === 'Urgent'
                        ? 'bg-rose-500/20 text-rose-300'
                        : pri === 'High'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {pri} Priority ({priTasks.length})
                  </span>
                </div>
                <div className="space-y-2">{priTasks.map(renderTaskCard)}</div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Flat List */
        <div className="p-4 rounded-xl bg-[#111112] border border-[#1F2023] space-y-2">
          {filteredTasks.map(renderTaskCard)}
        </div>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isCreateOpen || !!taskToEdit}
        onClose={() => {
          setIsCreateOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={async () => {
          if (taskToDelete) {
            await deleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
        title="Delete Action Item"
        message={`Are you sure you want to delete task "${taskToDelete?.title}"?`}
        confirmLabel="Delete Task"
        isDestructive={true}
      />
    </div>
  );
};
