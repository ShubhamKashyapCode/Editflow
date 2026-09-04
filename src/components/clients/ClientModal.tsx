import React, { useState, useEffect } from 'react';
import { Client, ClientStatus, ClientType, LeadSource } from '../../types';
import { Modal } from '../common/Modal';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Client, 'id' | 'createdAt' | 'lastActivity'>) => Promise<any>;
  clientToEdit?: Client | null;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clientToEdit
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [clientType, setClientType] = useState<ClientType>('YouTube Creator');
  const [leadSource, setLeadSource] = useState<LeadSource>('Referral');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [budgetRange, setBudgetRange] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setCompany(clientToEdit.company);
      setEmail(clientToEdit.email);
      setPhone(clientToEdit.phone || '');
      setWebsite(clientToEdit.website || '');
      setClientType(clientToEdit.clientType);
      setLeadSource(clientToEdit.leadSource);
      setStatus(clientToEdit.status);
      setBudgetRange(clientToEdit.budgetRange);
      setNotes(clientToEdit.notes || '');
    } else {
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setWebsite('');
      setClientType('YouTube Creator');
      setLeadSource('Referral');
      setStatus('Active');
      setBudgetRange('');
      setNotes('');
    }
  }, [clientToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await onSave({
        name: name.trim(),
        company: company.trim() || `${name.trim()}'s Brand`,
        email: email.trim(),
        phone: phone.trim() || undefined,
        website: website.trim() || undefined,
        clientType,
        leadSource,
        status,
        budgetRange: budgetRange.trim() || 'Flexible',
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (err) {
      console.error('Error saving client:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={clientToEdit ? 'Edit Client Profile' : 'Register New Client'}
      subtitle="Keep creator channel and brand information organized."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Client / Creator Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marques, Alex Rivera"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Channel / Company / Brand
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Apex Tech Media"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="creator@channel.com"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Phone / WhatsApp / Discord
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000 or Discord handle"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Client Type
            </label>
            <select
              value={clientType}
              onChange={(e) => setClientType(e.target.value as ClientType)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="YouTube Creator">YouTube Creator</option>
              <option value="Short-form / TikTok">Short-form / TikTok</option>
              <option value="Agency">Agency</option>
              <option value="Brand / Commercial">Brand / Commercial</option>
              <option value="Podcast">Podcast</option>
              <option value="Course Creator">Course Creator</option>
              <option value="Corporate">Corporate</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Lead Source
            </label>
            <select
              value={leadSource}
              onChange={(e) => setLeadSource(e.target.value as LeadSource)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Twitter/X">Twitter/X</option>
              <option value="YouTube">YouTube</option>
              <option value="Referral">Referral</option>
              <option value="Cold Outreach">Cold Outreach</option>
              <option value="Upwork / Freelance">Upwork / Freelance</option>
              <option value="Instagram">Instagram</option>
              <option value="Website">Website</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ClientStatus)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Active">Active</option>
              <option value="Lead">Lead</option>
              <option value="Inactive">Inactive</option>
              <option value="Past Client">Past Client</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Channel Link / Website / Social
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="youtube.com/@channel or website"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Budget Range / Retainer Target
            </label>
            <input
              type="text"
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              placeholder="e.g. $1,500 - $3,000 / mo"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Editor Notes & Creative Nuances
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Pacing preferences, preferred font, Frame.io reviewer emails, turnaround requirements..."
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-950/40"
          >
            {clientToEdit ? 'Save Changes' : 'Create Client'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
