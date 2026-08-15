import { Blog } from '@/components/features/blog';
import { getAllPosts } from '@/lib/blog';

export default function PostsPage() {
  return <Blog posts={getAllPosts()} />;
}
