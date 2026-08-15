import {
  createUnauthorizedResponse,
  deleteRepositoryMediaFile,
  isAdminAuthorized,
  listRepositoryMedia,
  writeRepositoryBinaryFile,
} from '@/lib/admin/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const MAX_MEDIA_SIZE = 50 * 1024 * 1024;
const allowedExtensions = new Set([
  'aac',
  'avif',
  'csv',
  'gif',
  'jpeg',
  'jpg',
  'm4a',
  'mov',
  'mp3',
  'mp4',
  'ogg',
  'pdf',
  'png',
  'txt',
  'wav',
  'webm',
  'webp',
  'zip',
]);

export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const files = await listRepositoryMedia();

    return Response.json({ files });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : '媒体列表读取失败。',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return Response.json(
        { message: '请选择要上传的文件。' },
        { status: 400 },
      );
    }

    if (file.size <= 0) {
      return Response.json({ message: '文件不能为空。' }, { status: 400 });
    }

    if (file.size > MAX_MEDIA_SIZE) {
      return Response.json({ message: '文件不能超过 50MB。' }, { status: 400 });
    }

    const extension = getSafeExtension(file);

    if (!extension || !allowedExtensions.has(extension)) {
      return Response.json({ message: '不支持该文件类型。' }, { status: 400 });
    }

    const now = new Date();
    const mediaType = getMediaType(file.type);
    const year = String(now.getFullYear());
    const fileName = `${formatTimestamp(now)}-${createSuffix()}.${extension}`;
    const mediaPath = `${mediaType}/${year}/${fileName}`;
    const repositoryPath = `content/media/${mediaPath}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await writeRepositoryBinaryFile({
      content: buffer,
      filePath: repositoryPath,
      message: `feat: upload media ${fileName}`,
    });

    return Response.json({
      file: {
        appUrl: `/media/${mediaPath}`,
        key: repositoryPath,
        name: file.name,
        size: file.size,
        type: file.type,
        url: `/media/${mediaPath}`,
      },
      message: '文件上传成功。',
      result,
    });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : '文件上传失败。',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAdminAuthorized(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const mediaPath = new URL(request.url).searchParams.get('path');

    if (!mediaPath) {
      return Response.json(
        { message: '请指定要删除的媒体路径。' },
        { status: 400 },
      );
    }

    const result = await deleteRepositoryMediaFile(mediaPath);

    return Response.json({
      message: '媒体文件已删除。',
      result,
    });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : '媒体文件删除失败。',
      },
      { status: 500 },
    );
  }
}

function getMediaType(mimeType: string) {
  if (mimeType.startsWith('image/')) return 'photos';
  if (mimeType.startsWith('video/')) return 'videos';
  if (mimeType.startsWith('audio/')) return 'audio';

  return 'files';
}

function getSafeExtension(file: File) {
  const nameExtension = file.name.split('.').pop()?.toLowerCase() || '';

  return nameExtension.replace(/[^a-z0-9]/g, '');
}

function formatTimestamp(date: Date) {
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${month}-${day}-${hours}-${minutes}-${seconds}`;
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function createSuffix() {
  return crypto.randomUUID().slice(0, 8);
}
