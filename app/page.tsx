import { getAllPosts } from '@/lib/blog';
import { PostItem } from '@/components/post-item';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

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
import { DownloadNowButton } from '@/components/download-now-button';
import { PlatformDownloads } from '@/components/platform-downloads';

import { siteConfig } from '@/config/site';
import { GitHubButton } from '@/components/github-button';
import { EmailSubscriptionForm } from '@/components/email-subscription-form';

const description =
  'iTracksy: Open-source time tracking application for personal and team productivity. Track your time, analyze performance, and boost productivity with our free, privacy-focused desktop app for Windows, macOS, and Linux.';

export const metadata: Metadata = {
  title: 'iTracksy: Free Open-Source Time Tracking Application for Individuals',
  description: description,
  keywords:
    'time tracking, productivity, open-source, desktop app, team productivity, time management, project tracking, work hours, time analytics, free time tracker',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'iTracksy - Free Open-Source Time Tracking Application',
    description: description,
    type: 'website',
    url: 'https://www.itracksy.com',
    images: [
      {
        url: 'https://www.itracksy.com/logo-300.png',
        width: 300,
        height: 300,
        alt: 'iTracksy Logo',
      },
    ],
    siteName: 'iTracksy',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iTracksy - Free Open-Source Time Tracking Application',
    description: description,
    images: [
      {
        url: 'https://www.itracksy.com/logo-300.png',
        alt: 'iTracksy Logo',
      },
    ],
    creator: '@buddy_beep_com',
    site: '@buddy_beep_com',
  },
  alternates: {
    canonical: 'https://www.itracksy.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token', // Replace with your actual Google verification token if you have one
  },
};

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 5);

  const videoObjectSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'iTracksy Demo Video',
    description:
      'Watch how iTracksy helps you track your time and boost productivity',
    thumbnailUrl: 'https://www.itracksy.com/video-thumbnail.jpg',
    uploadDate: '2023-04-15T08:00:00+08:00',
    duration: 'PT1M20S',
    contentUrl: 'https://www.itracksy.com/demo-video.mp4',
    embedUrl: 'https://www.youtube.com/embed/your-video-id',
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'iTracksy',
    url: 'https://www.itracksy.com',
    description: description,
    inLanguage: 'en-US',
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.twitter,
      siteConfig.links.discord,
    ],
  };

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'iTracksy',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Windows, macOS, Linux',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '25',
    },
    downloadUrl: 'https://www.itracksy.com/download',
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <div className="relative flex min-h-dvh flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          <section
            className="hero-section py-12 md:py-16"
            aria-label="Main hero section"
          >
            <div className="container mx-auto px-4">
              {/* Centered headline */}
              <div className="mx-auto max-w-4xl text-center">
                <h1
                  className="mb-4 text-4xl font-bold md:text-6xl"
                  itemProp="headline"
                >
                  <span className="text-slate-700 dark:text-slate-200">
                    Track your time,{' '}
                  </span>
                  <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    Boost your productivity
                  </span>
                </h1>
                <p
                  className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
                  itemProp="description"
                >
                  Smart time tracking with focus sessions, actionable analytics,
                  and productivity insights. Free, open-source, and
                  privacy-focused.
                </p>
              </div>

              {/* CTA and platform downloads - above video */}
              <div className="mx-auto mb-10 max-w-2xl text-center">
                <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <DownloadButton />
                  <GitHubButton
                    href="https://github.com/itracksy/itracksy"
                    type="star"
                    className="rounded-full border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Star on GitHub
                  </GitHubButton>
                </div>
                <PlatformDownloads />
              </div>

              {/* Video showcase */}
              <div className="mx-auto max-w-5xl">
                <div className="relative">
                  {/* Glow effect behind video */}
                  <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 blur-2xl"></div>

                  {/* macOS-style window frame */}
                  <div className="relative overflow-hidden rounded-xl border border-slate-200/50 bg-slate-900 shadow-2xl dark:border-slate-700/50">
                    {/* Window title bar */}
                    <div className="flex h-10 items-center gap-2 border-b border-slate-700 bg-slate-800 px-4">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-xs text-slate-400">iTracksy</span>
                      </div>
                      <div className="w-12"></div>
                    </div>

                    {/* Video content */}
                    <video
                      src="/screenshots/focus-demo.webm"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full"
                      style={{ aspectRatio: '1468/1068' }}
                    />
                  </div>
                </div>
              </div>

              {/* Distraction Blocking Feature */}
              <div className="mx-auto mt-16 max-w-5xl">
                <div className="mb-8 text-center">
                  <h2 className="mb-3 text-2xl font-bold text-slate-700 dark:text-slate-200 md:text-3xl">
                    Block Distractions, Stay Focused
                  </h2>
                  <p className="mx-auto max-w-2xl text-muted-foreground">
                    Automatically block distracting websites during focus
                    sessions. When you try to access a blocked site, iTracksy
                    gently reminds you to stay on track.
                  </p>
                </div>

                <div className="relative">
                  {/* Glow effect behind video */}
                  <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 blur-2xl"></div>

                  {/* macOS-style window frame */}
                  <div className="relative overflow-hidden rounded-xl border border-slate-200/50 bg-slate-900 shadow-2xl dark:border-slate-700/50">
                    {/* Window title bar */}
                    <div className="flex h-10 items-center gap-2 border-b border-slate-700 bg-slate-800 px-4">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-xs text-slate-400">
                          Distraction Blocking
                        </span>
                      </div>
                      <div className="w-12"></div>
                    </div>

                    {/* Video content */}
                    <video
                      src="/screenshots/blocking-feature.webm"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full"
                      style={{ aspectRatio: '1720/720' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* LearnifyTube Promotional Banner */}
          <section
            className="learnifytube-promo-section bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 py-12"
            aria-label="LearnifyTube Promotion"
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                {/* Left side - Icon and Content */}
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image
                      src="/learnifytube-icon.png"
                      alt="LearnifyTube App Icon"
                      width={96}
                      height={96}
                      className="rounded-2xl shadow-lg"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
                      <h3 className="text-2xl font-bold text-white">
                        LearnifyTube
                      </h3>
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
                        NEW
                      </span>
                    </div>
                    <p className="mb-2 text-lg text-white/90">
                      Download & Play YouTube Videos Offline
                    </p>
                    <p className="max-w-2xl text-sm text-white/80">
                      Never worry about internet connectivity again! Download
                      your favorite educational content, focus music, and
                      tutorials. Perfect companion for iTracksy users who want
                      uninterrupted productivity sessions.
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                      <span className="rounded-md bg-white/20 px-3 py-1 text-xs text-white">
                        📥 Offline Access
                      </span>
                      <span className="rounded-md bg-white/20 px-3 py-1 text-xs text-white">
                        🎵 High Quality
                      </span>
                      <span className="rounded-md bg-white/20 px-3 py-1 text-xs text-white">
                        ⚡ Easy to Use
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side - CTA Button */}
                <div className="flex flex-col items-center gap-3">
                  <Link
                    href="https://www.learnifytube.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-white px-8 py-4 text-lg font-semibold text-purple-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
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
                      className="transition-transform group-hover:scale-110"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" x2="12" y1="15" y2="3"></line>
                    </svg>
                    Get LearnifyTube
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
                      className="transition-transform group-hover:translate-x-1"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                  <p className="text-xs text-white/70">Free to Download</p>
                </div>
              </div>
            </div>
          </section>

          <section
            className="features-section bg-slate-800 py-16 text-white"
            aria-label="Key features section"
          >
            <div className="container mx-auto px-4">
              <div className="mb-6 text-center">
                <h3 className="text-lg font-medium text-slate-300">
                  POWERFUL FEATURES
                </h3>
              </div>
              <div className="mb-12 text-center">
                <h2 className="text-4xl font-bold">
                  <span className="text-amber-500">
                    Everything You Need to Boost Productivity
                  </span>
                </h2>
              </div>

              {/* Feature Grid */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Focus Sessions */}
                <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-amber-500"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Focus Sessions</h3>
                  <p className="text-slate-300">
                    Start timed or unlimited focus sessions. Track your
                    productive time with visual progress indicators and stay in
                    the zone.
                  </p>
                </div>

                {/* Distraction Blocking */}
                <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-red-500"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">
                    Distraction Blocking
                  </h3>
                  <p className="text-slate-300">
                    Block distracting websites during focus sessions. Get gentle
                    reminders when you try to access blocked sites.
                  </p>
                </div>

                {/* Smart Analytics */}
                <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-500"
                    >
                      <path d="M3 3v18h18"></path>
                      <path d="m19 9-5 5-4-4-3 3"></path>
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Smart Analytics</h3>
                  <p className="text-slate-300">
                    Focus Score, peak hours analysis, and AI-powered insights
                    help you understand and improve your productivity patterns.
                  </p>
                </div>

                {/* Activity Tracking */}
                <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Activity Tracking</h3>
                  <p className="text-slate-300">
                    Automatic activity detection captures your work sessions
                    without manual input. Know exactly where your time goes.
                  </p>
                </div>

                {/* Project Management */}
                <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-500"
                    >
                      <rect x="3" y="3" width="7" height="9"></rect>
                      <rect x="14" y="3" width="7" height="5"></rect>
                      <rect x="14" y="12" width="7" height="9"></rect>
                      <rect x="3" y="16" width="7" height="5"></rect>
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Project Management</h3>
                  <p className="text-slate-300">
                    Organize tasks with an intuitive kanban board. Drag and drop
                    cards between columns to keep projects moving forward.
                  </p>
                </div>

                {/* Rule-Based Classification */}
                <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-orange-500"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Smart Rules</h3>
                  <p className="text-slate-300">
                    Create custom rules to automatically classify activities by
                    app name, website, or pattern. Your workflow, your rules.
                  </p>
                </div>
              </div>

              {/* AI Analytics Dashboard Feature Highlight */}
              <div className="mt-12">
                <div className="mb-8 text-center">
                  <span className="mb-2 inline-block rounded-full bg-purple-500/20 px-4 py-1 text-sm font-medium text-purple-400">
                    NEW FEATURE
                  </span>
                  <h3 className="text-2xl font-bold md:text-3xl">
                    AI Analytics Dashboard
                  </h3>
                  <p className="mx-auto mt-3 max-w-2xl text-slate-300">
                    Visual productivity insights at a glance. Track your
                    productivity score, context switches, deep work blocks, and
                    activity patterns with our new AI-powered dashboard.
                  </p>
                </div>

                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 blur-2xl"></div>

                  {/* macOS-style window frame */}
                  <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900 shadow-2xl">
                    {/* Window title bar */}
                    <div className="flex h-10 items-center gap-2 border-b border-slate-700 bg-slate-800 px-4">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-xs text-slate-400">
                          AI Analytics Dashboard
                        </span>
                      </div>
                      <div className="w-12"></div>
                    </div>

                    {/* Image content */}
                    <Image
                      src="/screenshots/ai-analytics-dashboard.png"
                      alt="AI Analytics Dashboard showing productivity score, context switches, activity timeline, and top usage"
                      width={1280}
                      height={800}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="open-source-section bg-slate-50 py-16 dark:bg-slate-900"
            aria-label="Open Source Section"
          >
            <div className="container mx-auto px-4">
              <div className="mb-10 text-center">
                <h2 className="mb-4 text-3xl font-bold">
                  Open Source & Community-Driven
                </h2>
                <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                  iTracksy is proudly open source. We believe in transparency,
                  collaboration, and community-driven development.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
                <Card className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-amber-100 p-4 dark:bg-amber-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-amber-500"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                  </div>
                  <CardHeader className="p-0">
                    <CardTitle className="mb-2 text-xl">Contribute</CardTitle>
                    <CardDescription>
                      Help us improve iTracksy by contributing code, reporting
                      bugs, or suggesting new features.
                    </CardDescription>
                  </CardHeader>
                  <div className="mt-auto pt-4">
                    <a
                      href="https://github.com/itracksy/itracksy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      View on GitHub
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
                        className="ml-1"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </a>
                  </div>
                </Card>

                <Card className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-500"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <path d="M12 18v-6"></path>
                      <path d="M8 18v-1"></path>
                      <path d="M16 18v-3"></path>
                    </svg>
                  </div>
                  <CardHeader className="p-0">
                    <CardTitle className="mb-2 text-xl">
                      Documentation
                    </CardTitle>
                    <CardDescription>
                      Explore our documentation to learn about iTracksy&apos;s
                      features, architecture, and development process.
                    </CardDescription>
                  </CardHeader>
                  <div className="mt-auto pt-4">
                    <a
                      href="https://github.com/itracksy/itracksy#readme"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Read Docs
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
                        className="ml-1"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </a>
                  </div>
                </Card>

                <Card className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-green-100 p-4 dark:bg-green-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <CardHeader className="p-0">
                    <CardTitle className="mb-2 text-xl">Community</CardTitle>
                    <CardDescription>
                      Join our community of developers and users to discuss
                      ideas, share feedback, and get support.
                    </CardDescription>
                  </CardHeader>
                  <div className="mt-auto pt-4">
                    <a
                      href={siteConfig.links.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Join Discord
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
                        className="ml-1"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </a>
                  </div>
                </Card>
              </div>

              <div className="mt-12 text-center">
                <div className="mb-4 inline-flex items-center justify-center space-x-2">
                  <GitHubButton
                    href="https://github.com/itracksy/itracksy/stargazers"
                    type="star"
                    className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    <span className="text-sm font-medium">Star</span>
                  </GitHubButton>

                  <GitHubButton
                    href="https://github.com/itracksy/itracksy/fork"
                    type="fork"
                    className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    <span className="text-sm font-medium">Fork</span>
                  </GitHubButton>

                  <GitHubButton
                    href="https://github.com/itracksy/itracksy/issues"
                    type="issue"
                    className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    <span className="text-sm font-medium">Issues</span>
                  </GitHubButton>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  iTracksy is licensed under the{' '}
                  <a
                    href="https://github.com/itracksy/itracksy/blob/main/LICENSE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    MIT License
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section
            className="blog-section container mx-auto px-4 py-16"
            aria-label="Latest blog posts"
          >
            <h2
              className="mb-12 text-center text-3xl font-bold"
              id="latest-posts"
            >
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

          <section
            className="cta-section bg-primary/10 py-16"
            aria-label="Call to action"
          >
            <div className="container mx-auto px-4 text-center">
              <h2 className="mb-6 text-3xl font-bold" id="cta-heading">
                Ready to Boost Your Productivity?
              </h2>
              <p className="mb-8 text-lg">
                Join the growing community of users who are tracking their time
                more effectively with iTracksy.
              </p>
              <DownloadNowButton size="lg">
                Download iTracksy Now
              </DownloadNowButton>

              {/* Email Subscription Component */}
              <div className="mt-8 text-center">
                <p className="mb-4 text-lg font-medium">
                  Or subscribe for updates
                </p>
                <div className="mx-auto max-w-md">
                  <div className="relative">
                    <EmailSubscriptionForm />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    We&apos;ll notify you about new features, updates, and
                    mobile app releases.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center space-y-4">
                <div className="mt-2 flex items-center space-x-6">
                  <GitHubButton
                    href={siteConfig.links.github}
                    type="contribute"
                    className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                    aria-label="Contribute on GitHub"
                  >
                    Contribute on GitHub
                  </GitHubButton>
                  <GitHubButton
                    href={`${siteConfig.links.github}/issues`}
                    type="issue"
                    className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                    aria-label="Report issues"
                  >
                    Report Issues
                  </GitHubButton>
                </div>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
