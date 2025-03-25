'use client';
import { useAppVersion } from '@/hooks/use-app-version';
import { FaWindows, FaApple, FaLinux } from 'react-icons/fa';

export function PlatformDownloads() {
  const { links } = useAppVersion();

  return (
    <div className="flex flex-col">
      <p className="mb-2 text-sm text-muted-foreground">Available on</p>
      <div className="flex flex-wrap items-center gap-4">
        <a
          href={links.windows}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 rounded-md bg-blue-100 px-3 py-1 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
          aria-label="Download for Windows"
        >
          <div className="flex h-8 w-8 items-center justify-center">
            <FaWindows className="text-blue-600 dark:text-blue-300" />
          </div>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Windows
          </span>
        </a>

        <a
          href={links.macos}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 rounded-md bg-gray-100 px-3 py-1 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label="Download for macOS"
        >
          <div className="flex h-8 w-8 items-center justify-center">
            <FaApple className="text-gray-600 dark:text-gray-300" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            macOS
          </span>
        </a>

        <a
          href={links.linux}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 rounded-md bg-slate-100 px-3 py-1 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
          aria-label="Download for Linux"
        >
          <div className="flex h-8 w-8 items-center justify-center">
            <FaLinux className="text-slate-600 dark:text-slate-300" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Linux
          </span>
        </a>

        <div
          className="flex items-center space-x-1 rounded-md bg-green-50 px-3 py-1 dark:bg-green-900/30"
          aria-label="Coming soon for Android"
        >
          <div className="flex h-8 w-8 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600 dark:text-green-400"
            >
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <circle cx="12" cy="18" r="1" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              Android
            </span>
            <span className="text-xs text-green-600 dark:text-green-500">
              Coming soon
            </span>
          </div>
        </div>

        <div
          className="flex items-center space-x-1 rounded-md bg-indigo-50 px-3 py-1 dark:bg-indigo-900/30"
          aria-label="Coming soon for iOS"
        >
          <div className="flex h-8 w-8 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-600 dark:text-indigo-400"
            >
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <path d="M12 18h.01" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
              iOS
            </span>
            <span className="text-xs text-indigo-600 dark:text-indigo-500">
              Coming soon
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col space-y-2">
        <a
          href={links.releases}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-primary hover:underline"
          aria-label="View all releases on GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          View all releases on GitHub
        </a>
        <a
          href="https://github.com/itracksy/itracksy"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-primary hover:underline"
          aria-label="Star our GitHub repository"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Star us on GitHub
        </a>
      </div>
    </div>
  );
}
