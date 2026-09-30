import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Briefcase, ChevronLeft, ChevronRight, ExternalLink, Layers } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { projects, type Project } from "../data";
import { EmptyState, Section } from "./Section";

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

export function ProjectsSection() {
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

export function ProjectCard({ project, featured = false, index = 0 }: { project: Project; featured?: boolean; index?: number }) {
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
          {project.demo && (
            <a className="text-link muted-link" href={project.demo} target="_blank" rel="noreferrer">
              Live preview <ExternalLink size={15} aria-hidden="true" />
            </a>
          )}
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

export function ProjectArtwork({ project, index }: { project: Project; index: number }) {
  const images = project.images ?? [];
  const reducedMotion = useReducedMotion();
  const [activeImage, setActiveImage] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveImage(0);
    galleryRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [project.slug]);

  function selectImage(nextIndex: number) {
    if (!images.length) return;
    const next = Math.min(images.length - 1, Math.max(0, nextIndex));
    setActiveImage(next);
    galleryRef.current?.scrollTo({
      left: next * galleryRef.current.clientWidth,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  function handleGalleryScroll() {
    const gallery = galleryRef.current;
    if (!gallery || !gallery.clientWidth || !images.length) return;
    setActiveImage(Math.min(images.length - 1, Math.max(0, Math.round(gallery.scrollLeft / gallery.clientWidth))));
  }

  return (
    <div className={`project-artwork ${images.length ? "has-preview" : ""}`}>
      {images.length > 0 && (
        <div
          className="project-gallery-viewport"
          ref={galleryRef}
          role="region"
          aria-label={`${project.title} project screenshots`}
          aria-roledescription="carousel"
          tabIndex={0}
          onScroll={handleGalleryScroll}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              selectImage(activeImage - 1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              selectImage(activeImage + 1);
            }
          }}
        >
          {images.map((image, imageIndex) => (
            <div className="project-gallery-slide" key={image} role="group" aria-roledescription="slide" aria-label={`${imageIndex + 1} of ${images.length}`}>
              <img className="project-preview" src={image} alt={`${project.title} screenshot ${imageIndex + 1} of ${images.length}`} />
            </div>
          ))}
        </div>
      )}
      <div className="artwork-topline">
        <span>{String(index + 1).padStart(2, "0")} / CASE</span>
        <span>{project.year}</span>
      </div>
      {images.length > 1 && (
        <div className="project-gallery-controls" aria-label={`${project.title} screenshot navigation`}>
          <span aria-live="polite">{String(activeImage + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
          <div className="featured-buttons">
            <button className="showcase-button" type="button" onClick={() => selectImage(activeImage - 1)} disabled={activeImage === 0} aria-label="Previous project screenshot">
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button className="showcase-button" type="button" onClick={() => selectImage(activeImage + 1)} disabled={activeImage === images.length - 1} aria-label="Next project screenshot">
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
      {!images.length && (
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
      )}
      <strong>{project.title}</strong>
    </div>
  );
}
