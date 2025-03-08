import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChrome, FaEdge } from 'react-icons/fa';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { InstallButton } from '@/components/install-button';

const OptimizedHomepage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold md:text-6xl">
                BubbyBeep: Your AI-Powered Browsing Assistant
              </h1>
              <p className="mb-8 text-xl">
                Enhance your web experience with intelligent summaries,
                insights, and personalized assistance.
              </p>
              <div className="flex justify-center space-x-4">
                <InstallButton isAutoDetect={true} />
                <Link
                  href="/features"
                  className="rounded-full bg-white px-6 py-3 font-semibold text-purple-600 transition duration-300 hover:bg-gray-100"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Key Features
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: 'AI-Powered Summaries',
                  description: 'Get quick, accurate summaries of web content.',
                },
                {
                  title: 'Video Insights',
                  description: 'Extract key information from YouTube videos.',
                },
                {
                  title: 'Personalized Queries',
                  description:
                    'Ask questions and get tailored responses about any webpage.',
                },
              ].map((feature, index) => (
                <div key={index} className="rounded-lg bg-white p-6 shadow-md">
                  <h3 className="mb-4 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Trusted by Thousands
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200"
                >
                  <span className="font-semibold text-gray-500">Logo {i}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-purple-600 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">
              Ready to Transform Your Browsing?
            </h2>
            <p className="mb-8 text-xl">
              Join thousands of users enjoying a smarter web experience.
            </p>
            <InstallButton isAutoDetect={true} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="mb-6 w-full md:mb-0 md:w-1/3">
              <Image
                src="/logo-300.png"
                alt="BubbyBeep Logo"
                width={100}
                height={100}
              />
              <p className="mt-2">Enhancing your web experience with AI.</p>
            </div>
            <div className="mb-6 w-full md:mb-0 md:w-1/3">
              <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features">Features</Link>
                </li>
                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="mb-4 text-lg font-semibold">Connect With Us</h3>
              <div className="flex space-x-4">
                {/* Add your social media icons here */}
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2024 BubbyBeep. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OptimizedHomepage;
