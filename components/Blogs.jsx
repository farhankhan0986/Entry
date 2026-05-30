import { getAllBlogs } from '../lib/actions/blogActions';
import BlogsGrid from "./BlogsGrid";

export default async function Blogs({ limit, hot }) {
  const allBlogs = await getAllBlogs();
  
  const hotSlugs = [
    "avengers-doomsday-everything-we-know-about-marvels-biggest-gamble-yet",
    "gta-6-why-rockstars-next-game-could-redefine-openworld-gaming-forever",
    "will-ai-take-your-job-the-honest-answer-nobody-wants-to-hear",
    "one-piece-liveaction-season-2-why-netflixs-biggest-bet-is-about-to-get-even-wilder",
    "the-new-space-race-why-2026-is-the-most-important-year-for-mars-exploration",
    "iphone-17-and-apple-intelligence-is-apple-finally-winning-the-ai-race",
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