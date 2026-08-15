'use client';

import { Loader2, Plus, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PostFormState } from './types';
import { Field } from './AdminShared';
import { DateTimePicker } from './DateTimePicker';
import { PlateMarkdownEditor } from './PlateMarkdownEditor';
import { slugify } from './utils';

interface PostEditorPanelProps {
  editorKey: number;
  editingSlug: string | null;
  isPublishing: boolean;
  post: PostFormState;
  onCancel: () => void;
  onNewPost: () => void;
  onPostChange: (patch: Partial<PostFormState>) => void;
  onPublish: () => void;
}

export function PostEditorPanel({
  editorKey,
  editingSlug,
  isPublishing,
  onCancel,
  onNewPost,
  onPostChange,
  onPublish,
  post,
}: PostEditorPanelProps) {
  return (
    <section className="grid gap-5">
      {editingSlug && (
        <div className="flex flex-col gap-3 rounded-lg border border-[#121212]/10 px-4 py-3 text-sm text-[#121212]/70 dark:border-white/10 dark:text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <span>正在编辑 posts/{editingSlug}.md</span>
          <Button
            className="gap-2"
            type="button"
            variant="outline"
            onClick={onNewPost}
          >
            <Plus className="size-4" />
            新建文章
          </Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="标题">
          <input
            className="admin-input"
            value={post.title}
            onChange={(event) => {
              const title = event.target.value;
              const previousAutoSlug = slugify(post.title);
              const shouldSyncSlug =
                !editingSlug && (!post.slug || post.slug === previousAutoSlug);

              onPostChange({
                ...(shouldSyncSlug ? { slug: slugify(title) } : {}),
                title,
              });
            }}
          />
        </Field>
        <Field label="文章路径">
          <input
            className="admin-input"
            value={post.slug}
            onChange={(event) =>
              onPostChange({ slug: slugify(event.target.value) })
            }
          />
        </Field>
        <Field label="发布时间">
          <DateTimePicker
            value={post.date}
            onChange={(date) => onPostChange({ date })}
          />
        </Field>
        <Field label="标签">
          <input
            className="admin-input"
            placeholder="Design, Life"
            value={post.tags}
            onChange={(event) => onPostChange({ tags: event.target.value })}
          />
        </Field>
      </div>

      <Field label="摘要">
        <textarea
          className="admin-input min-h-24 resize-y"
          value={post.description}
          onChange={(event) => onPostChange({ description: event.target.value })}
        />
      </Field>

      <PlateMarkdownEditor
        key={editorKey}
        markdown={post.content}
        onMarkdownChange={(content) => onPostChange({ content })}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1">
          <label className="flex items-center gap-2 text-sm text-[#121212]/70 dark:text-white/70">
            <input
              checked={post.draft}
              className="size-4 accent-[#121212] dark:accent-white"
              type="checkbox"
              onChange={(event) => onPostChange({ draft: event.target.checked })}
            />
            保存为草稿
          </label>
          <p className="text-xs text-[#121212]/45 dark:text-white/45">
            勾选后文章会写入 posts 目录，但前台不会展示 draft: true。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button
            className="gap-2"
            disabled={isPublishing}
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            <X className="size-4" />
            取消
          </Button>
          <Button
            className="gap-2"
            disabled={isPublishing}
            type="button"
            variant="outline"
            onClick={onPublish}
          >
            {isPublishing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
            {editingSlug ? '更新文章' : '发布文章'}
          </Button>
        </div>
      </div>
    </section>
  );
}
