import { drainPendingMedia } from '@/lib/admin/pending-media';

function getPayloadMessage(payload: unknown) {
  if (
    payload &&
    typeof payload === 'object' &&
    'message' in payload &&
    typeof payload.message === 'string'
  ) {
    return payload.message;
  }

  return '';
}

function getHttpFallbackMessage(response: Response, fallbackMessage: string) {
  if (response.status === 401) {
    return '管理员口令错误或未配置，请检查 ADMIN_PASSWORD。';
  }

  if (response.status === 403) {
    return '没有权限执行该操作，请检查管理员口令。';
  }

  if (response.status === 404) {
    return '后台接口不存在，请确认部署包含 /api/admin/* 路由。';
  }

  if (response.status >= 500) {
    return `后台接口异常（${response.status}），请查看部署日志。`;
  }

  return fallbackMessage;
}

function tryParseJson(text: string) {
  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export async function readAdminResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  const payload =
    contentType.includes('application/json') || /^[\s\r\n]*[{[]/.test(text)
      ? tryParseJson(text)
      : null;

  if (!response.ok) {
    throw new Error(
      getPayloadMessage(payload) ||
        getHttpFallbackMessage(response, fallbackMessage),
    );
  }

  if (payload === null) {
    throw new Error(
      text.trim().startsWith('<')
        ? '后台接口返回了 HTML 页面而不是 JSON，请检查 Vercel 部署中的 /api/admin/* 路由。'
        : fallbackMessage,
    );
  }

  return payload as T;
}

export async function uploadPendingMediaAndRewriteContent(
  content: string,
  adminToken: string,
): Promise<string> {
  const pending = drainPendingMedia();

  if (pending.size === 0) {
    return content;
  }

  let rewritten = content;

  for (const [blobUrl, file] of pending) {
    if (!rewritten.includes(blobUrl)) {
      URL.revokeObjectURL(blobUrl);
      continue;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/media', {
      body: formData,
      headers: { 'x-admin-token': adminToken },
      method: 'POST',
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new Error(data.message || `媒体文件 ${file.name} 上传失败。`);
    }

    const data = (await response.json()) as { file?: { url?: string } };
    const finalUrl = data.file?.url;

    if (finalUrl) {
      rewritten = rewritten.split(blobUrl).join(finalUrl);
    }

    URL.revokeObjectURL(blobUrl);
  }

  return rewritten;
}
