import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

// 计算阅读时间
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes}min`;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  content: string;
  draft?: boolean;
  readingTime?: string;
}

export function getAllPosts(): BlogPost[] {
  // 确保目录存在
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md') && fileName !== '404.md')
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        description: data.description || '',
        draft: Boolean(data.draft),
        tags: data.tags || [],
        content,
        readingTime: calculateReadingTime(content),
      };
    })
    .filter((post) => !post.draft);

  // 按日期排序（最新的在前）
  return allPostsData.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date < b.date ? 1 : -1;
  });
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    // URL decode the slug to handle encoded characters (e.g. Chinese)
    const decodedSlug = decodeURIComponent(slug);

    // 防止目录遍历攻击
    if (decodedSlug.includes('/') || decodedSlug.includes('..')) {
      return null;
    }

    const fullPath = path.join(postsDirectory, `${decodedSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    if (data.draft) {
      return null;
    }

    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      description: data.description || '',
      draft: Boolean(data.draft),
      tags: data.tags || [],
      content,
      readingTime: calculateReadingTime(content),
    };
  } catch {
    return null;
  }
}
