import { getAllBlogs } from '../lib/actions/blogActions';
import BlogsGrid from "./BlogsGrid";

export default async function Blogs({ limit, hot }) {
  const allBlogs = await getAllBlogs();
  
  const hotSlugs = [
    "north-korea",
    "what-are-the-backrooms-explained-and-the-janitor-story",
    "porsche-911-complete-specs-performance-price",
    "inside-russian-sleep-experiment-horror-madness-darkest-human-test",
    "inside-north-korea-country-world-barely-understands",
    "nikola-tesla-biography-man-who-powered-the-modern-world",
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