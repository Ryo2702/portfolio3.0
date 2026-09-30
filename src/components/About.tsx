import { ArrowUpRight } from "lucide-react";
import { Section } from "./Section";

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
            <li>
              <span>01</span>
              <div>
                <strong>Understand</strong>
                <p>Clarify the audience, offer, and next action.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Build</strong>
                <p>Shape the content and interface into a responsive page.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Refine</strong>
                <p>Test the important paths, then hand over something maintainable.</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </Section>
  );
}
