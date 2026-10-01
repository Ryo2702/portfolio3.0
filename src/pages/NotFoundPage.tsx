import { ArrowUpRight } from "lucide-react";
import { MotionConfig } from "motion/react";
import { PortfolioLayout } from "../components/layout/PortfolioLayout";
import { site } from "../data/portfolio";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export function NotFoundPage() {
  useDocumentMeta(`Page not found — ${site.shortName}`, "The requested page could not be found.");

  return (
    <MotionConfig reducedMotion="user">
      <PortfolioLayout>
        <article className="detail-page not-found-page">
          <p className="eyebrow">404 / Not found</p>
          <h1>That page is not here.</h1>
          <p className="detail-lede">The link may be old, unpublished, or simply mistyped.</p>
          <a className="button button-primary" href="/">
            Return home <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </article>
      </PortfolioLayout>
    </MotionConfig>
  );
}
