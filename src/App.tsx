import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/navigation/Sidebar';
import { Header } from './components/common/Header';
import { FirstLaunchModal } from './components/onboarding/FirstLaunchModal';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { ClientsView } from './components/clients/ClientsView';
import { ProjectsView } from './components/projects/ProjectsView';
import { ProjectDetailView } from './components/projects/ProjectDetailView';
import { TasksView } from './components/tasks/TasksView';
import { CalendarView } from './components/calendar/CalendarView';
import { QualificationView } from './components/qualification/QualificationView';
import { BriefsView } from './components/briefs/BriefsView';
import { ProposalsView } from './components/proposals/ProposalsView';
import { PaymentsView } from './components/payments/PaymentsView';
import { RevisionsView } from './components/revisions/RevisionsView';
import { AssetsView } from './components/assets/AssetsView';
import { DeliveryView } from './components/delivery/DeliveryView';
import { RetainersView } from './components/retainers/RetainersView';
import { TemplatesView } from './components/templates/TemplatesView';
import { AIAssistantView } from './components/ai/AIAssistantView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

// Quick Add Modals
import { ClientModal } from './components/clients/ClientModal';
import { ProjectModal } from './components/projects/ProjectModal';
import { TaskModal } from './components/tasks/TaskModal';

const MainLayout: React.FC = () => {
  const {
    currentView,
    selectedProjectId,
    setCurrentView,
    settings,
    updateSettings,
    addClient,
    addProject,
    addTask
  } = useApp();

  const [isQuickClientOpen, setIsQuickClientOpen] = useState(false);
  const [isQuickProjectOpen, setIsQuickProjectOpen] = useState(false);
  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false);

  const handleFinishOnboarding = async (studioName: string, preferredCurrency: string) => {
    let sym = '$';
    if (preferredCurrency === 'EUR') sym = '€';
    else if (preferredCurrency === 'GBP') sym = '£';
    else if (preferredCurrency === 'INR') sym = '₹';

    await updateSettings({
      businessName: studioName || 'My Video Studio',
      currency: preferredCurrency,
      currencySymbol: sym,
      onboardingCompleted: true
    });
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'clients':
        return <ClientsView />;
      case 'projects':
        return <ProjectsView />;
      case 'project-detail':
        return selectedProjectId ? (
          <ProjectDetailView
            projectId={selectedProjectId}
            onBack={() => setCurrentView('projects')}
          />
        ) : (
          <ProjectsView />
        );
      case 'tasks':
        return <TasksView />;
      case 'calendar':
        return <CalendarView />;
      case 'qualification':
        return <QualificationView />;
      case 'briefs':
        return <BriefsView />;
      case 'proposals':
        return <ProposalsView />;
      case 'payments':
        return <PaymentsView />;
      case 'revisions':
        return <RevisionsView />;
      case 'assets':
        return <AssetsView />;
      case 'delivery':
        return <DeliveryView />;
      case 'retainers':
        return <RetainersView />;
      case 'templates':
        return <TemplatesView />;
      case 'ai-assistant':
        return <AIAssistantView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0B] text-slate-200 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Global Top Bar */}
        <Header
          onNewProject={() => setIsQuickProjectOpen(true)}
          onNewClient={() => setIsQuickClientOpen(true)}
          onNewTask={() => setIsQuickTaskOpen(true)}
        />

        {/* Scrollable View Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {renderActiveView()}
        </main>
      </div>

      {/* First Launch Onboarding Tour Modal */}
      {!settings.onboardingCompleted && (
        <FirstLaunchModal onComplete={handleFinishOnboarding} />
      )}

      {/* Quick Add Modals */}
      <ClientModal
        isOpen={isQuickClientOpen}
        onClose={() => setIsQuickClientOpen(false)}
        onSave={addClient}
      />

      <ProjectModal
        isOpen={isQuickProjectOpen}
        onClose={() => setIsQuickProjectOpen(false)}
        onSave={addProject}
      />

      <TaskModal
        isOpen={isQuickTaskOpen}
        onClose={() => setIsQuickTaskOpen(false)}
        onSave={addTask}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
