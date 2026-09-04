import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClientBrief, AspectRatio } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Film,
  Music,
  Palette,
  Target,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const BriefsView: React.FC = () => {
  const { briefs, projects, addBrief, updateBrief, loadDemo } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [projectGoal, setProjectGoal] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9 (Landscape)');
  const [videoStyle, setVideoStyle] = useState('Snappy, high retention, animated titles');
  const [targetDuration, setTargetDuration] = useState('8 - 12 Minutes');
  const [hookDescription, setHookDescription] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [musicPreferences, setMusicPreferences] = useState('');
  const [brandAssets, setBrandAssets] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');

  const filteredBriefs = briefs.filter((b) => {
    const project = projects.find((p) => p.id === b.projectId);
    return (
      b.projectGoal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.videoStyle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project && project.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleCreateBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectGoal.trim()) return;

    await addBrief({
      projectId: projectId || projects[0]?.id || 'demo-project',
      projectGoal: projectGoal.trim(),
      targetAudience: targetAudience.trim(),
      aspectRatio,
      videoStyle,
      targetDuration,
      hookDescription: hookDescription.trim(),
      callToAction: callToAction.trim(),
      musicPreferences: musicPreferences.trim(),
      brandAssets: brandAssets.trim(),
      referenceLinks: referenceUrl ? [referenceUrl] : []
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Client Briefs & Video Specs
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Clear editorial requirements: retention hooks, aspect ratios, soundscapes, and CTA direction.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Client Brief</span>
        </button>
      </div>

      {/* Brief Cards List */}
      {filteredBriefs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Briefs Found"
          description={
            briefs.length === 0
              ? 'No editorial briefs recorded. Create a brief to anchor client goals, reference videos, and retention requirements.'
              : 'No briefs match your search filter.'
          }
          actionLabel="+ New Client Brief"
          onAction={() => setIsModalOpen(true)}
          secondaryActionLabel={briefs.length === 0 ? 'Load Sample Briefs' : undefined}
          onSecondaryAction={briefs.length === 0 ? loadDemo : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBriefs.map((brief) => {
            const project = projects.find((p) => p.id === brief.projectId);

            return (
              <div
                key={brief.id}
                className="p-5 sm:p-6 rounded-xl bg-[#111112] border border-[#1F2023] space-y-4"
              >
                <div className="flex items-start justify-between gap-2 border-b border-[#1F2023] pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                      {project?.name || 'Video Project'}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                      {brief.aspectRatio} • {brief.targetDuration}
                    </h3>
                  </div>
                  <Badge variant="blue" size="xs">
                    {brief.videoStyle}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div>
                    <strong className="text-slate-400 block text-[11px] uppercase font-semibold">
                      Core Goal & Vision:
                    </strong>
                    <p className="text-slate-200 mt-0.5 leading-relaxed">{brief.projectGoal}</p>
                  </div>

                  {brief.hookDescription && (
                    <div className="p-3 rounded-lg bg-[#1A1A1C] border border-[#1F2023]">
                      <strong className="text-amber-400 block text-[11px] uppercase font-semibold">
                        Opening 5-Second Hook Strategy:
                      </strong>
                      <p className="text-slate-300 mt-0.5">{brief.hookDescription}</p>
                    </div>
                  )}

                  {brief.musicPreferences && (
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Music className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Soundscape: {brief.musicPreferences}</span>
                    </div>
                  )}

                  {brief.callToAction && (
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Outro CTA: {brief.callToAction}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Brief Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Video Editorial Brief"
        subtitle="Capture clear creative benchmarks upfront before touching the timeline."
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateBrief} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Link to Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#111112]">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              >
                <option value="16:9 (Landscape)" className="bg-[#111112]">16:9 (Landscape / YouTube)</option>
                <option value="9:16 (Vertical)" className="bg-[#111112]">9:16 (Vertical / Reels / TikTok)</option>
                <option value="1:1 (Square)" className="bg-[#111112]">1:1 (Square / Feed)</option>
                <option value="4:5 (Portrait)" className="bg-[#111112]">4:5 (Portrait)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Video Goal & Message <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={projectGoal}
              onChange={(e) => setProjectGoal(e.target.value)}
              placeholder="e.g. Explain new AI features in 10 minutes with clean B-roll and fast pacing..."
              className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60 placeholder:text-slate-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hook Concept (First 5 Seconds)
              </label>
              <input
                type="text"
                value={hookDescription}
                onChange={(e) => setHookDescription(e.target.value)}
                placeholder="e.g. Explosive visual montage + provocative question"
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60 placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Duration
              </label>
              <input
                type="text"
                value={targetDuration}
                onChange={(e) => setTargetDuration(e.target.value)}
                placeholder="e.g. 8 - 12 Minutes"
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Sound Design & Music Direction
              </label>
              <input
                type="text"
                value={musicPreferences}
                onChange={(e) => setMusicPreferences(e.target.value)}
                placeholder="e.g. Upbeat electronic, cinematic whooshes on cuts"
                className="w-full px-3 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60 placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Call to Action
              </label>
              <input
                type="text"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                placeholder="e.g. Subscribe and check pinned link in description"
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
              Save Brief
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
