import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Plus,
  Search,
  Sparkles,
  Database,
  Film,
  UserPlus,
  CheckSquare
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
  onOpenQuickProject?: () => void;
  onOpenQuickClient?: () => void;
  onOpenQuickTask?: () => void;
  onNewProject?: () => void;
  onNewClient?: () => void;
  onNewTask?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileSidebar,
  onOpenQuickProject,
  onOpenQuickClient,
  onOpenQuickTask,
  onNewProject,
  onNewClient,
  onNewTask
}) => {
  const { currentView, projects, clients, loadDemo, clearDemo } = useApp();
  const [showQuickDropdown, setShowQuickDropdown] = useState(false);

  const handleCreateProject = () => {
    setShowQuickDropdown(false);
    (onOpenQuickProject || onNewProject)?.();
  };

  const handleCreateClient = () => {
    setShowQuickDropdown(false);
    (onOpenQuickClient || onNewClient)?.();
  };

  const handleCreateTask = () => {
    setShowQuickDropdown(false);
    (onOpenQuickTask || onNewTask)?.();
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Overview';
      case 'clients':
        return 'Client Roster';
      case 'projects':
        return 'Projects & Timelines';
      case 'project-detail':
        return 'Project Workspace';
      case 'tasks':
        return 'Action Items & Tasks';
      case 'calendar':
        return 'Production Calendar';
      case 'qualification':
        return 'Lead Qualification';
      case 'briefs':
        return 'Client Briefs';
      case 'proposals':
        return 'Proposals & Quotes';
      case 'payments':
        return 'Payment Tracking';
      case 'revisions':
        return 'Revision Tracker';
      case 'assets':
        return 'Project Assets';
      case 'delivery':
        return 'Quality Control & Delivery';
      case 'retainers':
        return 'Retainer Pipeline';
      case 'templates':
        return 'Template Library';
      case 'ai-assistant':
        return 'AI Assistant';
      case 'reports':
        return 'Performance Analytics';
      case 'settings':
        return 'Studio Settings';
      default:
        return 'Workspace';
    }
  };

  const isDataEmpty = projects.length === 0 && clients.length === 0;

  return (
    <header className="h-16 border-b border-[#1F2023] bg-[#0A0A0B] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A1A1C] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">{getPageTitle()}</h1>
          <span className="hidden sm:inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Desktop V1.0
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Subtle Search Bar */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clients, projects, tasks..."
            className="bg-[#111112] border border-[#1F2023] rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 w-52 lg:w-64 transition-all"
          />
        </div>

        {/* Demo Data Quick Trigger */}
        {isDataEmpty ? (
          <button
            onClick={loadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all"
            title="Populate realistic sample video projects to test the interface"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Load Sample Data</span>
            <span className="sm:hidden">Sample</span>
          </button>
        ) : (
          <button
            onClick={clearDemo}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-normal text-slate-400 hover:text-slate-200 hover:bg-[#1A1A1C] transition-colors border border-transparent hover:border-[#1F2023]"
            title="Clear all records to start fresh"
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px]">Clear Data</span>
          </button>
        )}

        {/* Quick Add Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowQuickDropdown(!showQuickDropdown)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New</span>
          </button>

          {showQuickDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowQuickDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-[#111112] border border-[#1F2023] rounded-xl shadow-2xl z-50 py-1 divide-y divide-[#1F2023] animate-in fade-in zoom-in-95 duration-100">
                <div className="p-1">
                  <button
                    onClick={handleCreateProject}
                    className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-[#1A1A1C] rounded-lg flex items-center gap-2.5 transition-colors"
                  >
                    <Film className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Create Project</span>
                  </button>
                  <button
                    onClick={handleCreateClient}
                    className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-[#1A1A1C] rounded-lg flex items-center gap-2.5 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Add Client</span>
                  </button>
                  <button
                    onClick={handleCreateTask}
                    className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-[#1A1A1C] rounded-lg flex items-center gap-2.5 transition-colors"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add Task</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
