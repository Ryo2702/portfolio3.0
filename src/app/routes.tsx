import { blogPosts, projects } from "../data/portfolio";
import { BlogDetailPage } from "../pages/BlogDetailPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PortfolioPage } from "../pages/PortfolioPage";
import { ProjectDetailPage } from "../pages/ProjectDetailPage";

export function resolvePage(path: string) {
  if (path.startsWith("/projects/")) {
    const project = projects.find((item) => item.slug === path.slice("/projects/".length));
    return project ? <ProjectDetailPage project={project} /> : <NotFoundPage />;
  }

  if (path.startsWith("/blog/")) {
    const post = blogPosts.find((item) => item.slug === path.slice("/blog/".length));
    return post ? <BlogDetailPage post={post} /> : <NotFoundPage />;
  }

  return <PortfolioPage />;
}
