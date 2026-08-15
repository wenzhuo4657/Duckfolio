import { readRepositoryMediaFile } from '@/lib/admin/content';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{
    path: string[];
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { path } = await context.params;
    const mediaPath = path.join('/');
    const file = await readRepositoryMediaFile(mediaPath);

    if (!file) {
      return new Response('Not found', { status: 404 });
    }

    return new Response(new Uint8Array(file.content), {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': file.contentType,
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
