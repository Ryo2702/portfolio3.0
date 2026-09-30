import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Braces,
  Camera,
  Briefcase,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CircleAlert,
  Code2,
  CodeXml,
  Copy,
  Database,
  ExternalLink,
  FileText,
  GitBranch,
  Globe2,
  House,
  Layers,
  MapPin,
  Menu,
  MonitorSmartphone,
  Moon,
  Package,
  Palette,
  PenLine,
  Plug,
  Printer,
  Search,
  Send,
  Server,
  Smartphone,
  Terminal,
  TestTube2,
  Type,
  UserRound,
  Wrench,
  X,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { blogPosts, experience, projects, site, toolGroups, type BlogPost, type Project } from "./data";

const sectionLinks: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Home", icon: House },
  { id: "featured", label: "Featured work", icon: Briefcase },
  { id: "projects", label: "Projects", icon: Layers },
  { id: "stack", label: "Stack & tools", icon: Code2 },
  { id: "experience", label: "Experience", icon: Calendar },
  { id: "about", label: "About", icon: UserRound },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "github", label: "GitHub activity", icon: GitBranch },
];

const sectionIds = sectionLinks.map(({ id }) => id).concat("contact");

const stackGroupIcons: Record<string, LucideIcon> = {
  "Web Development": Code2,
  WordPress: Globe2,
  SEO: Search,
  Database,
  Tools: Wrench,
};

const stackItemIcons: Record<string, LucideIcon> = {
  HTML5: CodeXml,
  CSS3: Palette,
  JavaScript: Braces,
  TypeScript: Type,
  "Vue 3": Layers,
  React: Code2,
  "React Native": Smartphone,
  "React Native Web": MonitorSmartphone,
  Expo: Package,
  "Expo Router": GitBranch,
  Vite: Plug,
  PHP: CodeXml,
  Laravel: Layers,
  "REST API": Plug,
  "Responsive Design": MonitorSmartphone,
  "WordPress Development": Globe2,
  "WordPress Customization": Palette,
  "Theme Customization": Palette,
  "Plugin Management": Package,
  "Website Maintenance": Wrench,
  "Website Troubleshooting": CircleAlert,
  "Content Management": FileText,
  "On-Page SEO": Search,
  "Technical SEO": Code2,
  "Keyword Research": Search,
  "Meta Optimization": Search,
  "Internal Linking": GitBranch,
  "Site Structure": Layers,
  "SEO Auditing": CircleAlert,
  "Google Search Console": Search,
  MySQL: Database,
  MariaDB: Database,
  PostgreSQL: Database,
  SQLite: Database,
  Git: GitBranch,
  GitHub: GitBranch,
  "VS Code": Code2,
  Postman: Send,
  Linux: Terminal,
  Hostinger: Server,
  Vercel: Globe2,
  Jest: TestTube2,
  Zod: Check,
  "expo-secure-store": Package,
  "expo-camera": Camera,
  "expo-print": Printer,
  "Lucide React": Code2,
  "lucide-react-native": Smartphone,
};

function requestHorizontalSection(id: string) {
  window.dispatchEvent(new CustomEvent("portfolio:navigate", { detail: id }));
}

function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute("content", description);
  }, [description, title]);
}

