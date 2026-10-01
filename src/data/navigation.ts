import {
  Briefcase,
  Calendar,
  Code2,
  FileText,
  GitBranch,
  House,
  Layers,
  UserRound,
} from "lucide-react";
import type { NavigationItem } from "../types/navigation";

export const sectionLinks: NavigationItem[] = [
  { id: "home", label: "Home", icon: House },
  { id: "featured", label: "Featured work", icon: Briefcase },
  { id: "projects", label: "Projects", icon: Layers },
  { id: "stack", label: "Stack & tools", icon: Code2 },
  { id: "experience", label: "Experience", icon: Calendar },
  { id: "about", label: "About", icon: UserRound },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "github", label: "GitHub activity", icon: GitBranch },
];

export const sectionIds = sectionLinks.map(({ id }) => id).concat("contact");
