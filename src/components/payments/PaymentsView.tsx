import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Payment, PaymentStatus, PaymentMethod } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  CreditCard,
  Plus,
  Search,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Mail,
  Copy,
  Check,
  Calendar
} from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const { payments, clients, projects, settings, addPayment, updatePayment, loadDemo } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminderPayment, setReminderPayment] = useState<Payment | null>(null);
  const [copiedReminder, setCopiedReminder] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Form State
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [projectId, setProjectId] = useState('');
  const [amount, setAmount] = useState<number>(1000);
  const [status, setStatus] = useState<PaymentStatus>('Pending');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [invoiceReference, setInvoiceReference] = useState(`INV-${new Date().getFullYear()}-001`);

  // Calculations
  const totalRevenue = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const overdueAmount = payments
    .filter((p) => p.status === 'Overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter((p) => {
    if (statusFilter === 'ALL') return true;
    return p.status === statusFilter;
  });

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || amount <= 0) return;

    await addPayment({
      clientId,
      projectId: projectId || undefined,
      amount: Number(amount),
      status,
      dueDate,
      paymentMethod,
      invoiceReference
    });

    setIsModalOpen(false);
  };

  const getReminderEmail = (pay: Payment) => {
    const client = clients.find((c) => c.id === pay.clientId);
    return `Hi ${client?.name || 'there'},

I hope you are doing well!

Just a polite reminder regarding invoice ${pay.invoiceReference || 'for video editing services'} for ${settings.currencySymbol}${pay.amount.toLocaleString()}, which was due on ${pay.dueDate}.

Could you please confirm when payment will be processed via ${pay.paymentMethod}?

Thank you,
${settings.name || 'Your Video Editor'}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Payments & Invoices
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Track deposit invoices, collected revenue, and overdue milestone payments.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Invoice</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#111112] border border-[#1F2023]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider">Total Collected</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">
            {settings.currencySymbol}{totalRevenue.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Paid in full</span>
        </div>

        <div className="p-5 rounded-xl bg-[#111112] border border-[#1F2023]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider">Pending Deposits</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight">
            {settings.currencySymbol}{pendingAmount.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Awaiting payment</span>
        </div>

        <div className="p-5 rounded-xl bg-[#111112] border border-[#1F2023]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider">Overdue Balances</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 tracking-tight">
            {settings.currencySymbol}{overdueAmount.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Requires follow-up</span>
        </div>
      </div>

      {/* Payment List Table */}
      {filteredPayments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No Invoices Found"
          description="Track your video editing milestone deposits, retainers, and final deliveries."
          actionLabel="+ Add Invoice"
          onAction={() => setIsModalOpen(true)}
          secondaryActionLabel="Load Sample Invoices"
          onSecondaryAction={loadDemo}
        />
      ) : (
        <div className="rounded-xl bg-[#111112] border border-[#1F2023] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#1A1A1C] border-b border-[#1F2023] text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Invoice #</th>
                  <th className="px-4 py-3.5">Client & Project</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Due Date</th>
                  <th className="px-4 py-3.5">Method</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2023] text-slate-300">
                {filteredPayments.map((pay) => {
                  const client = clients.find((c) => c.id === pay.clientId);
                  const project = projects.find((p) => p.id === pay.projectId);

                  return (
                    <tr key={pay.id} className="hover:bg-[#1A1A1C]/50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-white whitespace-nowrap">
                        {pay.invoiceReference || 'INV-000'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-white block">{client?.name || 'Client'}</span>
                        <span className="text-xs text-slate-400">{project?.name || client?.company}</span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-white whitespace-nowrap">
                        {settings.currencySymbol}{pay.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">{pay.dueDate}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">{pay.paymentMethod}</td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant={
                            pay.status === 'Paid'
                              ? 'success'
                              : pay.status === 'Overdue'
                              ? 'danger'
                              : 'warning'
                          }
                          size="xs"
                        >
                          {pay.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                        {pay.status !== 'Paid' ? (
                          <>
                            <button
                              onClick={() =>
                                updatePayment(pay.id, {
                                  status: 'Paid',
                                  paidAt: new Date().toISOString()
                                })
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                            >
                              Mark as Paid
                            </button>
                            <button
                              onClick={() => setReminderPayment(pay)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                              title="Send Reminder Email"
                            >
                              Reminder
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-emerald-400 font-semibold">
                            Paid {pay.paidAt ? new Date(pay.paidAt).toLocaleDateString() : ''}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Invoice / Payment Milestone"
        subtitle="Track deposits, final balances, or monthly retainer billing."
        maxWidth="xl"
      >
        <form onSubmit={handleCreatePayment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Client <span className="text-rose-400">*</span>
              </label>
              <select
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Associated Project (Optional)
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
              >
                <option value="">No Project (General Invoice / Retainer)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Amount ({settings.currencySymbol}) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Invoice Reference #
              </label>
              <input
                type="text"
                value={invoiceReference}
                onChange={(e) => setInvoiceReference(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Stripe">Stripe</option>
                <option value="PayPal">PayPal</option>
                <option value="Wise">Wise</option>
                <option value="Crypto">Crypto</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-950/30"
            >
              Save Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Payment Reminder Script Modal */}
      <Modal
        isOpen={!!reminderPayment}
        onClose={() => setReminderPayment(null)}
        title="Payment Reminder Email Script"
        subtitle="Pre-written professional follow-up template."
        maxWidth="lg"
      >
        {reminderPayment && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap">
              {getReminderEmail(reminderPayment)}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getReminderEmail(reminderPayment));
                  setCopiedReminder(true);
                  setTimeout(() => setCopiedReminder(false), 2000);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-950/30"
              >
                {copiedReminder ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Reminder Script</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
