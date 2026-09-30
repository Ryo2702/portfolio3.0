import { Briefcase } from "lucide-react";
import { experience } from "../data";
import { Section } from "./Section";

export function ExperienceSection() {
  return (
    <Section
      id="experience"
      eyebrow="05 / Experience"
      title="Built around real work."
      intro="A short timeline with the kind of engagement and responsibility visitors can actually understand."
    >
      <div className="timeline">
        {experience.map((entry) => (
          <article className="timeline-entry" key={`${entry.role}-${entry.organization}`}>
            <div className="timeline-marker" aria-hidden="true" />
            <div className="timeline-date">{entry.dates}</div>
            <div className="timeline-card">
              <div className="timeline-card-heading">
                <div>
                  <p className="mini-label">{entry.engagement}</p>
                  <h3>{entry.role}</h3>
                  <p className="timeline-org">{entry.organization}</p>
                  {entry.location && <p className="timeline-location">{entry.location}</p>}
                </div>
                <Briefcase size={22} aria-hidden="true" />
              </div>
              <ul>
                {entry.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
