import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface Post {
  slug: string;
  slugAsParams: string;
  title: string;
  description?: string;
  date: string;
  published: boolean;
  tags?: string[];
  thumbnail?: string;
  thumbnail_alt_text?: string;
  content: string;
}

export function getPostSlugs(): string[] {
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.mdx'));
}

export function getPostBySlug(slug: string): Post | null {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: `blog/${realSlug}`,
    slugAsParams: realSlug,
    title: data.title || '',
    description: data.description,
    date: data.date || '',
    published: data.published !== false,
    tags: data.tags,
    thumbnail: data.thumbnail,
    thumbnail_alt_text: data.thumbnail_alt_text,
    content,
  };
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug.replace(/\.mdx$/, '')))
    .filter((post): post is Post => post !== null && post.published)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.tags?.includes(tag));
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
