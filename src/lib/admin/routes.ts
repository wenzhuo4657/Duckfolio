import type { ProfileConfig } from '@/types/platform-config';
import {
  createPostMarkdown,
  createUnauthorizedResponse,
  deleteRepositoryPost,
  isAdminAuthorized,
  listRepositoryPosts,
  normalizePostSlug,
  readRepositoryPost,
  updateRepositoryPostDraft,
  validatePlatformConfig,
  writeRepositoryFile,
} from '@/lib/admin/content';

type PostRequestBody = Record<string, unknown>;

export async function handleGetPosts(request: Request) {
  if (!isAdminAuthorized(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const slug = new URL(request.url).searchParams.get('slug');

    if (slug) {
      const post = await readRepositoryPost(slug);

      if (!post) {
        return Response.json({ message: '文章不存在。' }, { status: 404 });
      }

      return Response.json({ post });
    }

    const posts = await listRepositoryPosts();

    return Response.json({ posts });
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error ? error.message : '文章列表读取失败。',
      },
      { status: 500 },
    );
  }
}

export const handleListPosts = handleGetPosts;

export async function handlePublishPost(request: Request) {
  if (!isAdminAuthorized(request)) {
    return createUnauthorizedResponse();
  }

  try {
    return await savePostFromBody((await request.json()) as PostRequestBody);
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : '文章发布失败。',
      },
      { status: 500 },
    );
  }
}

export async function handleUpdatePost(request: Request) {
  if (!isAdminAuthorized(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const body = (await request.json()) as PostRequestBody;

    if (body.operation === 'visibility') {
      const slug = normalizePostSlug(String(body.slug || ''));

      if (!slug) {
        return Response.json(
          { message: '请输入有效的文章路径。' },
          { status: 400 },
        );
      }

      const draft = Boolean(body.draft);
      const result = await updateRepositoryPostDraft(slug, draft);

      return Response.json({
        message: draft ? '文章已设为草稿。' : '文章已设为公开。',
        result,
        slug,
      });
    }

    return await savePostFromBody(body);
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : '文章更新失败。',
      },
      { status: 500 },
    );
  }
}

export async function handleDeletePost(request: Request) {
  if (!isAdminAuthorized(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const slug = normalizePostSlug(
      new URL(request.url).searchParams.get('slug') || '',
    );

    if (!slug) {
      return Response.json(
        { message: '请输入有效的文章路径。' },
        { status: 400 },
      );
    }

    const result = await deleteRepositoryPost(slug);

    return Response.json({
      message: '文章已删除。',
      result,
      slug,
    });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : '文章删除失败。',
      },
      { status: 500 },
    );
  }
}

export async function handleSaveConfig(request: Request) {
  if (!isAdminAuthorized(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const config = validatePlatformConfig((await request.json()) as ProfileConfig);
    const result = await writeRepositoryFile({
      content: `${JSON.stringify(config, null, 2)}\n`,
      filePath: 'public/platform-config.json',
      message: 'chore: update platform config',
    });

    return Response.json({
      message: '配置保存成功。',
      result,
    });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : '配置保存失败。',
      },
      { status: 500 },
    );
  }
}

async function savePostFromBody(body: PostRequestBody) {
  const title = String(body.title || '').trim();
  const slug = normalizePostSlug(String(body.slug || title));
  const originalSlug = normalizePostSlug(String(body.originalSlug || ''));
  const content = String(body.content || '').trim();
  const date = String(body.date || new Date().toISOString());
  const description = String(body.description || '').trim();
  const tags = Array.isArray(body.tags)
    ? (body.tags as unknown[]).map((tag) => String(tag).trim()).filter(Boolean)
    : [];

  if (!title) {
    return Response.json({ message: '请输入文章标题。' }, { status: 400 });
  }

  if (!slug) {
    return Response.json({ message: '请输入有效的文章路径。' }, { status: 400 });
  }

  if (!content) {
    return Response.json({ message: '文章正文不能为空。' }, { status: 400 });
  }

  const markdown = createPostMarkdown({
    content,
    date,
    description,
    draft: Boolean(body.draft),
    tags,
    title,
  });

  const result = await writeRepositoryFile({
    content: markdown,
    filePath: `posts/${slug}.md`,
    message: originalSlug
      ? `chore: update post "${title}"`
      : `feat: publish post "${title}"`,
  });

  let cleanupError = '';

  if (originalSlug && originalSlug !== slug) {
    try {
      await deleteRepositoryPost(originalSlug);
    } catch (error) {
      cleanupError =
        error instanceof Error ? error.message : '旧文章路径删除失败。';
    }
  }

  return Response.json({
    cleanupError,
    message: cleanupError
      ? `文章已保存，但旧路径删除失败：${cleanupError}`
      : originalSlug
        ? '文章更新成功。'
        : '文章发布成功。',
    result,
    slug,
  });
}
