'use client';
import { useState, useEffect, FC } from 'react';
import { FaChrome, FaEdge, FaSignInAlt } from 'react-icons/fa';

export const InstallButton: FC<{
  isAutoDetect: boolean;
  className?: string;
}> = ({ isAutoDetect = false, className = '' }) => {
  const [isEdge, setIsEdge] = useState(false);

  useEffect(() => {
    const isEdgeBrowser = /Edg/.test(navigator.userAgent);
    setIsEdge(isEdgeBrowser);
  }, []);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const isEdgeBrowser = /Edg/.test(navigator.userAgent);
    setIsEdge(isEdgeBrowser);

    // Detect if user is on mobile
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    setIsMobile(isMobileDevice);
  }, []);

  const buttonClass =
    'flex w-full items-center justify-center rounded-full bg-purple-500 px-4 py-3 text-lg text-white transition-colors hover:bg-purple-600';
  const iconClass = 'mr-2 text-2xl';

  if (isMobile) {
    return (
      <a
        className={`${buttonClass} ${className}`}
        href="/login" // Replace with your actual login page URL
      >
        <span>Login</span>
      </a>
    );
  }
  if (!isAutoDetect) {
    return (
      <div
        className={`flex max-w-sm flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 ${className}`}
      >
        <a
          className={buttonClass}
          href="https://microsoftedge.microsoft.com/addons/detail/okjbfkonbgmfhcekhdpbodcfadofdefg"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaEdge className={iconClass} />
          <span>Add to Edge</span>
        </a>
        <a
          className={buttonClass}
          href="https://chromewebstore.google.com/detail/bubbybeep-your-ai-explora/cbibgdcbkoikdkeahemkjkpacmgicaco"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaChrome className={iconClass} />
          <span>Add to Chrome</span>
        </a>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <a
        className="flex h-10 max-w-sm flex-row items-center justify-center rounded-full bg-purple-500 px-4 py-3 text-lg text-white transition-colors hover:bg-purple-600"
        href={
          isEdge
            ? 'https://microsoftedge.microsoft.com/addons/detail/okjbfkonbgmfhcekhdpbodcfadofdefg'
            : 'https://chromewebstore.google.com/detail/bubbybeep-your-ai-explora/cbibgdcbkoikdkeahemkjkpacmgicaco'
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        {isEdge ? (
          <>
            <FaEdge size={24} className="mr-2" />
            <span>Add to Edge</span>
          </>
        ) : (
          <>
            <FaChrome size={24} className="mr-2" />
            <span>Add to Chrome</span>
          </>
        )}
      </a>
    </div>
  );
};
