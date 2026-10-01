import { Layers } from "lucide-react";
import { ProjectCard } from "../../components/partials/ProjectCard";
import { EmptyState, Section } from "../../components/shared/Section";
import { projects } from "../../data/portfolio";

export function ProjectsSection() {
  return (
    <Section
      id="projects"
      eyebrow="03 / Project index"
      title="A compact project catalog."
      intro="Published work first. Clear labels for personal projects, prototypes, and client work."
    >
      <div className="project-index-head">
        <p>
          <strong>{projects.length.toString().padStart(2, "0")}</strong> published project{projects.length === 1 ? "" : "s"}
        </p>
        <span className="index-note">The catalog grows as more work is published.</span>
      </div>
      {projects.length ? (
        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState icon={<Layers size={24} aria-hidden="true" />} title="No published projects yet." text="Add a project when there is work with a clear story and a link worth sharing." />
      )}
    </Section>
  );
}
