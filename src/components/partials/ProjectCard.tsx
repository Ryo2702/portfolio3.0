import { ArrowUpRight, ExternalLink } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "../../types/portfolio";
import { ProjectArtwork } from "./ProjectArtwork";

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
