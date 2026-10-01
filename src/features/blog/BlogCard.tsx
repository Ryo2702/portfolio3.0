import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "../../types/portfolio";

export function BlogCard({ post }: { post: BlogPost }) {
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
