import { ArrowUpRight } from "lucide-react";
import { processSteps } from "../../data/portfolio";
import { Section } from "../shared/Section";

export function AboutSection() {
  return (
    <Section
      id="about"
      eyebrow="06 / About"
      title="Make the useful thing clear."
      intro="Good web work removes questions. The page should tell people what is offered, why it matters, and what to do next."
    >
      <div className="about-grid">
        <div className="about-copy">
          <p className="about-lede">Writing readable, reusable, maintainable, and well-structured code.</p>
          <p>
            My core services are web development, WordPress development, and SEO. The scope stays practical: responsive layouts, service pages, inquiry paths, maintainable content, and on-page foundations that give search engines a clearer page to read.
          </p>
          <a className="text-link" href="#contact">
            Talk about your project <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="process-card">
          <p className="mini-label">A simple delivery path</p>
          <ol className="process-list">
            {processSteps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
