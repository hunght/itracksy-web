import { appLinks as defaultAppLinks } from '@/config/app-links';

// Allow passing custom app links or fallback to default
export const handleDownload = (customAppLinks = defaultAppLinks) => {
  console.log(`[customeAppLinks] `, customAppLinks);
  console.log(`[defaultAppLinks] `, defaultAppLinks);
  // Only run in browser environment
  if (typeof window !== 'undefined') {
    const userAgent = window.navigator.userAgent;
    let downloadUrl = '';

    // Detect OS
    if (userAgent.indexOf('Windows') !== -1) {
      // Windows
      downloadUrl = customAppLinks.windows;
    } else if (userAgent.indexOf('Mac') !== -1) {
      // macOS
      if (userAgent.indexOf('ARM') !== -1) {
        // ARM Mac explicitly mentioned in UA
        downloadUrl = customAppLinks.macos;
      } else {
        // Default to Intel Mac for older browsers or when detection is uncertain
        downloadUrl = customAppLinks.macosIntel || customAppLinks.macos;
      }
    } else if (userAgent.indexOf('Linux') !== -1) {
      // Linux
      downloadUrl = customAppLinks.linux;
    } else {
      // Default to GitHub release page if OS can't be detected
      downloadUrl = customAppLinks.releases;
    }

    // Trigger download by redirecting to the appropriate URL
    window.location.href = downloadUrl;
  }
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
