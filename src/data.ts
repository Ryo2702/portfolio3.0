export type Project = {
  slug: string;
  title: string;
  label: string;
  status: string;
  year: string;
  featured: boolean;
  summary: string;
  problem: string;
  contribution: string;
  delivered: string[];
  technologies: string[];
  demo?: string;
  repository?: string;
};

export type ExperienceEntry = {
  role: string;
  organization: string;
  dates: string;
  engagement: string;
  details: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  topic: string;
  date: string;
  tags: string[];
  content: string[];
};

export const site = {
  name: "Charles Aeron L. Pelayo",
  shortName: "Charles Pelayo",
  role: "Freelance Web Developer",
  email: import.meta.env.VITE_CONTACT_EMAIL || "hello@charlespelayo.dev",
  github: "https://github.com/Ryo2702",
  githubUsername: "Ryo2702",
};

export const projects: Project[] = [
  {
    slug: "doctrams",
    title: "DOCTRAMS",
    label: "Client project",
    status: "Documented",
    year: "—",
    featured: true,
    summary:
      "A municipal document tracking management system for submission, routing, review, approval, resubmission, and archival.",
    problem:
      "Participating offices need document ownership, timing, and activity history to stay visible while work moves through department-based workflows.",
    contribution:
      "A full-stack workflow platform covering role-aware review queues, attachments, processing-time monitoring, reporting, audit history, notifications, and document output.",
    delivered: [
      "Department-based document workflows",
      "Role-aware reviewer queues and actions",
      "Processing-time and overdue monitoring",
      "Reports, audit logs, notifications, and exports",
    ],
    technologies: ["Laravel", "PHP 8.2+", "Blade", "Tailwind CSS", "MySQL"],
  },
  {
    slug: "portfolio-3-0",
    title: "Portfolio 3.0",
    label: "Personal project",
    status: "Published",
    year: "2026",
    featured: true,
    summary:
      "A focused portfolio for presenting freelance web development, WordPress, and SEO work without getting in the way of the work itself.",
    problem:
      "Visitors need a quick way to understand the service offer, inspect relevant work, and start a conversation.",
    contribution:
      "Designed and built the responsive portfolio foundation, content structure, project routes, and contribution activity surface.",
    delivered: [
      "Responsive monochrome portfolio shell",
      "Published project detail route",
      "Accessible contact and copy-email actions",
      "Server-ready GitHub contribution endpoint",
    ],
    technologies: ["React", "TypeScript", "Vite", "Motion", "CSS"],
    repository: "https://github.com/Ryo2702",
  },
];

export const toolGroups = [
  {
    label: "Web Development",
    items: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "Vue 3",
      "React",
      "React Native",
      "React Native Web",
      "Expo",
      "Expo Router",
      "Vite",
      "PHP",
      "Laravel",
      "REST API",
      "Responsive Design",
    ],
  },
  {
    label: "WordPress",
    items: [
      "WordPress Development",
      "WordPress Customization",
      "Theme Customization",
      "Plugin Management",
      "Website Maintenance",
      "Website Troubleshooting",
      "Content Management",
    ],
  },
  {
    label: "SEO",
    items: [
      "On-Page SEO",
      "Technical SEO",
      "Keyword Research",
      "Meta Optimization",
      "Internal Linking",
      "Site Structure",
      "SEO Auditing",
      "Google Search Console",
    ],
  },
  {
    label: "Database",
    items: ["MySQL", "MariaDB", "PostgreSQL", "SQLite"],
  },
  {
    label: "Tools",
    items: [
      "Git",
      "GitHub",
      "VS Code",
      "Postman",
      "Linux",
      "Hostinger",
      "Vercel",
      "Jest",
      "Zod",
      "expo-secure-store",
      "expo-camera",
      "expo-print",
      "Lucide React",
      "lucide-react-native",
    ],
  },
];

export const experience: ExperienceEntry[] = [
  {
    role: "Freelance Web Developer",
    organization: "Independent",
    dates: "Current",
    engagement: "Freelance",
    details: [
      "Build responsive business websites and service pages.",
      "Develop and improve WordPress sites with maintainable layouts.",
      "Apply practical on-page SEO foundations within agreed project scope.",
    ],
  },
];

export const blogPosts: BlogPost[] = [];
