import { NextResponse } from 'next/server';
import { getLatestRelease, extractVersionFromTag } from '@/lib/github-api';

export async function GET() {
  try {
    const release = await getLatestRelease();

    if (!release) {
      return NextResponse.json(
        { error: 'Failed to fetch latest version' },
        { status: 500 },
      );
    }

    const version = extractVersionFromTag(release.tag_name);

    return NextResponse.json({
      version,
      tagName: release.tag_name,
      releaseName: release.name,
      releaseUrl: release.html_url,
      publishedAt: release.published_at,
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
