import { sortPosts } from '@/lib/utils';
import { posts } from '#site/content';
import { PostItem } from '@/components/post-item';
import { InstallButton } from '@/components/install-button';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { JsonLd } from 'react-schemaorg';
import { WebSite, SoftwareApplication, VideoObject } from 'schema-dts';
import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { DownloadButton } from '@/components/download-button';
import { appLinks, appVersion } from '@/config/app-links';

const description =
  'iTracksy: AI-powered Chrome extension for smart browsing. Get website summaries, YouTube insights, and access an AI Prompt Library.';

export const metadata: Metadata = {
  title: 'iTracksy: AI-Powered Chrome Extension for Smart Browsing',
  description: description,
  keywords:
    'AI, Chrome extension, browsing assistant, website summaries, YouTube insights, AI prompts',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'iTracksy - AI-Powered Browsing Assistant',
    description: description,
    type: 'website',
    url: 'https://www.itracksy.com',
    images: [
      {
        url: 'https://www.itracksy.com/logo-300.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iTracksy - AI-Powered Browsing Assistant',
    description: description,
    images: ['https://www.itracksy.com/logo-300.png'],
  },
  alternates: {
    canonical: 'https://www.itracksy.com',
  },
};

export default async function Home() {
  const latestPosts = sortPosts(posts).slice(0, 5);

  return (
    <>
      <div className="min-h-dvh relative flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          <section className="hero-section py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
                {/* Left side - Text content */}
                <div className="flex flex-col md:w-1/2">
                  <h1 className="mb-6 text-4xl font-bold md:text-5xl">
                    <span className="text-slate-700 dark:text-slate-200">
                      The{' '}
                    </span>
                    <span className="text-amber-500">Only Time Tracker</span>
                    <br />
                    <span className="text-slate-700 dark:text-slate-200">
                      You Need
                    </span>
                  </h1>
                  <p className="mb-8 text-lg text-muted-foreground">
                    Level up your personal or team&apos;s productivity with
                    detailed time tracking. Insights and info on your
                    performance. No credit card required!
                  </p>
                  <div className="mb-8">
                    <DownloadButton />
                  </div>

                  <div className="flex flex-col">
                    <p className="mb-2 text-sm text-muted-foreground">
                      Available on
                    </p>
                    <div className="flex items-center space-x-4">
                      <a
                        href={appLinks.windows}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 rounded-md bg-blue-100 px-3 py-1 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
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
                            className="text-blue-600 dark:text-blue-300"
                          >
                            <rect
                              x="2"
                              y="3"
                              width="20"
                              height="14"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          Windows
                        </span>
                      </a>

                      <a
                        href={appLinks.macos}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 rounded-md bg-gray-100 px-3 py-1 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
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
                            className="text-gray-600 dark:text-gray-300"
                          >
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                            <path d="M14.5 4.5c-1.5 1.5-3.5 1-4.5 1.5-1 .5-2.5 2-3 3.5s.5 3.5 2 4.5c1.5 1 4 1.5 5 .5 1-1 1.5-2.5 1.5-3.5s-1-1.5-1.5-2-1.5-2-1.5-3c0-1 2-1.5 2-1.5"></path>
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          macOS
                        </span>
                      </a>
                      <a
                        href={appLinks.linux}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 rounded-md bg-slate-100 px-3 py-1 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
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
                            className="text-slate-600 dark:text-slate-300"
                          >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Linux
                        </span>
                      </a>
                    </div>

                    <div className="mt-4">
                      <a
                        href={appLinks.releases}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-primary hover:underline"
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
                    </div>
                  </div>
                </div>

                {/* Right side - App screenshot */}
                <div className="mt-8 md:mt-0 md:w-1/2">
                  <div className="relative">
                    <div className="absolute -left-4 -right-4 -top-4 bottom-4 z-0 rounded-full bg-amber-500"></div>

                    <div className="relative z-10">
                      <Image
                        src="/app-screenshot.png"
                        alt="TRACKSY App Screenshot"
                        width={600}
                        height={400}
                        className="rounded-lg border border-slate-200 shadow-xl"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="features-section bg-slate-800 py-16 text-white">
            <div className="container mx-auto px-4">
              <div className="mb-6 text-center">
                <h3 className="text-lg font-medium text-slate-300">
                  CHOOSING ITRACKSY MEANS
                </h3>
              </div>
              <div className="mb-12 text-center">
                <h2 className="text-4xl font-bold">
                  <span className="text-amber-500">
                    Productive, Light, Free and private
                  </span>
                </h2>
              </div>

              <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
                {/* Left side - Features */}
                <div className="flex flex-col space-y-10 md:w-1/2">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500 text-white">
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
                        <rect
                          x="2"
                          y="3"
                          width="20"
                          height="14"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-semibold">
                        Designed for your performances
                      </h3>
                      <p className="text-slate-300">
                        Features are built for your productivity, so expect
                        innovative methods and system to keep it highest.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500 text-white">
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
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-semibold">
                        Meant to save time, not waste
                      </h3>
                      <p className="text-slate-300">
                        Smart, intuitive design and low resource use ensure a
                        pleasant experience for you.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500 text-white">
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
                        <rect
                          x="2"
                          y="5"
                          width="20"
                          height="14"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M2 10h20"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-semibold">
                        Open source, free and private
                      </h3>
                      <p className="text-slate-300">
                        As an open source and free platform, we don&apos;t have
                        any interest in your private data. You don&apos;t need
                        to worry about exposing your private data.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side - SVG illustration */}
                <div className="mt-8 md:mt-0 md:w-1/2">
                  <div className="relative">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute -left-4 -right-4 -top-4 bottom-4 z-0 rounded-lg  "></div>
                      <Image
                        src="/digital-nomad.svg"
                        alt="Digital Nomad"
                        width={500}
                        height={400}
                        className="relative z-10 rounded-lg bg-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="blog-section container mx-auto px-4 py-16">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Latest Posts
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <PostItem
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  description={post.description}
                  date={post.date}
                  tags={post.tags}
                />
              ))}
            </div>
          </section>

          <section className="cta-section bg-primary/10 py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="mb-6 text-3xl font-bold">Ready to Get Started?</h2>
              <p className="mb-8 text-lg">
                Join thousands of users who are already enjoying the benefits of
                AI-powered browsing with iTracksy.
              </p>
              <InstallButton isAutoDetect={true} />
              <div className="mt-4">
                <Link
                  href="/blog/testimonials"
                  className="text-primary hover:underline"
                >
                  See what our users are saying
                </Link>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
