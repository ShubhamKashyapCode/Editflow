import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Film,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  LayoutDashboard,
  Bookmark,
  Settings,
  ChevronRight,
  Zap
} from 'lucide-react';

export const FirstLaunchModal: React.FC = () => {
  const { settings, completeOnboarding, loadDemo } = useApp();

  const [step, setStep] = useState<'setup' | 'tour'>('setup');
  const [tourIndex, setTourIndex] = useState(0);

  // Form fields
  const [name, setName] = useState(settings.name || '');
  const [businessName, setBusinessName] = useState(settings.businessName || '');
  const [email, setEmail] = useState(settings.email || '');
  const [currency, setCurrency] = useState(settings.currency || 'USD');
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol || '$');
  const [defaultRevisionLimit, setDefaultRevisionLimit] = useState(settings.defaultRevisionLimit || 2);
  const [theme, setTheme] = useState<'Dark' | 'Light' | 'System'>(settings.theme || 'Dark');

  const handleCurrencyChange = (curr: string) => {
    setCurrency(curr);
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'CA$',
      AUD: 'A$',
      INR: '₹'
    };
    setCurrencySymbol(symbols[curr] || '$');
  };

  const handleFinishSetup = (startTourImmediately: boolean) => {
    const setupData = {
      name: name.trim() || 'Freelance Editor',
      businessName: businessName.trim() || 'Post Production Studio',
      email: email.trim(),
      currency,
      currencySymbol,
      defaultRevisionLimit,
      theme
    };

    if (startTourImmediately) {
      setStep('tour');
    } else {
      completeOnboarding(setupData);
    }
  };

  const tourSteps = [
    {
      title: 'Interactive Dashboard',
      subtitle: 'Real-time Metrics & Pipeline',
      icon: LayoutDashboard,
      description:
        'Your command center. Tracks genuine KPIs including active projects, pending payments, revenue, deadlines, and a visual 12-stage video editing pipeline from Inquiry to Retainer.'
    },
    {
      title: 'Client Management',
      subtitle: 'Creator & Brand Roster',
      icon: Users,
      description:
        'Manage your creators, YouTube channels, and agencies. Track client lifetime value, associated projects, active cuts, and contact details in one place.'
    },
    {
      title: 'Project Tracking & Timeline',
      subtitle: 'Deadline Guard & File Specs',
      icon: Film,
      description:
        'Every project tracks first-draft deadlines, final cut dates, revision quotas, linked briefs, asset checklists, and quality control deliveries.'
    },
    {
      title: 'The 12-Stage Video Workflow',
      subtitle: 'From First DM to Recurring Retainer',
      icon: Zap,
      description:
        'Inquiry → Qualification → Proposal → Payment → Brief → Assets → Editing → Review → Revisions → Delivery → Testimonial → Retainer. Advance stages with animated progress tracking.'
    },
    {
      title: 'Battle-Tested Templates',
      subtitle: 'Scripts that Protect Your Rates',
      icon: Bookmark,
      description:
        'Pre-written email and messaging scripts for revision limit pushbacks, deposit invoices, delivery handoffs, testimonial requests, and monthly retainer pitches.'
    },
    {
      title: 'Studio Settings & Local Backups',
      subtitle: '100% Offline & Private',
      icon: Settings,
      description:
        'Your business data lives exclusively on your local computer via IndexedDB. Export one-click JSON backups anytime with zero cloud vendor lock-in.'
    }
  ];

  if (settings.onboardingCompleted) {
    return null;
  }

  return (
    <div
      id="first-launch-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="w-full max-w-xl bg-[#111112] border border-[#1F2023] rounded-xl shadow-2xl overflow-hidden my-6">
        {step === 'setup' ? (
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-950/40">
                <Film className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white tracking-tight">EDITFLOW OS</h2>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                    V1.0 Setup
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Let's set up your video editing workspace.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Hayes"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#1A1A1C] border border-[#1F2023] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Studio / Channel Brand
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Cut Studio"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#1A1A1C] border border-[#1F2023] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="editor@yourdomain.com"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#1A1A1C] border border-[#1F2023] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#1F2023] text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
                  >
                    <option value="USD" className="bg-[#111112]">USD ($)</option>
                    <option value="EUR" className="bg-[#111112]">EUR (€)</option>
                    <option value="GBP" className="bg-[#111112]">GBP (£)</option>
                    <option value="CAD" className="bg-[#111112]">CAD (CA$)</option>
                    <option value="AUD" className="bg-[#111112]">AUD (A$)</option>
                    <option value="INR" className="bg-[#111112]">INR (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Default Revision Cap
                  </label>
                  <select
                    value={defaultRevisionLimit}
                    onChange={(e) => setDefaultRevisionLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#1F2023] text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
                  >
                    <option value={1} className="bg-[#111112]">1 Round</option>
                    <option value={2} className="bg-[#111112]">2 Rounds (Standard)</option>
                    <option value={3} className="bg-[#111112]">3 Rounds</option>
                    <option value={5} className="bg-[#111112]">5 Rounds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-[#1F2023] text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
                  >
                    <option value="Dark" className="bg-[#111112]">Dark Mode</option>
                    <option value="Light" className="bg-[#111112]">Light Mode</option>
                    <option value="System" className="bg-[#111112]">System Default</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Offline Local-First Note */}
            <div className="mt-6 p-3.5 rounded-lg bg-[#1A1A1C] border border-[#1F2023] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Local-First Storage:</strong> Your client roster, invoices, and briefs are stored strictly in your browser's IndexedDB. No external servers or API keys needed.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 pt-5 border-t border-[#1F2023]">
              <button
                type="button"
                onClick={() => handleFinishSetup(false)}
                className="w-full sm:w-auto px-5 py-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors text-center"
              >
                Skip & Start Blank
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleFinishSetup(true)}
                  className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Start Workspace Tour</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Interactive Tour */
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Workspace Tour • Step {tourIndex + 1} of {tourSteps.length}
              </span>
              <button
                onClick={() => {
                  completeOnboarding({
                    name: name || 'Freelance Editor',
                    businessName: businessName || 'Post Production Studio',
                    email,
                    currency,
                    currencySymbol,
                    defaultRevisionLimit,
                    theme
                  });
                }}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Skip Tour
              </button>
            </div>

            {/* Tour Step Card */}
            {(() => {
              const currentStep = tourSteps[tourIndex];
              const StepIcon = currentStep.icon;
              return (
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-16 h-16 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 shadow-lg shadow-indigo-950/20">
                    <StepIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{currentStep.title}</h3>
                  <span className="text-xs font-semibold text-indigo-400 mt-1">{currentStep.subtitle}</span>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-3 leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>
              );
            })()}

            {/* Tour Progress Indicators */}
            <div className="flex justify-center items-center gap-1.5 my-6">
              {tourSteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTourIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === tourIndex ? 'w-6 bg-indigo-500' : 'w-1.5 bg-[#1F2023]'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Tour Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1F2023]">
              <button
                type="button"
                disabled={tourIndex === 0}
                onClick={() => setTourIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                Back
              </button>

              {tourIndex < tourSteps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setTourIndex((prev) => prev + 1)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    completeOnboarding({
                      name: name || 'Freelance Editor',
                      businessName: businessName || 'Post Production Studio',
                      email,
                      currency,
                      currencySymbol,
                      defaultRevisionLimit,
                      theme
                    });
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <span>Launch Workspace</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
