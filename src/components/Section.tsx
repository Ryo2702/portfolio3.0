import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
  animate = true,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  animate?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <motion.section
      id={id}
      className={`content-section section-anchor ${isVisible ? "is-visible" : ""} ${className}`}
      initial={!animate || reducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={animate ? { once: true, amount: 0.12 } : undefined}
      transition={animate ? { duration: reducedMotion ? 0 : 0.32, ease: "easeOut" } : undefined}
      onViewportEnter={() => setIsVisible(true)}
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        {intro && <p className="section-intro">{intro}</p>}
      </div>
      {children}
    </motion.section>
  );
}

export function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}
