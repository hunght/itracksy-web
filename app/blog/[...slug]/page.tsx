import { posts } from '#site/content';
import { MDXContent } from '@/components/mdx-components';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils'; // Added this import
import Image from 'next/image';

import '@/styles/mdx.css';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { Tag } from '@/components/tag';
interface PostPageProps {
  params: {
    slug: string[];
  };
}

async function getPostFromParams(params: PostPageProps['params']) {
  const slug = params?.slug?.join('/');
  const post = posts.find((post) => post.slugAsParams === slug);

  return post;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params);

  if (!post) {
    return {};
  }

  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set('title', post.title);

  // Define the image URL, preferring the post's thumbnail if available
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
      url: `${siteConfig.url}${post.slug}`,
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

export async function generateStaticParams(): Promise<
  PostPageProps['params'][]
> {
  return posts.map((post) => ({ slug: post.slugAsParams.split('/') }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);

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
      <MDXContent code={post.body} />
    </article>
  );
}
