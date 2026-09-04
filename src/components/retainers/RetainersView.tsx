import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RetainerOpportunity, RetainerOfferStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  Sparkles,
  Plus,
  Copy,
  Check,
  TrendingUp,
  DollarSign,
  Users,
  Repeat,
  Mail
} from 'lucide-react';

export const RetainersView: React.FC = () => {
  const { retainers, clients, settings, addRetainer, updateRetainer, loadDemo } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRetainerForPitch, setSelectedRetainerForPitch] = useState<RetainerOpportunity | null>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);

  // Form State
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [projectsCompleted, setProjectsCompleted] = useState(3);
  const [suggestedMonthlyValue, setSuggestedMonthlyValue] = useState(2500);
  const [videosPerMonth, setVideosPerMonth] = useState(4);
  const [offerStatus, setOfferStatus] = useState<RetainerOfferStatus>('Opportunity');
  const [pitchNotes, setPitchNotes] = useState('');

  // Total Recurring Revenue Won
  const totalMonthlyRetainerWon = retainers
    .filter((r) => r.offerStatus === 'Won')
    .reduce((sum, r) => sum + r.suggestedMonthlyValue, 0);

  const handleCreateRetainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;

    await addRetainer({
      clientId,
      projectsCompleted: Number(projectsCompleted),
      suggestedMonthlyValue: Number(suggestedMonthlyValue),
      videosPerMonth: Number(videosPerMonth),
      offerStatus,
      pitchNotes: pitchNotes.trim() || undefined
    });

    setIsModalOpen(false);
  };

  const getPitchEmail = (ret: RetainerOpportunity) => {
    const client = clients.find((c) => c.id === ret.clientId);

    return `Hi ${client?.name || 'there'},

Now that we've successfully completed ${ret.projectsCompleted} video cuts together and dialed in your channel's pacing, branding, and visual identity, I wanted to reach out regarding a monthly partnership.

Instead of booking project-by-project with varying availability, I have 1 reserved retainer slot opening next month:

Monthly Video Retainer:
• ${ret.videosPerMonth} Polish Cuts per month
• Guaranteed 72-hour turnaround priority
• Frame.io review link management
• Flat Monthly Investment: ${settings.currencySymbol}${ret.suggestedMonthlyValue.toLocaleString()}/month

This ensures your publishing cadence never misses a week, and saves you 15% compared to our per-video rate.

Let me know if you'd like to lock in this slot starting next week!

Best regards,
${settings.name || 'Your Video Editor'}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Recurring Retainer Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Transform one-off editing jobs into predictable $2k-$5k/month client contracts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Retainer Opportunity</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#111112] border border-[#1F2023]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider">Locked MRR</span>
            <Repeat className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">
            {settings.currencySymbol}{totalMonthlyRetainerWon.toLocaleString()}/mo
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Active recurring contracts</span>
        </div>

        <div className="p-5 rounded-xl bg-[#111112] border border-[#1F2023]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider">Pipeline Opportunities</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {retainers.filter((r) => r.offerStatus === 'Opportunity' || r.offerStatus === 'Pitched').length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Ready to pitch</span>
        </div>

        <div className="p-5 rounded-xl bg-[#111112] border border-[#1F2023]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider">Annualized Value</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-400 tracking-tight">
            {settings.currencySymbol}{(totalMonthlyRetainerWon * 12).toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">ARR from recurring retainers</span>
        </div>
      </div>

      {/* Retainer Opportunities Grid */}
      {retainers.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No Retainer Opportunities"
          description="Identify creators you have edited 2+ videos for, and pitch monthly retainers for consistent income."
          actionLabel="+ Add Retainer Opportunity"
          onAction={() => setIsModalOpen(true)}
          secondaryActionLabel="Load Sample Pipeline"
          onSecondaryAction={loadDemo}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {retainers.map((ret) => {
            const client = clients.find((c) => c.id === ret.clientId);

            return (
              <div
                key={ret.id}
                className="p-5 rounded-xl bg-[#111112] border border-[#1F2023] flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white">{client?.name || 'Creator'}</h3>
                      <p className="text-xs text-slate-500">{client?.company || 'YouTube Channel'}</p>
                    </div>

                    <Badge
                      variant={
                        ret.offerStatus === 'Won'
                          ? 'success'
                          : ret.offerStatus === 'Lost'
                          ? 'danger'
                          : 'purple'
                      }
                      size="xs"
                    >
                      {ret.offerStatus}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-xs py-3 border-y border-[#1F2023] my-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Completed Cuts:</span>
                      <span className="font-medium text-slate-200">{ret.projectsCompleted} videos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monthly Target:</span>
                      <span className="font-bold text-emerald-400">
                        {settings.currencySymbol}{ret.suggestedMonthlyValue.toLocaleString()}/mo
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Deliverables:</span>
                      <span className="text-slate-300">{ret.videosPerMonth} videos / month</span>
                    </div>
                  </div>
                </div>

                {/* Status Toggles & Pitch Trigger */}
                <div className="pt-3 border-t border-[#1F2023] flex items-center justify-between gap-2">
                  <select
                    value={ret.offerStatus}
                    onChange={(e) =>
                      updateRetainer(ret.id, {
                        offerStatus: e.target.value as RetainerOfferStatus
                      })
                    }
                    className="bg-[#1A1A1C] border border-[#1F2023] text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="Opportunity" className="bg-[#111112]">Opportunity</option>
                    <option value="Pitched" className="bg-[#111112]">Pitched</option>
                    <option value="Won" className="bg-[#111112]">Won (Active)</option>
                    <option value="Lost" className="bg-[#111112]">Lost</option>
                  </select>

                  <button
                    onClick={() => setSelectedRetainerForPitch(ret)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Pitch Script</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Retainer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Retainer Opportunity"
        subtitle="Pitch a monthly video editing package to a proven creator."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateRetainer} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Client <span className="text-rose-400">*</span>
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#111112]">
                  {c.name} ({c.company})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Suggested Monthly Rate ({settings.currencySymbol})
              </label>
              <input
                type="number"
                value={suggestedMonthlyValue}
                onChange={(e) => setSuggestedMonthlyValue(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Videos Included / Month
              </label>
              <input
                type="number"
                value={videosPerMonth}
                onChange={(e) => setVideosPerMonth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Projects Completed Together
              </label>
              <input
                type="number"
                value={projectsCompleted}
                onChange={(e) => setProjectsCompleted(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status
              </label>
              <select
                value={offerStatus}
                onChange={(e) => setOfferStatus(e.target.value as RetainerOfferStatus)}
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              >
                <option value="Opportunity" className="bg-[#111112]">Opportunity</option>
                <option value="Pitched" className="bg-[#111112]">Pitched</option>
                <option value="Won" className="bg-[#111112]">Won</option>
                <option value="Lost" className="bg-[#111112]">Lost</option>
              </select>
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
              Add to Pipeline
            </button>
          </div>
        </form>
      </Modal>

      {/* Pitch Script Modal */}
      <Modal
        isOpen={!!selectedRetainerForPitch}
        onClose={() => setSelectedRetainerForPitch(null)}
        title="Retainer Pitch Email Generator"
        subtitle="Pitch your creator with professional positioning and clear monthly deliverables."
        maxWidth="lg"
      >
        {selectedRetainerForPitch && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#1A1A1C] border border-[#1F2023] font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {getPitchEmail(selectedRetainerForPitch)}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getPitchEmail(selectedRetainerForPitch));
                  setCopiedPitch(true);
                  setTimeout(() => setCopiedPitch(false), 2000);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
              >
                {copiedPitch ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied Pitch Email!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Retainer Pitch</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
