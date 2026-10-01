import { PenLine } from "lucide-react";
import { blogPosts } from "../../data/portfolio";
import { EmptyState, Section } from "../../components/shared/Section";
import { BlogCard } from "./BlogCard";

export function BlogSection() {
  return (
    <Section
      id="blog"
      eyebrow="07 / Notes"
      title="Writing when there is something useful to say."
      intro="Project lessons, implementation notes, WordPress fixes, and practical SEO work — published only when they are ready."
    >
      {blogPosts.length ? (
        <div className="blog-grid">
          {blogPosts.slice(0, 3).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState icon={<PenLine size={24} aria-hidden="true" />} title="No published articles yet." text="Draft ideas stay off the public index until there is a finished article to read." />
      )}
    </Section>
  );
}
