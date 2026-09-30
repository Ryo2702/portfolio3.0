import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { sectionIds } from "./navigation";

export function HorizontalPage({ children, onActiveChange }: { children: ReactNode; onActiveChange: (id: string) => void }) {
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
      let canScrollHorizontally = false;

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

        const horizontalDelta = usesVerticalWheel ? event.deltaY : event.deltaX;
        const isHorizontallyScrollable = (styles.overflowX === "auto" || styles.overflowX === "scroll") && element.scrollWidth > element.clientWidth + 1;
        if (horizontalDelta && isHorizontallyScrollable) {
          const maxScroll = element.scrollWidth - element.clientWidth;
          const canScrollLeft = element.scrollLeft > 0;
          const canScrollRight = element.scrollLeft < maxScroll - 1;
          canScrollHorizontally = horizontalDelta < 0 ? canScrollLeft : canScrollRight;
          if (canScrollHorizontally) break;
        }
        element = element.parentElement;
      }

      if (canScrollVertically) return;
      if (canScrollHorizontally && element) {
        const horizontalDelta = usesVerticalWheel ? event.deltaY : event.deltaX;
        const maxScroll = element.scrollWidth - element.clientWidth;
        element.scrollLeft = Math.min(maxScroll, Math.max(0, element.scrollLeft + horizontalDelta));
        event.preventDefault();
        return;
      }

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
