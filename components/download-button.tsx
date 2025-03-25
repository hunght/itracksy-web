'use client';

import { useAppVersion } from '@/hooks/use-app-version';
import { handleDownload } from '@/utils/handleDownload';
import { MouseEventHandler } from 'react';

export function DownloadButton() {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    // Use the dynamically fetched links
    handleDownload();
  };
  return (
    <button
      onClick={handleClick}
      className="relative rounded-full bg-amber-500 px-8 py-4 font-medium text-white hover:bg-amber-600"
    >
      Get the tracker for Free!
      <span className="absolute -right-4 -top-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        </div>
      </span>
    </button>
  );
}
