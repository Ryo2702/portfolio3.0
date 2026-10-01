import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import type { Project } from "../../types/portfolio";

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
