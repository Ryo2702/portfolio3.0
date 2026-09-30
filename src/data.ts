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
  images?: string[];
  demo?: string;
  repository?: string;
};

export type ExperienceEntry = {
  role: string;
  organization: string;
  dates: string;
  engagement: string;
  location?: string;
  details: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  topic: string;
  date: string;
  tags: string[];
  seoTitle?: string;
  metaDescription?: string;
  sections: { heading?: string; paragraphs: string[] }[];
};

export const site = {
  name: "Charles Aeron L. Pelayo",
  shortName: "Charles Pelayo",
  role: "Freelance Web Developer",
  email: import.meta.env.VITE_CONTACT_EMAIL || "charlespelayo27@gmail.com",
  whatsapp: "639086237194",
  github: "https://github.com/Ryo2702",
  githubUsername: "Ryo2702",
};

export const projects: Project[] = [
  {
    slug: "stockpilot",
    title: "StockPilot",
    label: "Mobile Application · Offline-first inventory",
    status: "Published",
    year: "—",
    featured: true,
    summary:
      "An offline-first inventory management application for independent business owners to manage products, stock movements, stock health, and multiple stores from a mobile-first interface.",
    problem:
      "Independent business owners need inventory workflows that remain useful without a connection while keeping products, stock movements, stock health, and multiple stores organized.",
    contribution:
      "Built an offline-first mobile inventory application with local SQLite data, stock health states, multi-store workflows, barcode and QR scanning, insights, backup, and restore flows.",
    delivered: [
      "Offline-first inventory workflows backed by a local SQLite database.",
      "Stock Health states for healthy, low-stock, and critical products.",
      "Multiple stores with separate products, inventory, and stock movements.",
      "Barcode and QR scanning, inventory insights, backup, and restore flows.",
    ],
    technologies: [
      "Expo SDK 57",
      "React Native 0.86.3",
      "TypeScript 6",
      "Expo Router 57",
      "SQLite",
      "React Native Web",
      "Zod",
      "expo-secure-store",
      "expo-camera",
      "expo-print",
      "Jest",
      "lucide-react-native",
    ],
    images: [
      "/projects/stockpilot/ChatGPT Image Sep 24, 2026, 12_41_52 AM (1).png",
      "/projects/stockpilot/ChatGPT Image Sep 24, 2026, 12_41_54 AM (2).png",
      "/projects/stockpilot/ChatGPT Image Sep 24, 2026, 12_41_55 AM (3).png",
      "/projects/stockpilot/ChatGPT Image Sep 24, 2026, 12_41_57 AM (4).png",
      "/projects/stockpilot/ChatGPT Image Sep 24, 2026, 12_41_58 AM (5).png",
      "/projects/stockpilot/ChatGPT Image Sep 24, 2026, 12_41_58 AM (6).png",
      "/projects/stockpilot/ChatGPT Image Sep 24, 2026, 12_41_59 AM (7).png",
    ],
    demo: "https://stockpilot-six-nu.vercel.app/",
  },
  {
    slug: "doctrams",
    title: "DOCTRAMS",
    label: "Document Tracking Management System",
    status: "Documented",
    year: "—",
    featured: false,
    summary:
      "A municipal workflow platform built for the Municipality of Bansud to track document submission, routing, review, approval, resubmission, and archival.",
    problem:
      "Participating offices need document ownership, timing, and activity history to stay visible while work moves through department-based workflows.",
    contribution:
      "A full-stack workflow platform covering role-aware review queues, attachments, processing-time monitoring, reporting, audit history, notifications, and document output.",
    delivered: [
      "Multi-step, department-based document workflows with visible ownership and status.",
      "Role-aware access for administrators, department heads, staff, and reviewers.",
      "Reviewer queues with approve, return, reassign, receive, and resubmit actions.",
      "Dashboards, reports, audit logs, notifications, and operational tracking.",
    ],
    technologies: [
      "PHP 8.2+",
      "Laravel 12",
      "Blade",
      "Tailwind CSS v4",
      "JavaScript",
      "Vite 7",
      "MySQL / MariaDB",
      "Spatie Permission",
      "Chart.js",
      "Dompdf",
      "Laravel Excel",
      "PHPWord",
      "PHPUnit",
      "ESC/POS",
    ],
    images: [
      "/projects/dtms/dashboard.png",
      "/projects/dtms/transactions.png",
      "/projects/dtms/workflow-review.png",
    ],
    demo: "https://bansud-dtms.online/",
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
    role: "IT Support Intern",
    organization: "TESDA Provincial Office",
    dates: "March 2026 – June 2026",
    engagement: "Internship",
    location: "Oriental Mindoro, Philippines",
    details: [
      "Supported daily office operations, client assistance, technical troubleshooting, reporting, and inventory documentation.",
      "Processed accreditation and assessment documents accurately while following office requirements and procedures.",
      "Maintained inventory records, toolkit distribution, labeling, and asset organization to support efficient office operations.",
      "Diagnosed and resolved printer, scanner, and basic network issues to minimize workflow disruptions.",
    ],
  },
  {
    role: "Salesforce Virtual Intern",
    organization: "SmartBridge",
    dates: "September 2025 – December 2025",
    engagement: "Internship",
    location: "Remote",
    details: [
      "Completed an 8-week Salesforce internship covering CRM fundamentals, development, and platform configuration.",
      "Worked with Data and Security Modeling, Declarative Automation, Apex, Lightning Web Components, and Visualforce.",
      "Developed Salesforce components and completed a capstone project applying automation, security, and CRM solutions.",
    ],
  },
  {
    role: "IT Support – Special Program Employment Student (SPES)",
    organization: "Special Program for Employment of Students",
    dates: "August 2024",
    engagement: "Special program",
    location: "Philippines",
    details: [
      "Encoded and maintained 4Ps beneficiary records using Microsoft Excel while keeping records organized and accurate.",
      "Organized physical files and documents to improve accessibility and record retrieval.",
      "Troubleshot basic network connectivity, laptop settings, firewall configurations, and printer-related issues.",
    ],
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "my-web-development-journey",
    title: "Who Am I?",
    excerpt:
      "A personal introduction to my journey as a software developer and freelance web developer building practical, reliable, and user-friendly digital solutions.",
    topic: "Personal / Developer Journey",
    date: "2026",
    tags: ["Web Development", "Software Development", "Career Journey"],
    seoTitle: "Charles Aeron Pelayo | My Journey as a Web Developer",
    metaDescription:
      "Meet Charles Aeron Pelayo, a freelance web developer and software developer focused on building practical websites, modern applications, and digital solutions.",
    sections: [
      {
        paragraphs: [
          "Hi, I'm Charles Aeron L. Pelayo, a Software Developer and Freelance Web Developer passionate about building practical, reliable, and user-friendly digital solutions.",
          "My interest in programming started with curiosity about how websites, applications, and systems work. Over time, that curiosity developed into a passion for solving real-world problems through technology.",
          "For me, development isn't just about writing code. It's about understanding problems, finding effective solutions, and creating something that people can actually use.",
        ],
      },
      {
        heading: "Turning Problems Into Solutions",
        paragraphs: [
          "Throughout my development journey, I've worked on projects involving document management, organizational systems, inventory management concepts, and business applications.",
          "These experiences helped me strengthen my skills in modern technologies such as React, TypeScript, Laravel, PHP, MySQL, and Tailwind CSS.",
          "Every project has taught me something important: Good software isn't defined by how complicated it is, but by how effectively it solves a problem.",
          "I focus on writing maintainable code, building intuitive interfaces, and creating applications that balance functionality, performance, and usability.",
        ],
      },
      {
        heading: "Expanding Into Freelance Development",
        paragraphs: [
          "As I continue growing professionally, I've also started offering freelance services in Web Development, WordPress Development, and Search Engine Optimization (SEO).",
          "My goal is to help individuals and businesses establish a stronger online presence through websites that are responsive, accessible, professional, and designed around their needs.",
          "I believe a website should do more than look attractive. It should communicate clearly, build trust, and make it easier for potential customers to connect with a business.",
        ],
      },
      {
        heading: "Learning Never Stops",
        paragraphs: [
          "Technology constantly evolves, and I believe continuous learning is essential for every developer.",
          "I'm continually exploring modern development practices, improving my problem-solving abilities, and learning how to use AI-assisted development tools responsibly to make my workflow more efficient.",
          "My long-term goal is to grow into a skilled Software Engineer and Full-Stack Architect capable of designing scalable systems and delivering meaningful digital products.",
        ],
      },
      {
        heading: "What's Next?",
        paragraphs: [
          "I'm still building my career, learning new technologies, improving my craft, and exploring opportunities to collaborate on interesting projects.",
          "This blog will serve as a place where I share my development experiences, technical discoveries, project insights, challenges, and lessons learned along the way.",
          "I'm Charles Aeron Pelayo, and I'm building one solution at a time.",
        ],
      },
    ],
  },
];
