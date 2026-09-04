import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Proposal, ProposalTier } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  ScrollText,
  Plus,
  Copy,
  Check,
  Film,
  Sparkles,
  DollarSign,
  Shield,
  FileCheck
} from 'lucide-react';

export const ProposalsView: React.FC = () => {
  const { proposals, clients, projects, settings, addProposal, updateProposal, loadDemo } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [title, setTitle] = useState('YouTube Channel Editing Package');
  const [scopeOfWork, setScopeOfWork] = useState(
    'Full video assembly, multicam sync, motion titles, color grading, sound normalization to -14 LUFS, and 2 rounds of client revisions.'
  );
  const [revisionPolicy, setRevisionPolicy] = useState(
    '2 rounds of consolidated revisions included. Additional revision rounds billed at $75/round.'
  );
  const [paymentTerms, setPaymentTerms] = useState(
    '50% deposit upfront before project start, remaining 50% balance upon final master export delivery.'
  );

  const [tier1Price, setTier1Price] = useState(1200);
  const [tier2Price, setTier2Price] = useState(2200);
  const [tier3Price, setTier3Price] = useState(3800);

  const handleCopyProposal = (prop: Proposal) => {
    const text = `
========================================
VIDEO EDITING PROPOSAL: ${prop.title}
========================================

SCOPE OF WORK:
${prop.scopeOfWork}

DELIVERABLES:
${prop.deliverables.map((d) => `• ${d}`).join('\n')}

INVESTMENT TIERS:
${prop.tiers
  .map(
    (t) => `
[${t.name.toUpperCase()}] - ${settings.currencySymbol}${t.price}
${t.features.map((f) => `  - ${f}`).join('\n')}
`
  )
  .join('\n')}

REVISION POLICY:
${prop.revisionPolicy}

PAYMENT TERMS:
${prop.paymentTerms}

TERMS & CONDITIONS:
${prop.termsAndConditions}
========================================
`.trim();

    navigator.clipboard.writeText(text);
    setCopiedId(prop.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientId) return;

    const tiers: ProposalTier[] = [
      {
        name: 'Essential Cut',
        price: tier1Price,
        turnaround: '5 Business Days',
        features: ['Up to 10 min cut', 'Basic B-roll & sound effects', '2 Revision rounds']
      },
      {
        name: 'Growth & Retention',
        price: tier2Price,
        turnaround: '3 Business Days',
        features: [
          'Up to 15 min cut',
          'Dynamic motion graphics',
          'Custom SFX & Lo-Fi mix',
          '2 Revision rounds',
          '2x Vertical Short-form hooks'
        ]
      },
      {
        name: 'VIP Creator Suite',
        price: tier3Price,
        turnaround: '48 Hour Turnaround',
        features: [
          'Full production suite',
          'Unlimited stock footage access',
          'Frame.io cloud collaboration',
          'Priority turnaround',
          '4x Shorts / TikTok cuts'
        ]
      }
    ];

    await addProposal({
      clientId,
      title: title.trim(),
      scopeOfWork,
      deliverables: [
        'Full 4K / 1080p Master File (ProRes & H.265)',
        'YouTube Metadata Timecodes',
        'Social Media Clips'
      ],
      timeline: '3 - 5 Business Days per cut',
      tiers,
      revisionPolicy,
      paymentTerms,
      termsAndConditions:
        'All client media backed up locally for 30 days post delivery. Raw project files remain proprietary to studio unless project buyout buyout is licensed.',
      status: 'Sent'
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Proposals & Quotes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Generate 3-tier proposals with scope, turnaround guarantees, and revision boundaries.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Proposal</span>
        </button>
      </div>

      {/* Proposals List */}
      {proposals.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="No Proposals Yet"
          description="Send your prospective clients professional 3-tier proposals to win higher-paying recurring contracts."
          actionLabel="+ Generate Proposal"
          onAction={() => setIsModalOpen(true)}
          secondaryActionLabel="Load Sample Proposals"
          onSecondaryAction={loadDemo}
        />
      ) : (
        <div className="space-y-6">
          {proposals.map((prop) => {
            const client = clients.find((c) => c.id === prop.clientId);

            return (
              <div
                key={prop.id}
                className="p-6 rounded-xl bg-[#111112] border border-[#1F2023] space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2023] pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                      Client: {client?.name || 'Creator'} ({client?.company})
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">{prop.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        prop.status === 'Accepted'
                          ? 'success'
                          : prop.status === 'Declined'
                          ? 'danger'
                          : 'purple'
                      }
                      size="sm"
                    >
                      {prop.status}
                    </Badge>

                    <button
                      onClick={() => handleCopyProposal(prop)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1C] hover:bg-[#252528] text-slate-200 text-xs font-medium border border-[#1F2023] transition-colors"
                    >
                      {copiedId === prop.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Proposal</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Scope Preview */}
                <div className="text-xs sm:text-sm text-slate-300">
                  <strong className="text-slate-400 block text-[11px] uppercase font-semibold mb-1">
                    Scope of Work:
                  </strong>
                  <p className="leading-relaxed">{prop.scopeOfWork}</p>
                </div>

                {/* 3 Tiers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {prop.tiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border flex flex-col justify-between ${
                        idx === 1
                          ? 'bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/20'
                          : 'bg-[#1A1A1C] border-[#1F2023]'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-white">{tier.name}</span>
                          {idx === 1 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-semibold">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-xl font-bold text-emerald-400 mb-3 tracking-tight">
                          {settings.currencySymbol}
                          {tier.price.toLocaleString()}
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {tier.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-[11px] text-slate-500 pt-3 mt-3 border-t border-[#1F2023]">
                        Turnaround: {tier.turnaround}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Terms preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400 pt-2 border-t border-[#1F2023]">
                  <div>
                    <strong className="text-slate-300 block mb-0.5">Revision Policy:</strong>
                    {prop.revisionPolicy}
                  </div>
                  <div>
                    <strong className="text-slate-300 block mb-0.5">Payment Terms:</strong>
                    {prop.paymentTerms}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Proposal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Client Proposal"
        subtitle="Build tiered packages with scope, revision policies, and payment terms."
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateProposal} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Client / Brand
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

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Proposal Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Scope of Work
            </label>
            <textarea
              rows={2}
              value={scopeOfWork}
              onChange={(e) => setScopeOfWork(e.target.value)}
              className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tier 1 Price ({settings.currencySymbol})
              </label>
              <input
                type="number"
                value={tier1Price}
                onChange={(e) => setTier1Price(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tier 2 Price ({settings.currencySymbol})
              </label>
              <input
                type="number"
                value={tier2Price}
                onChange={(e) => setTier2Price(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tier 3 Price ({settings.currencySymbol})
              </label>
              <input
                type="number"
                value={tier3Price}
                onChange={(e) => setTier3Price(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Revision Policy
              </label>
              <input
                type="text"
                value={revisionPolicy}
                onChange={(e) => setRevisionPolicy(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Payment Terms
              </label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
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
              Save & Generate
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
