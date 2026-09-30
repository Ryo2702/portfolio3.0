import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink, Send } from "lucide-react";
import { MotionConfig } from "motion/react";
import { blogPosts, projects, site, type BlogPost, type Project } from "./data";
import { AboutSection } from "./components/About";
import { BlogSection } from "./components/Blog";
import { ExperienceSection } from "./components/Experience";
import { Footer } from "./components/Footer";
import { GitHubCalendar } from "./components/GitHubCalendar";
import { Hero } from "./components/Hero";
import { HorizontalPage } from "./components/HorizontalPage";
import { ProjectArtwork, FeaturedProjects, ProjectsSection } from "./components/Projects";
import { SiteChrome } from "./components/SiteChrome";
import { TechStack } from "./components/TechStack";

function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute("content", description);
  }, [description, title]);
}

export function PortfolioPage() {
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

export function ProjectDetailPage({ project }: { project: Project }) {
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
      </SiteChrome>
    </MotionConfig>
  );
}

export function BlogDetailPage({ post }: { post: BlogPost }) {
  useDocumentMeta(post.seoTitle || `${post.title} — ${site.shortName}`, post.metaDescription || post.excerpt);

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
            {post.sections.map((section) => (
              <section className="article-section" key={section.heading || section.paragraphs[0]}>
                {section.heading && <h2>{section.heading}</h2>}
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </section>
            ))}
          </div>
          <a className="button button-primary" href="/#contact">
            Start a project <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </article>
      </SiteChrome>
    </MotionConfig>
  );
}

export function NotFoundPage() {
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

export function resolvePage(path: string) {
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
