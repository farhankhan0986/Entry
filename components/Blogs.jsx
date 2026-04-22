import { getAllBlogs } from '../lib/actions/blogActions';
import BlogsGrid from "./BlogsGrid";

export default async function Blogs({ limit, hot }) {
  const allBlogs = await getAllBlogs();
  
  const hotSlugs = [
    "top-5-emerging-countries-for-digital-nomads-in-2026-beyond-bali-dubai",
    "science-of-first-impressions-how-to-be-the-most-interesting-person-in-the-room",
    "how-to-build-a-10k-month-personal-brand-while-working-a-9-5",
    "why-quiet-people-often-have-the-strongest-minds",
    "messi-vs-ronaldo-who-truly-had-better-prime",
    "michael-jackson-biography-king-of-pop-legacy",
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