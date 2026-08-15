export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface ModelItem {
  id?: unknown;
}

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function getModelsUrl(baseURL: string) {
  return `${baseURL.replace(/\/+$/, '')}/models`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const apiKey = clean(body.apiKey);
    const baseURL = clean(body.baseURL);

    if (!apiKey || !baseURL) {
      return Response.json(
        { message: '请先填写 AI API Key 和 Base URL。', models: [] },
        { status: 400 },
      );
    }

    const response = await fetch(getModelsUrl(baseURL), {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      method: 'GET',
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      return Response.json(
        {
          message:
            typeof data?.error?.message === 'string'
              ? data.error.message
              : typeof data?.message === 'string'
                ? data.message
                : `模型列表读取失败（${response.status}）。`,
          models: [],
        },
        { status: response.status },
      );
    }

    const models = Array.isArray(data?.data)
      ? data.data
          .map((model: ModelItem) => clean(model.id))
          .filter(Boolean)
          .map((id: string) => ({ label: id, value: id }))
      : [];

    return Response.json({ models });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : '模型列表读取失败。',
        models: [],
      },
      { status: 500 },
    );
  }
}
