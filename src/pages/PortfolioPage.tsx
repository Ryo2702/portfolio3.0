import { useState } from "react";
import { MotionConfig } from "motion/react";
import { AboutSection } from "../components/sections/About";
import { BlogSection } from "../features/blog/Blog";
import { ExperienceSection } from "../components/sections/Experience";
import { Footer } from "../components/layout/Footer";
import { GitHubCalendar } from "../features/github/GitHubCalendar";
import { Hero } from "../components/sections/Hero";
import { HorizontalPage } from "../components/layout/HorizontalPage";
import { FeaturedProjects } from "../features/projects/FeaturedProjects";
import { ProjectsSection } from "../features/projects/ProjectsSection";
import { PortfolioLayout } from "../components/layout/PortfolioLayout";
import { TechStack } from "../components/sections/TechStack";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export function PortfolioPage() {
  const [activeId, setActiveId] = useState("home");
  useDocumentMeta(
    "Charles Aeron L. Pelayo — Freelance Web Developer",
    "Freelance web development, WordPress development, and practical SEO by Charles Aeron L. Pelayo.",
  );

  return (
    <MotionConfig reducedMotion="user">
      <PortfolioLayout activeId={activeId} horizontal>
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
      </PortfolioLayout>
    </MotionConfig>
  );
}
