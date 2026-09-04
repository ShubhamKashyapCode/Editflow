import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeadQualification, LeadScore } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  UserCheck,
  Plus,
  Search,
  Check,
  X,
  ScrollText,
  AlertTriangle,
  Flame,
  ExternalLink,
  ShieldCheck,
  Filter
} from 'lucide-react';

export const QualificationView: React.FC = () => {
  const { leads, addLead, updateLead, deleteLead, setCurrentView, settings, loadDemo } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [videoType, setVideoType] = useState('YouTube Long-form');
  const [budget, setBudget] = useState('$1,500 - $3,000');
  const [timeline, setTimeline] = useState('7 - 10 Days');
  const [rawFootageLength, setRawFootageLength] = useState('45 - 60 Minutes (Multi-cam)');
  const [targetLength, setTargetLength] = useState('10 - 14 Minutes');
  const [referenceVideo, setReferenceVideo] = useState('https://youtube.com/watch?v=sample');
  const [score, setScore] = useState<LeadScore>('High Value Lead');
  const [redFlags, setRedFlags] = useState('');

  const filteredLeads = leads.filter(
    (l) =>
      l.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.videoType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.budget.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    await addLead({
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      videoType,
      budget,
      timeline,
      rawFootageLength,
      targetLength,
      referenceVideo,
      revisionExpectations: '2 rounds agreed upfront',
      score,
      redFlags: redFlags.trim() || undefined,
      status: 'New'
    });

    setIsModalOpen(false);
    setClientName('');
    setClientEmail('');
  };

  const handleScoreColor = (leadScore: LeadScore) => {
    switch (leadScore) {
      case 'High Value Lead':
        return 'success';
      case 'Normal Lead':
        return 'blue';
      case 'Low Value / Red Flag':
        return 'danger';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Lead Qualification & Vetting
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Filter incoming creator inquiries, score budget realism, and detect scope-creep red flags.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Vet New Inquiry</span>
        </button>
      </div>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No Inquiries Found"
          description={
            leads.length === 0
              ? 'No incoming creator leads to qualify. Add an inquiry to score budget and avoid low-paying scope creep.'
              : 'No leads match your search query.'
          }
          actionLabel="+ Vet New Inquiry"
          onAction={() => setIsModalOpen(true)}
          secondaryActionLabel={leads.length === 0 ? 'Load Sample Data' : undefined}
          onSecondaryAction={leads.length === 0 ? loadDemo : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="p-5 rounded-xl bg-[#111112] border border-[#1F2023] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">{lead.clientName}</h3>
                    <p className="text-xs text-slate-500">{lead.clientEmail || 'No email provided'}</p>
                  </div>
                  <Badge variant={handleScoreColor(lead.score)} size="xs">
                    {lead.score}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs py-3 border-y border-[#1F2023] my-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Video Type:</span>
                    <span className="font-medium text-slate-200">{lead.videoType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Offered Budget:</span>
                    <span className="font-bold text-emerald-400">{lead.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Footage / Target:</span>
                    <span className="text-slate-300">
                      {lead.rawFootageLength} → {lead.targetLength}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Timeline:</span>
                    <span className="text-slate-300">{lead.timeline}</span>
                  </div>
                </div>

                {lead.redFlags && (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <span>Red Flag: {lead.redFlags}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#1F2023] flex items-center justify-between gap-2">
                <button
                  onClick={() => updateLead(lead.id, { status: 'Declined' })}
                  className="px-3 py-1.5 rounded-lg bg-[#1A1A1C] hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 text-xs font-medium border border-[#1F2023] transition-colors"
                >
                  Decline
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      updateLead(lead.id, { status: 'Accepted' });
                      setCurrentView('proposals');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    <ScrollText className="w-3.5 h-3.5" />
                    <span>Send Proposal</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Qualification Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Qualify New Video Inquiry"
        subtitle="Evaluate client expectations against your studio rates and turnaround speed."
        maxWidth="xl"
      >
        <form onSubmit={handleCreateLead} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Client / Creator Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. David Vance"
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60 placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@channel.com"
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Type of Video
              </label>
              <input
                type="text"
                value={videoType}
                onChange={(e) => setVideoType(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Client's Budget
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. $2,000 / video"
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Raw Footage Volume
              </label>
              <input
                type="text"
                value={rawFootageLength}
                onChange={(e) => setRawFootageLength(e.target.value)}
                placeholder="e.g. 2 hours of multicam"
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60 placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Final Length
              </label>
              <input
                type="text"
                value={targetLength}
                onChange={(e) => setTargetLength(e.target.value)}
                placeholder="e.g. 10 minutes"
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Lead Assessment Score
              </label>
              <select
                value={score}
                onChange={(e) => setScore(e.target.value as LeadScore)}
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              >
                <option value="High Value Lead" className="bg-[#111112]">High Value Lead (Generous Budget, Clear Scope)</option>
                <option value="Normal Lead" className="bg-[#111112]">Normal Lead (Standard Market Rate)</option>
                <option value="Low Value / Red Flag" className="bg-[#111112]">Low Value / Red Flag (Unrealistic Demands)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Red Flag Notes (If Any)
              </label>
              <input
                type="text"
                value={redFlags}
                onChange={(e) => setRedFlags(e.target.value)}
                placeholder="e.g. Demands unlimited revisions, 24hr rush with no rush fee"
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60 placeholder:text-slate-600"
              />
            </div>
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
              Save Qualification
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
