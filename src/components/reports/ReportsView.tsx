import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  Calendar,
  Clock,
  Layers,
  Award,
  FileSpreadsheet,
  Printer
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { clients, projects, payments, leads, settings, exportBackup } = useApp();

  // Metrics
  const totalRevenue = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const avgProjectValue =
    projects.length > 0
      ? Math.round(
          projects.reduce((sum, p) => sum + p.price, 0) / projects.length
        )
      : 0;

  const totalRevisions = projects.reduce(
    (sum, p) => sum + (p.revisionsUsed || 0),
    0
  );
  const avgRevisions =
    projects.length > 0
      ? (totalRevisions / projects.length).toFixed(1)
      : '0.0';

  // Conversion rate (inquiries converted to projects)
  const convertedLeads = leads.filter((l) => l.status === 'Accepted').length;
  const leadConversionRate =
    leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 100;

  // Top clients by revenue
  const clientRevenueMap: Record<string, number> = {};
  payments
    .filter((p) => p.status === 'Paid')
    .forEach((pay) => {
      clientRevenueMap[pay.clientId] =
        (clientRevenueMap[pay.clientId] || 0) + pay.amount;
    });

  const topClients = Object.entries(clientRevenueMap)
    .map(([cId, rev]) => {
      const client = clients.find((c) => c.id === cId);
      return {
        name: client?.name || 'Unknown Client',
        company: client?.company || 'YouTube Channel',
        revenue: rev
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Status breakdown
  const statusCounts = {
    Inquiry: projects.filter((p) => p.stage === 'inquiry').length,
    Editing: projects.filter((p) => p.stage === 'editing').length,
    Review: projects.filter((p) => p.stage === 'review').length,
    Completed: projects.filter((p) => p.stage === 'delivered' || p.stage === 'retainer').length,
    Other: projects.filter(
      (p) => !['inquiry', 'editing', 'review', 'delivered', 'retainer'].includes(p.stage)
    ).length
  };

  const handleExportCSV = () => {
    let csv = 'Type,Name,Client,Amount,Status,Date\n';
    projects.forEach((p) => {
      const c = clients.find((client) => client.id === p.clientId);
      csv += `"Project","${p.name}","${c?.name || ''}",${p.price},"${p.stage}","${p.createdAt}"\n`;
    });
    payments.forEach((pay) => {
      const c = clients.find((client) => client.id === pay.clientId);
      csv += `"Payment","${pay.invoiceReference || 'Invoice'}","${c?.name || ''}",${pay.amount},"${pay.status}","${pay.dueDate}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EditFlow_OS_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Financial & Studio Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Key operational metrics: average cut pricing, client LTV, conversion, and revision rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1A1C] hover:bg-[#252528] text-slate-200 text-xs font-medium rounded-lg border border-[#1F2023] transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1A1C] hover:bg-[#252528] text-slate-200 text-xs font-medium rounded-lg border border-[#1F2023] transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#111112] border border-[#1F2023]">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider block">
            Total Revenue
          </span>
          <div className="text-2xl font-bold text-emerald-400 mt-2 tracking-tight">
            {settings.currencySymbol}{totalRevenue.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Invoiced & collected</span>
        </div>

        <div className="p-5 rounded-xl bg-[#111112] border border-[#1F2023]">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider block">
            Average Project Fee
          </span>
          <div className="text-2xl font-bold text-indigo-400 mt-2 tracking-tight">
            {settings.currencySymbol}{avgProjectValue.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Per video contract</span>
        </div>

        <div className="p-5 rounded-xl bg-[#111112] border border-[#1F2023]">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider block">
            Average Revisions
          </span>
          <div className="text-2xl font-bold text-amber-400 mt-2 tracking-tight">
            {avgRevisions} rounds
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Under 2.0 cap target</span>
        </div>

        <div className="p-5 rounded-xl bg-[#111112] border border-[#1F2023]">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider block">
            Inquiry Conversion
          </span>
          <div className="text-2xl font-bold text-indigo-400 mt-2 tracking-tight">
            {leadConversionRate}%
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Lead to paying deal</span>
        </div>
      </div>

      {/* 2-Column Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients by Revenue */}
        <div className="p-6 rounded-xl bg-[#111112] border border-[#1F2023] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F2023] pb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Top Clients by Lifetime Revenue</span>
            </h3>
          </div>

          <div className="space-y-2.5">
            {topClients.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No paid invoices recorded yet.</p>
            ) : (
              topClients.map((client, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#1A1A1C] border border-[#1F2023] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#111112] text-slate-400 font-bold text-xs flex items-center justify-center border border-[#1F2023]">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">{client.name}</h4>
                      <p className="text-[11px] text-slate-500">{client.company}</p>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-emerald-400">
                    {settings.currencySymbol}{client.revenue.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Project Pipeline Breakdown */}
        <div className="p-6 rounded-xl bg-[#111112] border border-[#1F2023] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F2023] pb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Pipeline Stage Breakdown</span>
            </h3>
          </div>

          <div className="space-y-3">
            {Object.entries(statusCounts).map(([stageName, count]) => {
              const total = projects.length || 1;
              const pct = Math.round((count / total) * 100);

              return (
                <div key={stageName} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300">{stageName}</span>
                    <span className="text-slate-500 font-mono">
                      {count} projects ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1A1A1C] rounded-full overflow-hidden border border-[#1F2023]">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
