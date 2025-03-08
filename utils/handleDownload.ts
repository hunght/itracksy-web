export const handleDownload = () => {
  // Only run in browser environment
  if (typeof window !== 'undefined') {
    const userAgent = window.navigator.userAgent;
    let downloadUrl = '';

    // Detect OS
    if (userAgent.indexOf('Windows') !== -1) {
      // Windows
      downloadUrl =
        'https://github.com/itracksy/itracksy/releases/download/v1.0.138/itracksy-1.0.138.Setup.exe';
    } else if (userAgent.indexOf('Mac') !== -1) {
      // macOS
      if (
        userAgent.indexOf('ARM') !== -1 ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      ) {
        // ARM Mac (M1/M2)
        downloadUrl =
          'https://github.com/itracksy/itracksy/releases/download/v1.0.138/itracksy-1.0.138-arm64.dmg';
      } else {
        // Intel Mac
        downloadUrl =
          'https://github.com/itracksy/itracksy/releases/download/v1.0.138/itracksy-1.0.138-arm64.dmg';
      }
    } else if (userAgent.indexOf('Linux') !== -1) {
      // Linux
      downloadUrl =
        'https://github.com/itracksy/itracksy/releases/download/v1.0.138/itracksy_1.0.138_amd64.deb';
    } else {
      // Default to GitHub release page if OS can't be detected
      downloadUrl =
        'https://github.com/itracksy/itracksy/releases/tag/v1.0.138';
    }

    // Trigger download by redirecting to the appropriate URL
    window.location.href = downloadUrl;
  }
};