function DotCursor() {
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!cursor || !finePointer.matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const interactiveSelector = "a, button, select, summary, input, textarea, [role='button']";

    const render = () => {
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frame = 0;
    };

    const handleMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      cursor.classList.add("is-visible");
      const target = event.target;
      cursor.classList.toggle("is-hovering", target instanceof Element && Boolean(target.closest(interactiveSelector)));
      if (!frame) frame = requestAnimationFrame(render);
    };

    const hide = () => cursor.classList.remove("is-visible", "is-hovering");
    const handlePointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerout", handlePointerOut);
    window.addEventListener("blur", hide);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return <span className="dot-cursor" ref={cursorRef} aria-hidden="true" />;
}

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  try {
    const saved = window.localStorage.getItem("portfolio-theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // Use the system preference when storage is unavailable.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function ThemeToggle({
  theme,
  pressed,
  onToggle,
}: {
  theme: Theme;
  pressed: boolean;
  onToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      className={`theme-toggle ${pressed ? "is-pressed" : ""}`}
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-pressed={theme === "dark"}
      aria-busy={pressed}
      onClick={onToggle}
    >
      <Icon size={16} aria-hidden="true" />
      <span className="theme-toggle-label">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}

function SiteChrome({ activeId, horizontal = false, children }: { activeId?: string; horizontal?: boolean; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [themePressed, setThemePressed] = useState(false);
  const themeTimeoutRef = useRef<number | null>(null);
  const revealTimeoutRef = useRef<number | null>(null);
  const pendingThemeRef = useRef<Theme | null>(null);
  const hrefPrefix = window.location.pathname === "/" ? "" : "/";

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem("portfolio-theme", theme);
    } catch {
      // Theme still applies for the current session without storage.
    }
  }, [theme]);

  useEffect(() => () => {
    if (themeTimeoutRef.current !== null) window.clearTimeout(themeTimeoutRef.current);
    if (revealTimeoutRef.current !== null) window.clearTimeout(revealTimeoutRef.current);
    document.documentElement.classList.remove("theme-reveal");
    document.documentElement.removeAttribute("data-theme-reveal");
  }, []);

  const finishThemeChange = (nextTheme: Theme) => {
    pendingThemeRef.current = null;
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.remove("theme-reveal");
    document.documentElement.removeAttribute("data-theme-reveal");
    setTheme(nextTheme);
    setThemePressed(false);
  };

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (pendingThemeRef.current) return;

    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    const bounds = event.currentTarget.getBoundingClientRect();
    document.documentElement.style.setProperty("--theme-origin-x", `${bounds.left + bounds.width / 2}px`);
    document.documentElement.style.setProperty("--theme-origin-y", `${bounds.top + bounds.height / 2}px`);
    pendingThemeRef.current = nextTheme;
    setThemePressed(true);

    themeTimeoutRef.current = window.setTimeout(() => {
      themeTimeoutRef.current = null;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finishThemeChange(nextTheme);
        return;
      }

      document.documentElement.dataset.themeReveal = nextTheme;
      document.documentElement.classList.add("theme-reveal");
      revealTimeoutRef.current = window.setTimeout(() => {
        revealTimeoutRef.current = null;
        finishThemeChange(nextTheme);
      }, 480);
    }, 200);
  };

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <DotCursor />
      <Sidebar activeId={activeId} hrefPrefix={hrefPrefix} collapsed={collapsed} horizontal={horizontal} onToggle={() => setCollapsed((value) => !value)} theme={theme} themePressed={themePressed} onThemeToggle={handleThemeToggle} />
      <main className={`main-content ${horizontal ? "horizontal-main" : ""}`} id="main-content">
        <MobileHeader activeId={activeId} hrefPrefix={hrefPrefix} horizontal={horizontal} theme={theme} themePressed={themePressed} onThemeToggle={handleThemeToggle} />
        {children}
      </main>
    </div>
  );
}

