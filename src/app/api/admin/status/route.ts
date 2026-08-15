import { getConfig } from '@/lib/config';
import { getAdminStatus } from '@/lib/admin/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export function GET() {
  return Response.json({
    config: getConfig(),
    status: getAdminStatus(),
  });
}
