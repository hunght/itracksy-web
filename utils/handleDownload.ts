import { appLinks as defaultAppLinks } from '@/config/app-links';

// Allow passing custom app links or fallback to default
export const handleDownload = (customAppLinks = defaultAppLinks) => {
  //let go to the download page domain/download
  window.location.href = '/download';
};

// Export a function to get platform-specific download URL without triggering download
export const getPlatformDownloadUrl = (
  customAppLinks = defaultAppLinks,
): string => {
  // For server-side rendering, return the releases page
  if (typeof window === 'undefined') {
    return customAppLinks.releases;
  }

  const userAgent = window.navigator.userAgent;

  if (userAgent.indexOf('Windows') !== -1) {
    return customAppLinks.windows;
  } else if (userAgent.indexOf('Mac') !== -1) {
    if (userAgent.indexOf('ARM') !== -1) {
      return customAppLinks.macos;
    } else {
      return customAppLinks.macosIntel || customAppLinks.macos;
    }
  } else if (userAgent.indexOf('Linux') !== -1) {
    return customAppLinks.linux;
  }

  return customAppLinks.releases;
};
