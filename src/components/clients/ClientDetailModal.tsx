import React, { useState } from 'react';
import { Client, Project, Payment } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge, StageBadge } from '../common/Badge';
import {
  Film,
  CreditCard,
  Mail,
  Phone,
  Globe,
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  FileText
} from 'lucide-react';

interface ClientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onCreateProjectForClient: (clientId: string) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  isOpen,
  onClose,
  client,
  onEdit,
  onDelete,
  onCreateProjectForClient
}) => {
  const { projects, payments, settings, navigateToProjectDetail } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'payments' | 'notes'>('overview');

  if (!client) return null;

  const clientProjects = projects.filter((p) => p.clientId === client.id);
  const clientPayments = payments.filter((p) => p.clientId === client.id);

  const totalProjects = clientProjects.length;
  const activeProjects = clientProjects.filter((p) => p.status !== 'retainer' && p.deliveryStatus !== 'Delivered').length;
  const completedProjects = clientProjects.filter((p) => p.deliveryStatus === 'Delivered' || p.status === 'retainer').length;

  const totalProjectValue = clientProjects.reduce((sum, p) => sum + (p.projectValue || 0), 0);
  const totalPaid = clientPayments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + (p.amount || 0), 0);
  const outstandingPayments = clientPayments
    .filter((p) => p.status === 'Pending' || p.status === 'Overdue')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={client.name}
      subtitle={client.company}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="p-2 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Cuts</span>
            <span className="text-base sm:text-lg font-black text-white">{totalProjects}</span>
          </div>
          <div className="p-2 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">In Queue</span>
            <span className="text-base sm:text-lg font-black text-purple-400">{activeProjects}</span>
          </div>
          <div className="p-2 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Delivered</span>
            <span className="text-base sm:text-lg font-black text-emerald-400">{completedProjects}</span>
          </div>
          <div className="p-2 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Value</span>
            <span className="text-base sm:text-lg font-black text-indigo-400">
              {settings.currencySymbol}{totalProjectValue.toLocaleString()}
            </span>
          </div>
          <div className="p-2 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Outstanding</span>
            <span className="text-base sm:text-lg font-black text-amber-400">
              {settings.currencySymbol}{outstandingPayments.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          {(['overview', 'projects', 'payments', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => onEdit(client)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Edit client"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(client.id)}
              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              title="Delete client"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Contact & Channels</h4>
                {client.email && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.website && (
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <a href={client.website.startsWith('http') ? client.website : `https://${client.website}`} target="_blank" rel="noreferrer" className="hover:underline truncate">
                      {client.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Client Classification</h4>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Type:</span>
                  <Badge variant="blue" size="xs">{client.clientType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status:</span>
                  <Badge variant={client.status === 'Active' ? 'success' : 'slate'} size="xs">{client.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Lead Source:</span>
                  <span className="text-slate-200 font-medium">{client.leadSource}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Budget Range:</span>
                  <span className="text-emerald-400 font-semibold">{client.budgetRange}</span>
                </div>
              </div>
            </div>

            {/* Timeline info */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Added on {new Date(client.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Last Activity: {new Date(client.lastActivity).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase">Associated Video Edits ({clientProjects.length})</h4>
              <button
                onClick={() => {
                  onClose();
                  onCreateProjectForClient(client.id);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>
            </div>

            {clientProjects.length === 0 ? (
              <div className="text-center py-8 text-slate-400 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
                <Film className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-medium">No projects created for this client yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {clientProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onClose();
                      navigateToProjectDetail(p.id);
                    }}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors flex items-center justify-between gap-3"
                  >
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-white">{p.name}</h5>
                      <span className="text-[11px] text-slate-400">
                        {p.projectType} • {settings.currencySymbol}{p.projectValue?.toLocaleString()} • Final: {p.finalDeadline}
                      </span>
                    </div>
                    <StageBadge stage={p.status} size="xs" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Payments */}
        {activeTab === 'payments' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase">Payment Invoices & Milestones ({clientPayments.length})</h4>
              <span className="text-xs font-bold text-emerald-400">
                Total Collected: {settings.currencySymbol}{totalPaid.toLocaleString()}
              </span>
            </div>

            {clientPayments.length === 0 ? (
              <div className="text-center py-8 text-slate-400 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
                <CreditCard className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-medium">No payment records logged for this client yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {clientPayments.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {settings.currencySymbol}{pay.amount.toLocaleString()} ({pay.invoiceReference || 'Invoice'})
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Due: {pay.dueDate} • {pay.paymentMethod}
                      </span>
                    </div>
                    <Badge variant={pay.status === 'Paid' ? 'success' : pay.status === 'Overdue' ? 'danger' : 'warning'} size="xs">
                      {pay.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Notes */}
        {activeTab === 'notes' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
            {client.notes || 'No specific creative notes recorded yet. Click Edit to add preferences, sound libraries, or style guides.'}
          </div>
        )}
      </div>
    </Modal>
  );
};
