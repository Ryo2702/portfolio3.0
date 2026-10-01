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

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type BlogSection = {
  heading?: string;
  paragraphs: string[];
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
  sections: BlogSection[];
};
