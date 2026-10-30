/*
  What hangs on the sphere.

  Each entry is one real screenshot from a shipped project, mapped to wherever
  that project actually lives so the sphere is navigation, not decoration. If a
  face has no `href` it is still shown, it just is not clickable.

  Images live in /public/projects as 512px WebP. The originals were 420x280
  JPEGs totalling 1.7MB for faces that never render larger than ~180px; the
  WebP set is 217KB for the same thing. See MOTION-UPGRADE.md.
*/

export type SphereItem = {
  src: string
  label: string
  project: string
  href?: string
}

export const sphereItems: SphereItem[] = [
  // Cluster Pulse, the Go fleet-health service
  { src: '/projects/pulsehub-status.webp', label: 'Fleet status board', project: 'Cluster Pulse', href: '/demos/cluster-pulse' },

  // Qmail, AI scam detection
  { src: '/projects/qmail-dashboard.webp', label: 'Inbox triage', project: 'Qmail', href: '/demos/qmail' },
  { src: '/projects/qmail-scam.webp', label: 'Scam classifier verdict', project: 'Qmail', href: '/demos/qmail' },

  // PawPass, shelter PWA
  { src: '/projects/pawpass-landing.webp', label: 'Landing', project: 'PawPass', href: '/demos/pawpass' },
  { src: '/projects/pawpass-list.webp', label: 'Adoption list', project: 'PawPass', href: '/demos/pawpass' },
  { src: '/projects/pawpass-detail.webp', label: 'Animal detail', project: 'PawPass', href: '/demos/pawpass' },
  { src: '/projects/pawpass-assistant.webp', label: 'Gemini assistant', project: 'PawPass', href: '/demos/pawpass' },

  // Ops Automation
  { src: '/projects/opsauto-overview.webp', label: 'Overview', project: 'Ops Automation', href: '/demos/workflow-automation' },
  { src: '/projects/opsauto-workflows.webp', label: 'Workflow builder', project: 'Ops Automation', href: '/demos/workflow-automation' },
  { src: '/projects/opsauto-schedule.webp', label: 'Schedule', project: 'Ops Automation', href: '/demos/workflow-automation' },
  { src: '/projects/opsauto-activity.webp', label: 'Activity log', project: 'Ops Automation', href: '/demos/workflow-automation' },

  // TradePro, the market agent stack
  { src: '/projects/tradepro-terminal.webp', label: 'Terminal', project: 'TradePro' },
  { src: '/projects/tradepro-agents.webp', label: 'Agent orchestration', project: 'TradePro' },
  { src: '/projects/tradepro-lab.webp', label: 'Strategy lab', project: 'TradePro' },

  // Client and internal dashboards
  { src: '/projects/salescrm-pipeline.webp', label: 'Sales pipeline', project: 'Sales dashboard' },
  { src: '/projects/internships-review.webp', label: 'Application review', project: 'Internships dashboard' },

  // Shipped client sites
  { src: '/projects/easybowls-hero.webp', label: 'Storefront', project: 'Easy Bowls', href: '/demos/easy-bowls/index.html' },
  { src: '/projects/easybowls-admin-login.webp', label: 'Admin', project: 'Easy Bowls', href: '/demos/easy-bowls/admin.html' },
  { src: '/projects/fadekings-hero.webp', label: 'Storefront', project: 'Fade Kings' },
]
