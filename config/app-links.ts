// Configuration file for application download links and version information

// Fallback version in case API fetch fails
export const fallbackVersion = '1.0.138';

// Function to build download URLs based on a version
export const buildAppLinks = (version: string) => ({
  // Main platform download links
  windows: `https://github.com/itracksy/itracksy/releases/download/v${version}/itracksy-${version}.Setup.exe`,
  macos: `https://github.com/itracksy/itracksy/releases/download/v${version}/itracksy-${version}-arm64.dmg`,
  linux: `https://github.com/itracksy/itracksy/releases/download/v${version}/itracksy_${version}_amd64.deb`,

  // Additional links
  releases: `https://github.com/itracksy/itracksy/releases/tag/v${version}`,

  // You can add other platform-specific links if needed
  macosIntel: `https://github.com/itracksy/itracksy/releases/download/v${version}/itracksy-${version}-x64.dmg`,
  linuxRpm: `https://github.com/itracksy/itracksy/releases/download/v${version}/itracksy-${version}-1.x86_64.rpm`,
});

// Client-side version getter that uses the API
export async function getLatestVersionFromApi(): Promise<string> {
  try {
    // Only run on client
    if (typeof window === 'undefined') {
      return fallbackVersion;
    }

    const response = await fetch('/api/latest-version');

    if (!response.ok) {
      throw new Error('Failed to fetch latest version');
    }

    const data = await response.json();
    return data.version;
  } catch (error) {
    console.warn('Failed to get latest version, using fallback:', error);
    return fallbackVersion;
  }
}

// Default export uses the fallback version
export const appVersion = fallbackVersion;
export const appLinks = buildAppLinks(fallbackVersion);
