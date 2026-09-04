import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RevisionRound } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  History,
  Plus,
  AlertTriangle,
  Copy,
  Check,
  Film,
  Clock,
  CheckCircle2,
  FileCode
} from 'lucide-react';

export const RevisionsView: React.FC = () => {
  const { revisions, projects, addRevision, updateRevision, updateProject, loadDemo } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Form State
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [clientFeedback, setClientFeedback] = useState('');
  const [timestampNotes, setTimestampNotes] = useState('');

  const selectedProject = projects.find((p) => p.id === projectId);
  const currentRounds = selectedProject?.revisionsUsed || 0;
  const revisionLimit = selectedProject?.revisionLimit || 2;
  const isCapReached = currentRounds >= revisionLimit;

  const extraFeeTemplate = `Hi ${selectedProject?.name ? 'there' : 'Client'},

Thanks for sending over this latest round of feedback!

As outlined in our project agreement, the initial scope included ${revisionLimit} rounds of revisions, which have now been successfully completed.

To proceed with these additional adjustments, my fee for an extra revision pass is $75 (or $60/hour depending on scope).

Please let me know if you would like me to prepare an invoice so we can dive right in and polish this cut!

Best,
Your Video Editor`;

  const handleCreateRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientFeedback.trim() || !projectId) return;

    const nextRound = currentRounds + 1;
    await addRevision({
      projectId,
      roundNumber: nextRound,
      clientFeedback: clientFeedback.trim(),
      timestampNotes: timestampNotes.trim() || undefined,
      requestedAt: new Date().toISOString().split('T')[0],
      status: 'In Progress',
      editorResponse: 'Changes logged into timeline.'
    });

    await updateProject(projectId, {
      revisionsUsed: nextRound,
      status: 'revisions'
    });

    setIsModalOpen(false);
    setClientFeedback('');
    setTimestampNotes('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Revision Guard & Feedback Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Protect against scope creep. Track feedback rounds and enforce contractual revision caps.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Revision Round</span>
        </button>
      </div>

      {/* Revision Cap Script Banner */}
      <div className="p-5 rounded-xl bg-[#111112] border border-[#1F2023] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs sm:text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Scope Creep Shield: Revision Cap Template</span>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(extraFeeTemplate);
              setCopiedTemplate(true);
              setTimeout(() => setCopiedTemplate(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1C] hover:bg-[#252528] text-slate-200 text-xs font-medium rounded-lg border border-[#1F2023] transition-colors"
          >
            {copiedTemplate ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Script!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Pushback Script</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-[#1A1A1C] p-3.5 rounded-lg border border-[#1F2023] font-mono">
          {extraFeeTemplate}
        </p>
      </div>

      {/* Revision Rounds Feed */}
      {revisions.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Revision Rounds Logged"
          description="Log creator feedback and timestamp notes to hold clients accountable to agreed revision limits."
          actionLabel="+ Log Revision Round"
          onAction={() => setIsModalOpen(true)}
          secondaryActionLabel="Load Sample Data"
          onSecondaryAction={loadDemo}
        />
      ) : (
        <div className="space-y-3">
          {revisions.map((rev) => {
            const project = projects.find((p) => p.id === rev.projectId);
            const isCompleted = rev.status === 'Completed';

            return (
              <div
                key={rev.id}
                className="p-5 rounded-xl bg-[#111112] border border-[#1F2023] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F2023] pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                      {project?.name || 'Project'} • Round #{rev.roundNumber}
                    </span>
                    <span className="text-xs text-slate-500">Requested: {rev.requestedAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={isCompleted ? 'success' : 'warning'} size="xs">
                      {rev.status}
                    </Badge>
                    {!isCompleted && (
                      <button
                        onClick={() =>
                          updateRevision(rev.id, {
                            status: 'Completed',
                            completedAt: new Date().toISOString()
                          })
                        }
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-200">
                  <strong className="text-slate-500 block text-[11px] uppercase font-semibold mb-1">
                    Client Feedback:
                  </strong>
                  <p>{rev.clientFeedback}</p>
                </div>

                {rev.timestampNotes && (
                  <div className="p-2.5 rounded-lg bg-[#1A1A1C] border border-[#1F2023] text-xs text-slate-300 font-mono">
                    Timestamps: {rev.timestampNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Log Revision Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Client Revision Feedback"
        subtitle="Increment the revision counter and capture specific timeline timestamps."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateRevision} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Project <span className="text-rose-400">*</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#111112]">
                  {p.name} (Rounds used: {p.revisionsUsed || 0}/{p.revisionLimit})
                </option>
              ))}
            </select>
          </div>

          {isCapReached && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Warning:</strong> This project has already reached its agreed cap of {revisionLimit} revision rounds!
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Client Feedback Notes <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={clientFeedback}
              onChange={(e) => setClientFeedback(e.target.value)}
              placeholder="e.g. Cut 10 seconds from talking head intro, change font color on hook text, make outro music fade slower..."
              className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Timestamps (Optional)
            </label>
            <input
              type="text"
              value={timestampNotes}
              onChange={(e) => setTimestampNotes(e.target.value)}
              placeholder="01:15 (trim), 04:30 (fix volume), 08:20 (add zoom)"
              className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2023]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              Record Revision Round
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
