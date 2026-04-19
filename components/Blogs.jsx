import { getAllBlogs } from '../lib/actions/blogActions';
import BlogsGrid from "./BlogsGrid";

export default async function Blogs({ limit, hot }) {
  const allBlogs = await getAllBlogs();
  
  const hotSlugs = [
    "foods-that-improve-skin-naturally",
    "messi-vs-ronaldo-the-2026-definitive-comparison",
    "tech-salary-leak-report-2026-real-developer-pm-designer-pay",
    "iran",
    "bollywood-top-10-male-actors",
    "7-habits-that-instantly-make-you-more-attractive",
  ];

  let displayBlogs = hot
    ? allBlogs.filter((blog) => hotSlugs.includes(blog.slug))
    : allBlogs;

  const blogs = limit ? displayBlogs.slice(0, limit) : displayBlogs;

  return <BlogsGrid
    blogs={blogs}
    hot={hot}
    hotSlugs={hotSlugs}
  />
}