export type ProjectStage =
  | 'inquiry'
  | 'qualification'
  | 'proposal'
  | 'payment'
  | 'brief'
  | 'assets'
  | 'editing'
  | 'review'
  | 'revisions'
  | 'delivery'
  | 'testimonial'
  | 'retainer';

export const WORKFLOW_STAGES: { id: ProjectStage; label: string; description: string; stepNumber: number }[] = [
  { id: 'inquiry', label: 'Inquiry', description: 'Initial contact and request received', stepNumber: 1 },
  { id: 'qualification', label: 'Qualification', description: 'Assess budget, timeline & fit', stepNumber: 2 },
  { id: 'proposal', label: 'Proposal', description: 'Scope, timeline and quote sent', stepNumber: 3 },
  { id: 'payment', label: 'Payment', description: 'Deposit or upfront payment secured', stepNumber: 4 },
  { id: 'brief', label: 'Client Brief', description: 'Creative direction & specs locked', stepNumber: 5 },
  { id: 'assets', label: 'Assets', description: 'Footage, audio & branding received', stepNumber: 6 },
  { id: 'editing', label: 'Editing', description: 'Active cut and post-production', stepNumber: 7 },
  { id: 'review', label: 'Review', description: 'First draft submitted for client review', stepNumber: 8 },
  { id: 'revisions', label: 'Revisions', description: 'Client feedback and fine-tuning', stepNumber: 9 },
  { id: 'delivery', label: 'Delivery', description: '10-point QC and final master export', stepNumber: 10 },
  { id: 'testimonial', label: 'Testimonial', description: 'Client review and social proof', stepNumber: 11 },
  { id: 'retainer', label: 'Retainer', description: 'Ongoing recurring contract pitch', stepNumber: 12 },
];

export type ClientStatus = 'Lead' | 'Active' | 'Inactive' | 'Past Client';
export type ClientType = 'YouTube Creator' | 'Short-form / TikTok' | 'Agency' | 'Brand / Commercial' | 'Podcast' | 'Course Creator' | 'Corporate' | 'Other';
export type LeadSource = 'Twitter/X' | 'YouTube' | 'Referral' | 'Cold Outreach' | 'Upwork / Freelance' | 'Instagram' | 'Website' | 'Other';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  website?: string;
  clientType: ClientType;
  leadSource: LeadSource;
  status: ClientStatus;
  budgetRange: string;
  notes?: string;
  createdAt: string;
  lastActivity: string;
}

export type ProjectType =
  | 'YouTube Long-form'
  | 'Short-form / Reels / TikTok'
  | 'Commercial / Ad'
  | 'Podcast Video'
  | 'Course / Educational'
  | 'Documentary'
  | 'Corporate Video'
  | 'Music Video'
  | 'Gaming Montage'
  | 'Other';

export type PaymentStatus = 'Pending' | 'Partial' | 'Paid' | 'Overdue';
export type AssetsStatus = 'Missing' | 'Incomplete' | 'Received' | 'Approved';
export type DeliveryStatus = 'Pending' | 'In Progress' | 'Delivered';

