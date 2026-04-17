import { getAllBlogs } from '@/lib/actions/blogActions';
import BlogsGrid from "@/components/BlogsGrid";

export default async function Blogs({journal}) {
  const blogs = await getAllBlogs(journal);
  return <BlogsGrid blogs={blogs} journal={true} />;
}