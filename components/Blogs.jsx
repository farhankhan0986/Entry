import { getAllBlogs } from '../lib/actions/blogActions';
import BlogsGrid from "./BlogsGrid";

export default async function Blogs({ limit, hot }) {
  const allBlogs = await getAllBlogs();
  const blogs = limit ? allBlogs.slice(0, limit) : allBlogs;
  return <BlogsGrid blogs={blogs} hot={hot} />;
}