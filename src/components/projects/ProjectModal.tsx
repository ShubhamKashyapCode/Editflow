import React, { useState, useEffect } from 'react';
import {
  Project,
  ProjectType,
  ProjectStage,
  PaymentStatus,
  AssetsStatus,
  DeliveryStatus,
  WORKFLOW_STAGES
} from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'stages'>) => Promise<any>;
  projectToEdit?: Project | null;
  defaultClientId?: string | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectToEdit,
  defaultClientId
}) => {
  const { clients, settings } = useApp();

  const [clientId, setClientId] = useState('');
  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('YouTube Long-form');
  const [status, setStatus] = useState<ProjectStage>('inquiry');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [firstDraftDeadline, setFirstDraftDeadline] = useState(
    new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  );
  const [finalDeadline, setFinalDeadline] = useState(
    new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]
  );
  const [projectValue, setProjectValue] = useState<number>(1000);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Pending');
  const [revisionLimit, setRevisionLimit] = useState<number>(settings.defaultRevisionLimit || 2);
  const [revisionsUsed, setRevisionsUsed] = useState<number>(0);
  const [assetsStatus, setAssetsStatus] = useState<AssetsStatus>('Incomplete');
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>('Pending');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      setClientId(projectToEdit.clientId);
      setName(projectToEdit.name);
      setProjectType(projectToEdit.projectType);
      setStatus(projectToEdit.status);
      setStartDate(projectToEdit.startDate);
      setFirstDraftDeadline(projectToEdit.firstDraftDeadline);
      setFinalDeadline(projectToEdit.finalDeadline);
      setProjectValue(projectToEdit.projectValue);
      setPaymentStatus(projectToEdit.paymentStatus);
      setRevisionLimit(projectToEdit.revisionLimit);
      setRevisionsUsed(projectToEdit.revisionsUsed || 0);
      setAssetsStatus(projectToEdit.assetsStatus);
      setDeliveryStatus(projectToEdit.deliveryStatus);
      setNotes(projectToEdit.notes || '');
    } else {
      setClientId(defaultClientId || (clients[0]?.id || ''));
      setName('');
      setProjectType('YouTube Long-form');
      setStatus('inquiry');
      setStartDate(new Date().toISOString().split('T')[0]);
      setFirstDraftDeadline(new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]);
      setFinalDeadline(new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]);
      setProjectValue(1000);
      setPaymentStatus('Pending');
      setRevisionLimit(settings.defaultRevisionLimit || 2);
      setRevisionsUsed(0);
      setAssetsStatus('Incomplete');
      setDeliveryStatus('Pending');
      setNotes('');
    }
  }, [projectToEdit, isOpen, defaultClientId, clients, settings.defaultRevisionLimit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !clientId) return;

    try {
      setIsSubmitting(true);
      await onSave({
        clientId,
        name: name.trim(),
        projectType,
        status,
        startDate,
        firstDraftDeadline,
        finalDeadline,
        projectValue: Number(projectValue) || 0,
        paymentStatus,
        revisionLimit: Number(revisionLimit) || 2,
        revisionsUsed: Number(revisionsUsed) || 0,
        assetsStatus,
        deliveryStatus,
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (err) {
      console.error('Error saving project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Edit Project Specifications' : 'Initialize New Video Edit'}
      subtitle="Define scope, deadlines, revision caps, and delivery goals."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Project / Video Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. M4 MacBook Pro Review Cut or 6x Summer Meta Reels"
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Client / Creator <span className="text-rose-400">*</span>
            </label>
            <select
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {clients.length === 0 ? (
                <option value="">No clients found - Add a client first</option>
              ) : (
                clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Project Type
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value as ProjectType)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="YouTube Long-form">YouTube Long-form</option>
              <option value="Short-form / Reels / TikTok">Short-form / Reels / TikTok</option>
              <option value="Commercial / Ad">Commercial / Ad</option>
              <option value="Podcast Video">Podcast Video</option>
              <option value="Course / Educational">Course / Educational</option>
              <option value="Documentary">Documentary</option>
              <option value="Corporate Video">Corporate Video</option>
              <option value="Music Video">Music Video</option>
              <option value="Gaming Montage">Gaming Montage</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              First Draft Deadline <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              required
              value={firstDraftDeadline}
              onChange={(e) => setFirstDraftDeadline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Final Master Deadline <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              required
              value={finalDeadline}
              onChange={(e) => setFinalDeadline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Project Value ({settings.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              value={projectValue}
              onChange={(e) => setProjectValue(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Pending">Pending</option>
              <option value="Partial">Partial / Deposit Paid</option>
              <option value="Paid">Paid in Full</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Revision Limit
            </label>
            <select
              value={revisionLimit}
              onChange={(e) => setRevisionLimit(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value={1}>1 Round</option>
              <option value={2}>2 Rounds (Standard)</option>
              <option value={3}>3 Rounds</option>
              <option value={4}>4 Rounds</option>
              <option value={5}>5 Rounds</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Current Workflow Stage
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStage)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {WORKFLOW_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  Stage {s.stepNumber}: {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Raw Assets Status
            </label>
            <select
              value={assetsStatus}
              onChange={(e) => setAssetsStatus(e.target.value as AssetsStatus)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Missing">Missing Footage / Audio</option>
              <option value="Incomplete">Partially Received</option>
              <option value="Received">All Assets Received</option>
              <option value="Approved">Verified & Synced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Editing Notes & Specifications
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Target duration, sound design style, Frame.io project links, LUT/Color details..."
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
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
            disabled={isSubmitting || clients.length === 0}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-950/40"
          >
            {projectToEdit ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
