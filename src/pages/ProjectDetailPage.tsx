import { ArrowLeft, Check, ExternalLink, Send } from "lucide-react";
import { MotionConfig } from "motion/react";
import { ProjectArtwork } from "../components/partials/ProjectArtwork";
import { PortfolioLayout } from "../components/layout/PortfolioLayout";
import { site } from "../data/portfolio";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import type { Project } from "../types/portfolio";

export function ProjectDetailPage({ project }: { project: Project }) {
  useDocumentMeta(`${project.title} — ${site.shortName}`, project.summary);

  return (
    <MotionConfig reducedMotion="user">
      <PortfolioLayout>
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
              <p className="mini-label">Highlights</p>
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
            {project.demo && (
              <a className="button button-secondary" href={project.demo} target="_blank" rel="noreferrer">
                Live preview <ExternalLink size={18} aria-hidden="true" />
              </a>
            )}
            {project.repository && (
              <a className="button button-secondary" href={project.repository} target="_blank" rel="noreferrer">
                View repository <ExternalLink size={18} aria-hidden="true" />
              </a>
            )}
          </div>
        </article>
      </PortfolioLayout>
    </MotionConfig>
  );
}
