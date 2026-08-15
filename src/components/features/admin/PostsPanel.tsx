'use client';

import { Eye, EyeOff, ExternalLink, Loader2, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminNotice } from './AdminShared';
import type { AdminPostSummary } from './types';
import { formatPostDate } from './utils';

export function PostsPanel({
  isLoading,
  mutatingSlug,
  onDeletePost,
  onEditPost,
  onNewPost,
  onRefresh,
  onToggleVisibility,
  posts,
}: {
  isLoading: boolean;
  mutatingSlug: string | null;
  onDeletePost: (slug: string) => void | Promise<void>;
  onEditPost: (slug: string) => void | Promise<void>;
  onNewPost: () => void;
  onRefresh: () => void | Promise<void>;
  onToggleVisibility: (post: AdminPostSummary) => void | Promise<void>;
  posts: AdminPostSummary[];
}) {
  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-3 border-b border-[#121212]/10 pb-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-medium">文章列表</h2>
          <p className="mt-1 text-sm text-[#121212]/50 dark:text-white/50">
            当前发布目标中的 posts 目录。
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="gap-2"
            type="button"
            variant="outline"
            onClick={() => void onRefresh()}
          >
            <RefreshCw
              className={`size-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            刷新
          </Button>
          <Button className="gap-2" type="button" onClick={onNewPost}>
            <Plus className="size-4" />
            新建文章
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 rounded-lg border border-[#121212]/10 px-4 py-6 text-sm text-[#121212]/60 dark:border-white/10 dark:text-white/60">
          <Loader2 className="size-4 animate-spin" />
          正在读取文章列表...
        </div>
      ) : posts.length ? (
        <div className="grid gap-3">
          {posts.map((post) => {
            const isMutating = mutatingSlug === post.slug;

            return (
              <article
                key={post.path}
                className="grid gap-4 rounded-lg border border-[#121212]/10 p-4 dark:border-white/10 md:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-medium">
                      {post.title}
                    </h3>
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        post.draft
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-200'
                          : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'
                      }`}
                    >
                      {post.draft ? '草稿' : '公开'}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-[#121212]/50 dark:text-white/50">
                    {post.path}
                  </p>
                  {post.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-[#121212]/70 dark:text-white/70">
                      {post.description}
                    </p>
                  )}
                  {post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-[#121212]/5 px-2 py-0.5 text-xs text-[#121212]/60 dark:bg-white/10 dark:text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  <time className="text-sm text-[#121212]/50 dark:text-white/50">
                    {formatPostDate(post.date)}
                  </time>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      aria-label="编辑文章"
                      className="size-9 p-0"
                      disabled={isMutating}
                      title="编辑文章"
                      type="button"
                      variant="outline"
                      onClick={() => void onEditPost(post.slug)}
                    >
                      {isMutating ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Pencil className="size-4" />
                      )}
                    </Button>
                    <Button
                      aria-label={post.draft ? '设为公开' : '设为草稿'}
                      className="size-9 p-0"
                      disabled={isMutating}
                      title={post.draft ? '设为公开' : '设为草稿'}
                      type="button"
                      variant="outline"
                      onClick={() => void onToggleVisibility(post)}
                    >
                      {post.draft ? (
                        <Eye className="size-4" />
                      ) : (
                        <EyeOff className="size-4" />
                      )}
                    </Button>
                    {!post.draft && (
                      <Button
                        asChild
                        aria-label="查看文章"
                        className="size-9 p-0"
                        title="查看文章"
                        type="button"
                        variant="outline"
                      >
                        <a
                          href={`/posts/${post.slug}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      aria-label="删除文章"
                      className="size-9 p-0 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300"
                      disabled={isMutating}
                      title="删除文章"
                      type="button"
                      variant="outline"
                      onClick={() => void onDeletePost(post.slug)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <AdminNotice>
          当前目标分支没有可显示的文章。确认 GITHUB_REPO 和 GITHUB_BRANCH
          指向你的 deploy 分支后再刷新。
        </AdminNotice>
      )}
    </section>
  );
}
