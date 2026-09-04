import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { StageBadge, Badge } from '../common/Badge';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Film,
  CheckSquare,
  CreditCard,
  AlertTriangle
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'first-draft' | 'final-deadline' | 'task' | 'payment';
  color: 'purple' | 'rose' | 'amber' | 'emerald';
  meta?: any;
}

export const CalendarView: React.FC = () => {
  const { projects, tasks, payments, settings, navigateToProjectDetail } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Aggregate all events
  const events: CalendarEvent[] = [];

  // Project First Draft Deadlines
  projects.forEach((p) => {
    if (p.firstDraftDeadline) {
      events.push({
        id: `fd-${p.id}`,
        title: `1st Draft: ${p.name}`,
        date: p.firstDraftDeadline,
        type: 'first-draft',
        color: 'purple',
        meta: p
      });
    }
    if (p.finalDeadline) {
      events.push({
        id: `fin-${p.id}`,
        title: `Final Cut: ${p.name}`,
        date: p.finalDeadline,
        type: 'final-deadline',
        color: 'rose',
        meta: p
      });
    }
  });

  // Tasks
  tasks.forEach((t) => {
    if (t.dueDate) {
      events.push({
        id: `task-${t.id}`,
        title: t.title,
        date: t.dueDate,
        type: 'task',
        color: 'amber',
        meta: t
      });
    }
  });

  // Payments Due
  payments.forEach((pay) => {
    if (pay.dueDate) {
      events.push({
        id: `pay-${pay.id}`,
        title: `${settings.currencySymbol}${pay.amount.toLocaleString()} Due (${pay.invoiceReference || 'Invoice'})`,
        date: pay.dueDate,
        type: 'payment',
        color: 'emerald',
        meta: pay
      });
    }
  });

  // Calendar math
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // Previous month filler days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prevMonthDate = new Date(year, month - 1, d);
    days.push({
      day: d,
      dateStr: prevMonthDate.toISOString().split('T')[0],
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      day: d,
      dateStr,
      isCurrentMonth: true
    });
  }

  // Next month filler days to complete grid
  const remainingCells = 42 - days.length;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonthDate = new Date(year, month + 1, d);
    days.push({
      day: d,
      dateStr: nextMonthDate.toISOString().split('T')[0],
      isCurrentMonth: false
    });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Production Calendar
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Monitor first draft delivery dates, final cut masters, milestones, and invoice due dates.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            1st Draft
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Final Master
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Tasks
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Payments
          </span>
        </div>
      </div>

      {/* Month Navigation Controls */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#111112] border border-[#1F2023]">
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg bg-[#1A1A1C] hover:bg-[#252528] text-slate-400 hover:text-white border border-[#1F2023] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm sm:text-base font-bold text-white px-2">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg bg-[#1A1A1C] hover:bg-[#252528] text-slate-400 hover:text-white border border-[#1F2023] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={goToToday}
          className="px-3 py-1.5 bg-[#1A1A1C] hover:bg-[#252528] text-slate-200 text-xs font-semibold rounded-lg border border-[#1F2023] transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl bg-[#111112] border border-[#1F2023] overflow-hidden">
        {/* Day of week headers */}
        <div className="grid grid-cols-7 border-b border-[#1F2023] bg-[#111112] text-slate-500 text-center py-2.5 text-xs font-semibold uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[#1F2023] text-slate-200">
          {days.map((item, index) => {
            const dayEvents = events.filter((e) => e.date === item.dateStr);
            const isToday = item.dateStr === todayStr;

            return (
              <div
                key={index}
                className={`min-h-[105px] p-2 flex flex-col justify-between transition-colors ${
                  !item.isCurrentMonth
                    ? 'bg-[#0A0A0B]/60 text-slate-600'
                    : isToday
                    ? 'bg-indigo-500/10'
                    : 'bg-[#111112] hover:bg-[#1A1A1C]/50'
                }`}
              >
                {/* Day number */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday
                        ? 'bg-indigo-600 text-white font-bold'
                        : item.isCurrentMonth
                        ? 'text-slate-300'
                        : 'text-slate-600'
                    }`}
                  >
                    {item.day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Day Events Stack */}
                <div className="space-y-1 mt-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                  {dayEvents.slice(0, 3).map((event) => {
                    const colorStyles = {
                      purple: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
                      rose: 'bg-rose-500/10 text-rose-300 border-rose-500/20 font-semibold',
                      amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
                      emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    };

                    return (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`text-[10px] p-1 rounded-md border truncate cursor-pointer transition-colors hover:border-slate-500 ${
                          colorStyles[event.color]
                        }`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <span className="text-[9px] text-slate-500 font-medium block text-center">
                      +{dayEvents.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Event Details"
        subtitle={selectedEvent?.date}
        maxWidth="md"
      >
        {selectedEvent && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-lg bg-[#1A1A1C] border border-[#1F2023] space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Milestone Title
              </span>
              <h4 className="text-sm font-bold text-white">{selectedEvent.title}</h4>
              <p className="text-slate-400">Date: {selectedEvent.date}</p>
            </div>

            {selectedEvent.type.includes('draft') || selectedEvent.type.includes('deadline') ? (
              <button
                onClick={() => {
                  const pId = selectedEvent.meta?.id;
                  setSelectedEvent(null);
                  if (pId) navigateToProjectDetail(pId);
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-center transition-colors shadow-sm"
              >
                Open Project Workspace
              </button>
            ) : null}
          </div>
        )}
      </Modal>
    </div>
  );
};