function Sidebar({
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
  onThemeToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
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

function NavItem({
  id,
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
    <a className={`sidebar-link ${active ? "is-active" : ""}`} href={href} aria-label={label} title={label} aria-current={active ? "page" : undefined} onClick={(event) => { onNavigate?.(); onClick?.(event); }}>
      <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
      <span>{label}</span>
      {active && <span className="active-dot" aria-hidden="true" />}
    </a>
  );
}

function MobileHeader({
  activeId = "",
  hrefPrefix = "",
  horizontal = false,
  theme,
  themePressed,
  onThemeToggle,
}: {
  activeId?: string;
  hrefPrefix?: string;
  horizontal?: boolean;
  theme: Theme;
  themePressed: boolean;
  onThemeToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="mobile-header">
      <a className="mobile-brand" href={`${hrefPrefix}#home`} aria-label="Go to Charles Pelayo home">
        <span className="brand-mark" aria-hidden="true">
          <img src="/favicons/favicon-64x64.png" alt="" />
        </span>
        <span>CHARLES / 03</span>
      </a>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="icon-button" type="button" aria-label="Open navigation">
            <Menu size={23} aria-hidden="true" />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="mobile-menu-overlay" />
          <Dialog.Content className="mobile-menu" aria-describedby={undefined}>
            <div className="mobile-menu-topline">
              <Dialog.Title className="mobile-menu-title">Navigation / 00</Dialog.Title>
              <Dialog.Close asChild>
                <button className="icon-button" type="button" aria-label="Close navigation">
                  <X size={23} aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <nav className="mobile-nav" aria-label="Mobile navigation">
              {sectionLinks.map((link) => (
                <NavItem
                  key={link.id}
                  {...link}
                  active={activeId === link.id}
                  href={`${hrefPrefix}#${link.id}`}
                  onNavigate={() => setOpen(false)}
                  onClick={horizontal ? (event) => { event.preventDefault(); requestHorizontalSection(link.id); } : undefined}
                />
              ))}
            </nav>
            <ThemeToggle theme={theme} pressed={themePressed} onToggle={onThemeToggle} />
            <a className="button button-primary mobile-menu-cta" href={`${hrefPrefix}#contact`} onClick={() => setOpen(false)}>
              Start a project <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
  animate = true,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  animate?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <motion.section
      id={id}
      className={`content-section section-anchor ${isVisible ? "is-visible" : ""} ${className}`}
      initial={!animate || reducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={animate ? { once: true, amount: 0.12 } : undefined}
      transition={animate ? { duration: reducedMotion ? 0 : 0.32, ease: "easeOut" } : undefined}
      onViewportEnter={() => setIsVisible(true)}
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        {intro && <p className="section-intro">{intro}</p>}
      </div>
      {children}
    </motion.section>
  );
}

function Hero() {
  return (
    <section className="hero section-anchor" id="home">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">01 / Freelance web developer</p>
          <h1>Web Developer | WordPress | SEO</h1>
          <p className="hero-summary">
            I build clear, responsive web experiences for people and businesses that need their work understood — from the first scroll to the first inquiry.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">
              Start a project <Send size={18} aria-hidden="true" />
            </a>
            <a className="button button-secondary" href="#featured">
              View my work <ArrowDownIcon />
            </a>
          </div>
          <div className="service-strip" aria-label="Core services">
            <span>Web development</span>
            <span>WordPress</span>
            <span>SEO</span>
          </div>
        </div>
        <Portrait />
      </div>
      <div className="hero-bottomline">
        <span>Scroll to explore</span>
        <span className="line" aria-hidden="true" />
        <span>Remote</span>
      </div>
    </section>
  );
}

function ArrowDownIcon() {
  return <ArrowUpRight size={18} aria-hidden="true" className="rotated-arrow" />;
}

function Portrait() {
  return (
    <div className="portrait-wrap">
      <div className="portrait-note">02 / Portrait study</div>
      <div className="portrait-frame">
        <img className="portrait-art" src="/avatar.png" alt="One-bit portrait of Charles Aeron L. Pelayo" />
      </div>
      <div className="portrait-caption">
        <span>CHARLES / AERON / PELAYO</span>
        <span className="portrait-index">03</span>
      </div>
    </div>
  );
}

function FeaturedProjects({ horizontal = false }: { horizontal?: boolean }) {
  const featured = projects.filter((project) => project.featured);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(featured.length ? 1 / featured.length : 0);
  const [metrics, setMetrics] = useState({ start: 0, distance: 0 });

  useLayoutEffect(() => {
    if (horizontal) return;

    const measure = () => {
      const showcase = showcaseRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!showcase || !viewport || !track) return;

      const isMobile = window.matchMedia("(max-width: 760px)").matches;
      const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const start = showcase.getBoundingClientRect().top + window.scrollY;
      setMetrics({ start, distance });

      if (isMobile || reducedMotion) {
        showcase.style.removeProperty("--showcase-height");
        track.style.removeProperty("transform");
        return;
      }

      showcase.style.setProperty("--showcase-height", `${window.innerHeight + distance}px`);
    };

    const frame = requestAnimationFrame(measure);
    const handleResize = () => requestAnimationFrame(measure);
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, [featured.length, horizontal, reducedMotion]);

  useEffect(() => {
    if (horizontal || reducedMotion) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (window.matchMedia("(max-width: 760px)").matches) return;
        if (!metrics.distance || !trackRef.current) {
          setProgress(1);
          return;
        }

        const nextProgress = Math.min(1, Math.max(0, (window.scrollY - metrics.start) / metrics.distance));
        trackRef.current.style.transform = `translate3d(${-metrics.distance * nextProgress}px, 0, 0)`;
        setProgress(nextProgress);
        setActiveIndex(Math.min(featured.length - 1, Math.round(nextProgress * Math.max(0, featured.length - 1))));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, [featured.length, horizontal, metrics, reducedMotion]);

  function handleCarouselScroll() {
    if (horizontal || !trackRef.current || !window.matchMedia("(max-width: 760px)").matches) return;
    const card = trackRef.current.querySelector<HTMLElement>(".project-card");
    if (!card) return;
    const gap = Number.parseFloat(getComputedStyle(trackRef.current).columnGap || getComputedStyle(trackRef.current).gap) || 0;
    const index = Math.min(featured.length - 1, Math.max(0, Math.round(trackRef.current.scrollLeft / (card.offsetWidth + gap))));
    setActiveIndex(index);
    setProgress(featured.length ? (index + 1) / featured.length : 0);
  }

  function goToProject(index: number) {
    if (!featured.length || horizontal || reducedMotion) return;
    const nextIndex = Math.min(featured.length - 1, Math.max(0, index));
    const isMobile = window.matchMedia("(max-width: 760px)").matches;

    if (isMobile && trackRef.current) {
      const card = trackRef.current.querySelector<HTMLElement>(".project-card");
      if (!card) return;
      const gap = Number.parseFloat(getComputedStyle(trackRef.current).columnGap || getComputedStyle(trackRef.current).gap) || 0;
      trackRef.current.scrollTo({ left: nextIndex * (card.offsetWidth + gap), behavior: "smooth" });
    } else {
      const scrollDistance = featured.length > 1 ? (nextIndex / (featured.length - 1)) * metrics.distance : 0;
      window.scrollTo({ top: metrics.start + scrollDistance, behavior: "smooth" });
    }

    setActiveIndex(nextIndex);
    setProgress(featured.length ? (nextIndex + 1) / featured.length : 0);
  }

  return (
    <Section
      id="featured"
      eyebrow="02 / Selected work"
      title="The work, up close."
      intro="A closer look at the problem, the contribution, and the useful thing that shipped."
      animate={false}
    >
      {featured.length ? (
        <div className={`featured-showcase ${horizontal ? "is-page-horizontal" : ""} ${reducedMotion ? "is-reduced" : ""}`} ref={showcaseRef}>
          <div className="featured-sticky">
            <div className="featured-showcase-meta">
              <span>Sequence / {String(featured.length).padStart(2, "0")}</span>
              <span>{horizontal ? "Section panel / vertical reading" : reducedMotion ? "Reduced motion / stacked view" : "Scroll sequence / swipe on mobile"}</span>
            </div>
            <div
              className="featured-viewport"
              ref={viewportRef}
              tabIndex={0}
              aria-label="Featured project showcase. Use the arrow keys or controls to browse."
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  goToProject(activeIndex - 1);
                }
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  goToProject(activeIndex + 1);
                }
              }}
            >
              <div className="featured-track" ref={trackRef} onScroll={handleCarouselScroll}>
                {featured.map((project, index) => (
                  <ProjectCard key={project.slug} project={project} featured index={index} />
                ))}
              </div>
            </div>
            <div className="featured-controls" aria-label="Featured project navigation">
              <div className="featured-progress" aria-live="polite">
                <span>{String(activeIndex + 1).padStart(2, "0")}</span>
                <span className="featured-progress-line" aria-hidden="true">
                  <span style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }} />
                </span>
                <span>{String(featured.length).padStart(2, "0")}</span>
              </div>
              <div className="featured-buttons">
                <button className="showcase-button" type="button" onClick={() => goToProject(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Previous featured project">
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <button className="showcase-button" type="button" onClick={() => goToProject(activeIndex + 1)} disabled={activeIndex === featured.length - 1} aria-label="Next featured project">
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState icon={<Briefcase size={24} aria-hidden="true" />} title="Featured work is being prepared." text="Published case studies will appear here once the work is ready to share." />
      )}
    </Section>
  );
}

