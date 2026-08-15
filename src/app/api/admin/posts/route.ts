import {
  handleDeletePost,
  handleGetPosts,
  handlePublishPost,
  handleUpdatePost,
} from '@/lib/admin/routes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const DELETE = handleDeletePost;
export const GET = handleGetPosts;
export const PATCH = handleUpdatePost;
export const POST = handlePublishPost;
