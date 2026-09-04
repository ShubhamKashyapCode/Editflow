import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EMAIL_TEMPLATES } from '../../data/demoData';
import { EmailTemplate } from '../../types';
import { Badge } from '../common/Badge';
import {
  FileCode,
  Copy,
  Check,
  Search,
  Mail,
  User,
  DollarSign,
  Calendar,
  Sparkles,
  Share2
} from 'lucide-react';

export const TemplatesView: React.FC = () => {
  const { settings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dynamic variable inputs for live template preview
  const [clientName, setClientName] = useState('Alex');
  const [projectName, setProjectName] = useState('Product Launch Video');
  const [invoiceAmount, setInvoiceAmount] = useState('1,250');
  const [editorName, setEditorName] = useState(settings.name || 'Your Name');

  const filteredTemplates = EMAIL_TEMPLATES.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTemplateBody = (body: string) => {
    return body
      .replace(/\[Client Name\]/g, clientName || '[Client Name]')
      .replace(/\[Project Name\]/g, projectName || '[Project Name]')
      .replace(/\[Amount\]/g, `${settings.currencySymbol}${invoiceAmount || '1,000'}`)
      .replace(/\[Your Name\]/g, editorName || '[Your Name]')
      .replace(/\[Channel Name\]/g, `${clientName}'s Channel`)
      .replace(/\[Invoice Number\]/g, 'INV-2026-004')
      .replace(/\[Date\]/g, new Date().toLocaleDateString());
  };

  const handleCopy = (template: EmailTemplate) => {
    const formatted = formatTemplateBody(template.body);
    navigator.clipboard.writeText(`Subject: ${template.subject}\n\n${formatted}`);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Email Scripts & Communication Library
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Pre-written negotiation templates: scope pushbacks, retainer pitches, and outreach scripts.
          </p>
        </div>
      </div>

      {/* Live Variable Insertion Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#111112] border border-[#1F2023] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Live Variable Replacements (Auto-fills all scripts below)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Client / Creator Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full px-3 py-1.5 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. AI Workflow Breakdown"
              className="w-full px-3 py-1.5 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Amount ({settings.currencySymbol})</label>
            <input
              type="text"
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(e.target.value)}
              placeholder="e.g. 1,500"
              className="w-full px-3 py-1.5 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Your Name</label>
            <input
              type="text"
              value={editorName}
              onChange={(e) => setEditorName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-3 py-1.5 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500/60"
            />
          </div>
        </div>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTemplates.map((template) => {
          const formattedBody = formatTemplateBody(template.body);

          return (
            <div
              key={template.id}
              className="p-5 sm:p-6 rounded-xl bg-[#111112] border border-[#1F2023] flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 border-b border-[#1F2023] pb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">{template.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{template.description}</p>
                  </div>
                  <Badge variant="purple" size="xs">
                    {template.category}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs mt-3">
                  <div className="p-3 rounded-lg bg-[#1A1A1C] border border-[#1F2023] text-slate-300 font-mono">
                    <strong className="text-indigo-400 block mb-1">
                      Subject: {template.subject.replace(/\[Project Name\]/g, projectName)}
                    </strong>
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
                      {formattedBody}
                    </div>
                  </div>
                </div>
              </div>

              {/* Copy Action */}
              <div className="pt-3 border-t border-[#1F2023] flex justify-end">
                <button
                  onClick={() => handleCopy(template)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                >
                  {copiedId === template.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied with Placeholders Filled!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>1-Click Copy Script</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
