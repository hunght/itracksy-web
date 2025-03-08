import { appLinks, appVersion } from '@/config/app-links';

export const handleDownload = () => {
  // Only run in browser environment
  if (typeof window !== 'undefined') {
    const userAgent = window.navigator.userAgent;
    let downloadUrl = '';

    // Cast navigator to extended type that includes userAgentData
    const nav = navigator;

    // Detect OS
    if (userAgent.indexOf('Windows') !== -1) {
      // Windows
      downloadUrl = appLinks.windows;
    } else if (userAgent.indexOf('Mac') !== -1) {
      // macOS
      // Note: navigator.platform is deprecated, but there's no perfect alternative
      // for detecting Apple Silicon vs Intel Mac in JavaScript
      if (userAgent.indexOf('ARM') !== -1) {
        // ARM Mac explicitly mentioned in UA
        downloadUrl = appLinks.macos;
      } else {
        // Default to Intel Mac for older browsers or when detection is uncertain
        downloadUrl = appLinks.macosIntel || appLinks.macos;
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
