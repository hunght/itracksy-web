'use client';
import { FC, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const InstallPage: FC = () => {
  const router = useRouter();

  useEffect(() => {
    const isEdgeBrowser = /Edg/.test(navigator.userAgent);
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    if (isMobileDevice) {
      // Show message for mobile users
      router.push('/blog/download-instructions');
    } else {
      // Redirect to the appropriate extension store
      const extensionUrl = isEdgeBrowser
        ? 'https://microsoftedge.microsoft.com/addons/detail/okjbfkonbgmfhcekhdpbodcfadofdefg'
        : 'https://chromewebstore.google.com/detail/bubbybeep-your-ai-explora/cbibgdcbkoikdkeahemkjkpacmgicaco';

      window.location.href = extensionUrl;
    }
  }, [router]);

  // Return null as we're handling everything in the useEffect
  return null;
};
export default InstallPage;
