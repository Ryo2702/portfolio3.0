import { ArrowUpRight, PenLine } from "lucide-react";
import { blogPosts, type BlogPost } from "../data";
import { EmptyState, Section } from "./Section";

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

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="blog-card">
      <div className="project-card-topline">
        <span className="badge">{post.topic}</span>
        <span className="project-year">{post.date}</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <div className="project-tags">
        {post.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <a className="text-link" href={`/blog/${post.slug}`}>
        Read article <ArrowUpRight size={17} aria-hidden="true" />
      </a>
    </article>
  );
}
