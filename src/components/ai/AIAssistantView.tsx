import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Zap,
  Copy,
  Check,
  Send,
  Wand2,
  FileText,
  AlertTriangle,
  Flame,
  Key,
  ShieldCheck
} from 'lucide-react';

export const AIAssistantView: React.FC = () => {
  const { settings, projects, clients } = useApp();

  const [activeTab, setActiveTab] = useState<
    'hooks' | 'scope-creep' | 'client-response' | 'titles' | 'description'
  >('hooks');

  // Input states
  const [topicInput, setTopicInput] = useState('');
  const [targetAudience, setTargetAudience] = useState('Tech entrepreneurs & Creators');
  const [clientMessage, setClientMessage] = useState('');
  const [responseTone, setResponseTone] = useState<'firm' | 'friendly' | 'professional'>('professional');
  const [scopeRequest, setScopeRequest] = useState('');
  const [originalAgreement, setOriginalAgreement] = useState(
    'Standard cut includes 10-minute video edit, 2 revision rounds, color grading, and audio mix. Raw project files not included.'
  );

  // Generated output
  const [output, setOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Smart local generation logic
  const handleGenerateHooks = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const topic = topicInput || 'video editing';
      const hooks = [
        `1. "Most people think ${topic} takes months to master, but this 60-second secret changes everything..."`,
        `2. "Stop making this fatal ${topic} mistake if you actually want high viewer retention in 2026."`,
        `3. "I tested every single ${topic} technique so you don't have to waste your time—here is the brutal truth."`,
        `4. "If you are struggling with ${topic}, it is probably because you were taught this backward rule."`,
        `5. "Watch what happens in the next 5 seconds when we apply this game-changing trick to ${topic}..."`,
        `6. "The top 1% of creators secretly use this exact rule for ${topic}, while everyone else ignores it."`,
        `7. "Never post another video about ${topic} until you double check this one critical setting."`,
        `8. "Before you buy expensive gear for ${topic}, do this completely free workflow hack first."`,
        `9. "Here is the exact framework I used to fix my retention curve on ${topic} in under 48 hours."`,
        `10. "There are only 2 reasons why your audience drops off during ${topic}—and this fixes both instantly."`
      ];
      setOutput(hooks.join('\n\n'));
      setIsGenerating(false);
    }, 400);
  };

  const handleAnalyzeScopeCreep = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const req = scopeRequest.toLowerCase();
      let flagScore = 'Low Risk';
      let analysis = 'The requested changes appear to be within standard revision scope.';

      if (
        req.includes('project file') ||
        req.includes('prproj') ||
        req.includes('source') ||
        req.includes('rush') ||
        req.includes('tomorrow') ||
        req.includes('re-shoot') ||
        req.includes('restructure') ||
        req.includes('re-record') ||
        req.includes('new footage') ||
        req.includes('vertical version') ||
        req.includes('tiktok') ||
        req.includes('shorts')
      ) {
        flagScore = 'HIGH RISK SCOPE CREEP DETECTED';
        analysis = `
⚠️ SCOPE CREEP ANALYSIS:
- Identified Out-of-Scope Items: Additional aspect ratios, project source files, or complete timeline overhaul.
- Contractual Basis: Original agreement strictly bounds output to standard master deliverables and agreed rounds.
- Recommended Action: Bill an add-on change order before commencing additional work.

Recommended Client Response:
"Hi [Client], I can certainly deliver those additional cuts/re-edits for you! Because this expands beyond our agreed initial master scope, I can add this as a project add-on for $150. Let me know if you'd like me to invoice that so we can roll it into the timeline."`;
      } else {
        analysis = `
✅ SCOPE CREEP ANALYSIS:
- Status: Likely within agreed revision boundaries.
- Notes: Standard timing trims, title font tweaks, or music volume balance.
- Recommendation: Execute under your active revision round and note timestamps for project records.`;
      }

      setOutput(analysis.trim());
      setIsGenerating(false);
    }, 400);
  };

  const handleGenerateClientResponse = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let draft = '';
      if (responseTone === 'firm') {
        draft = `Hi [Client],

Thank you for following up. Regarding the revision items requested: our original agreement covered 2 comprehensive revision rounds, which we have concluded. 

To maintain our production schedule and quality standards, subsequent revisions are invoiced at my standard hourly rate ($65/hr) or a flat $75 per pass. Please let me know how you would like to proceed so we can keep momentum going!

Best,
${settings.name || 'Your Video Editor'}`;
      } else if (responseTone === 'friendly') {
        draft = `Hi [Client]!

Hope you're having an awesome week. I took a look at the notes you sent over! 

I'm super excited to polish these details. Let me know if you have any preferred music reference track, and I'll jump straight into Premiere/DaVinci to have this ready for you by tomorrow afternoon!

Cheers,
${settings.name || 'Your Video Editor'}`;
      } else {
        draft = `Dear [Client],

Thank you for your message. I have reviewed your feedback and cataloged the adjustments into our production checklist.

The updated cut will be rendered and uploaded to your review link by [Date/Time]. Please let me know if any priority items take precedence.

Sincerely,
${settings.name || 'Your Video Editor'}`;
      }

      setOutput(draft);
      setIsGenerating(false);
    }, 400);
  };

  const handleGenerateTitles = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const topic = topicInput || 'Video Editing';
      const titles = [
        `1. I Tried ${topic} for 30 Days (Here's What Happened)`,
        `2. Why 99% of Editors Fail at ${topic} (And How to Fix It)`,
        `3. The ONLY ${topic} Guide You Need in 2026`,
        `4. How to Master ${topic} Without Burning Out`,
        `5. ${topic}: What Nobody Tells You Before You Start`,
        `6. How I Reached 100k Followers Using This ${topic} Secret`,
        `7. Stop Doing ${topic} Like This in 2026!`,
        `8. The Brutal Truth About ${topic} Nobody Wants to Admit`
      ];
      setOutput(titles.join('\n\n'));
      setIsGenerating(false);
    }, 400);
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>AI Production Assistant</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Smart algorithmic tools for video editors: viral hooks, CTR titles, and scope-creep defense.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111112] border border-[#1F2023] text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Offline Smart Engine Active</span>
        </div>
      </div>

      {/* Tool Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#111112] border border-[#1F2023] rounded-xl">
        <button
          onClick={() => {
            setActiveTab('hooks');
            setOutput('');
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'hooks'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#1A1A1C]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Hook Generator</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('scope-creep');
            setOutput('');
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'scope-creep'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#1A1A1C]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Scope Creep Analyzer</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('client-response');
            setOutput('');
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'client-response'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#1A1A1C]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Client Response Writer</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('titles');
            setOutput('');
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'titles'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#1A1A1C]'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>CTR Title Optimizer</span>
        </button>
      </div>

      {/* Main Workspace (Input + Output) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Box */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#111112] border border-[#1F2023] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {activeTab === 'hooks' && (
              <>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Generate 10 Viral Video Hooks
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Video Topic or Angle
                  </label>
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="e.g. How to edit talking head videos 3x faster"
                    className="w-full px-3.5 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. YouTube beginners, busy agency clients"
                    className="w-full px-3.5 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
                  />
                </div>
              </>
            )}

            {activeTab === 'scope-creep' && (
              <>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Scope Creep & Risk Assessment
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Paste Client's Latest Message or Email
                  </label>
                  <textarea
                    rows={4}
                    value={scopeRequest}
                    onChange={(e) => setScopeRequest(e.target.value)}
                    placeholder="e.g. Can we also get 4 TikTok cuts from this, and can you send over the Premiere project file with all plugins used?"
                    className="w-full px-3.5 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Agreed Scope of Work
                  </label>
                  <textarea
                    rows={2}
                    value={originalAgreement}
                    onChange={(e) => setOriginalAgreement(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500/60"
                  />
                </div>
              </>
            )}

            {activeTab === 'client-response' && (
              <>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Client Response Generator
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Client's Question / Demand
                  </label>
                  <textarea
                    rows={3}
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    placeholder="e.g. Why is the video taking so long? We need this uploaded today."
                    className="w-full px-3.5 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Desired Tone
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['professional', 'firm', 'friendly'] as const).map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setResponseTone(tone)}
                        className={`py-2 text-xs font-medium rounded-lg border capitalize transition-colors ${
                          responseTone === tone
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                            : 'bg-[#1A1A1C] text-slate-400 border-[#1F2023] hover:border-slate-700'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'titles' && (
              <>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  CTR Optimized Title Ideas
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Video Topic
                  </label>
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="e.g. Building a full-time video editing business"
                    className="w-full px-3.5 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
                  />
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => {
              if (activeTab === 'hooks') handleGenerateHooks();
              else if (activeTab === 'scope-creep') handleAnalyzeScopeCreep();
              else if (activeTab === 'client-response') handleGenerateClientResponse();
              else if (activeTab === 'titles') handleGenerateTitles();
            }}
            disabled={isGenerating}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Generating Results...' : 'Run Generation'}</span>
          </button>
        </div>

        {/* Right: Output Box */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#111112] border border-[#1F2023] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F2023] pb-3">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Output Results
            </span>

            {output && (
              <button
                onClick={handleCopyOutput}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1C] hover:bg-[#252528] text-slate-200 text-xs font-medium rounded-lg border border-[#1F2023] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[300px] p-4 rounded-lg bg-[#1A1A1C] border border-[#1F2023] text-xs sm:text-sm text-slate-300 font-mono whitespace-pre-wrap overflow-y-auto custom-scrollbar">
            {output ? (
              output
            ) : (
              <span className="text-slate-600 font-sans italic flex items-center justify-center h-full text-center">
                Configure parameters on the left and click "Run Generation" to view results.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
