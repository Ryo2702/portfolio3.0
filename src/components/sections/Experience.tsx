import { experience } from "../../data/portfolio";
import { TimelineItem } from "../partials/TimelineItem";
import { Section } from "../shared/Section";

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
          <TimelineItem key={`${entry.role}-${entry.organization}`} entry={entry} />
        ))}
      </div>
    </Section>
  );
}
