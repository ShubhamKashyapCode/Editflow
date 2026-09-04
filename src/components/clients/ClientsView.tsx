import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Client, ClientStatus } from '../../types';
import { ClientModal } from './ClientModal';
import { ClientDetailModal } from './ClientDetailModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  Users,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Mail,
  Phone,
  Film,
  Sparkles,
  ExternalLink,
  Edit2,
  Trash2
} from 'lucide-react';

export const ClientsView: React.FC = () => {
  const { clients, projects, payments, settings, addClient, updateClient, deleteClient, loadDemo, activeClientId, setActiveClientId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'activity' | 'created'>('activity');

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(() => {
    if (activeClientId) {
      return clients.find((c) => c.id === activeClientId) || null;
    }
    return null;
  });
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Filter and sort clients
  const filteredClients = useMemo(() => {
    return clients
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      });
  }, [clients, searchQuery, statusFilter, sortBy]);

  const handleSaveClient = async (data: Omit<Client, 'id' | 'createdAt' | 'lastActivity'>) => {
    if (editingClient) {
      await updateClient(editingClient.id, data);
      setEditingClient(null);
    } else {
      await addClient(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (clientToDelete) {
      await deleteClient(clientToDelete.id);
      if (viewingClient?.id === clientToDelete.id) {
        setViewingClient(null);
        setActiveClientId(null);
      }
      setClientToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Client Roster</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage creator relationships, channel requirements, and client lifetime revenue.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingClient(null);
            setIsCreateOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-950/30 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-3 rounded-xl bg-[#111112] border border-[#1F2023]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients by name, channel, or email..."
            className="w-full pl-9 pr-4 py-2 bg-[#1A1A1C] border border-[#1F2023] rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 bg-[#1A1A1C] border border-[#1F2023] rounded-lg px-2.5 py-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#111112]">All Statuses</option>
              <option value="Active" className="bg-[#111112]">Active</option>
              <option value="Lead" className="bg-[#111112]">Lead</option>
              <option value="Inactive" className="bg-[#111112]">Inactive</option>
              <option value="Past Client" className="bg-[#111112]">Past Client</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#1A1A1C] border border-[#1F2023] rounded-lg px-2.5 py-1.5 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="activity" className="bg-[#111112]">Recent Activity</option>
              <option value="name" className="bg-[#111112]">Client Name</option>
              <option value="created" className="bg-[#111112]">Date Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Clients Found"
          description={
            clients.length === 0
              ? 'Your client roster is empty. Register your first creator or brand to link edits, briefs, and invoices.'
              : 'No clients match your search criteria. Try clearing the filter.'
          }
          actionLabel="+ Add Client"
          onAction={() => {
            setEditingClient(null);
            setIsCreateOpen(true);
          }}
          secondaryActionLabel={clients.length === 0 ? 'Load Sample Clients' : undefined}
          onSecondaryAction={clients.length === 0 ? loadDemo : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const clientProjects = projects.filter((p) => p.clientId === client.id);
            const activeProjectsCount = clientProjects.filter(
              (p) => p.status !== 'retainer' && p.deliveryStatus !== 'Delivered'
            ).length;
            const totalValue = clientProjects.reduce((sum, p) => sum + (p.projectValue || 0), 0);

            return (
              <div
                key={client.id}
                onClick={() => setViewingClient(client)}
                className="p-5 rounded-xl bg-[#111112] border border-[#1F2023] hover:border-[#2C2D31] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-xs shrink-0">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                          {client.name}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">{client.company}</p>
                      </div>
                    </div>

                    <Badge variant={client.status === 'Active' ? 'success' : 'slate'} size="xs">
                      {client.status}
                    </Badge>
                  </div>

                  {/* Badges / Type */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#1A1A1C] text-slate-300 font-medium border border-[#1F2023]">
                      {client.clientType}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#1A1A1C] text-slate-400 border border-[#1F2023]">
                      Via {client.leadSource}
                    </span>
                  </div>

                  {/* Quick Contact info */}
                  <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                    {client.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Stats Footer */}
                <div className="pt-3 border-t border-[#1F2023] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Active Cuts</span>
                    <span className="font-semibold text-slate-200">{activeProjectsCount} in queue</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Total Value</span>
                    <span className="font-bold text-emerald-400">
                      {settings.currencySymbol}{totalValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <ClientModal
        isOpen={isCreateOpen || !!editingClient}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClient}
        clientToEdit={editingClient}
      />

      <ClientDetailModal
        isOpen={!!viewingClient}
        onClose={() => {
          setViewingClient(null);
          setActiveClientId(null);
        }}
        client={viewingClient}
        onEdit={(cli) => {
          setViewingClient(null);
          setEditingClient(cli);
        }}
        onDelete={(cliId) => {
          const cli = clients.find((c) => c.id === cliId);
          if (cli) setClientToDelete(cli);
        }}
        onCreateProjectForClient={(cliId) => {
          // Handled via Quick Project with preselected client
        }}
      />

      <ConfirmModal
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Client Record"
        message={`Are you sure you want to delete "${clientToDelete?.name}"? All client details will be removed from your local database. Existing projects and payments will remain in your archive.`}
        confirmLabel="Delete Client"
        isDestructive={true}
      />
    </div>
  );
};
