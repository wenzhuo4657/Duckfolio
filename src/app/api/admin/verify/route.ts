import { isAdminAuthorized } from '@/lib/admin/content';

export const runtime = 'nodejs';

export function POST(request: Request) {
  if (!isAdminAuthorized(request)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  return Response.json({ ok: true });
}
