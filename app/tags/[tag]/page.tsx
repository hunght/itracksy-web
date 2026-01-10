import { getAllPosts } from '@/lib/blog';
import { PostItem } from '@/components/post-item';
import { Tag } from '@/components/tag';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllTags, getPostsByTagSlug, sortTagsByCount } from '@/lib/utils';
import { slug } from 'github-slugger';
import { Metadata } from 'next';

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const title = tag.split('-').join(' ');
  return {
    title: `${title} - iTracksy`,
    description: `Explore posts on the topic of ${title}. Find articles, tutorials, and insights related to ${title}.`,
    openGraph: {
      title: `${title} - iTracksy`,
      description: `Explore posts on the topic of ${title}. Find articles, tutorials, and insights related to ${title}.`,
      type: 'website',
      url: `https://itracksy.com/tags/${tag}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - iTracksy`,
      description: `Explore posts on the topic of ${title}. Find articles, tutorials, and insights related to ${title}.`,
    },
  };
}

export const generateStaticParams = () => {
  const posts = getAllPosts();
  const tags = getAllTags(posts);
  const paths = Object.keys(tags).map((tag) => ({ tag: slug(tag) }));
  return paths;
};

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const title = tag.split('-').join(' ');

  const posts = getAllPosts();
  const displayPosts = getPostsByTagSlug(posts, tag);
  const tags = getAllTags(posts);
  const sortedTags = sortTagsByCount(tags);

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block text-4xl font-black capitalize lg:text-5xl">
            {title}
          </h1>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-12 gap-3">
        <div className="col-span-12 col-start-1 sm:col-span-8">
          <hr />
          {displayPosts?.length > 0 ? (
            <ul className="flex flex-col">
              {displayPosts.map((post) => {
                const { slug, date, title, description, tags } = post;
                return (
                  <li key={slug}>
                    <PostItem
                      slug={slug}
                      date={date}
                      title={title}
                      description={description}
                      tags={tags}
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No posts found for this tag.</p>
          )}
        </div>
        <Card className="col-span-12 row-start-3 h-fit sm:col-span-4 sm:col-start-9 sm:row-start-1">
          <CardHeader>
            <CardTitle>Related Tags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {sortedTags?.map((t) => (
              <Tag tag={t} key={t} count={tags[t]} current={slug(t) === tag} />
            ))}
          </CardContent>
        </Card>
      </div>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${title} - iTracksy`,
          description: `Explore posts on the topic of ${title}. Find articles, tutorials, and insights related to ${title}.`,
          url: `https://itracksy.com/tags/${tag}`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: displayPosts.map((post, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `https://itracksy.com/posts/${post.slug}`,
              name: post.title,
            })),
          },
        })}
      </script>
    </div>
  );
}
