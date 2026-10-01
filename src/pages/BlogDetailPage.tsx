import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MotionConfig } from "motion/react";
import { PortfolioLayout } from "../components/layout/PortfolioLayout";
import { site } from "../data/portfolio";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import type { BlogPost } from "../types/portfolio";

export function BlogDetailPage({ post }: { post: BlogPost }) {
  useDocumentMeta(post.seoTitle || `${post.title} — ${site.shortName}`, post.metaDescription || post.excerpt);

  return (
    <MotionConfig reducedMotion="user">
      <PortfolioLayout>
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
      </PortfolioLayout>
    </MotionConfig>
  );
}
