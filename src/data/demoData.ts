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
  WORKFLOW_STAGES,
  ProjectWorkflowStageState,
  ProjectStage
} from '../types';

export function generateInitialStages(completedUpToStage?: ProjectStage): Record<ProjectStage, ProjectWorkflowStageState> {
  const result = {} as Record<ProjectStage, ProjectWorkflowStageState>;
  const stageIds = WORKFLOW_STAGES.map(s => s.id);
  const targetIndex = completedUpToStage ? stageIds.indexOf(completedUpToStage) : -1;

  stageIds.forEach((id, idx) => {
    const isCompleted = targetIndex >= 0 && idx <= targetIndex;
    result[id] = {
      stage: id,
      isCompleted,
      completedAt: isCompleted ? new Date(Date.now() - (targetIndex - idx) * 86400000 * 2).toISOString() : undefined
    };
  });

  return result;
}

export function createDemoDataset() {
  const now = new Date();
  const dateOffset = (days: number) => new Date(now.getTime() + days * 86400000).toISOString().split('T')[0];

  const clients: Client[] = [
    {
      id: 'cli-1',
      name: 'Alex Rivera',
      company: 'Apex Tech Reviews (850K subs)',
      email: 'alex@apextech.media',
      phone: '+1 (555) 234-8891',
      website: 'youtube.com/@apextech',
      clientType: 'YouTube Creator',
      leadSource: 'Twitter/X',
      status: 'Active',
      budgetRange: '$2,500 - $4,000 / mo',
      notes: 'High volume tech reviewer. Wants fast-paced B-roll matching Marques Brownlee aesthetic. Very prompt communicator.',
      createdAt: dateOffset(-45),
      lastActivity: dateOffset(-1)
    },
    {
      id: 'cli-2',
      name: 'Elena Rostova',
      company: 'Verve Fitness App',
      email: 'elena@vervefit.co',
      phone: '+1 (555) 872-1102',
      website: 'vervefit.co',
      clientType: 'Brand / Commercial',
      leadSource: 'Referral',
      status: 'Active',
      budgetRange: '$4,000 - $6,000 / project',
      notes: 'Series of commercial ad cuts for Meta and TikTok. Strict branding guidelines and color lookup tables.',
      createdAt: dateOffset(-30),
      lastActivity: dateOffset(-2)
    },
    {
      id: 'cli-3',
      name: 'Marcus Vance',
      company: 'The Founder Mindset Podcast',
      email: 'marcus@foundermindset.fm',
      website: 'foundermindset.fm',
      clientType: 'Podcast',
      leadSource: 'Cold Outreach',
      status: 'Lead',
      budgetRange: '$1,500 - $2,500 / mo',
      notes: 'Needs multi-cam podcast cutdowns and vertical Shorts for LinkedIn/TikTok with Alex Hormozi style captions.',
      createdAt: dateOffset(-10),
      lastActivity: dateOffset(-3)
    },
    {
      id: 'cli-4',
      name: 'Sarah Chen',
      company: 'Studio Lumos Design',
      email: 'sarah@studiolumos.com',
      website: 'studiolumos.com',
      clientType: 'Agency',
      leadSource: 'Upwork / Freelance',
      status: 'Active',
      budgetRange: '$3,000 - $5,000',
      notes: 'Agency subcontracting high-end case study videos for SaaS clients.',
      createdAt: dateOffset(-60),
      lastActivity: dateOffset(-5)
    }
  ];

  const projects: Project[] = [
    {
      id: 'prj-1',
      clientId: 'cli-1',
      name: 'M4 Max MacBook Pro Review & Benchmark Cut',
      projectType: 'YouTube Long-form',
      status: 'editing',
      startDate: dateOffset(-8),
      firstDraftDeadline: dateOffset(2),
      finalDeadline: dateOffset(5),
      projectValue: 1200,
      paymentStatus: 'Partial',
      revisionLimit: 2,
      revisionsUsed: 0,
      assetsStatus: 'Approved',
      deliveryStatus: 'In Progress',
      notes: 'A-roll timeline assembly complete. Currently implementing motion graphics benchmarks and audio ducking.',
      stages: generateInitialStages('assets'),
      createdAt: dateOffset(-8),
      updatedAt: dateOffset(-1)
    },
    {
      id: 'prj-2',
      clientId: 'cli-2',
      name: 'Summer Fitness Campaign: 6x Meta Reels & TikToks',
      projectType: 'Short-form / Reels / TikTok',
      status: 'revisions',
      startDate: dateOffset(-15),
      firstDraftDeadline: dateOffset(-4),
      finalDeadline: dateOffset(3),
      projectValue: 2400,
      paymentStatus: 'Partial',
      revisionLimit: 3,
      revisionsUsed: 1,
      assetsStatus: 'Approved',
      deliveryStatus: 'In Progress',
      notes: 'First draft reviewed. Client requested slightly faster hook transition on Ad #3.',
      stages: generateInitialStages('review'),
      createdAt: dateOffset(-15),
      updatedAt: dateOffset(-2)
    },
    {
      id: 'prj-3',
      clientId: 'cli-4',
      name: 'SaaS Platform Launch Video (90s 4K)',
      projectType: 'Commercial / Ad',
      status: 'delivery',
      startDate: dateOffset(-22),
      firstDraftDeadline: dateOffset(-10),
      finalDeadline: dateOffset(1),
      projectValue: 3200,
      paymentStatus: 'Paid',
      revisionLimit: 2,
      revisionsUsed: 2,
      assetsStatus: 'Approved',
      deliveryStatus: 'In Progress',
      notes: 'Revisions finished. Going through final 10-point QC before master upload.',
      stages: generateInitialStages('revisions'),
      createdAt: dateOffset(-22),
      updatedAt: dateOffset(-1)
    }
  ];

  const tasks: Task[] = [
    {
      id: 'tsk-1',
      title: 'Finish B-roll pacing and graph animations for M4 Max cut',
      projectId: 'prj-1',
      clientId: 'cli-1',
      priority: 'High',
      status: 'In Progress',
      dueDate: dateOffset(1),
      notes: 'Check 4K 120fps benchmark footage in timeline bin 03.',
      createdAt: dateOffset(-2)
    },
    {
      id: 'tsk-2',
      title: 'Apply client revision notes to Reel #3 hook and re-export',
      projectId: 'prj-2',
      clientId: 'cli-2',
      priority: 'Urgent',
      status: 'Todo',
      dueDate: dateOffset(0),
      notes: 'Speed ramp the opening kettlebell swing and add sound impact.',
      createdAt: dateOffset(-1)
    },
    {
      id: 'tsk-3',
      title: 'Run 10-point QC checklist on SaaS Platform Launch master',
      projectId: 'prj-3',
      clientId: 'cli-4',
      priority: 'Urgent',
      status: 'In Progress',
      dueDate: dateOffset(0),
      notes: 'Verify audio mastering LUFS and check caption alignment on mobile safe-area.',
      createdAt: dateOffset(-1)
    },
    {
      id: 'tsk-4',
      title: 'Send monthly retainer proposal to Alex Rivera (Apex Tech)',
      projectId: 'prj-1',
      clientId: 'cli-1',
      priority: 'Medium',
      status: 'Todo',
      dueDate: dateOffset(4),
      notes: 'Package 4 long-form tech reviews + 8 YouTube Shorts for $3,200/mo.',
      createdAt: dateOffset(-3)
    }
  ];

  const leads: LeadQualification[] = [
    {
      id: 'lead-1',
      fullName: 'Marcus Vance',
      businessName: 'The Founder Mindset Podcast',
      email: 'marcus@foundermindset.fm',
      websiteOrSocial: 'youtube.com/@foundermindset',
      projectType: 'Podcast Video / Short-form',
      numberOfVideos: 4,
      averageVideoLength: '45-60 minutes + 12 shorts',
      frequency: 'Weekly',
      mainGoal: 'Scale audience on YouTube and capture viral reach with Shorts/Reels',
      editingStyle: 'Dynamic podcast cuts with smooth camera switching, punchy animated captions and subtle cinematic music.',
      referenceVideos: 'https://youtube.com/watch?v=sample1, https://youtube.com/watch?v=sample2',
      firstDraftDeadline: dateOffset(14),
      budget: 2200,
      assetsReady: 'Yes',
      approvalPerson: 'Marcus Vance (Host)',
      revisionExpectations: '1-2 rounds of polish',
      communicationMethod: 'Slack & Frame.io',
      previousEditorExperience: 'Positive',
      successCriteria: 'Consistent turnaround under 72h, zero audio synchronization issues.',
      additionalInfo: 'Looking for a reliable long-term editing partner for the whole upcoming season.',
      score: 92,
      decision: 'HIGH PRIORITY',
      reasons: [
        'Budget matches professional freelance editing rates ($2,200/mo)',
        'Footage and multi-cam audio are already recorded and cloud-synced',
        'Realistic 14-day timeline for first batch',
        'High recurring potential (weekly episodes)'
      ],
      recommendedAction: 'Send formal proposal immediately and schedule a 15-minute alignment call.',
      status: 'New',
      createdAt: dateOffset(-3)
    },
    {
      id: 'lead-2',
      fullName: 'Dave Kowalski',
      businessName: 'Apex Speed Gaming',
      email: 'dave@apexgaming.gg',
      websiteOrSocial: 'tiktok.com/@apexgamer',
      projectType: 'Gaming Montage',
      numberOfVideos: 10,
      averageVideoLength: '15-30s',
      frequency: 'Daily',
      mainGoal: 'Get 100k views',
      editingStyle: 'Lots of 3D effects, beat sync, screen shakes',
      referenceVideos: '',
      firstDraftDeadline: dateOffset(2),
      budget: 150,
      assetsReady: 'No',
      approvalPerson: 'Me and my manager',
      revisionExpectations: 'Unlimited revisions until it goes viral',
      communicationMethod: 'Discord DMs at 2am',
      previousEditorExperience: 'Negative',
      successCriteria: 'Viral video guarantee',
      score: 22,
      decision: 'HIGH RISK',
      reasons: [
        'Budget ($150 for 10 videos) is severely below market standard',
        'Unrealistic turnaround requirement (48 hours)',
        'Unrealistic revision expectations ("unlimited revisions")',
        'No assets prepared yet'
      ],
      recommendedAction: 'Politely decline using Scope/Rate boundary template or require upfront retainer deposit with clear revision cap.',
      status: 'New',
      createdAt: dateOffset(-5)
    }
  ];

  const briefs: ClientBrief[] = [
    {
      id: 'brf-1',
      projectId: 'prj-1',
      clientId: 'cli-1',
      projectName: 'M4 Max MacBook Pro Review & Benchmark Cut',
      videoType: 'YouTube Long-form (Tech)',
      numberOfVideos: 1,
      targetPlatforms: ['YouTube', 'Twitter/X Clip'],
      finalLength: '12-14 minutes',
      goal: 'Educate creators on real render performance gains while maintaining high viewer retention in the first 30 seconds.',
      targetAudience: 'Video editors, 3D artists, hardware enthusiasts, tech early-adopters.',
      coreMessage: 'The M4 Max is genuinely revolutionary for 8K ProRes timelines, but pricing is steep.',
      desiredStyle: 'Clean, modern, crisp transitions, minimal techno soundtrack, high-contrast B-roll lighting.',
      referenceVideos: 'https://youtube.com/watch?v=mkbhd-reference',
      hook: 'Cold open with side-by-side export bar where M4 Max finishes in 8 seconds flat.',
      cta: 'Subscribe and comment on your current editing rig setup.',
      brandGuidelines: 'Apex Tech brand font is Inter/Plus Jakarta. Dark grey background hex #121212.',
      footageLink: 'https://drive.google.com/drive/folders/apex-m4-raw',
      audioDetails: 'Rode Wireless Pro 32-bit float audio file in folder /Audio',
      logosDetails: 'Apex tech animated lower-third in Assets folder',
      brollDetails: '4K ProRes 422 B-roll captured on Sony FX3 in folder /Broll',
      graphicsDetails: 'Benchmark bars need to animate smoothly with subtle audio swoosh',
      captionsDetails: 'Burned-in clean kinetic subtitles during the first 45 seconds hook',
      assetStatus: 'Approved',
      firstDraftDeadline: dateOffset(2),
      finalDeadline: dateOffset(5),
      approvalPerson: 'Alex Rivera',
      feedbackMethod: 'Frame.io markers with timecodes',
      revisionExpectations: '2 rounds max',
      fileFormat: 'MP4 (H.265 Master)',
      resolution: '4K (3840x2160)',
      aspectRatio: '16:9',
      deliveryDestination: 'Google Drive Master Folder',
      mustNotBeChanged: 'Do not color grade the benchmark screen recordings (need true gamma)',
      successCriteria: 'Audience retention above 55% at 5 minutes',
      additionalNotes: 'Alex prefers audio loudness normalized to -14 LUFS integrated.',
      isCompleted: true,
      completionPercentage: 100,
      updatedAt: dateOffset(-1)
    }
  ];

  const proposals: Proposal[] = [
    {
      id: 'prp-1',
      clientId: 'cli-1',
      projectId: 'prj-1',
      title: 'M4 Max In-Depth Hardware Review Master Cut',
      scope: 'Complete post-production for 12-14 minute YouTube tech review, including A-roll pacing, B-roll integration, custom animated benchmark charts, sound design, and color grading.',
      deliverables: [
        '1x Master 4K 60fps YouTube edit (MP4 H.265)',
        '1x 60s Vertical Shorts cutdown for YouTube Shorts & TikTok',
        'Clean audio mix (-14 LUFS) and SRT subtitles'
      ],
      numberOfVideos: 1,
      timeline: 'First draft in 5 days; final master within 48h of revision notes',
      revisionLimit: 2,
      price: 1200,
      paymentTerms: '50% deposit upon kickoff ($600), 50% prior to clean master delivery ($600)',
      expirationDate: dateOffset(10),
      status: 'Accepted',
      createdAt: dateOffset(-12),
      acceptedAt: dateOffset(-10)
    },
    {
      id: 'prp-2',
      clientId: 'cli-3',
      title: 'Monthly Multi-Cam Podcast & Short-Form Package',
      scope: '4x weekly 45-minute podcast episode multi-cam cuts with audio leveling, lower thirds, chapter markers, plus 3 high-impact vertical short clips per episode (12 shorts total).',
      deliverables: [
        '4x Full Episode Multi-cam edits (1080p / 4K)',
        '12x High-retention Vertical Shorts with kinetic captions',
        'Show notes timestamps and YouTube thumbnail freeze-frames'
      ],
      numberOfVideos: 16,
      timeline: '72-hour turnaround for each weekly episode after raw drop',
      revisionLimit: 2,
      price: 2200,
      paymentTerms: '100% upfront monthly retainer on the 1st of each month',
      expirationDate: dateOffset(7),
      status: 'Sent',
      createdAt: dateOffset(-2),
      sentAt: dateOffset(-2)
    }
  ];

  const payments: Payment[] = [
    {
      id: 'pay-1',
      projectId: 'prj-1',
      clientId: 'cli-1',
      amount: 600,
      dueDate: dateOffset(-7),
      status: 'Paid',
      paymentMethod: 'Stripe',
      invoiceReference: 'INV-2026-081',
      paidAt: dateOffset(-7),
      createdAt: dateOffset(-8),
      notes: '50% kickoff deposit paid promptly.'
    },
    {
      id: 'pay-2',
      projectId: 'prj-1',
      clientId: 'cli-1',
      amount: 600,
      dueDate: dateOffset(5),
      status: 'Pending',
      paymentMethod: 'Stripe',
      invoiceReference: 'INV-2026-082',
      createdAt: dateOffset(-8),
      notes: 'Final 50% balance upon delivery.'
    },
    {
      id: 'pay-3',
      projectId: 'prj-2',
      clientId: 'cli-2',
      amount: 1200,
      dueDate: dateOffset(-14),
      status: 'Paid',
      paymentMethod: 'Bank Transfer',
      invoiceReference: 'INV-2026-077',
      paidAt: dateOffset(-14),
      createdAt: dateOffset(-15),
      notes: 'Initial 50% deposit received.'
    },
    {
      id: 'pay-4',
      projectId: 'prj-2',
      clientId: 'cli-2',
      amount: 1200,
      dueDate: dateOffset(3),
      status: 'Pending',
      paymentMethod: 'Bank Transfer',
      invoiceReference: 'INV-2026-078',
      createdAt: dateOffset(-15),
      notes: 'Final milestone upon approval of 6x Reels.'
    },
    {
      id: 'pay-5',
      projectId: 'prj-3',
      clientId: 'cli-4',
      amount: 3200,
      dueDate: dateOffset(-2),
      status: 'Paid',
      paymentMethod: 'Wise',
      invoiceReference: 'INV-2026-070',
      paidAt: dateOffset(-2),
      createdAt: dateOffset(-22),
      notes: 'Full payment received in advance for fast-track turnaround.'
    }
  ];

  const revisions: Revision[] = [
    {
      id: 'rev-1',
      projectId: 'prj-2',
      clientId: 'cli-2',
      revisionNumber: 1,
      requestDate: dateOffset(-3),
      summary: 'Shorten Reel #3 hook from 3.5s to 2.1s and swap background track for higher BPM.',
      inScope: true,
      status: 'In Progress',
      notes: 'Audio track updated with licensed Artlist cut.'
    },
    {
      id: 'rev-2',
      projectId: 'prj-3',
      clientId: 'cli-4',
      revisionNumber: 1,
      requestDate: dateOffset(-12),
      summary: 'Adjust UI highlight zoom speeds on second feature module.',
      inScope: true,
      status: 'Completed',
      completedDate: dateOffset(-11),
      notes: 'Adjusted bezier curves to ease-out.'
    },
    {
      id: 'rev-3',
      projectId: 'prj-3',
      clientId: 'cli-4',
      revisionNumber: 2,
      requestDate: dateOffset(-7),
      summary: 'Swap out final CTA logo animation with new vector SVG.',
      inScope: true,
      status: 'Completed',
      completedDate: dateOffset(-6),
      notes: 'Imported vector and rendered with motion blur.'
    }
  ];

  const assets: ProjectAsset[] = [
    {
      id: 'ast-1',
      projectId: 'prj-1',
      clientId: 'cli-1',
      name: 'Sony FX3 4K S-Log3 Main A-Roll',
      type: 'Footage',
      link: 'https://drive.google.com/drive/folders/apex-m4-raw/aroll',
      status: 'Approved',
      notes: 'Checked and color matched perfectly.',
      createdAt: dateOffset(-8)
    },
    {
      id: 'ast-2',
      projectId: 'prj-1',
      clientId: 'cli-1',
      name: 'M4 Max Cinebench & Premiere Export Screen Recordings',
      type: 'B-Roll',
      link: 'https://drive.google.com/drive/folders/apex-m4-raw/benchmarks',
      status: 'Approved',
      notes: 'Uncompressed 60fps captures.',
      createdAt: dateOffset(-8)
    },
    {
      id: 'ast-3',
      projectId: 'prj-1',
      clientId: 'cli-1',
      name: 'Apex Tech Vector Logo & Channel Lower Thirds',
      type: 'Logo',
      link: 'https://drive.google.com/drive/folders/apex-brand',
      status: 'Approved',
      createdAt: dateOffset(-8)
    },
    {
      id: 'ast-4',
      projectId: 'prj-2',
      clientId: 'cli-2',
      name: 'Verve Fitness 9:16 Workout Footage (Gym Pack)',
      type: 'Footage',
      link: 'https://dropbox.com/sh/verve-footage-raw',
      status: 'Approved',
      createdAt: dateOffset(-15)
    },
    {
      id: 'ast-5',
      projectId: 'prj-2',
      clientId: 'cli-2',
      name: 'Brand Typography & Color Hex Standards',
      type: 'Reference',
      link: 'https://vervefit.co/brand-kit',
      status: 'Approved',
      createdAt: dateOffset(-15)
    }
  ];

  const deliveries: DeliveryChecklist[] = [
    {
      id: 'del-1',
      projectId: 'prj-3',
      aspectRatioChecked: true,
      resolutionChecked: true,
      audioChecked: true,
      captionsChecked: true,
      spellingChecked: true,
      brandingChecked: true,
      noMissingFramesChecked: true,
      exportSettingsChecked: true,
      finalFileUploaded: true,
      clientApprovalReceived: false,
      notes: 'Final 4K master ProRes 422 rendered and uploaded to client Google Drive.',
      downloadLink: 'https://drive.google.com/drive/folders/saas-launch-master-delivery'
    }
  ];

  const retainers: RetainerOpportunity[] = [
    {
      id: 'ret-1',
      clientId: 'cli-1',
      projectsCompleted: 3,
      totalValue: 3600,
      recentActivityDate: dateOffset(-1),
      suggestedMonthlyValue: 2800,
      potential: 'High Potential',
      offerStatus: 'Offer Sent',
      lastContactDate: dateOffset(-3),
      nextFollowUpDate: dateOffset(2),
      notes: 'Alex uploads 2 reviews per week. Pitching dedicated 4-video/mo package at $2,800/mo.'
    },
    {
      id: 'ret-2',
      clientId: 'cli-2',
      projectsCompleted: 2,
      totalValue: 4800,
      recentActivityDate: dateOffset(-2),
      suggestedMonthlyValue: 3500,
      potential: 'High Potential',
      offerStatus: 'Not Contacted',
      nextFollowUpDate: dateOffset(5),
      notes: 'Verve Fitness has monthly marketing budget and needs continuous ad creative iterations.'
    },
    {
      id: 'ret-3',
      clientId: 'cli-4',
      projectsCompleted: 4,
      totalValue: 8400,
      recentActivityDate: dateOffset(-1),
      suggestedMonthlyValue: 4000,
      potential: 'High Potential',
      offerStatus: 'Negotiating',
      lastContactDate: dateOffset(-4),
      nextFollowUpDate: dateOffset(1),
      notes: 'Discussing quarterly contract for 2 agency case study videos per month.'
    }
  ];

  return {
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
    retainers
  };
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tmpl-1',
    title: 'Cold Outreach to YouTubers',
    category: 'Outreach',
    description: 'High-converting email to pitch video editing services to high-growth creators.',
    subject: 'Idea for your next video / quick edit sample for [Channel Name]',
    body: `Hey [Client Name],

Huge fan of your recent breakdown on [Project Name]—the pacing and storytelling were super engaging.

I noticed a couple of spots where punchy sound design and kinetic zoom cuts could elevate audience retention even further during the first 30 seconds.

I went ahead and edited a quick 20-second retention-optimized sample hook for your channel (no strings attached): [Link]

I run an editing studio specialized in high-retention YouTube long-form. Would you be open to testing 1 video together this month to see how your average watch duration responds?

Best,
[Your Name]`
  },
  {
    id: 'tmpl-2',
    title: 'Inactive Client Follow-up',
    category: 'Re-engagement',
    description: 'Check in with former clients to reactivate new video editing projects.',
    subject: 'Catching up + availability for your upcoming videos',
    body: `Hey [Client Name],

Hope everything is going great with [Project Name]! I saw your recent uploads and loved how the content came together.

I'm currently organizing my production schedule for next month and wanted to check in to see if you have any new footage, podcasts, or campaigns in the pipeline?

I have a reserved editing slot opening up and would love to collaborate again.

Let me know what you're working on!

Best,
[Your Name]`
  },
  {
    id: 'tmpl-3',
    title: 'Rate Increase Notification',
    category: 'Pricing',
    description: 'Gracefully announce updated editing rates while preserving existing client relationships.',
    subject: 'Production update & rate adjustment for upcoming projects',
    body: `Hi [Client Name],

I want to thank you for the wonderful partnership we've built over our video projects together. Seeing your channel grow has been truly rewarding!

To maintain our high turnaround speed and invest in higher-end motion design and audio mixing resources, I am updating my standard rates starting on [Date].

Because I value our collaboration, I'm happy to honor our previous rate for all projects booked before that date.

Thank you so much for your continued trust and support!

Warm regards,
[Your Name]`
  },
  {
    id: 'tmpl-4',
    title: 'Scope Creep Pushback',
    category: 'Revisions',
    description: 'Firmly decline or bill for out-of-scope requests while staying professional.',
    subject: 'Additional revisions for [Project Name]',
    body: `Hi [Client Name],

Thanks for sending over this latest list of notes!

As outlined in our project scope agreement, the initial fee included 2 comprehensive revision passes, which we have now completed.

I would be more than happy to carry out these additional creative requests and adjustments. My rate for an additional revision pass is [Amount].

Please let me know if you would like me to invoice that so we can immediately dive into the timeline!

Best,
[Your Name]`
  },
  {
    id: 'tmpl-5',
    title: 'Late Payment Reminder',
    category: 'Payments',
    description: 'Polite but firm follow-up for outstanding or overdue invoices.',
    subject: 'Gentle reminder: Invoice [Invoice Number] for [Project Name]',
    body: `Hi [Client Name],

I hope you're having a productive week!

Just a polite reminder that invoice [Invoice Number] for [Amount], which was due on [Date], is currently pending.

Could you please confirm if this has been submitted to your accounting team or when payment can be expected? 

If you need me to re-send the invoice details or link, please let me know.

Thank you!
[Your Name]`
  },
  {
    id: 'tmpl-6',
    title: 'Retainer Pitch',
    category: 'Sales',
    description: 'Convert successful one-off video clients into guaranteed monthly recurring retainers.',
    subject: 'Guaranteed video turnaround: Monthly editing partnership',
    body: `Hi [Client Name],

Now that we have dialed in your editing style, motion graphics, and audio pacing over our recent cuts, I wanted to propose a monthly arrangement.

Booking project-by-project often creates scheduling delays when availability fills up. To solve this, I can reserve a dedicated monthly editing slot:

Monthly Retainer:
• 4 Polished Long-Form Videos per month
• Guaranteed 72-hour turnaround priority
• All revisions & social short cuts included
• Flat Monthly Investment: [Amount]/month (15% savings over ad-hoc rates)

Let me know if you'd like to reserve this slot starting next week!

Best regards,
[Your Name]`
  },
  {
    id: 'tmpl-7',
    title: 'Testimonial Request',
    category: 'Reviews',
    description: 'Request high-impact portfolio testimonials after successful project delivery.',
    subject: 'Quick question regarding [Project Name]!',
    body: `Hi [Client Name],

I loved working together on [Project Name] and seeing it published!

If you were pleased with the turnaround and the final cut, would you mind sharing a quick 2-sentence testimonial I can feature on my website and portfolio?

Specifically:
1. What was your experience like working together?
2. What did you think of the pacing and final quality?

Thank you so much—it truly helps independent editors like me grow!

Best,
[Your Name]`
  },
  {
    id: 'tmpl-8',
    title: 'Referral Request',
    category: 'Referrals',
    description: 'Ask satisfied creators to refer other YouTuber colleagues and creator friends.',
    subject: 'Quick favor + 15% credit for referrals',
    body: `Hey [Client Name],

Hope the latest video is performing well!

I'm currently opening up 1-2 new client spots this month. Do you know any fellow creators, podcasters, or agency founders who are looking for a reliable, high-retention video editor?

As a thank you, I offer a 15% discount credit on your next project for any creator you introduce who books a project.

Thanks so much for the support!

Best,
[Your Name]`
  }
];

