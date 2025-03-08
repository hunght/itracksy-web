import { MetadataRoute } from 'next';
import { posts } from '#site/content';
import { siteConfig } from '@/config/site';
import { getAllTags, sortTagsByCount } from '@/lib/utils';
import { slug } from 'github-slugger';

const INDEXNOW_KEY = '297acff1ac6e47caabdb6c837b11a1c4';

async function sendToIndexNow(urlList: string[]) {
  const indexNowPayload = {
    host: siteConfig.url.replace(/^https?:\/\//, ''),
    key: INDEXNOW_KEY,
    keyLocation: `${siteConfig.url}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  try {
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(indexNowPayload),
    });

    if (!response.ok) {
      throw new Error(`IndexNow API request failed: ${response.statusText}`);
    }

    console.log('Sitemap submitted to IndexNow successfully');
  } catch (error) {
    console.error('Error submitting sitemap to IndexNow:', error);
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Generate sitemap entries for blog posts
  const sitemapPost: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slugAsParams}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Generate sitemap entries for tags
  const tags = getAllTags(posts);
  const sortedTags = sortTagsByCount(tags);
  const sitemapPostTags: MetadataRoute.Sitemap = sortedTags.map((tag) => ({
    url: `${siteConfig.url}/tags/${slug(tag)}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  // Combine all sitemap entries
  const allEntries: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/tags`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    ...sitemapPost,
    ...sitemapPostTags,
  ];

  // Extract URLs from sitemap entries
  const urlList = allEntries.map((entry) => entry.url);

  sendToIndexNow(urlList);

  return allEntries;
}
