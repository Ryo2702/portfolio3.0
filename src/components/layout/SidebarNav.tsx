import { ArrowUpRight, MapPin, Menu } from "lucide-react";
import type { MouseEvent } from "react";
import { sectionLinks } from "../../data/navigation";
import { requestHorizontalSection } from "../../utils/navigation";
import { ThemeToggle } from "../../features/theme/ThemeToggle";
import type { Theme } from "../../features/theme/useTheme";
import type { NavigationItem } from "../../types/navigation";

export function NavItem({
  label,
  icon: Icon,
  active,
  href,
  onNavigate,
  onClick,
}: NavigationItem & {
  active: boolean;
  href: string;
  onNavigate?: () => void;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
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

export function SidebarNav({
  activeId = "",
  hrefPrefix = "",
  collapsed,
  horizontal = false,
  onToggle,
  theme,
  themePressed,
  onThemeToggle,
}: {
  activeId?: string;
  hrefPrefix?: string;
  collapsed: boolean;
  horizontal?: boolean;
  onToggle: () => void;
  theme: Theme;
  themePressed: boolean;
  onThemeToggle: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <aside className="desktop-sidebar" aria-label="Primary navigation">
      <div className="sidebar-brand-row">
        <a className="brand-lockup" href={`${hrefPrefix}#home`} aria-label="Go to Charles Pelayo home">
          <span className="brand-mark" aria-hidden="true">
            <img src="/favicons/favicon-64x64.png" alt="" />
          </span>
          <span>
            <strong>CHARLES</strong>
            <small>PELAYO / 27</small>
          </span>
        </a>
        <button className="sidebar-toggle" type="button" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <Menu size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="sidebar-rule" />
      <p className="sidebar-label">Index / 00</p>
      <nav className="sidebar-nav">
        {sectionLinks.map((link) => (
          <NavItem
            key={link.id}
            {...link}
            active={activeId === link.id}
            href={`${hrefPrefix}#${link.id}`}
            onClick={horizontal ? (event) => { event.preventDefault(); requestHorizontalSection(link.id); } : undefined}
          />
        ))}
      </nav>

      <div className="sidebar-spacer" />
      <ThemeToggle theme={theme} pressed={themePressed} onToggle={onThemeToggle} />
      <div className="sidebar-footer">
        <p className="sidebar-label">Have a project?</p>
        <a className="sidebar-contact" href={`${hrefPrefix}#contact`} aria-label="Start a project" title="Start a project">
          <span className="sidebar-contact-copy">Start a project</span>
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
        <p className="sidebar-meta">
          <MapPin size={15} aria-hidden="true" />
          <span className="sidebar-meta-copy">Remote</span>
        </p>
      </div>
    </aside>
  );
}
