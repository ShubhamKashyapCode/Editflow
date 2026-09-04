import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Film,
  CheckSquare,
  Calendar,
  UserCheck,
  FileText,
  ScrollText,
  CreditCard,
  History,
  HardDrive,
  PackageCheck,
  Sparkles,
  Bookmark,
  Bot,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
  category: 'main' | 'workflow' | 'tools';
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const { currentView, setCurrentView, projects, tasks, payments, leads, settings } = useApp();

  // Calculate live badge counts
  const activeProjectsCount = projects.filter((p) => p.status !== 'retainer').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const pendingPaymentsCount = payments.filter((p) => p.status === 'Pending' || p.status === 'Overdue').length;
  const newLeadsCount = leads.filter((l) => l.status === 'New').length;

  const navItems: NavItem[] = [
    // Main Menu
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'main' },
    { id: 'clients', label: 'Clients', icon: Users, category: 'main' },
    { id: 'projects', label: 'Projects', icon: Film, badge: activeProjectsCount > 0 ? activeProjectsCount : undefined, badgeColor: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20', category: 'main' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined, badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/20', category: 'main' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, category: 'main' },
    
    // Workflow
    { id: 'qualification', label: 'Qualification', icon: UserCheck, badge: newLeadsCount > 0 ? newLeadsCount : undefined, badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20', category: 'workflow' },
    { id: 'briefs', label: 'Briefs', icon: FileText, category: 'workflow' },
    { id: 'proposals', label: 'Proposals', icon: ScrollText, category: 'workflow' },
    { id: 'payments', label: 'Payments', icon: CreditCard, badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined, badgeColor: 'bg-rose-500/15 text-rose-400 border border-rose-500/20', category: 'workflow' },
    { id: 'revisions', label: 'Revisions', icon: History, category: 'workflow' },
    { id: 'assets', label: 'Assets', icon: HardDrive, category: 'workflow' },
    { id: 'delivery', label: 'Delivery', icon: PackageCheck, category: 'workflow' },
    { id: 'retainers', label: 'Retainers', icon: Sparkles, category: 'workflow' },

    // Tools & Settings
    { id: 'templates', label: 'Templates', icon: Bookmark, category: 'tools' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, category: 'tools' },
    { id: 'reports', label: 'Reports', icon: BarChart3, category: 'tools' },
    { id: 'settings', label: 'Settings', icon: Settings, category: 'tools' }
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setCurrentView(tab);
    onCloseMobile();
  };

  const renderSection = (category: 'main' | 'workflow' | 'tools', title: string) => {
    const items = navItems.filter((i) => i.category === category);

    return (
      <div className="space-y-0.5">
        {!isCollapsed && (
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-3 py-2">
            {title}
          </div>
        )}
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'projects' && currentView === 'project-detail');

          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs sm:text-sm transition-all group relative ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                  : 'text-slate-400 hover:bg-[#1A1A1C] hover:text-white font-normal'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'
                }`}
              />

              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!isCollapsed && item.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${item.badgeColor || 'bg-[#1A1A1C] text-slate-400'}`}>
                  {item.badge}
                </span>
              )}

              {isCollapsed && item.badge !== undefined && (
                <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#111112]" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Persistent Elegant Dark Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-[#111112] border-r border-[#1F2023] flex flex-col shrink-0 transition-all duration-300 ease-in-out select-none ${
          isCollapsed ? 'w-20' : 'w-60'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-[#1F2023] flex items-center justify-between px-4 sm:px-5 shrink-0">
          <div
            className="flex items-center gap-3 overflow-hidden cursor-pointer"
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0 shadow-md shadow-indigo-950/40">
              <div className="w-4 h-4 border-2 border-white/90 rounded-sm rotate-45" />
            </div>

            {!isCollapsed && (
              <span className="font-bold text-base tracking-tight text-white truncate">
                EDITFLOW OS
              </span>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A1A1C]"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-[#1A1A1C] transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Items grouped into Main Menu, Workflow, Tools */}
        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto custom-scrollbar">
          {renderSection('main', 'Main Menu')}
          {renderSection('workflow', 'Workflow')}
          {renderSection('tools', 'Tools & Settings')}
        </nav>

        {/* Bottom Profile / Workspace */}
        <div className="p-3 border-t border-[#1F2023] shrink-0 bg-[#111112]">
          <div
            onClick={() => handleNavClick('settings')}
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-[#1A1A1C] cursor-pointer transition-colors ${
              isCollapsed ? 'justify-center p-1' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-[#1F2023] overflow-hidden">
              <span className="text-indigo-400 font-extrabold text-xs">
                {settings.name ? settings.name.charAt(0).toUpperCase() : 'E'}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">
                  {settings.name || 'Alex Creative'}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {settings.businessName || 'Pro Editor Studio'}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
