import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, MapPin, Menu, Moon, Sun, X } from "lucide-react";
import { NavItem, requestHorizontalSection, sectionLinks } from "./navigation";

export type Theme = "light" | "dark";

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
      cursor.classList.toggle("is-on-footer", target instanceof Element && Boolean(target.closest(".site-footer")));
      if (!frame) frame = requestAnimationFrame(render);
    };

    const hide = () => cursor.classList.remove("is-visible", "is-hovering", "is-on-footer");
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

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

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
  onToggle: (event: MouseEvent<HTMLButtonElement>) => void;
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

export function SiteChrome({ activeId, horizontal = false, children }: { activeId?: string; horizontal?: boolean; children: ReactNode }) {
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

  const handleThemeToggle = (event: MouseEvent<HTMLButtonElement>) => {
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
      <Sidebar
        activeId={activeId}
        hrefPrefix={hrefPrefix}
        collapsed={collapsed}
        horizontal={horizontal}
        onToggle={() => setCollapsed((value) => !value)}
        theme={theme}
        themePressed={themePressed}
        onThemeToggle={handleThemeToggle}
      />
      <main className={`main-content ${horizontal ? "horizontal-main" : ""}`} id="main-content">
        <MobileHeader
          activeId={activeId}
          hrefPrefix={hrefPrefix}
          horizontal={horizontal}
          theme={theme}
          themePressed={themePressed}
          onThemeToggle={handleThemeToggle}
        />
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
  onThemeToggle: (event: MouseEvent<HTMLButtonElement>) => void;
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
