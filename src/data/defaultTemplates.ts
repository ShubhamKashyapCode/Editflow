import { EmailTemplate } from '../types';

export const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl-1',
    title: 'First Inquiry / Discovery Call Invite',
    category: 'Client Communication',
    description: 'Polite, professional response to set expectations and qualify the project.',
    content: `Hi [Client Name],

Thanks for reaching out about [Project Name/Video Type]! I reviewed your project details and the style you're aiming for aligns well with my editing pipeline.

Before we dive into production, I want to make sure we're on the same page regarding timelines, footage format, and creative direction.

Could you share:
1. Expected raw footage volume and link (Google Drive / Dropbox / Frame.io)
2. Target delivery deadline for the first cut
3. 1-2 video links that capture your desired pacing and graphical intensity

Looking forward to bringing this cut to life!

Best,
[Your Name]
[Your Business Name]`
  },
  {
    id: 'tpl-2',
    title: 'Professional Proposal & Scope Definition',
    category: 'Proposal',
    description: 'Crisp deliverable scope, turnaround time, payment terms, and revision cap.',
    content: `Hi [Client Name],

Following our discussion, here is the official proposal for [Project Name]:

• Project Scope: [Number of Videos] video edits ([e.g. 10-15 minute YouTube long-form / 60s Shorts])
• Inclusions: Pacing cut, dynamic sound design, color grading, custom text motion graphics, and audio mastering (-14 LUFS)
• Revisions Included: [Revision Limit] rounds of constructive notes within original scope
• First Draft Delivery: [Date]
• Total Investment: [Price]
• Payment Terms: 50% upfront deposit to secure editing queue slot, 50% upon final master approval

To approve and secure your delivery timeline, please reply with "Approved" and I will send the deposit invoice and asset checklist.

Best regards,
[Your Name]`
  },
  {
    id: 'tpl-3',
    title: 'Upfront Deposit & Invoice Request',
    category: 'Payment',
    description: 'Secures editing slot upon payment receipt.',
    content: `Hi [Client Name],

I'm ready to load your footage onto my editing timeline!

Attached is invoice #[Invoice Number] for the [Deposit Amount / 50%] deposit. You can complete this via [Payment Method].

As soon as the payment is confirmed and your assets are unlocked, the project officially enters the active edit queue with first draft scheduled for [First Draft Deadline].

Thank you!
[Your Name]`
  },
  {
    id: 'tpl-4',
    title: 'First Draft Ready for Review (Frame.io / Review link)',
    category: 'Review' as any,
    description: 'Delivery of rough or fine cut with instructions on how to leave timecoded feedback.',
    content: `Hi [Client Name],

First cut of [Project Name] is live and ready for your eyes!

Review Link: [Review / Frame.io Link]

To ensure we hit your final publishing deadline, please leave all notes directly with timecodes or in one consolidated list by [Feedback Deadline].

A quick reminder: this project includes [Revision Limit] rounds of revisions. Let me know what you think of the intro hook and sound design!

Cheers,
[Your Name]`
  },
  {
    id: 'tpl-5',
    title: 'Revision Limit Reached / Out of Scope Request',
    category: 'Revision',
    description: 'Firm yet friendly boundary setting when client requests extensive redesigns or exceeds revision rounds.',
    content: `Hi [Client Name],

Thanks for the updated notes on [Project Name]!

We have successfully completed the [Revision Limit] rounds of included revisions agreed upon in our project scope.

The changes you've noted (specifically: [brief mention, e.g. rebuilding the intro with new b-roll / re-editing the entire second half]) represent an out-of-scope structural change. 

I'd be happy to tackle these for you! Additional editing time for these updates is billed at [Rate per hour or flat $X addon]. 

Let me know if you would like me to add this to the final invoice and proceed, or if we should lock the current master cut for final delivery.

Best,
[Your Name]`
  },
  {
    id: 'tpl-6',
    title: 'Final Master Delivery & Clean Handoff',
    category: 'Delivery',
    description: 'Delivery of final render files, clean backups, and QC validation.',
    content: `Hi [Client Name],

The master cut for [Project Name] is officially complete and verified against our 10-point quality checklist (correct resolution, color space, audio loudness standard, and caption timing).

You can download your master high-bitrate files here:
Master Download Link: [Cloud Link]

Included:
- 4K / 1080p Master MP4 / ProRes
- Clean Video (textless if requested)
- Separate SRT subtitles

It was an absolute pleasure cutting this with you. Best of luck with the release!

Warm regards,
[Your Name]`
  },
  {
    id: 'tpl-7',
    title: 'Video Editor Testimonial & Social Proof Request',
    category: 'Testimonial',
    description: 'Collects high-impact quotes and client satisfaction metrics while the excitement is fresh.',
    content: `Hi [Client Name],

Thrilled to see [Project Name] out in the world!

If you were happy with the speed, communication, and editing quality on this cut, would you mind writing 2-3 quick sentences sharing your experience?

A few prompts to make it effortless:
1. What was your biggest editing bottleneck before we worked together?
2. How did the turnaround time and final edit quality meet your standards?
3. Would you recommend my editing to other creators or brands?

You can reply right here or drop a review link. It helps independent editors like me immensely!

Much appreciated,
[Your Name]`
  },
  {
    id: 'tpl-8',
    title: 'Monthly Retainer Upsell Pitch',
    category: 'Retainer',
    description: 'Pitch predictable monthly editing slots for steady workflow and recurring revenue.',
    content: `Hi [Client Name],

Now that we've dialed in your editing style, pacing, and brand assets across our recent projects, production went significantly smoother and faster.

To guarantee you never have to wait for an available slot in my schedule, I'd love to invite you onto a monthly editing retainer.

Here's how it works:
• [X] Videos per month (YouTube long-form or [Y] short-form vertical cutdowns)
• Guaranteed 48-72 hour turnaround window on raw footage drops
• Priority queue placement (you skip the one-off queue)
• Dedicated cloud backup of all project files and sound libraries
• Fixed monthly rate: [Suggested Monthly Value] (saving ~15% compared to single-project rates)

I only take on 3 retainer creators at a time to maintain high quality. Let me know if you'd like to reserve this spot starting next month!

Best,
[Your Name]`
  },
  {
    id: 'tpl-9',
    title: 'Gentle Invoice Follow-Up / Overdue Nudge',
    category: 'Follow-up',
    description: 'Polite reminder for outstanding invoices without burning bridges.',
    content: `Hi [Client Name],

Just checking in on invoice #[Invoice Number] for [Amount], which was due on [Due Date].

Here is the quick payment link: [Payment Link]

Please let me know if you need another copy of the invoice or if your accounts team needs any vendor details.

Thanks for your prompt attention to this!

Best regards,
[Your Name]`
  }
];
