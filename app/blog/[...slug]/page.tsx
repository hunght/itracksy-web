import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import '@/styles/mdx.css';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { Tag } from '@/components/tag';
import Image, { ImageProps } from 'next/image';
import { Callout } from '@/components/callout';

interface PostPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

const components = {
  Image: (props: ImageProps) => <Image {...props} />,
  Callout,
};

async function getPostFromParams(slug: string[]) {
  const slugPath = slug?.join('/');
  const post = getPostBySlug(slugPath);
  return post;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostFromParams(slug);

  if (!post) {
    return {};
  }

  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set('title', post.title);

  const imageUrl =
    post.thumbnail || `${siteConfig.url}/api/og?${ogSearchParams.toString()}`;

  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: post.description,
    authors: { name: siteConfig.author },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `${siteConfig.url}/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.date,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.thumbnail_alt_text || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slugAsParams.split('/') }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostFromParams(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className="container prose mx-auto max-w-3xl py-6 dark:prose-invert">
      <h1 className="mb-2">{post.title}</h1>
      <div className="mb-2 flex gap-2">
        {post.tags?.map((tag) => <Tag tag={tag} key={tag} />)}
      </div>
      {post.description && (
        <p className="mt-0 text-xl text-muted-foreground">{post.description}</p>
      )}
      <time dateTime={post.date} className="text-sm text-muted-foreground">
        {formatDate(post.date)}
      </time>
      <hr className="my-4" />
      <MDXRemote
        source={post.content}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypePrettyCode, { theme: 'github-dark' }],
              [
                rehypeAutolinkHeadings,
                {
                  behavior: 'prepend',
                  properties: {
                    className: ['subheading-anchor'],
                    ariaLabel: 'Link to section',
                  },
                  content: {
                    type: 'element',
                    tagName: 'span',
                    properties: { className: ['icon-link'] },
                    children: [{ type: 'text', value: '#' }],
                  },
                },
              ],
            ],
          },
        }}
      />
    </article>
  );
}
