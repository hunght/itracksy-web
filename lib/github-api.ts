/**
 * GitHub API client for fetching release information
 */

const GITHUB_REPO = 'itracksy/itracksy';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
}

interface CachedRelease {
  data: GitHubRelease;
  timestamp: number;
}

let cachedRelease: CachedRelease | null = null;

/**
 * Fetches the latest release from GitHub API
 * Uses caching to minimize API calls
 */
export async function getLatestRelease(): Promise<GitHubRelease | null> {
  // Check cache first
  if (cachedRelease && Date.now() - cachedRelease.timestamp < CACHE_DURATION) {
    return cachedRelease.data;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          // Add GitHub token as Authorization if you have rate limit issues
          // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const release: GitHubRelease = await response.json();

    // Update cache
    cachedRelease = {
      data: release,
      timestamp: Date.now(),
    };

    return release;
  } catch (error) {
    console.error('Failed to fetch latest release:', error);
    // Return cached data even if expired, rather than nothing
    return cachedRelease?.data || null;
  }
}

/**
 * Extracts the version number from a GitHub release tag
 * Handles formats like "v1.0.138" -> "1.0.138"
 */
export function extractVersionFromTag(tagName: string): string {
  return tagName.replace(/^v/, '');
}
