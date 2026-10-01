import { Briefcase } from "lucide-react";
import type { ExperienceEntry } from "../../types/portfolio";

export function TimelineItem({ entry }: { entry: ExperienceEntry }) {
  return (
    <article className="timeline-entry">
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
  );
}
