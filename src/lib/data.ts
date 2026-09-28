// Central content model for the site - sourced from Kumail's resume and
// project history. Keeping this in one place means every section (hero,
// work grid, experience timeline, footer) reads from the same source of
// truth instead of duplicating copy.

export const profile = {
  name: "Syed Kumail Rizvi",
  shortName: "Kumail",
  role: "Software Engineer",
  focus: "Full-stack systems, AI-integrated products, and the infra underneath them",
  location: "Bothell, WA",
  email: "kumailrizvi890@gmail.com",
  phone: "(425) 364-2649",
  github: "https://github.com/kumailrizvi890",
  linkedin: "https://linkedin.com/in/syedkumailrizvi",
  graduation: "December 2027",
  school: "University of Washington, Bothell",
  degree: "B.S. Computer Science, Software Engineering",
  gpa: "3.60",
};

export const heroCopy = {
  eyebrow: "Software Engineer, class of 2027",
  headline: "I build systems, then I make you watch them run.",
  subtext:
    "Full-stack engineer shipping AI-integrated products end to end. Every project below is live, not a screenshot.",
};

export type Skill = {
  category: string;
  items: string[];
};

export const skills: Skill[] = [
  {
    category: "Languages",
    items: ["Python", "Java", "Go", "C++", "TypeScript", "JavaScript", "SQL"],
  },
  {
    category: "Frameworks",
    items: ["React", "Next.js", "Tailwind CSS", "Pygame"],
  },
  {
    category: "Infra & platforms",
    items: [
      "Git",
      "REST APIs",
      "OAuth / SSO",
      "Distributed systems",
      "Azure",
      "Vercel",
      "Supabase",
      "Docker",
    ],
  },
  {
    category: "AI / ML",
    items: [
      "LLM integration",
      "OpenAI API",
      "Gemini API",
      "Retrieval-Augmented Generation",
      "Text-to-Speech APIs",
      "MCP tool orchestration",
    ],
  },
];

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  award?: string;
  demoHref?: string;
  repoHref?: string;
  size: "lg" | "md" | "sm";
  accentStatus?: "ok" | "warn" | "down";
};

export const projects: Project[] = [
  {
    slug: "cluster-pulse",
    name: "Cluster Pulse",
    tagline: "Go microservice for fleet health & rollout risk",
    description:
      "A small Go service that simulates a fleet of production clusters, exposes Prometheus-style health and latency metrics over its own API, and scores deployment risk the way a platform team would before a rollout. Built to speak the same language as the infra teams I want to join.",
    tech: ["Go", "REST", "Vercel Functions", "Observability"],
    demoHref: "/demos/cluster-pulse",
    repoHref: "https://github.com/kumailrizvi890/portfolio/tree/main/api",
    size: "lg",
    accentStatus: "ok",
  },
  {
    slug: "qmail",
    name: "Qmail",
    tagline: "AI scam-detection email client",
    description:
      "An Apple-inspired PWA that classifies incoming mail for scam intent using an LLM, with Replit OAuth login and message storage seeded by Azure Quantum RNG. Placed 5th at WSU Hackathon 2025.",
    tech: ["React", "TypeScript", "Tailwind", "OpenAI API", "OAuth"],
    award: "5th Place, WSU Hackathon 2025",
    demoHref: "/demos/qmail",
    repoHref: "https://github.com/kumailrizvi890/qmail",
    size: "md",
  },
  {
    slug: "pawpass",
    name: "PawPass",
    tagline: "Shelter & foster coordination, offline-first",
    description:
      "An offline-capable PWA for animal shelters: pet profiles, care logs, shift checklists, emergency alerts, and a RAG chatbot grounded in the shelter's own pet-records database.",
    tech: ["Gemini API", "RAG", "Offline-first PWA"],
    demoHref: "/demos/pawpass",
    repoHref: "https://github.com/kumailrizvi890/PawPass",
    size: "md",
  },
  {
    slug: "workflow-automation",
    name: "Ops Automation",
    tagline: "Multi-agent workflow platform on Claude + MCP",
    description:
      "A personal operations platform: 10+ MCP tools (Notion, Gmail, job-search and CRM APIs) wired into scheduled workflows, feeding live dashboards that replaced manual tracking across job search and business operations.",
    tech: ["Claude", "MCP", "Python", "Scheduled workflows"],
    demoHref: "/demos/workflow-automation",
    repoHref: "https://github.com/kumailrizvi890/Auto-Intern",
    size: "sm",
  },
  {
    slug: "up2date",
    name: "UP2DATE",
    tagline: "Internship-window predictor",
    description:
      "Predicts internship posting windows from historical data so applicants stop missing deadlines, plus AI-driven resume and cover-letter keyword optimization. Originated the idea and led a 4-person team at DubHacks.",
    tech: ["AI APIs", "Historical modeling", "Team lead"],
    demoHref: "/demos/up2date",
    size: "sm",
  },
];

export type ExperienceItem = {
  org: string;
  role: string;
  period: string;
  detail: string;
};

export const workExperience: ExperienceItem[] = [
  {
    org: "Marvin Windows",
    role: "Brand Ambassador",
    period: "Feb 2026 - Sep 2026",
    detail:
      "Drove in-store sales for home window replacement by engaging walk-up customers, explaining product value, and converting interest into qualified leads and appointments, closing an average of 8 deals worth $400,000 in sales every week.",
  },
  {
    org: "Instacart, Caper Carts",
    role: "Brand Ambassador",
    period: "Jul 2024 - Oct 2024",
    detail:
      "Supported the launch of Instacart's AI-powered Caper Carts, driving a 25% increase in customer engagement across 500+ product implementations.",
  },
];

export const leadership: ExperienceItem[] = [
  {
    org: "Pakistan Student Association, UW Bothell",
    role: "Vice President",
    period: "Jul 2023 - Jul 2026",
    detail: "Organized and led 5+ events per academic year, including Iftar gatherings and cricket matches.",
  },
  {
    org: "International Student Society, UW Bothell",
    role: "Vice President",
    period: "Jul 2023 - Jul 2026",
    detail:
      "Partnered with student groups on career and academic programming, including Global Careers CPT/OPT sessions. Founding member, Cricket Club.",
  },
];

export const awards: string[] = [
  "Dean's List, 5 terms (2024-25)",
  "Valedictorian, Top 5%, Henry M. Jackson HS (4.0 GPA)",
  "WA State Honors Award, Top 10%",
  "Cambridge CAIE O-Levels: 7 A*s, 1 A",
];

export const coursework: string[] = [
  "Data Structures & Algorithms I/II",
  "Algorithm Analysis & Design",
  "Software Engineering",
  "Database Systems",
  "Computer Programming I/II",
];
