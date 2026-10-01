import { useEffect, useRef, useState, type ReactNode } from "react";
import { MobileNav } from "./MobileNav";
import { SidebarNav } from "./SidebarNav";
import { useTheme } from "../../features/theme/useTheme";

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

export function PortfolioLayout({ activeId, horizontal = false, children }: { activeId?: string; horizontal?: boolean; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, themePressed, handleThemeToggle } = useTheme();
  const hrefPrefix = window.location.pathname === "/" ? "" : "/";

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <DotCursor />
      <SidebarNav
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
        <MobileNav
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
