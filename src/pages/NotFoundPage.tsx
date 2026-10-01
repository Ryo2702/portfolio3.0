import { ArrowLeft, House } from "lucide-react";
import { motion, MotionConfig, useReducedMotion } from "motion/react";
import { PortfolioLayout } from "../components/layout/PortfolioLayout";
import { site } from "../data/portfolio";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export function NotFoundPage() {
  useDocumentMeta(`Page not found — ${site.shortName}`, "The requested page could not be found.");

  return (
    <MotionConfig reducedMotion="user">
      <NotFoundContent />
    </MotionConfig>
  );
}

function NotFoundContent() {
  const reducedMotion = useReducedMotion();

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.assign("/");
  }

  return (
    <PortfolioLayout>
      <motion.article
        className="detail-page not-found-page"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
      >
        <div className="not-found-frame">
          <motion.div
            className="not-found-dots"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={reducedMotion ? { opacity: 0.28 } : { opacity: [0.28, 0.44, 0.28], backgroundPosition: ["0 0", "14px 10px", "0 0"] }}
            transition={reducedMotion ? { duration: 0 } : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="not-found-copy">
            <p className="eyebrow">404 / Not found</p>
            <p className="not-found-code" aria-hidden="true">404</p>
            <h1>This page got lost in the dots.</h1>
            <p className="detail-lede">The page may have moved, or the link may be incorrect.</p>
            <div className="not-found-actions">
              <a className="button button-primary" href="/">
                <House size={18} aria-hidden="true" /> Back to Home
              </a>
              <button className="button button-secondary" type="button" onClick={goBack}>
                <ArrowLeft size={18} aria-hidden="true" /> Go Back
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    </PortfolioLayout>
  );
}