function ProjectsSection() {
  return (
    <Section
      id="projects"
      eyebrow="03 / Project index"
      title="A compact project catalog."
      intro="Published work first. Clear labels for personal projects, prototypes, and client work."
    >
      <div className="project-index-head">
        <p>
          <strong>{projects.length.toString().padStart(2, "0")}</strong> published project{projects.length === 1 ? "" : "s"}
        </p>
        <span className="index-note">The catalog grows as more work is published.</span>
      </div>
      {projects.length ? (
        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState icon={<Layers size={24} aria-hidden="true" />} title="No published projects yet." text="Add a project when there is work with a clear story and a link worth sharing." />
      )}
    </Section>
  );
}

function ProjectCard({ project, featured = false, index = 0 }: { project: Project; featured?: boolean; index?: number }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      className={`project-card ${featured ? "project-card-featured" : ""}`}
      whileHover={reducedMotion ? undefined : { y: -4 }}
      transition={{ duration: reducedMotion ? 0 : 0.18 }}
    >
      <ProjectArtwork project={project} index={index} />
      <div className="project-card-body">
        <div className="project-card-topline">
          <div className="badge-row">
            <span className="badge">{project.label}</span>
            <span className="badge badge-inverted">{project.status}</span>
          </div>
          <span className="project-year">{project.year}</span>
        </div>
        <h3>{project.title}</h3>
        <p className="project-summary">{project.summary}</p>
        {featured && (
          <div className="project-story">
            <div>
              <p className="mini-label">The problem</p>
              <p>{project.problem}</p>
            </div>
            <div>
              <p className="mini-label">My contribution</p>
              <p>{project.contribution}</p>
            </div>
          </div>
        )}
        <div className="project-tags">
          {project.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
        <div className="card-actions">
          <a className="text-link" href={`/projects/${project.slug}`}>
            Read case study <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          {project.repository && (
            <a className="text-link muted-link" href={project.repository} target="_blank" rel="noreferrer">
              Repository <ExternalLink size={15} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function ProjectArtwork({ project, index }: { project: Project; index: number }) {
  return (
    <div className="project-artwork" aria-hidden="true">
      <div className="artwork-topline">
        <span>{String(index + 1).padStart(2, "0")} / CASE</span>
        <span>{project.year}</span>
      </div>
      <div className="artwork-window">
        <div className="artwork-window-bar">
          <span />
          <span />
          <span />
        </div>
        <div className="artwork-window-body">
          <div className="artwork-block artwork-block-wide" />
          <div className="artwork-block artwork-block-short" />
          <div className="artwork-columns">
            <div className="artwork-column" />
            <div className="artwork-column artwork-column-filled" />
            <div className="artwork-column" />
          </div>
        </div>
      </div>
      <strong>{project.title}</strong>
    </div>
  );
}

function TechStack() {
  return (
    <Section
      id="stack"
      eyebrow="04 / Tools & capabilities"
      title="The stack stays useful."
      intro="Tools are here to support the outcome: clear pages, maintainable builds, and fewer dead ends."
    >
      <div className="stack-grid">
        {toolGroups.map((group) => {
          const Icon = stackGroupIcons[group.label] ?? Code2;

          return (
            <article className="stack-card" key={group.label}>
              <div className="stack-card-heading">
                <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                <h3>{group.label}</h3>
              </div>
              <div className="stack-items">
                {group.items.map((item) => {
                  const SkillIcon = stackItemIcons[item] ?? Icon;

                  return (
                    <span className="badge" key={item}>
                      <SkillIcon size={11} strokeWidth={2} aria-hidden="true" />
                      {item}
                    </span>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

function ExperienceSection() {
  return (
    <Section
      id="experience"
      eyebrow="05 / Experience"
      title="Built around real work."
      intro="A short timeline with the kind of engagement and responsibility visitors can actually understand."
    >
      <div className="timeline">
        {experience.map((entry) => (
          <article className="timeline-entry" key={`${entry.role}-${entry.organization}`}>
            <div className="timeline-marker" aria-hidden="true" />
            <div className="timeline-date">{entry.dates}</div>
            <div className="timeline-card">
              <div className="timeline-card-heading">
                <div>
                  <p className="mini-label">{entry.engagement}</p>
                  <h3>{entry.role}</h3>
                  <p className="timeline-org">{entry.organization}</p>
                </div>
                <Briefcase size={22} aria-hidden="true" />
              </div>
              <ul>
                {entry.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function AboutSection() {
  return (
    <Section
      id="about"
      eyebrow="06 / About"
      title="Make the useful thing clear."
      intro="Good web work removes questions. The page should tell people what is offered, why it matters, and what to do next."
    >
      <div className="about-grid">
        <div className="about-copy">
          <p className="about-lede">Writing readable, reusable, maintainable, and well-structured code.</p>
          <p>
            My core services are web development, WordPress development, and SEO. The scope stays practical: responsive layouts, service pages, inquiry paths, maintainable content, and on-page foundations that give search engines a clearer page to read.
          </p>
          <a className="text-link" href="#contact">
            Talk about your project <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="process-card">
          <p className="mini-label">A simple delivery path</p>
          <ol className="process-list">
            <li>
              <span>01</span>
              <div>
                <strong>Understand</strong>
                <p>Clarify the audience, offer, and next action.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Build</strong>
                <p>Shape the content and interface into a responsive page.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Refine</strong>
                <p>Test the important paths, then hand over something maintainable.</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </Section>
  );
}

function BlogSection() {
  return (
    <Section
      id="blog"
      eyebrow="07 / Notes"
      title="Writing when there is something useful to say."
      intro="Project lessons, implementation notes, WordPress fixes, and practical SEO work — published only when they are ready."
    >
      {blogPosts.length ? (
        <div className="blog-grid">
          {blogPosts.slice(0, 3).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState icon={<PenLine size={24} aria-hidden="true" />} title="No published articles yet." text="Draft ideas stay off the public index until there is a finished article to read." />
      )}
    </Section>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="blog-card">
      <div className="project-card-topline">
        <span className="badge">{post.topic}</span>
        <span className="project-year">{post.date}</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <div className="project-tags">
        {post.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <a className="text-link" href={`/blog/${post.slug}`}>
        Read article <ArrowUpRight size={17} aria-hidden="true" />
      </a>
    </article>
  );
}

type ContributionDay = { date: string; contributionCount: number };
type ContributionWeek = { contributionDays: ContributionDay[] };
type ContributionResponse = {
  username: string;
  from: string;
  to: string;
  totalContributions: number;
  weeks: ContributionWeek[];
  fetchedAt: string;
};

function getCalendarRange(value: string) {
  const now = new Date();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));
  const start = new Date(end);

  if (value === "last-year") {
    start.setUTCFullYear(start.getUTCFullYear() - 1);
  } else {
    const year = Number(value);
    start.setUTCFullYear(year, 0, 1);
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCFullYear(year, 11, 31);
  }

  return {
    from: start.toISOString(),
    to: end.toISOString(),
    label: value === "last-year" ? "Last 12 months" : value,
  };
}

function GitHubCalendar() {
  const [range, setRange] = useState("last-year");
  const [state, setState] = useState<{ status: "idle" | "loading" | "success" | "error"; data?: ContributionResponse; message?: string }>({
    status: "idle",
  });
  const currentYear = new Date().getUTCFullYear();
  const rangeOptions = ["last-year", String(currentYear - 1), String(currentYear - 2)];
  const selectedRange = useMemo(() => getCalendarRange(range), [range]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      username: site.githubUsername,
      from: selectedRange.from,
      to: selectedRange.to,
    });

    setState({ status: "loading" });
    fetch(`/api/github-contributions?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Contribution data is unavailable right now.");
        const payload = (await response.json()) as ContributionResponse;
        if (!Array.isArray(payload.weeks) || typeof payload.totalContributions !== "number") {
          throw new Error("The contribution response was incomplete.");
        }
        return payload;
      })
      .then((data) => setState({ status: "success", data }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ status: "error", message: error instanceof Error ? error.message : "Contribution data is unavailable right now." });
      });

    return () => controller.abort();
  }, [selectedRange.from, selectedRange.to]);

  return (
    <Section
      id="github"
      eyebrow="08 / GitHub activity"
      title="The public rhythm of the work."
      intro="Live contribution data is requested from GitHub through a server-side endpoint. No response means no invented total."
    >
      <div className="github-card">
        <div className="github-card-topline">
          <div>
            <div className="github-title-line">
              <GitBranch size={24} aria-hidden="true" />
              <h3>{site.githubUsername}</h3>
            </div>
            <p className="muted-copy">Contributions / {selectedRange.label}</p>
          </div>
          <label className="range-select">
            <span>Range</span>
            <select value={range} onChange={(event) => setRange(event.target.value)}>
              {rangeOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "last-year" ? "Last 12 months" : option}
                </option>
              ))}
            </select>
            <ChevronDown size={17} aria-hidden="true" />
          </label>
        </div>

        {state.status === "loading" || state.status === "idle" ? <ContributionSkeleton /> : null}
        {state.status === "error" ? <ContributionError message={state.message} /> : null}
        {state.status === "success" && state.data ? <ContributionData data={state.data} /> : null}
      </div>
    </Section>
  );
}

function ContributionSkeleton() {
  return (
    <div className="calendar-loading" aria-label="Loading contribution activity">
      <div className="calendar-skeleton" aria-hidden="true">
        {Array.from({ length: 52 }, (_, week) => (
          <div className="skeleton-week" key={week}>
            {Array.from({ length: 7 }, (_, day) => <span className="skeleton-cell" key={day} />)}
          </div>
        ))}
      </div>
      <div className="skeleton-copy" aria-hidden="true">
        <span />
        <span />
      </div>
    </div>
  );
}

function ContributionError({ message }: { message?: string }) {
  return (
    <div className="github-error">
      <CircleAlert size={23} aria-hidden="true" />
      <div>
        <h3>Activity unavailable</h3>
        <p>{message || "The live contribution snapshot could not be loaded."}</p>
        <a className="text-link" href={site.github} target="_blank" rel="noreferrer">
          Open GitHub profile <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

function ContributionData({ data }: { data: ContributionResponse }) {
  const days = data.weeks.flatMap((week) => week.contributionDays);
  const rangeLabel = `${formatDate(data.from)} — ${formatDate(data.to)}`;

  return (
    <>
      <div className="github-summary">
        <div>
          <strong>{data.totalContributions.toLocaleString()}</strong>
          <span>contributions</span>
        </div>
        <div>
          <strong>{rangeLabel}</strong>
          <span>selected range</span>
        </div>
        <a className="text-link" href={site.github} target="_blank" rel="noreferrer">
          View profile <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="calendar-scroll" tabIndex={0} aria-label="Vertically scrollable GitHub contribution calendar">
        <div className="calendar-grid" aria-label={`GitHub contributions from ${rangeLabel}`}>
          {data.weeks.map((week, index) => (
            <div className="calendar-week" key={`${week.contributionDays[0]?.date || "week"}-${index}`}>
              {week.contributionDays.map((day) => (
                <button
                  className={`contribution-cell ${day.contributionCount > 0 ? "is-filled" : ""}`}
                  type="button"
                  key={day.date}
                  title={`${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                  aria-label={`${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="calendar-legend">
        <span>Less</span>
        <span className="contribution-cell" aria-hidden="true" />
        <span className="contribution-cell is-filled" aria-hidden="true" />
        <span>More</span>
      </div>
      <details className="calendar-text-alternative">
        <summary>Open text alternative</summary>
        <ul>
          {days.map((day) => (
            <li key={day.date}>
              <strong>{formatDate(day.date)}</strong>: {day.contributionCount} contribution{day.contributionCount === 1 ? "" : "s"}
            </li>
          ))}
        </ul>
      </details>
      <p className="github-updated">Last successful update: {formatDateTime(data.fetchedAt)}</p>
    </>
  );
}

function formatDate(value: string) {
  return new Date(value.includes("T") ? value : `${value}T12:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function Footer() {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  async function copyEmail() {
    setCopyFailed(false);
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyFailed(true);
    }
  }

  return (
    <footer className="site-footer section-anchor" id="contact">
      <div className="footer-main">
        <div>
          <p className="eyebrow">09 / Start a project</p>
          <h2>Have a useful idea? Let’s make the next step clear.</h2>
        </div>
        <div className="footer-contact">
          <p className="mini-label">Email</p>
          <a className="contact-email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <div className="footer-actions">
            <button className="button button-light" type="button" onClick={copyEmail}>
              {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
              {copied ? "Copied" : "Copy email"}
            </button>
            <a className="button button-outline-light" href={site.github} target="_blank" rel="noreferrer">
              GitHub <ExternalLink size={17} aria-hidden="true" />
            </a>
          </div>
          <p className="copy-status" aria-live="polite">
            {copyFailed ? "Copy failed — the email above remains selectable." : copied ? "Email copied to clipboard." : ""}
          </p>
        </div>
      </div>
      <div className="footer-bottomline">
        <span>© {new Date().getFullYear()} {site.shortName}</span>
        <span>Web development / WordPress / SEO</span>
        <a className="back-to-top" href="#home">
          Back to top <ArrowUp size={16} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}

function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

function HorizontalPage({ children, onActiveChange }: { children: ReactNode; onActiveChange: (id: string) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const pendingWheelIndexRef = useRef<number | null>(null);
  const wheelLockRef = useRef(false);
  const wheelUnlockTimeoutRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  function getPanels() {
    return Array.from(trackRef.current?.querySelectorAll<HTMLElement>(".section-anchor") ?? []);
  }

  function syncTrack() {
    const track = trackRef.current;
    const panels = getPanels();
    if (!track || !panels.length) return;

    const center = track.scrollLeft + track.clientWidth / 2;
    const nextIndex = panels.reduce((closest, panel, index) => {
      const currentLeft = panel.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
      const closestLeft = panels[closest].getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
      const currentDistance = Math.abs(currentLeft + panel.offsetWidth / 2 - center);
      const closestDistance = Math.abs(closestLeft + panels[closest].offsetWidth / 2 - center);
      return currentDistance < closestDistance ? index : closest;
    }, 0);
    const maxScroll = Math.max(1, track.scrollWidth - track.clientWidth);

    activeIndexRef.current = nextIndex;
    if (pendingWheelIndexRef.current === nextIndex) pendingWheelIndexRef.current = null;
    setActiveIndex(nextIndex);
    setProgress(Math.min(1, Math.max(0, track.scrollLeft / maxScroll)));
    onActiveChange(panels[nextIndex]?.id ?? sectionIds[nextIndex] ?? "home");
  }

  function scrollToSection(id: string, smooth = !reducedMotion, fromWheel = false) {
    const track = trackRef.current;
    const panel = getPanels().find((item) => item.id === id);
    if (!track || !panel) return;
    if (!fromWheel) pendingWheelIndexRef.current = null;
    const left = panel.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    if (smooth) track.scrollTo({ left, behavior: "smooth" });
    else {
      track.scrollLeft = left;
      syncTrack();
    }
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const scheduleSync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncTrack);
    };
    const handleWheel = (event: WheelEvent) => {
      const rawDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      const usesVerticalWheel = Math.abs(event.deltaY) >= Math.abs(event.deltaX) && event.deltaY !== 0;
      if (!rawDelta || track.scrollWidth <= track.clientWidth + 1) return;

      const target = event.target instanceof HTMLElement ? event.target : null;
      let element = target;
      let canScrollVertically = false;

      while (element && element !== track) {
        const styles = getComputedStyle(element);
        const isScrollable = (styles.overflowY === "auto" || styles.overflowY === "scroll") && element.scrollHeight > element.clientHeight + 1;
        if (usesVerticalWheel && isScrollable) {
          const maxScroll = element.scrollHeight - element.clientHeight;
          const canScrollUp = element.scrollTop > 0;
          const canScrollDown = element.scrollTop < maxScroll - 1;
          canScrollVertically = event.deltaY < 0 ? canScrollUp : canScrollDown;
          if (canScrollVertically) break;
        }
        element = element.parentElement;
      }

      if (canScrollVertically) return;

      event.preventDefault();
      if (wheelLockRef.current) return;

      const currentIndex = pendingWheelIndexRef.current ?? activeIndexRef.current;
      const direction = rawDelta > 0 ? 1 : -1;
      const nextIndex = Math.min(sectionIds.length - 1, Math.max(0, currentIndex + direction));
      if (nextIndex === currentIndex) return;

      pendingWheelIndexRef.current = nextIndex;
      wheelLockRef.current = true;
      if (wheelUnlockTimeoutRef.current !== null) window.clearTimeout(wheelUnlockTimeoutRef.current);
      wheelUnlockTimeoutRef.current = window.setTimeout(() => {
        wheelLockRef.current = false;
        wheelUnlockTimeoutRef.current = null;
      }, reducedMotion ? 120 : 520);
      scrollToSection(sectionIds[nextIndex], !reducedMotion, true);
    };
    const handleRequest = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (typeof id === "string") scrollToSection(id);
    };
    const handleHashChange = () => {
      const id = window.location.hash.slice(1);
      if (sectionIds.includes(id)) window.setTimeout(() => scrollToSection(id, false), 80);
    };

    const wheelOptions = { passive: false, capture: true };
    scheduleSync();
    track.addEventListener("scroll", scheduleSync, { passive: true });
    document.addEventListener("wheel", handleWheel, wheelOptions);
    window.addEventListener("resize", scheduleSync);
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("portfolio:navigate", handleRequest);
    const hashFrame = requestAnimationFrame(handleHashChange);
    const hashTimeout = window.setTimeout(handleHashChange, 120);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(hashFrame);
      window.clearTimeout(hashTimeout);
      if (wheelUnlockTimeoutRef.current !== null) window.clearTimeout(wheelUnlockTimeoutRef.current);
      track.removeEventListener("scroll", scheduleSync);
      document.removeEventListener("wheel", handleWheel, wheelOptions);
      window.removeEventListener("resize", scheduleSync);
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("portfolio:navigate", handleRequest);
    };
  }, [reducedMotion]);

  return (
    <div className="horizontal-page-shell">
      <div
        className="horizontal-page"
        ref={trackRef}
        tabIndex={0}
        aria-label="Portfolio sections. Use the arrow keys or horizontal scroll to move between sections."
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const direction = event.key === "ArrowLeft" || event.key === "PageUp" ? -1 : 1;
          const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? sectionIds.length - 1 : Math.min(sectionIds.length - 1, Math.max(0, activeIndex + direction));
          scrollToSection(sectionIds[nextIndex]);
        }}
      >
        {children}
      </div>
      <div className="horizontal-page-controls" aria-label="Portfolio section navigation">
        <span className="horizontal-page-count" aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")} / {String(sectionIds.length).padStart(2, "0")}
        </span>
        <span className="horizontal-page-progress" aria-hidden="true">
          <span style={{ width: `${progress * 100}%` }} />
        </span>
        <div className="horizontal-page-buttons">
          <button className="showcase-button" type="button" onClick={() => scrollToSection(sectionIds[activeIndex - 1])} disabled={activeIndex === 0} aria-label="Previous portfolio section">
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button className="showcase-button" type="button" onClick={() => scrollToSection(sectionIds[activeIndex + 1])} disabled={activeIndex === sectionIds.length - 1} aria-label="Next portfolio section">
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PortfolioPage() {
  const [activeId, setActiveId] = useState("home");
  useDocumentMeta(
    "Charles Aeron L. Pelayo — Freelance Web Developer",
    "Freelance web development, WordPress development, and practical SEO by Charles Aeron L. Pelayo.",
  );

  return (
    <MotionConfig reducedMotion="user">
      <SiteChrome activeId={activeId} horizontal>
        <HorizontalPage onActiveChange={setActiveId}>
          <Hero />
          <FeaturedProjects horizontal />
          <ProjectsSection />
          <TechStack />
          <ExperienceSection />
          <AboutSection />
          <BlogSection />
          <GitHubCalendar />
          <Footer />
        </HorizontalPage>
      </SiteChrome>
    </MotionConfig>
  );
}

function ProjectDetailPage({ project }: { project: Project }) {
  useDocumentMeta(`${project.title} — ${site.shortName}`, project.summary);

  return (
    <MotionConfig reducedMotion="user">
      <SiteChrome>
        <article className="detail-page">
          <a className="back-link" href="/#projects">
            <ArrowLeft size={17} aria-hidden="true" /> Back to projects
          </a>
          <div className="detail-heading">
            <div>
              <p className="eyebrow">Case study / {project.year}</p>
              <h1>{project.title}</h1>
              <p className="detail-lede">{project.summary}</p>
            </div>
            <div className="badge-row detail-badges">
              <span className="badge">{project.label}</span>
              <span className="badge badge-inverted">{project.status}</span>
            </div>
          </div>
          <ProjectArtwork project={project} index={0} />
          <div className="detail-grid">
            <div>
              <p className="mini-label">The problem</p>
              <p>{project.problem}</p>
            </div>
            <div>
              <p className="mini-label">My contribution</p>
              <p>{project.contribution}</p>
            </div>
          </div>
          <div className="detail-delivered">
            <div>
              <p className="mini-label">Delivered</p>
              <h2>Useful pieces, shipped.</h2>
            </div>
            <ul className="check-list">
              {project.delivered.map((item) => (
                <li key={item}>
                  <Check size={18} aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="detail-footer-actions">
            <a className="button button-primary" href={`mailto:${site.email}`}>
              Start a project <Send size={18} aria-hidden="true" />
            </a>
            {project.repository && (
              <a className="button button-secondary" href={project.repository} target="_blank" rel="noreferrer">
                View repository <ExternalLink size={18} aria-hidden="true" />
              </a>
            )}
          </div>
        </article>
      </SiteChrome>
    </MotionConfig>
  );
}

function BlogDetailPage({ post }: { post: BlogPost }) {
  useDocumentMeta(`${post.title} — ${site.shortName}`, post.excerpt);

  return (
    <MotionConfig reducedMotion="user">
      <SiteChrome>
        <article className="detail-page article-page">
          <a className="back-link" href="/#blog">
            <ArrowLeft size={17} aria-hidden="true" /> Back to notes
          </a>
          <p className="eyebrow">{post.topic} / {post.date}</p>
          <h1>{post.title}</h1>
          <p className="detail-lede">{post.excerpt}</p>
          <div className="article-copy">
            {post.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <a className="button button-primary" href="/#contact">
            Start a project <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </article>
      </SiteChrome>
    </MotionConfig>
  );
}

function NotFoundPage() {
  useDocumentMeta(`Page not found — ${site.shortName}`, "The requested page could not be found.");

  return (
    <MotionConfig reducedMotion="user">
      <SiteChrome>
        <article className="detail-page not-found-page">
          <p className="eyebrow">404 / Not found</p>
          <h1>That page is not here.</h1>
          <p className="detail-lede">The link may be old, unpublished, or simply mistyped.</p>
          <a className="button button-primary" href="/">
            Return home <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </article>
      </SiteChrome>
    </MotionConfig>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path.startsWith("/projects/")) {
    const project = projects.find((item) => item.slug === path.slice("/projects/".length));
    return project ? <ProjectDetailPage project={project} /> : <NotFoundPage />;
  }

  if (path.startsWith("/blog/")) {
    const post = blogPosts.find((item) => item.slug === path.slice("/blog/".length));
    return post ? <BlogDetailPage post={post} /> : <NotFoundPage />;
  }

  return <PortfolioPage />;
}
