import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectAssets, AssetsStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  FolderArchive,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Film,
  HardDrive
} from 'lucide-react';

export const AssetsView: React.FC = () => {
  const { assets, projects, updateAssets, updateProject, loadDemo } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleChecklist = async (
    assetId: string,
    key: 'footageReceived' | 'audioReceived' | 'musicReceived' | 'sfxReceived' | 'graphicsReceived' | 'bRollReceived',
    currentVal: boolean,
    projectId: string
  ) => {
    const newVal = !currentVal;
    await updateAssets(assetId, { [key]: newVal });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Raw Footage & Project Assets
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Keep media checklists in check: verify multi-cam rushes, WAV voiceovers, SFX, and cloud links.
          </p>
        </div>
      </div>

      {/* Asset Cards */}
      {assets.length === 0 ? (
        <EmptyState
          icon={FolderArchive}
          title="No Project Media Tracked"
          description="Assets are automatically initialized whenever you create a video project."
          actionLabel="Load Sample Data"
          onAction={loadDemo}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {assets.map((asset) => {
            const project = projects.find((p) => p.id === asset.projectId);

            const checklist = [
              { key: 'footageReceived', label: 'A-Roll Raw Footage', val: asset.footageReceived },
              { key: 'bRollReceived', label: 'B-Roll & Screen Renders', val: asset.bRollReceived },
              { key: 'audioReceived', label: 'Audio / Voiceover WAVs', val: asset.audioReceived },
              { key: 'musicReceived', label: 'Background Music Tracks', val: asset.musicReceived },
              { key: 'sfxReceived', label: 'Sound FX & Risers', val: asset.sfxReceived },
              { key: 'graphicsReceived', label: 'Brand Logos & Fonts', val: asset.graphicsReceived }
            ] as const;

            const receivedCount = checklist.filter((c) => c.val).length;
            const pct = Math.round((receivedCount / checklist.length) * 100);

            return (
              <div
                key={asset.id}
                className="p-5 sm:p-6 rounded-xl bg-[#111112] border border-[#1F2023] space-y-4"
              >
                <div className="flex items-start justify-between gap-2 border-b border-[#1F2023] pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                      {project?.name || 'Video Edit'}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                      Media Checklist ({receivedCount}/6)
                    </h3>
                  </div>

                  <Badge variant={pct === 100 ? 'success' : pct > 50 ? 'blue' : 'warning'} size="xs">
                    {pct === 100 ? 'All Assets In' : `${pct}% Received`}
                  </Badge>
                </div>

                {/* Checklist items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {checklist.map((item) => (
                    <div
                      key={item.key}
                      onClick={() =>
                        handleToggleChecklist(asset.id, item.key, item.val, asset.projectId)
                      }
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

                {/* Cloud Link */}
                {asset.driveLink && (
                  <div className="pt-2 border-t border-[#1F2023] flex items-center justify-between text-xs">
                    <span className="text-slate-400 truncate max-w-xs">{asset.driveLink}</span>
                    <a
                      href={asset.driveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <span>Open Drive</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
