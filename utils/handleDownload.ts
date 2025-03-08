import { appLinks, appVersion } from '@/config/app-links';

// Export the download handler function
export const handleDownload = () => {
  // Only run in browser environment
  if (typeof window !== 'undefined') {
    const userAgent = window.navigator.userAgent;
    let downloadUrl = '';

    // Detect OS
    if (userAgent.indexOf('Windows') !== -1) {
      // Windows
      downloadUrl = appLinks.windows;
    } else if (userAgent.indexOf('Mac') !== -1) {
      // macOS
      if (userAgent.indexOf('ARM') !== -1) {
        // ARM Mac explicitly mentioned in UA
        downloadUrl = appLinks.macos;
      } else {
        // Default to Intel Mac for older browsers or when detection is uncertain
        downloadUrl = appLinks.macos;
      }
    } else if (userAgent.indexOf('Linux') !== -1) {
      // Linux
      downloadUrl = appLinks.linux;
    } else {
      // Default to GitHub release page if OS can't be detected
      downloadUrl = appLinks.releases;
    }

    // Trigger download by redirecting to the appropriate URL
    window.location.href = downloadUrl;
  }
};

// Export a function to get platform-specific download URL without triggering download
export const getPlatformDownloadUrl = (): string => {
  // For server-side rendering, return the releases page
  if (typeof window === 'undefined') {
    return appLinks.releases;
  }

  const userAgent = window.navigator.userAgent;

  if (userAgent.indexOf('Windows') !== -1) {
    return appLinks.windows;
  } else if (userAgent.indexOf('Mac') !== -1) {
    if (userAgent.indexOf('ARM') !== -1) {
      return appLinks.macos;
    } else {
      return appLinks.macosIntel || appLinks.macos;
    }
  } else if (userAgent.indexOf('Linux') !== -1) {
    return appLinks.linux;
  }

  return appLinks.releases;
};