export interface ProjectWorkflowStageState {
  stage: ProjectStage;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  projectType: ProjectType;
  status: ProjectStage;
  stage?: ProjectStage;
  startDate: string;
  firstDraftDeadline: string;
  finalDeadline: string;
  projectValue: number;
  price?: number;
  paymentStatus: PaymentStatus;
  revisionLimit: number;
  revisionsUsed: number;
  assetsStatus: AssetsStatus;
  deliveryStatus: DeliveryStatus;
  notes?: string;
  stages: Record<ProjectStage, ProjectWorkflowStageState>;
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Todo' | 'Pending' | 'In Progress' | 'Completed';
export type TaskCategory =
  | 'Rough Cut'
  | 'Sound Design'
  | 'Color Grading'
  | 'Motion Graphics'
  | 'Subtitles'
  | 'Export'
  | 'Feedback'
  | 'Communication'
  | 'Admin'
  | 'Other';

export interface Task {
  id: string;
  title: string;
  projectId?: string;
  clientId?: string;
  category?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  notes?: string;
  createdAt: string;
}

export type QualificationDecision = 'HIGH PRIORITY' | 'REVIEW' | 'CAUTION' | 'HIGH RISK';
export type LeadScore = 'High Value Lead' | 'Normal Lead' | 'Low Value / Red Flag';

export interface LeadQualification {
  id: string;
  fullName?: string;
  businessName?: string;
  email?: string;
  clientName?: string;
  clientEmail?: string;
  websiteOrSocial?: string;
  projectType?: string;
  videoType?: string;
  numberOfVideos?: number;
  averageVideoLength?: string;
  targetLength?: string;
  rawFootageLength?: string;
  frequency?: string;
  timeline?: string;
  mainGoal?: string;
  editingStyle?: string;
  referenceVideos?: string;
  referenceVideo?: string;
  firstDraftDeadline?: string;
  budget: any;
  assetsReady?: 'Yes' | 'Partially' | 'No';
  approvalPerson?: string;
  revisionExpectations?: string;
  communicationMethod?: string;
  previousEditorExperience?: 'Positive' | 'Neutral' | 'Negative' | 'First Time Hiring';
  successCriteria?: string;
  additionalInfo?: string;
  score: any;
  redFlags?: string;
  decision?: QualificationDecision;
  reasons?: string[];
  recommendedAction?: string;
  status: 'New' | 'Qualified' | 'Converted' | 'Accepted' | 'Declined' | 'Archived';
  createdAt: string;
}

export type AspectRatio =
  | '16:9 (Landscape)'
  | '9:16 (Vertical)'
  | '1:1 (Square)'
  | '4:5 (Portrait)';

export interface ClientBrief {
  id: string;
  projectId: string;
  clientId?: string;
  projectName?: string;
  videoType?: string;
  numberOfVideos?: number;
  targetPlatforms?: string[];
  finalLength?: string;
  targetDuration?: string;
  goal?: string;
  projectGoal?: string;
  targetAudience: string;
  coreMessage?: string;
  desiredStyle?: string;
  videoStyle?: string;
  referenceVideos?: string;
  referenceLinks?: string[];
  hook?: string;
  hookDescription?: string;
  cta?: string;
  callToAction?: string;
  brandGuidelines?: string;
  brandAssets?: string;
  footageLink?: string;
  audioDetails?: string;
  musicPreferences?: string;
  logosDetails?: string;
  brollDetails?: string;
  graphicsDetails?: string;
  captionsDetails?: string;
  assetStatus?: AssetsStatus;
  firstDraftDeadline?: string;
  finalDeadline?: string;
  approvalPerson?: string;
  feedbackMethod?: string;
  revisionExpectations?: string;
  fileFormat?: string;
  resolution?: string;
  aspectRatio: string;
  deliveryDestination?: string;
  mustNotBeChanged?: string;
  successCriteria?: string;
  additionalNotes?: string;
  isCompleted?: boolean;
  completionPercentage?: number;
  updatedAt?: string;
}

export type ProposalStatus = 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Declined' | 'Expired';

export interface ProposalTier {
  name: string;
  price: number;
  turnaround: string;
  features: string[];
}

export interface Proposal {
  id: string;
  clientId: string;
  projectId?: string;
  title: string;
  scope?: string;
  scopeOfWork?: string;
  deliverables: string[];
  numberOfVideos?: number;
  timeline: string;
  revisionLimit?: number;
  revisionPolicy?: string;
  price?: number;
  tiers?: ProposalTier[];
  paymentTerms: string;
  expirationDate?: string;
  additionalTerms?: string;
  termsAndConditions?: string;
  status: ProposalStatus;
  createdAt: string;
  sentAt?: string;
  acceptedAt?: string;
}

export type PaymentRecordStatus = 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
export type PaymentMethod = 'Bank Transfer' | 'Stripe' | 'PayPal' | 'Wise' | 'Credit Card' | 'Crypto' | 'Other';

export interface Payment {
  id: string;
  projectId?: string;
  clientId: string;
  amount: number;
  dueDate: string;
  status: PaymentRecordStatus;
  paymentMethod: PaymentMethod;
  invoiceReference?: string;
  followUpDate?: string;
  notes?: string;
  paidAt?: string;
  createdAt: string;
}

export type RevisionStatus = 'Requested' | 'In Progress' | 'Completed' | 'Out of Scope';

export interface Revision {
  id: string;
  projectId: string;
  clientId?: string;
  revisionNumber?: number;
  roundNumber?: number;
  requestDate?: string;
  requestedAt?: string;
  summary?: string;
  clientFeedback?: string;
  timestampNotes?: string;
  inScope?: boolean;
  status: RevisionStatus;
  completedDate?: string;
  completedAt?: string;
  editorResponse?: string;
  notes?: string;
}

export type RevisionRound = Revision;

export type AssetType =
  | 'Footage'
  | 'Audio'
  | 'Logo'
  | 'B-Roll'
  | 'Graphics'
  | 'Music'
  | 'Script'
  | 'Reference'
  | 'Other';

export type AssetStatus = 'Missing' | 'Requested' | 'Received' | 'Approved';

export interface ProjectAsset {
  id: string;
  projectId: string;
  clientId?: string;
  name?: string;
  type?: AssetType;
  link?: string;
  driveLink?: string;
  footageReceived?: boolean;
  bRollReceived?: boolean;
  audioReceived?: boolean;
  musicReceived?: boolean;
  sfxReceived?: boolean;
  graphicsReceived?: boolean;
  status?: AssetStatus;
  notes?: string;
  createdAt: string;
}

export type ProjectAssets = ProjectAsset;

export interface DeliveryChecklist {
  id: string;
  projectId: string;
  aspectRatioChecked?: boolean;
  resolutionChecked?: boolean;
  audioChecked?: boolean;
  audioLevelsChecked?: boolean;
  colorGraded?: boolean;
  captionsChecked?: boolean;
  spellingChecked?: boolean;
  brandingChecked?: boolean;
  thumbnailExported?: boolean;
  licensesVerified?: boolean;
  noMissingFramesChecked?: boolean;
  exportSettingsChecked?: boolean;
  exportSettingsVerified?: boolean;
  finalFileUploaded?: boolean;
  finalExportLink?: string;
  clientApprovalReceived?: boolean;
  deliveredDate?: string;
  testimonialRequested?: boolean;
  retainerPitched?: boolean;
  notes?: string;
  downloadLink?: string;
}

export type ProjectDelivery = DeliveryChecklist;

export type RetainerPotential = 'High Potential' | 'Medium Potential' | 'Low Potential';
export type RetainerOfferStatus = 'Opportunity' | 'Not Contacted' | 'Contacted' | 'Offer Sent' | 'Pitched' | 'Negotiating' | 'Won' | 'Declined' | 'Lost';

export interface RetainerOpportunity {
  id: string;
  clientId: string;
  projectsCompleted: number;
  totalValue?: number;
  recentActivityDate?: string;
  suggestedMonthlyValue: number;
  videosPerMonth?: number;
  potential?: RetainerPotential;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  offerStatus: RetainerOfferStatus;
  pitchNotes?: string;
  notes?: string;
}

export type TemplateCategory =
  | 'Client Communication'
  | 'Outreach'
  | 'Re-engagement'
  | 'Pricing'
  | 'Proposal'
  | 'Payment'
  | 'Payments'
  | 'Brief'
  | 'Revision'
  | 'Revisions'
  | 'Delivery'
  | 'Testimonial'
  | 'Reviews'
  | 'Referral'
  | 'Referrals'
  | 'Retainer'
  | 'Sales'
  | 'Follow-up';

export interface EmailTemplate {
  id: string;
  title: string;
  category: TemplateCategory | string;
  description: string;
  content?: string;
  subject?: string;
  body?: string;
  isCustom?: boolean;
}

export interface UserSettings {
  name: string;
  businessName: string;
  email: string;
  logoUrl?: string;
  currency: string;
  currencySymbol: string;
  defaultTurnaroundDays?: number;
  defaultRevisionLimit: number;
  hourlyRate?: number;
  dayRate?: number;
  theme: 'Dark' | 'Light' | 'System';
  accentColor: 'indigo' | 'purple' | 'blue' | 'emerald';
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface BackupData {
  version: string;
  exportDate: string;
  data: {
    settings: UserSettings;
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
  };
}
