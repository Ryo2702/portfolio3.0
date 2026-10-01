import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { ProjectCard } from "../../components/partials/ProjectCard";
import { EmptyState, Section } from "../../components/shared/Section";
import { projects } from "../../data/portfolio";

export function FeaturedProjects({ horizontal = false }: { horizontal?: boolean }) {
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
