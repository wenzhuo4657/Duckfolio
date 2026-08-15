import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { renderMarkdownToHtml } from '@/lib/markdown';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = true;
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const contentHtml = await renderMarkdownToHtml(post.content);
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('zh-CN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <article className="mx-auto w-full max-w-3xl px-4 pb-20 pt-24 md:pt-32">
      <Link
        href="/posts"
        className="mb-10 inline-flex items-center gap-2 text-sm text-[#121212]/50 transition-colors hover:text-[#121212] dark:text-white/50 dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        返回
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl/tight font-semibold  text-[#121212] dark:text-white sm:text-5xl">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-5 text-lg/8  text-[#121212]/60 dark:text-white/60">
            {post.description}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[#121212]/40 dark:text-white/40">
          {formattedDate && <time dateTime={post.date}>{formattedDate}</time>}
          {post.readingTime && <span>{post.readingTime}</span>}
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded bg-[#121212]/6 px-2 py-0.5 text-[#121212]/60 dark:bg-white/8 dark:text-white/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div
        className="prose max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
}
