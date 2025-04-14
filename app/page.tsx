import { sortPosts } from '@/lib/utils';
import { posts } from '#site/content';
import { PostItem } from '@/components/post-item';
import { FaWindows, FaApple, FaLinux } from 'react-icons/fa';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

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
import { DownloadNowButton } from '@/components/download-now-button';
import { PlatformDownloads } from '@/components/platform-downloads';

import { siteConfig } from '@/config/site';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useEffect, useState, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { type CarouselApi } from '@/components/ui/carousel';
import { AutoPlayCarousel } from '@/components/AutoPlayCarousel';

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
  const latestPosts = sortPosts(posts).slice(0, 5);

  return (
    <>
      {/* Structured Data for SEO */}
      <JsonLd<VideoObject>
        item={{
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
        }}
      />
      <JsonLd<WebSite>
        item={{
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
        }}
      />
      <JsonLd<SoftwareApplication>
        item={{
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
        }}
      />
      <div className="min-h-dvh relative flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          <section
            className="hero-section py-16"
            aria-label="Main hero section"
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
                {/* Left side - Text content */}
                <div className="flex flex-col md:w-1/2">
                  <h1
                    className="mb-6 text-4xl font-bold md:text-5xl"
                    itemProp="headline"
                  >
                    <span className="text-slate-700 dark:text-slate-200">
                      The{' '}
                    </span>
                    <span className="text-amber-500">Only Time Tracker</span>
                    <br />
                    <span className="text-slate-700 dark:text-slate-200">
                      You Need
                    </span>
                  </h1>
                  <p
                    className="mb-8 text-lg text-muted-foreground"
                    itemProp="description"
                  >
                    Level up your personal or team&apos;s productivity with
                    detailed time tracking. Insights and info on your
                    performance. No credit card required!
                  </p>
                  <div className="mb-8">
                    <DownloadButton />
                  </div>

                  <PlatformDownloads />
                </div>

                {/* Right side - App screenshot */}
                <div className="mt-8 md:mt-0 md:w-1/2">
                  <div className="relative">
                    <div className="absolute -left-4 -right-4 -top-4 bottom-4 z-0 rounded-full bg-amber-500"></div>

                    <div className="relative z-10">
                      <div className="relative overflow-hidden rounded-lg border border-slate-200 shadow-xl">
                        <AutoPlayCarousel
                          className="overflow-hidden rounded-lg"
                          interval={5000}
                        >
                          {[
                            {
                              src: '/screenshots/time-analytics.png',
                              alt: 'iTracksy Time Analytics Dashboard',
                            },
                            {
                              src: '/screenshots/activity-tracking.png',
                              alt: 'iTracksy Activity Tracking Interface',
                            },
                            {
                              src: '/screenshots/project-management.png',
                              alt: 'iTracksy Project Management',
                            },
                            {
                              src: '/screenshots/achievements.png',
                              alt: 'iTracksy Achievement System',
                            },
                            {
                              src: '/screenshots/rule-classification.png',
                              alt: 'iTracksy Rule Classification System',
                            },
                          ].map((image, index) => (
                            <CarouselItem key={index}>
                              <div className="p-1">
                                <Image
                                  src={image.src}
                                  alt={image.alt}
                                  width={800}
                                  height={500}
                                  priority={index === 0}
                                  className="w-full"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </AutoPlayCarousel>
                      </div>
                    </div>
                  </div>
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

              {/* Activity Tracking Feature */}
              <div className="mb-24 flex flex-col items-center md:flex-row md:items-start md:justify-between">
                <div className="mb-8 flex flex-col space-y-4 md:mb-0 md:w-2/5">
                  <h3 className="text-2xl font-bold">Activity Tracking</h3>
                  <p className="text-slate-300">
                    Track your work sessions effortlessly. iTracksy
                    automatically captures your activities, helping you
                    understand where your time goes without manual input.
                  </p>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start">
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
                        className="mr-2 mt-1 text-amber-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Automatic activity detection</span>
                    </li>
                    <li className="flex items-start">
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
                        className="mr-2 mt-1 text-amber-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Focus session tracking</span>
                    </li>
                    <li className="flex items-start">
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
                        className="mr-2 mt-1 text-amber-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Seamless background operation</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-3/5 lg:w-1/2">
                  <div className="transform overflow-hidden rounded-lg border-4 border-slate-700 shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
                    <Image
                      src="/screenshots/activity-tracking.png"
                      alt="Activity tracking interface in iTracksy"
                      width={800}
                      height={500}
                      className="w-full"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Project Management Feature */}
              <div className="mb-24 flex flex-col-reverse items-center md:flex-row md:items-start md:justify-between">
                <div className="md:w-3/5 lg:w-1/2">
                  <div className="transform overflow-hidden rounded-lg border-4 border-slate-700 shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
                    <Image
                      src="/screenshots/project-management.png"
                      alt="Project management kanban board in iTracksy"
                      width={800}
                      height={500}
                      className="w-full"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="mb-8 flex flex-col space-y-4 md:mb-0 md:w-2/5">
                  <h3 className="text-2xl font-bold">Project Management</h3>
                  <p className="text-slate-300">
                    Organize tasks with an intuitive kanban board. Drag and drop
                    cards between columns to update status and keep your
                    projects moving forward.
                  </p>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start">
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
                        className="mr-2 mt-1 text-amber-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Intuitive drag-and-drop interface</span>
                    </li>
                    <li className="flex items-start">
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
                        className="mr-2 mt-1 text-amber-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Custom workflow columns</span>
                    </li>
                    <li className="flex items-start">
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
                        className="mr-2 mt-1 text-amber-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Time tracking integration</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Time Analytics Feature */}
              <div className="mb-24 flex flex-col items-center md:flex-row md:items-start md:justify-between">
                <div className="mb-8 flex flex-col space-y-4 md:mb-0 md:w-2/5">
                  <h3 className="text-2xl font-bold">Time Analytics</h3>
                  <p className="text-slate-300">
                    Gain insights from powerful analytics. Visualize how you
                    spend your time with beautiful, interactive charts that
                    reveal productivity patterns.
                  </p>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start">
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
                        className="mr-2 mt-1 text-amber-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Interactive data visualization</span>
                    </li>
                    <li className="flex items-start">
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
                        className="mr-2 mt-1 text-amber-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Productivity trend analysis</span>
                    </li>
                    <li className="flex items-start">
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
                        className="mr-2 mt-1 text-amber-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Customizable reporting periods</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-3/5 lg:w-1/2">
                  <div className="transform overflow-hidden rounded-lg border-4 border-slate-700 shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
                    <Image
                      src="/screenshots/time-analytics.png"
                      alt="Time analytics dashboard in iTracksy"
                      width={800}
                      height={500}
                      className="w-full"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Achievements Feature */}
              <div className="mb-24 flex flex-col-reverse items-center md:flex-row md:items-start md:justify-between">
                <div className="md:w-3/5 lg:w-1/2">
                  <div className="transform overflow-hidden rounded-lg border-4 border-slate-700 shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
                    <Image
                      src="/screenshots/achievements.png"
                      alt="Achievement system in iTracksy"
                      width={800}
                      height={500}
                      className="w-full"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="mb-8 flex flex-col space-y-4 md:mb-0 md:w-2/5">
                  <h3 className="text-2xl font-bold">Achievements</h3>
                  <p className="text-slate-300">
                    Stay motivated with gamification. Unlock achievements as you
                    reach productivity milestones, making productivity
                    improvement fun and rewarding.
                  </p>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start">
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
                        className="mr-2 mt-1 text-amber-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Productivity milestone badges</span>
                    </li>
                    <li className="flex items-start">
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
                        className="mr-2 mt-1 text-amber-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Progress tracking</span>
                    </li>
                    <li className="flex items-start">
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
                        className="mr-2 mt-1 text-amber-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Motivational reward system</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Rule-Based Classification Feature */}
              <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between">
                <div className="mb-8 flex flex-col space-y-4 md:mb-0 md:w-2/5">
                  <h3 className="text-2xl font-bold">
                    Rule-Based Classification
                  </h3>
                  <p className="text-slate-300">
                    Customize how activities are categorized. Create rules to
                    automatically classify your work based on application names,
                    websites, or custom patterns.
                  </p>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start">
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
                        className="mr-2 mt-1 text-amber-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Custom categorization rules</span>
                    </li>
                    <li className="flex items-start">
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
                        className="mr-2 mt-1 text-amber-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Pattern matching for applications</span>
                    </li>
                    <li className="flex items-start">
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
                        className="mr-2 mt-1 text-amber-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Website-based activity grouping</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-3/5 lg:w-1/2">
                  <div className="transform overflow-hidden rounded-lg border-4 border-slate-700 shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
                    <Image
                      src="/screenshots/rule-classification.png"
                      alt="Rule-based classification interface in iTracksy"
                      width={800}
                      height={500}
                      className="w-full"
                      loading="lazy"
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
                  <a
                    href="https://github.com/itracksy/itracksy/stargazers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
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
                      className="mr-1 text-amber-500"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span className="text-sm font-medium">Star</span>
                  </a>

                  <a
                    href="https://github.com/itracksy/itracksy/fork"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
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
                      className="mr-1 text-blue-500"
                    >
                      <circle cx="12" cy="18" r="3"></circle>
                      <circle cx="6" cy="6" r="3"></circle>
                      <circle cx="18" cy="6" r="3"></circle>
                      <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path>
                      <path d="M12 12v3"></path>
                    </svg>
                    <span className="text-sm font-medium">Fork</span>
                  </a>

                  <a
                    href="https://github.com/itracksy/itracksy/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
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
                      className="mr-1 text-green-500"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span className="text-sm font-medium">Issues</span>
                  </a>
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
              <div className="mt-6 flex flex-col items-center space-y-4">
                <Link
                  href="/blog/use-cases"
                  className="text-primary hover:underline"
                  aria-label="Read about iTracksy use cases"
                >
                  See how others are using iTracksy
                </Link>

                <div className="mt-2 flex items-center space-x-6">
                  <a
                    href="https://github.com/itracksy/itracksy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                    aria-label="Contribute on GitHub"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    Contribute on GitHub
                  </a>
                  <a
                    href="https://github.com/itracksy/itracksy/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                    aria-label="Report issues"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Report Issues
                  </a>
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
