import {
  Briefcase,
  Calendar,
  Code2,
  FileText,
  GitBranch,
  House,
  Layers,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export const sectionLinks: { id: string; label: string; icon: LucideIcon }[] = [
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

export function requestHorizontalSection(id: string) {
  window.dispatchEvent(new CustomEvent("portfolio:navigate", { detail: id }));
}

export function NavItem({
  label,
  icon: Icon,
  active,
  href,
  onNavigate,
  onClick,
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  href: string;
  onNavigate?: () => void;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      className={`sidebar-link ${active ? "is-active" : ""}`}
      href={href}
      aria-label={label}
      title={label}
      aria-current={active ? "page" : undefined}
      onClick={(event) => {
        onNavigate?.();
        onClick?.(event);
      }}
    >
      <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
      <span>{label}</span>
      {active && <span className="active-dot" aria-hidden="true" />}
    </a>
  );
}
