import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectDelivery } from '../../types';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  PackageCheck,
  CheckCircle2,
  Copy,
  Check,
  Star,
  Film,
  Download,
  ExternalLink,
  Mail
} from 'lucide-react';

export const DeliveryView: React.FC = () => {
  const { deliveries, projects, clients, settings, updateDelivery, loadDemo } = useApp();

  const [copiedHandoffId, setCopiedHandoffId] = useState<string | null>(null);
  const [copiedTestimonialId, setCopiedTestimonialId] = useState<string | null>(null);

  const handleToggleQc = async (
    deliveryId: string,
    key: 'audioLevelsChecked' | 'colorGraded' | 'captionsChecked' | 'thumbnailExported' | 'licensesVerified' | 'exportSettingsVerified',
    currentVal: boolean
  ) => {
    await updateDelivery(deliveryId, { [key]: !currentVal });
  };

  const getHandoffEmail = (del: ProjectDelivery) => {
    const project = projects.find((p) => p.id === del.projectId);
    const client = clients.find((c) => c.id === project?.clientId);

    return `Hi ${client?.name || 'there'},

Your final master video files for "${project?.name || 'your project'}" are officially ready!

Master Download Link:
${del.finalExportLink || 'https://drive.google.com/drive/folders/sample-master'}

Package includes:
• 4K / 1080p Master Video (.mp4 / ProRes)
• Timecode-synced Subtitles (.srt)
• High-res Thumbnail Still Frame (.png)

Thank you so much for the opportunity to cut this video with you. Please let me know once you have safely downloaded the files.

Best regards,
${settings.name || 'Your Video Editor'}`;
  };

  const getTestimonialEmail = (del: ProjectDelivery) => {
    const project = projects.find((p) => p.id === del.projectId);
    const client = clients.find((c) => c.id === project?.clientId);

    return `Hi ${client?.name || 'there'},

I loved working together on "${project?.name || 'the video'}" and seeing it come to life!

If you were happy with the turnaround, pacing, and overall polish, would you mind sharing a quick 2-sentence review or testimonial I can feature in my portfolio?

Specifically:
1. What was your experience like working together on this edit?
2. How did the final video perform with your audience?

Thank you so much for your support!

Best,
${settings.name || 'Your Video Editor'}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Quality Control & Final Delivery
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            6-point post-production QC, master download links, and 1-click testimonial request scripts.
          </p>
        </div>
      </div>

      {/* Deliveries List */}
      {deliveries.length === 0 ? (
        <EmptyState
          icon={PackageCheck}
          title="No Active Deliveries"
          description="Quality control records are generated when a video project enters the review and delivery stage."
          actionLabel="Load Sample Deliveries"
          onAction={loadDemo}
        />
      ) : (
        <div className="space-y-6">
          {deliveries.map((del) => {
            const project = projects.find((p) => p.id === del.projectId);

            const qcList = [
              { key: 'audioLevelsChecked', label: 'Audio levels normalized to -14 LUFS', val: del.audioLevelsChecked },
              { key: 'colorGraded', label: 'Color grading checked across displays', val: del.colorGraded },
              { key: 'captionsChecked', label: 'Captions & subtitles spell-checked', val: del.captionsChecked },
              { key: 'thumbnailExported', label: 'Clean thumbnail still frame exported', val: del.thumbnailExported },
              { key: 'licensesVerified', label: 'Music & SFX commercial licenses cleared', val: del.licensesVerified },
              { key: 'exportSettingsVerified', label: 'ProRes / High-bitrate master verified', val: del.exportSettingsVerified }
            ] as const;

            const passedQc = qcList.filter((q) => q.val).length;
            const allPassed = passedQc === qcList.length;

            return (
              <div
                key={del.id}
                className="p-6 rounded-xl bg-[#111112] border border-[#1F2023] space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2023] pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                      Project: {project?.name || 'Video Cut'}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      Master Delivery Package ({passedQc}/6 QC Passed)
                    </h3>
                  </div>

                  <Badge variant={allPassed ? 'success' : 'warning'} size="sm">
                    {allPassed ? 'QC Approved' : 'QC Pending'}
                  </Badge>
                </div>

                {/* 6-Point Quality Checklist */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Post-Production Quality Checklist (Click to Toggle)
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {qcList.map((item) => (
                      <div
                        key={item.key}
                        onClick={() => handleToggleQc(del.id, item.key, item.val)}
                        className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors select-none ${
                          item.val
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                            : 'bg-[#1A1A1C] border-[#1F2023] text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-medium">{item.label}</span>
                        <CheckCircle2
                          className={`w-4 h-4 ${item.val ? 'text-emerald-400' : 'text-slate-600'}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Script Generator Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#1F2023]">
                  {/* Delivery Handoff Script */}
                  <div className="p-4 rounded-lg bg-[#1A1A1C] border border-[#1F2023] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-indigo-400" />
                        Delivery Handoff Email
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(getHandoffEmail(del));
                          setCopiedHandoffId(del.id);
                          setTimeout(() => setCopiedHandoffId(null), 2000);
                        }}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                      >
                        {copiedHandoffId === del.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Email</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {getHandoffEmail(del)}
                    </p>
                  </div>

                  {/* Testimonial Request Script */}
                  <div className="p-4 rounded-lg bg-[#1A1A1C] border border-[#1F2023] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        Testimonial Request Email
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(getTestimonialEmail(del));
                          setCopiedTestimonialId(del.id);
                          setTimeout(() => setCopiedTestimonialId(null), 2000);
                        }}
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                      >
                        {copiedTestimonialId === del.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Script</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {getTestimonialEmail(del)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
