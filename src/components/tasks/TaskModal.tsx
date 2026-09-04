import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, TaskCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Task, 'id' | 'createdAt'>) => Promise<any>;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit
}) => {
  const { projects } = useApp();

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [category, setCategory] = useState<TaskCategory>('Rough Cut');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setProjectId(taskToEdit.projectId || '');
      setDueDate(taskToEdit.dueDate);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setCategory(taskToEdit.category || 'Rough Cut');
    } else {
      setTitle('');
      setProjectId('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setPriority('Medium');
      setStatus('Pending');
      setCategory('Rough Cut');
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await onSave({
        title: title.trim(),
        projectId: projectId || undefined,
        dueDate,
        priority,
        status,
        category
      });
      onClose();
    } catch (err) {
      console.error('Error saving task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Action Item' : 'New Production Task'}
      subtitle="Schedule an editing milestone, QC check, or client deliverable."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Task Description <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Color grade A-roll in DaVinci, mix sound effects, export ProRes master"
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Associated Project (Optional)
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">General Studio Task (No Project)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Due Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Rough Cut">Rough Cut</option>
              <option value="Sound Design">Sound Design</option>
              <option value="Color Grading">Color Grading</option>
              <option value="Motion Graphics">Motion Graphics</option>
              <option value="Subtitles">Subtitles / Captions</option>
              <option value="Export">Export & Render</option>
              <option value="Feedback">Client Feedback</option>
              <option value="Communication">Communication</option>
              <option value="Admin">Admin & Invoicing</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-950/40"
          >
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
