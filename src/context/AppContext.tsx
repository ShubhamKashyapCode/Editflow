import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Client,
  Project,
  Task,
  LeadQualification,
  ClientBrief,
  Proposal,
  Payment,
  Revision,
  ProjectAsset,
  DeliveryChecklist,
  RetainerOpportunity,
  EmailTemplate,
  UserSettings,
  ProjectStage,
  WORKFLOW_STAGES,
  ProjectWorkflowStageState,
  BackupData
} from '../types';
import {
  getSettings,
  saveSettings,
  getAllFromStore,
  putToStore,
  deleteFromStore,
  ensureTemplates,
  exportAllData,
  importAllData,
  resetAllData,
  seedDemoData,
  clearAllContentData,
  DEFAULT_SETTINGS
} from '../db/indexedDB';
import { DEFAULT_TEMPLATES } from '../data/defaultTemplates';

export type NavigationTab =
  | 'dashboard'
  | 'clients'
  | 'projects'
  | 'project-detail'
  | 'tasks'
  | 'calendar'
  | 'qualification'
  | 'briefs'
  | 'proposals'
  | 'payments'
  | 'revisions'
  | 'assets'
  | 'delivery'
  | 'retainers'
  | 'templates'
  | 'ai-assistant'
  | 'reports'
  | 'settings';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  // Navigation
  currentView: NavigationTab;
  setCurrentView: (view: NavigationTab) => void;
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  activeClientId: string | null;
  setActiveClientId: (id: string | null) => void;
  navigateToProjectDetail: (projectId: string) => void;
  navigateToClientDetail: (clientId: string) => void;

  // Settings & Status
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  completeOnboarding: (setupData: Partial<UserSettings>) => Promise<void>;
  isLoading: boolean;

  // Data Collections
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  leads: LeadQualification[];
  briefs: ClientBrief[];
  proposals: Proposal[];
  payments: Payment[];
  revisions: Revision[];
  assets: ProjectAsset[];
  deliveries: DeliveryChecklist[];
  retainers: RetainerOpportunity[];
  templates: EmailTemplate[];

  // CRUD Actions
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'lastActivity'>) => Promise<Client>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;

  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'stages'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  advanceProjectStage: (projectId: string, targetStage: ProjectStage) => Promise<void>;
  toggleProjectStage: (projectId: string, stage: ProjectStage) => Promise<void>;

  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;

  addLead: (lead: Omit<LeadQualification, 'id' | 'createdAt'>) => Promise<LeadQualification>;
  updateLead: (id: string, updates: Partial<LeadQualification>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  convertLeadToClient: (leadId: string) => Promise<Client>;
  convertLeadToProject: (leadId: string) => Promise<{ client: Client; project: Project }>;

  saveBrief: (brief: ClientBrief) => Promise<void>;
  getBriefForProject: (projectId: string) => ClientBrief | undefined;

  addProposal: (proposal: Omit<Proposal, 'id' | 'createdAt'>) => Promise<Proposal>;
  updateProposal: (id: string, updates: Partial<Proposal>) => Promise<void>;
  deleteProposal: (id: string) => Promise<void>;
  duplicateProposal: (proposalId: string) => Promise<Proposal>;
  markProposalStatus: (id: string, status: Proposal['status']) => Promise<void>;

  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => Promise<Payment>;
  updatePayment: (id: string, updates: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  markPaymentPaid: (id: string) => Promise<void>;

  addRevision: (revision: Omit<Revision, 'id'>) => Promise<Revision>;
  updateRevision: (id: string, updates: Partial<Revision>) => Promise<void>;
  deleteRevision: (id: string) => Promise<void>;

  addAsset: (asset: Omit<ProjectAsset, 'id' | 'createdAt'>) => Promise<ProjectAsset>;
  updateAsset: (id: string, updates: Partial<ProjectAsset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;

  saveDeliveryChecklist: (delivery: DeliveryChecklist) => Promise<void>;
  getDeliveryForProject: (projectId: string) => DeliveryChecklist | undefined;
  markProjectDelivered: (projectId: string) => Promise<void>;

  addRetainer: (retainer: Omit<RetainerOpportunity, 'id'>) => Promise<RetainerOpportunity>;
  updateRetainer: (id: string, updates: Partial<RetainerOpportunity>) => Promise<void>;
  deleteRetainer: (id: string) => Promise<void>;

  addTemplate: (template: Omit<EmailTemplate, 'id'>) => Promise<EmailTemplate>;
  updateTemplate: (id: string, updates: Partial<EmailTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  resetTemplates: () => Promise<void>;

  // Backup & Storage Management
  exportBackup: () => Promise<void>;
  importBackup: (backup: BackupData) => Promise<void>;
  resetDatabase: () => Promise<void>;
  loadDemo: () => Promise<void>;
  clearDemo: () => Promise<void>;

  // Toast
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<NavigationTab>('dashboard');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);

  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<LeadQualification[]>([]);
  const [briefs, setBriefs] = useState<ClientBrief[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [assets, setAssets] = useState<ProjectAsset[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryChecklist[]>([]);
  const [retainers, setRetainers] = useState<RetainerOpportunity[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, message?: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Initial Load from IndexedDB
  const refreshAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [
        loadedSettings,
        loadedClients,
        loadedProjects,
        loadedTasks,
        loadedLeads,
        loadedBriefs,
        loadedProposals,
        loadedPayments,
        loadedRevisions,
        loadedAssets,
        loadedDeliveries,
        loadedRetainers,
        loadedTemplates
      ] = await Promise.all([
        getSettings(),
        getAllFromStore<Client>('clients'),
        getAllFromStore<Project>('projects'),
        getAllFromStore<Task>('tasks'),
        getAllFromStore<LeadQualification>('leads'),
        getAllFromStore<ClientBrief>('briefs'),
        getAllFromStore<Proposal>('proposals'),
        getAllFromStore<Payment>('payments'),
        getAllFromStore<Revision>('revisions'),
        getAllFromStore<ProjectAsset>('assets'),
        getAllFromStore<DeliveryChecklist>('deliveries'),
        getAllFromStore<RetainerOpportunity>('retainers'),
        ensureTemplates()
      ]);

      setSettings(loadedSettings);
      setClients(loadedClients);
      setProjects(loadedProjects);
      setTasks(loadedTasks);
      setLeads(loadedLeads);
      setBriefs(loadedBriefs);
      setProposals(loadedProposals);
      setPayments(loadedPayments);
      setRevisions(loadedRevisions);
      setAssets(loadedAssets);
      setDeliveries(loadedDeliveries);
      setRetainers(loadedRetainers);
      setTemplates(loadedTemplates);
    } catch (err) {
      console.error('Failed to load local database:', err);
      showToast('Database Error', 'Could not load local IndexedDB data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Navigation Helpers
  const navigateToProjectDetail = useCallback((projectId: string) => {
    setActiveProjectId(projectId);
    setCurrentView('project-detail');
  }, []);

  const navigateToClientDetail = useCallback((clientId: string) => {
    setActiveClientId(clientId);
    setCurrentView('clients');
  }, []);

  // Settings
  const updateSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    await saveSettings(updated);
    setSettings(updated);
    showToast('Settings Saved', 'Workspace preferences updated');
  }, [settings, showToast]);

  const completeOnboarding = useCallback(async (setupData: Partial<UserSettings>) => {
    const updated: UserSettings = {
      ...settings,
      ...setupData,
      onboardingCompleted: true
    };
    await saveSettings(updated);
    setSettings(updated);
    showToast('Workspace Ready', `Welcome to EDITFLOW OS, ${updated.name || 'Editor'}!`);
  }, [settings, showToast]);

  // Clients CRUD
  const addClient = useCallback(async (data: Omit<Client, 'id' | 'createdAt' | 'lastActivity'>) => {
    const newClient: Client = {
      ...data,
      id: 'cli-' + Date.now(),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    await putToStore('clients', newClient);
    setClients((prev) => [newClient, ...prev]);
    showToast('Client Added', `${newClient.name} was successfully registered.`);
    return newClient;
  }, [showToast]);

  const updateClient = useCallback(async (id: string, updates: Partial<Client>) => {
    const client = clients.find((c) => c.id === id);
    if (!client) return;
    const updated: Client = {
      ...client,
      ...updates,
      lastActivity: new Date().toISOString()
    };
    await putToStore('clients', updated);
    setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
    showToast('Client Updated', 'Client profile updated.');
  }, [clients, showToast]);

  const deleteClient = useCallback(async (id: string) => {
    await deleteFromStore('clients', id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    showToast('Client Deleted', 'Client was removed from local records.');
  }, [showToast]);

  // Projects CRUD
  const addProject = useCallback(async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'stages'>) => {
    const stages: Record<ProjectStage, ProjectWorkflowStageState> = {} as any;
    WORKFLOW_STAGES.forEach((s) => {
      stages[s.id] = {
        stage: s.id,
        isCompleted: s.id === data.status,
        completedAt: s.id === data.status ? new Date().toISOString() : undefined
      };
    });

    const newProject: Project = {
      ...data,
      id: 'prj-' + Date.now(),
      stages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await putToStore('projects', newProject);
    setProjects((prev) => [newProject, ...prev]);

    // Also update client last activity
    if (data.clientId) {
      const client = clients.find((c) => c.id === data.clientId);
      if (client) {
        await putToStore('clients', { ...client, lastActivity: new Date().toISOString() });
        setClients((prev) => prev.map((c) => (c.id === client.id ? { ...c, lastActivity: new Date().toISOString() } : c)));
      }
    }

    showToast('Project Created', `"${newProject.name}" has been started.`);
    return newProject;
  }, [clients, showToast]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    const updated: Project = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await putToStore('projects', updated);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    showToast('Project Updated', 'Project details saved.');
  }, [projects, showToast]);

  const deleteProject = useCallback(async (id: string) => {
    await deleteFromStore('projects', id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProjectId === id) {
      setActiveProjectId(null);
      setCurrentView('projects');
    }
    showToast('Project Deleted', 'Project removed.');
  }, [activeProjectId, showToast]);

  // Workflow Stage advancement
  const advanceProjectStage = useCallback(async (projectId: string, targetStage: ProjectStage) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const stages = { ...project.stages };
    const targetIdx = WORKFLOW_STAGES.findIndex((s) => s.id === targetStage);

    WORKFLOW_STAGES.forEach((s, idx) => {
      if (idx <= targetIdx) {
        stages[s.id] = {
          stage: s.id,
          isCompleted: true,
          completedAt: stages[s.id]?.completedAt || new Date().toISOString()
        };
      }
    });

    const updated: Project = {
      ...project,
      status: targetStage,
      stages,
      updatedAt: new Date().toISOString()
    };

    await putToStore('projects', updated);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));

    // Trigger celebration if reached delivery or testimonial
    if (targetStage === 'delivery' || targetStage === 'testimonial' || targetStage === 'retainer') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    const stageLabel = WORKFLOW_STAGES.find((s) => s.id === targetStage)?.label || targetStage;
    showToast('Workflow Updated', `Project advanced to ${stageLabel}`);
  }, [projects, showToast]);

  const toggleProjectStage = useCallback(async (projectId: string, stage: ProjectStage) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const currentStageState = project.stages[stage];
    const newIsCompleted = !currentStageState?.isCompleted;

    const updatedStages = {
      ...project.stages,
      [stage]: {
        stage,
        isCompleted: newIsCompleted,
        completedAt: newIsCompleted ? new Date().toISOString() : undefined
      }
    };

    // Calculate current active stage based on highest incomplete or current
    let nextActiveStatus = project.status;
    if (newIsCompleted) {
      nextActiveStatus = stage;
      if (stage === 'delivery') {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      }
    }

    const updated: Project = {
      ...project,
      status: nextActiveStatus,
      stages: updatedStages,
      updatedAt: new Date().toISOString()
    };

    await putToStore('projects', updated);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));

    const stageLabel = WORKFLOW_STAGES.find((s) => s.id === stage)?.label || stage;
    showToast(newIsCompleted ? 'Stage Completed' : 'Stage Reopened', `${stageLabel} status updated`);
  }, [projects, showToast]);

  // Tasks CRUD
  const addTask = useCallback(async (data: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...data,
      id: 'tsk-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    await putToStore('tasks', newTask);
    setTasks((prev) => [newTask, ...prev]);
    showToast('Task Created', newTask.title);
    return newTask;
  }, [showToast]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updated: Task = { ...task, ...updates };
    await putToStore('tasks', updated);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    showToast('Task Updated', 'Task saved.');
  }, [tasks, showToast]);

  const deleteTask = useCallback(async (id: string) => {
    await deleteFromStore('tasks', id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task Deleted', 'Task removed.');
  }, [showToast]);

  const toggleTaskStatus = useCallback(async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const nextStatus = task.status === 'Completed' ? 'Todo' : 'Completed';
    const updated: Task = { ...task, status: nextStatus };
    await putToStore('tasks', updated);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    showToast(nextStatus === 'Completed' ? 'Task Completed ✓' : 'Task Reopened', task.title);
  }, [tasks, showToast]);

  // Leads CRUD & Qualification
  const addLead = useCallback(async (data: Omit<LeadQualification, 'id' | 'createdAt'>) => {
    const newLead: LeadQualification = {
      ...data,
      id: 'lead-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    await putToStore('leads', newLead);
    setLeads((prev) => [newLead, ...prev]);
    showToast('Lead Qualified', `${newLead.fullName} - Score: ${newLead.score}/100 (${newLead.decision})`);
    return newLead;
  }, [showToast]);

  const updateLead = useCallback(async (id: string, updates: Partial<LeadQualification>) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    const updated: LeadQualification = { ...lead, ...updates };
    await putToStore('leads', updated);
    setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
    showToast('Lead Updated', 'Qualification record saved.');
  }, [leads, showToast]);

  const deleteLead = useCallback(async (id: string) => {
    await deleteFromStore('leads', id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    showToast('Lead Deleted', 'Lead removed.');
  }, [showToast]);

  const convertLeadToClient = useCallback(async (leadId: string): Promise<Client> => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    const newClient: Client = {
      id: 'cli-' + Date.now(),
      name: lead.fullName,
      company: lead.businessName || `${lead.fullName}'s Channel`,
      email: lead.email,
      website: lead.websiteOrSocial,
      clientType: lead.projectType.includes('Short') ? 'Short-form / TikTok' : 'YouTube Creator',
      leadSource: 'Other',
      status: 'Active',
      budgetRange: `$${lead.budget}`,
      notes: `Converted from Lead Qualification (Score: ${lead.score}/100). Success criteria: ${lead.successCriteria}`,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    await putToStore('clients', newClient);
    setClients((prev) => [newClient, ...prev]);

    // Update lead status
    const updatedLead: LeadQualification = { ...lead, status: 'Converted' };
    await putToStore('leads', updatedLead);
    setLeads((prev) => prev.map((l) => (l.id === leadId ? updatedLead : l)));

    showToast('Lead Converted to Client', `${newClient.name} is now an Active Client!`);
    return newClient;
  }, [leads, showToast]);

  const convertLeadToProject = useCallback(async (leadId: string) => {
    const client = await convertLeadToClient(leadId);
    const lead = leads.find((l) => l.id === leadId)!;

    const project = await addProject({
      clientId: client.id,
      name: `${client.company || client.name} - ${lead.projectType}`,
      projectType: (lead.projectType.includes('Short') ? 'Short-form / Reels / TikTok' : 'YouTube Long-form') as any,
      status: 'brief',
      startDate: new Date().toISOString().split('T')[0],
      firstDraftDeadline: lead.firstDraftDeadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      finalDeadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      projectValue: lead.budget || 1000,
      paymentStatus: 'Pending',
      revisionLimit: 2,
      revisionsUsed: 0,
      assetsStatus: lead.assetsReady === 'Yes' ? 'Received' : 'Incomplete',
      deliveryStatus: 'Pending',
      notes: `Converted from qualified lead. Goal: ${lead.mainGoal}. Reference videos: ${lead.referenceVideos}`
    });

    // Also pre-create a linked brief
    const initialBrief: ClientBrief = {
      id: 'brf-' + Date.now(),
      projectId: project.id,
      clientId: client.id,
      projectName: project.name,
      videoType: lead.projectType,
      numberOfVideos: lead.numberOfVideos || 1,
      targetPlatforms: ['YouTube'],
      finalLength: lead.averageVideoLength || '10-12 mins',
      goal: lead.mainGoal,
      targetAudience: 'Target viewer base',
      coreMessage: 'Core narrative',
      desiredStyle: lead.editingStyle,
      referenceVideos: lead.referenceVideos,
      hook: '',
      cta: '',
      brandGuidelines: '',
      footageLink: '',
      audioDetails: '',
      logosDetails: '',
      brollDetails: '',
      graphicsDetails: '',
      captionsDetails: '',
      assetStatus: lead.assetsReady === 'Yes' ? 'Received' : 'Incomplete',
      firstDraftDeadline: project.firstDraftDeadline,
      finalDeadline: project.finalDeadline,
      approvalPerson: lead.approvalPerson || lead.fullName,
      feedbackMethod: lead.communicationMethod || 'Frame.io',
      revisionExpectations: lead.revisionExpectations || '2 rounds',
      fileFormat: 'MP4',
      resolution: '4K',
      aspectRatio: '16:9',
      deliveryDestination: 'Google Drive',
      mustNotBeChanged: '',
      successCriteria: lead.successCriteria,
      additionalNotes: lead.additionalInfo || '',
      isCompleted: false,
      completionPercentage: 40,
      updatedAt: new Date().toISOString()
    };

    await putToStore('briefs', initialBrief);
    setBriefs((prev) => [initialBrief, ...prev]);

    return { client, project };
  }, [convertLeadToClient, leads, addProject]);

  // Briefs CRUD
  const saveBrief = useCallback(async (brief: ClientBrief) => {
    await putToStore('briefs', brief);
    setBriefs((prev) => {
      const idx = prev.findIndex((b) => b.id === brief.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = brief;
        return next;
      }
      return [brief, ...prev];
    });

    // If marked complete, update project brief stage
    if (brief.isCompleted && brief.projectId) {
      const project = projects.find((p) => p.id === brief.projectId);
      if (project && !project.stages.brief?.isCompleted) {
        await advanceProjectStage(project.id, 'brief');
      }
    }

    showToast('Brief Saved', `Client brief for "${brief.projectName}" saved.`);
  }, [projects, advanceProjectStage, showToast]);

  const getBriefForProject = useCallback((projectId: string) => {
    return briefs.find((b) => b.projectId === projectId);
  }, [briefs]);

  // Proposals CRUD
  const addProposal = useCallback(async (data: Omit<Proposal, 'id' | 'createdAt'>) => {
    const newProposal: Proposal = {
      ...data,
      id: 'prp-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    await putToStore('proposals', newProposal);
    setProposals((prev) => [newProposal, ...prev]);
    showToast('Proposal Created', newProposal.title);
    return newProposal;
  }, [showToast]);

  const updateProposal = useCallback(async (id: string, updates: Partial<Proposal>) => {
    const proposal = proposals.find((p) => p.id === id);
    if (!proposal) return;
    const updated: Proposal = { ...proposal, ...updates };
    await putToStore('proposals', updated);
    setProposals((prev) => prev.map((p) => (p.id === id ? updated : p)));
    showToast('Proposal Saved', 'Proposal updated.');
  }, [proposals, showToast]);

  const deleteProposal = useCallback(async (id: string) => {
    await deleteFromStore('proposals', id);
    setProposals((prev) => prev.filter((p) => p.id !== id));
    showToast('Proposal Deleted', 'Proposal removed.');
  }, [showToast]);

  const duplicateProposal = useCallback(async (proposalId: string) => {
    const source = proposals.find((p) => p.id === proposalId);
    if (!source) throw new Error('Proposal not found');
    const duplicate: Proposal = {
      ...source,
      id: 'prp-' + Date.now(),
      title: `${source.title} (Copy)`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      sentAt: undefined,
      acceptedAt: undefined
    };
    await putToStore('proposals', duplicate);
    setProposals((prev) => [duplicate, ...prev]);
    showToast('Proposal Duplicated', duplicate.title);
    return duplicate;
  }, [proposals, showToast]);

  const markProposalStatus = useCallback(async (id: string, status: Proposal['status']) => {
    const proposal = proposals.find((p) => p.id === id);
    if (!proposal) return;

    const updates: Partial<Proposal> = { status };
    if (status === 'Sent') updates.sentAt = new Date().toISOString();
    if (status === 'Accepted') {
      updates.acceptedAt = new Date().toISOString();
      // If linked to project, move project to payment stage!
      if (proposal.projectId) {
        await advanceProjectStage(proposal.projectId, 'payment');
      }
      confetti({ particleCount: 50, spread: 60 });
    }

    const updated: Proposal = { ...proposal, ...updates };
    await putToStore('proposals', updated);
    setProposals((prev) => prev.map((p) => (p.id === id ? updated : p)));
    showToast('Proposal Status Changed', `Status updated to ${status}`);
  }, [proposals, advanceProjectStage, showToast]);

  // Payments CRUD
  const addPayment = useCallback(async (data: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...data,
      id: 'pay-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    await putToStore('payments', newPayment);
    setPayments((prev) => [newPayment, ...prev]);
    showToast('Payment Logged', `${settings.currencySymbol}${newPayment.amount} (${newPayment.status})`);
    return newPayment;
  }, [settings.currencySymbol, showToast]);

  const updatePayment = useCallback(async (id: string, updates: Partial<Payment>) => {
    const payment = payments.find((p) => p.id === id);
    if (!payment) return;
    const updated: Payment = { ...payment, ...updates };
    await putToStore('payments', updated);
    setPayments((prev) => prev.map((p) => (p.id === id ? updated : p)));
    showToast('Payment Saved', 'Payment entry updated.');
  }, [payments, showToast]);

  const deletePayment = useCallback(async (id: string) => {
    await deleteFromStore('payments', id);
    setPayments((prev) => prev.filter((p) => p.id !== id));
    showToast('Payment Deleted', 'Payment entry removed.');
  }, [showToast]);

  const markPaymentPaid = useCallback(async (id: string) => {
    const payment = payments.find((p) => p.id === id);
    if (!payment) return;
    const updated: Payment = {
      ...payment,
      status: 'Paid',
      paidAt: new Date().toISOString()
    };
    await putToStore('payments', updated);
    setPayments((prev) => prev.map((p) => (p.id === id ? updated : p)));

    // Check project payments
    if (payment.projectId) {
      const project = projects.find((p) => p.id === payment.projectId);
      if (project) {
        await updateProject(project.id, { paymentStatus: 'Paid' });
        if (!project.stages.payment?.isCompleted) {
          await advanceProjectStage(project.id, 'payment');
        }
      }
    }

    confetti({ particleCount: 45, spread: 50, origin: { y: 0.7 } });
    showToast('Payment Received!', `${settings.currencySymbol}${payment.amount} marked as Paid`);
  }, [payments, projects, settings.currencySymbol, updateProject, advanceProjectStage, showToast]);

  // Revisions CRUD
  const addRevision = useCallback(async (data: Omit<Revision, 'id'>) => {
    const newRevision: Revision = {
      ...data,
      id: 'rev-' + Date.now()
    };
    await putToStore('revisions', newRevision);
    setRevisions((prev) => [newRevision, ...prev]);

    // Update project revisions used count
    const project = projects.find((p) => p.id === data.projectId);
    if (project) {
      const updatedUsed = (project.revisionsUsed || 0) + 1;
      await updateProject(project.id, {
        revisionsUsed: updatedUsed,
        status: 'revisions'
      });
    }

    showToast('Revision Logged', `Round #${newRevision.revisionNumber} recorded.`);
    return newRevision;
  }, [projects, updateProject, showToast]);

  const updateRevision = useCallback(async (id: string, updates: Partial<Revision>) => {
    const revision = revisions.find((r) => r.id === id);
    if (!revision) return;
    const updated: Revision = { ...revision, ...updates };
    await putToStore('revisions', updated);
    setRevisions((prev) => prev.map((r) => (r.id === id ? updated : r)));
    showToast('Revision Updated', 'Revision notes saved.');
  }, [revisions, showToast]);

  const deleteRevision = useCallback(async (id: string) => {
    await deleteFromStore('revisions', id);
    setRevisions((prev) => prev.filter((r) => r.id !== id));
    showToast('Revision Deleted', 'Revision entry removed.');
  }, [showToast]);

  // Assets CRUD
  const addAsset = useCallback(async (data: Omit<ProjectAsset, 'id' | 'createdAt'>) => {
    const newAsset: ProjectAsset = {
      ...data,
      id: 'ast-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    await putToStore('assets', newAsset);
    setAssets((prev) => [newAsset, ...prev]);
    showToast('Asset Added', `${newAsset.name} (${newAsset.type})`);
    return newAsset;
  }, [showToast]);

  const updateAsset = useCallback(async (id: string, updates: Partial<ProjectAsset>) => {
    const asset = assets.find((a) => a.id === id);
    if (!asset) return;
    const updated: ProjectAsset = { ...asset, ...updates };
    await putToStore('assets', updated);
    setAssets((prev) => prev.map((a) => (a.id === id ? updated : a)));
    showToast('Asset Updated', 'Asset status saved.');
  }, [assets, showToast]);

  const deleteAsset = useCallback(async (id: string) => {
    await deleteFromStore('assets', id);
    setAssets((prev) => prev.filter((a) => a.id !== id));
    showToast('Asset Deleted', 'Asset removed.');
  }, [showToast]);

  // Delivery Checklist CRUD
  const saveDeliveryChecklist = useCallback(async (delivery: DeliveryChecklist) => {
    await putToStore('deliveries', delivery);
    setDeliveries((prev) => {
      const idx = prev.findIndex((d) => d.id === delivery.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = delivery;
        return next;
      }
      return [delivery, ...prev];
    });
    showToast('Delivery Checklist Saved', 'QC specifications updated.');
  }, [showToast]);

  const getDeliveryForProject = useCallback((projectId: string) => {
    return deliveries.find((d) => d.projectId === projectId);
  }, [deliveries]);

  const markProjectDelivered = useCallback(async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    // Update delivery checklist
    let delivery = deliveries.find((d) => d.projectId === projectId);
    if (!delivery) {
      delivery = {
        id: 'del-' + Date.now(),
        projectId,
        aspectRatioChecked: true,
        resolutionChecked: true,
        audioChecked: true,
        captionsChecked: true,
        spellingChecked: true,
        brandingChecked: true,
        noMissingFramesChecked: true,
        exportSettingsChecked: true,
        finalFileUploaded: true,
        clientApprovalReceived: true,
        deliveredDate: new Date().toISOString()
      };
    } else {
      delivery = {
        ...delivery,
        aspectRatioChecked: true,
        resolutionChecked: true,
        audioChecked: true,
        captionsChecked: true,
        spellingChecked: true,
        brandingChecked: true,
        noMissingFramesChecked: true,
        exportSettingsChecked: true,
        finalFileUploaded: true,
        clientApprovalReceived: true,
        deliveredDate: new Date().toISOString()
      };
    }
    await putToStore('deliveries', delivery);
    setDeliveries((prev) => {
      const idx = prev.findIndex((d) => d.projectId === projectId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = delivery!;
        return next;
      }
      return [delivery!, ...prev];
    });

    // Update project state
    await updateProject(projectId, {
      deliveryStatus: 'Delivered',
      status: 'delivery'
    });
    await advanceProjectStage(projectId, 'delivery');

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    showToast('Master Delivered 🎉', `"${project.name}" marked as Delivered! Ready for testimonial & retainer.`);
  }, [projects, deliveries, updateProject, advanceProjectStage, showToast]);

  // Retainers CRUD
  const addRetainer = useCallback(async (data: Omit<RetainerOpportunity, 'id'>) => {
    const newRetainer: RetainerOpportunity = {
      ...data,
      id: 'ret-' + Date.now()
    };
    await putToStore('retainers', newRetainer);
    setRetainers((prev) => [newRetainer, ...prev]);
    showToast('Retainer Logged', `Suggested ${settings.currencySymbol}${newRetainer.suggestedMonthlyValue}/mo`);
    return newRetainer;
  }, [settings.currencySymbol, showToast]);

  const updateRetainer = useCallback(async (id: string, updates: Partial<RetainerOpportunity>) => {
    const retainer = retainers.find((r) => r.id === id);
    if (!retainer) return;
    const updated: RetainerOpportunity = { ...retainer, ...updates };
    await putToStore('retainers', updated);
    setRetainers((prev) => prev.map((r) => (r.id === id ? updated : r)));
    showToast('Retainer Saved', 'Opportunity updated.');
  }, [retainers, showToast]);

  const deleteRetainer = useCallback(async (id: string) => {
    await deleteFromStore('retainers', id);
    setRetainers((prev) => prev.filter((r) => r.id !== id));
    showToast('Retainer Removed', 'Opportunity deleted.');
  }, [showToast]);

  // Templates CRUD
  const addTemplate = useCallback(async (data: Omit<EmailTemplate, 'id'>) => {
    const newTemplate: EmailTemplate = {
      ...data,
      id: 'tpl-' + Date.now(),
      isCustom: true
    };
    await putToStore('templates', newTemplate);
    setTemplates((prev) => [newTemplate, ...prev]);
    showToast('Template Created', newTemplate.title);
    return newTemplate;
  }, [showToast]);

  const updateTemplate = useCallback(async (id: string, updates: Partial<EmailTemplate>) => {
    const tpl = templates.find((t) => t.id === id);
    if (!tpl) return;
    const updated: EmailTemplate = { ...tpl, ...updates };
    await putToStore('templates', updated);
    setTemplates((prev) => prev.map((t) => (t.id === id ? updated : t)));
    showToast('Template Saved', 'Template updated.');
  }, [templates, showToast]);

  const deleteTemplate = useCallback(async (id: string) => {
    await deleteFromStore('templates', id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    showToast('Template Removed', 'Template deleted.');
  }, [showToast]);

  const resetTemplates = useCallback(async () => {
    await putToStore('templates', DEFAULT_TEMPLATES);
    setTemplates(DEFAULT_TEMPLATES);
    showToast('Templates Reset', 'Restored original video editor template suite.');
  }, [showToast]);

  // Backup & Storage
  const exportBackup = useCallback(async () => {
    try {
      const backup = await exportAllData();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backup, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `EDITFLOW_OS_BACKUP_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Backup Exported', 'Full JSON database downloaded safely.');
    } catch (err) {
      console.error(err);
      showToast('Export Failed', 'Could not compile backup JSON', 'error');
    }
  }, [showToast]);

  const importBackup = useCallback(async (backup: BackupData) => {
    try {
      await importAllData(backup);
      await refreshAllData();
      showToast('Backup Restored', 'All clients, projects, and records successfully imported.');
    } catch (err: any) {
      console.error(err);
      showToast('Import Error', err.message || 'Corrupt or invalid backup file', 'error');
    }
  }, [refreshAllData, showToast]);

  const resetDatabase = useCallback(async () => {
    try {
      await resetAllData();
      await refreshAllData();
      showToast('Database Reset', 'All data cleared. Welcome to a fresh workspace.');
    } catch (err) {
      console.error(err);
      showToast('Reset Failed', 'Could not clear database', 'error');
    }
  }, [refreshAllData, showToast]);

  const loadDemo = useCallback(async () => {
    try {
      await seedDemoData();
      await refreshAllData();
      showToast('Demo Data Loaded', 'Sample video editing clients and projects populated.');
    } catch (err) {
      console.error(err);
      showToast('Demo Load Failed', 'Could not seed sample data', 'error');
    }
  }, [refreshAllData, showToast]);

  const clearDemo = useCallback(async () => {
    try {
      await clearAllContentData();
      await refreshAllData();
      showToast('Data Cleared', 'Workspace emptied.');
    } catch (err) {
      console.error(err);
      showToast('Clear Failed', 'Could not clear data', 'error');
    }
  }, [refreshAllData, showToast]);

  const value = useMemo(
    () => ({
      currentView,
      setCurrentView,
      activeProjectId,
      setActiveProjectId,
      activeClientId,
      setActiveClientId,
      navigateToProjectDetail,
      navigateToClientDetail,
      settings,
      updateSettings,
      completeOnboarding,
      isLoading,
      clients,
      projects,
      tasks,
      leads,
      briefs,
      proposals,
      payments,
      revisions,
      assets,
      deliveries,
      retainers,
      templates,
      addClient,
      updateClient,
      deleteClient,
      addProject,
      updateProject,
      deleteProject,
      advanceProjectStage,
      toggleProjectStage,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      addLead,
      updateLead,
      deleteLead,
      convertLeadToClient,
      convertLeadToProject,
      saveBrief,
      getBriefForProject,
      addProposal,
      updateProposal,
      deleteProposal,
      duplicateProposal,
      markProposalStatus,
      addPayment,
      updatePayment,
      deletePayment,
      markPaymentPaid,
      addRevision,
      updateRevision,
      deleteRevision,
      addAsset,
      updateAsset,
      deleteAsset,
      saveDeliveryChecklist,
      getDeliveryForProject,
      markProjectDelivered,
      addRetainer,
      updateRetainer,
      deleteRetainer,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      resetTemplates,
      exportBackup,
      importBackup,
      resetDatabase,
      loadDemo,
      clearDemo,
      toasts,
      showToast,
      removeToast
    }),
    [
      currentView,
      activeProjectId,
      activeClientId,
      navigateToProjectDetail,
      navigateToClientDetail,
      settings,
      updateSettings,
      completeOnboarding,
      isLoading,
      clients,
      projects,
      tasks,
      leads,
      briefs,
      proposals,
      payments,
      revisions,
      assets,
      deliveries,
      retainers,
      templates,
      addClient,
      updateClient,
      deleteClient,
      addProject,
      updateProject,
      deleteProject,
      advanceProjectStage,
      toggleProjectStage,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      addLead,
      updateLead,
      deleteLead,
      convertLeadToClient,
      convertLeadToProject,
      saveBrief,
      getBriefForProject,
      addProposal,
      updateProposal,
      deleteProposal,
      duplicateProposal,
      markProposalStatus,
      addPayment,
      updatePayment,
      deletePayment,
      markPaymentPaid,
      addRevision,
      updateRevision,
      deleteRevision,
      addAsset,
      updateAsset,
      deleteAsset,
      saveDeliveryChecklist,
      getDeliveryForProject,
      markProjectDelivered,
      addRetainer,
      updateRetainer,
      deleteRetainer,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      resetTemplates,
      exportBackup,
      importBackup,
      resetDatabase,
      loadDemo,
      clearDemo,
      toasts,
      showToast,
      removeToast
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
