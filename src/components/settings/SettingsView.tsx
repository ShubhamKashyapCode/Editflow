import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { UserSettings } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Settings as SettingsIcon,
  Save,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Database,
  Check,
  ShieldCheck,
  HardDrive
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    clients,
    projects,
    tasks,
    payments,
    updateSettings,
    exportBackup,
    importBackup,
    loadDemo,
    resetData
  } = useApp();

  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [currency, setCurrency] = useState(settings.currency);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [defaultTurnaroundDays, setDefaultTurnaroundDays] = useState(settings.defaultTurnaroundDays);
  const [defaultRevisionLimit, setDefaultRevisionLimit] = useState(settings.defaultRevisionLimit);
  const [hourlyRate, setHourlyRate] = useState(settings.hourlyRate);
  const [dayRate, setDayRate] = useState(settings.dayRate);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDemoConfirmOpen, setIsDemoConfirmOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCurrencyChange = (curr: string) => {
    setCurrency(curr);
    if (curr === 'USD' || curr === 'CAD' || curr === 'AUD') setCurrencySymbol('$');
    else if (curr === 'EUR') setCurrencySymbol('€');
    else if (curr === 'GBP') setCurrencySymbol('£');
    else if (curr === 'INR') setCurrencySymbol('₹');
    else if (curr === 'JPY') setCurrencySymbol('¥');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      name: name.trim(),
      email: email.trim(),
      businessName: businessName.trim(),
      currency,
      currencySymbol,
      defaultTurnaroundDays: Number(defaultTurnaroundDays),
      defaultRevisionLimit: Number(defaultRevisionLimit),
      hourlyRate: Number(hourlyRate),
      dayRate: Number(dayRate)
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        await importBackup(text);
        alert('Data successfully restored from backup file!');
      } catch (err) {
        alert('Failed to restore backup: invalid JSON format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Studio Preferences & Data Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Configure rates, currency symbols, turnaround defaults, and local backup archives.
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-xl bg-[#111112] border border-[#1F2023] space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#1F2023] pb-3">
            Editor Profile & Business Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Full Name / Alias
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Business / Studio Brand Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Display Currency
              </label>
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              >
                <option value="USD" className="bg-[#111112]">USD ($) - US Dollar</option>
                <option value="EUR" className="bg-[#111112]">EUR (€) - Euro</option>
                <option value="GBP" className="bg-[#111112]">GBP (£) - British Pound</option>
                <option value="CAD" className="bg-[#111112]">CAD ($) - Canadian Dollar</option>
                <option value="AUD" className="bg-[#111112]">AUD ($) - Australian Dollar</option>
                <option value="INR" className="bg-[#111112]">INR (₹) - Indian Rupee</option>
              </select>
            </div>
          </div>
        </div>

        {/* Production Defaults */}
        <div className="p-6 rounded-xl bg-[#111112] border border-[#1F2023] space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#1F2023] pb-3">
            Production & Billing Rates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Default Turnaround (Days)
              </label>
              <input
                type="number"
                min="1"
                value={defaultTurnaroundDays}
                onChange={(e) => setDefaultTurnaroundDays(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Revision Cap (Rounds)
              </label>
              <input
                type="number"
                min="1"
                value={defaultRevisionLimit}
                onChange={(e) => setDefaultRevisionLimit(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Standard Hourly Rate ({currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Standard Day Rate ({currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                value={dayRate}
                onChange={(e) => setDayRate(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-sm"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Local Data Storage & Backup Card */}
      <div className="p-6 rounded-xl bg-[#111112] border border-[#1F2023] space-y-5">
        <div className="flex items-center justify-between border-b border-[#1F2023] pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Local-First Database & Backup Hub
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">IndexedDB v1.0.0 (Local Storage)</span>
        </div>

        {/* Storage Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-[#1A1A1C] border border-[#1F2023] text-center">
            <span className="text-xs text-slate-500 block">Clients Stored</span>
            <span className="text-lg font-bold text-white">{clients.length}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#1A1A1C] border border-[#1F2023] text-center">
            <span className="text-xs text-slate-500 block">Projects Active</span>
            <span className="text-lg font-bold text-white">{projects.length}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#1A1A1C] border border-[#1F2023] text-center">
            <span className="text-xs text-slate-500 block">Tasks Stored</span>
            <span className="text-lg font-bold text-white">{tasks.length}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#1A1A1C] border border-[#1F2023] text-center">
            <span className="text-xs text-slate-500 block">Payment Records</span>
            <span className="text-lg font-bold text-white">{payments.length}</span>
          </div>
        </div>

        {/* Data Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1F2023]">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={exportBackup}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1A1C] hover:bg-[#252528] text-slate-300 text-xs font-medium rounded-lg border border-[#1F2023] transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export JSON Backup</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1A1C] hover:bg-[#252528] text-slate-300 text-xs font-medium rounded-lg border border-[#1F2023] transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>Restore Backup</span>
            </button>

            <button
              onClick={() => setIsDemoConfirmOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1A1C] hover:bg-[#252528] text-slate-400 hover:text-slate-200 text-xs font-medium rounded-lg border border-[#1F2023] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reload Sample Data</span>
            </button>
          </div>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium rounded-lg border border-rose-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset All Studio Data</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={async () => {
          await resetData();
          setIsResetConfirmOpen(false);
        }}
        title="Wipe All Local Data?"
        message="This will permanently delete all client records, active project workflows, tasks, and payment history from this computer. This action cannot be undone unless you have a JSON backup."
        confirmLabel="Erase Everything"
        isDestructive={true}
      />

      <ConfirmModal
        isOpen={isDemoConfirmOpen}
        onClose={() => setIsDemoConfirmOpen(false)}
        onConfirm={async () => {
          await loadDemo();
          setIsDemoConfirmOpen(false);
        }}
        title="Reload Production Demo Suite?"
        message="This will overwrite current local records with the 4 sample creator clients, active projects, tasks, briefs, and payment milestones."
        confirmLabel="Reload Demo Suite"
      />
    </div>
  );
};
