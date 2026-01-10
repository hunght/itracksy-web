'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaWindows,
  FaApple,
  FaLinux,
  FaDownload,
  FaMobileAlt,
  FaAndroid,
} from 'react-icons/fa';
import Link from 'next/link';
import { getPlatformDownloadUrl } from '@/utils/handleDownload';
import { useAppVersion } from '@/hooks/use-app-version';
import Image from 'next/image';
import { useSupabaseBrowser } from '@/lib/supabase/client';

const DownloadPage = () => {
  const { links, loading, version } = useAppVersion();
  const supabase = useSupabaseBrowser();
  const [os, setOs] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  useEffect(() => {
    // Detect user's operating system and if it's mobile
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const mobileRegex =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

      setIsMobile(mobileRegex.test(userAgent));

      // Check for mobile platforms first, then desktop platforms
      if (userAgent.indexOf('android') !== -1) {
        setOs('android');
      } else if (
        userAgent.indexOf('iphone') !== -1 ||
        userAgent.indexOf('ipad') !== -1
      ) {
        setOs('ios');
      } else if (userAgent.indexOf('windows') !== -1) {
        setOs('windows');
      } else if (userAgent.indexOf('mac') !== -1) {
        setOs('mac');
      } else if (userAgent.indexOf('linux') !== -1) {
        setOs('linux');
      } else {
        setOs('unknown');
      }
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      // Get the platform-specific download URL
      const url = getPlatformDownloadUrl(links);
      setDownloadUrl(url);

      // Skip countdown for macOS as we need user to select architecture
      if (os === 'mac') {
        return;
      }

      // Start countdown for auto-download for non-macOS platforms
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto-start download after countdown
            initiateDownload();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, links, os]);

  const initiateDownload = () => {
    if (downloadStarted) return;

    setDownloadStarted(true);
    handlePlatformDownload(os || 'unknown');
  };

  const getOsIcon = () => {
    switch (os) {
      case 'windows':
        return <FaWindows className="text-4xl" />;
      case 'mac':
        return <FaApple className="text-4xl" />;
      case 'linux':
        return <FaLinux className="text-4xl" />;
      case 'android':
        return <FaAndroid className="text-4xl" />;
      case 'ios':
        return <FaMobileAlt className="text-4xl" />;
      default:
        return <FaDownload className="text-4xl" />;
    }
  };

  const getOsName = () => {
    switch (os) {
      case 'windows':
        return 'Windows';
      case 'mac':
        return 'macOS';
      case 'linux':
        return 'Linux';
      case 'android':
        return 'Android';
      case 'ios':
        return 'iOS';
      default:
        return 'your device';
    }
  };

  const getDownloadFileName = (macArch?: string) => {
    if (!version) return '';

    switch (os) {
      case 'windows':
        return `itracksy-${version}.Setup.exe`;
      case 'mac':
        return macArch === 'intel'
          ? `itracksy-${version}.dmg`
          : `itracksy-${version}-arm64.dmg`;
      case 'linux':
        return `itracksy_${version}_amd64.deb`;
      default:
        return `itracksy-${version}.Setup.exe`;
    }
  };

  const handlePlatformDownload = (platform: string, macArch?: string) => {
    if (platform === 'windows') {
      window.location.href = links.windows;
    } else if (platform === 'mac') {
      // If macArch is specified, use the appropriate URL
      if (macArch === 'intel' && links.macosIntel) {
        window.location.href = links.macosIntel;
      } else {
        window.location.href = links.macos; // Default to ARM
      }
    } else if (platform === 'linux') {
      window.location.href = links.linux;
    } else {
      window.location.href = links.releases;
    }
    setDownloadStarted(true);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setSubscribeError('Please enter a valid email address');
      return;
    }

    try {
      // Save the email to the leads table
      const { error } = await supabase.from('leads').insert({
        name: email.split('@')[0], // Extract username part of email as name
        email: email,
        phone: 'Not provided', // Default value
        message: `Mobile app interest (${os} user)`,
        submission_time: new Date().toISOString(),
        group: 'mobile-subscribers', // Group for these specific leads
      });

      if (error) {
        console.error('Error saving subscription:', error);
        // If it's a duplicate email error, still show success to the user
        if (error.code === '23505') {
          // Unique constraint violation code
          setSubscribed(true);
          setSubscribeError('');
        } else {
          setSubscribeError('Failed to subscribe. Please try again later.');
        }
      } else {
        // Set state to show success message
        setSubscribed(true);
        setSubscribeError('');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeError('Failed to subscribe. Please try again later.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-xl md:p-12"
      >
        <div className="mb-8 text-center">
          <Image
            src="/icon-300.png"
            alt="iTracksy Logo"
            width={120}
            height={120}
            className="mx-auto mb-6 h-24 w-24"
          />
          <h1 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">
            Download iTracksy
          </h1>
          <p className="text-lg text-gray-600">
            Your time management tool and productivity booster
          </p>
          {!loading && version && (
            <p className="mt-2 text-sm text-purple-600">Version {version}</p>
          )}
        </div>

        {loading ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-purple-700"></div>
            <p className="text-gray-600">Loading download information...</p>
          </div>
        ) : isMobile ? (
          <div className="mb-8 rounded-xl bg-purple-50 p-6 text-center">
            <div className="mb-4 flex items-center justify-center">
              {getOsIcon()}
              <span className="ml-3 text-xl font-medium">
                We detected you&apos;re using {getOsName()}
              </span>
            </div>
            {subscribed ? (
              <p className="text-green-600">
                Thank you for subscribing! We&apos;ll notify you when the mobile
                version is available.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <p className="text-gray-600">
                  Mobile versions are coming soon! Subscribe to get notified:
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
                {subscribeError && (
                  <p className="text-sm text-red-600">{subscribeError}</p>
                )}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition duration-300 hover:bg-purple-700"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        ) : (
          <>
            <div className="mb-8 rounded-xl bg-purple-50 p-6 text-center">
              <div className="mb-4 flex items-center justify-center">
                {getOsIcon()}
                <span className="ml-3 text-xl font-medium">
                  We detected you&apos;re using {getOsName()}
                </span>
              </div>

              {downloadStarted ? (
                <div className="font-medium text-green-600">
                  <p className="mb-2">Your download has started!</p>
                  <p className="text-sm text-gray-600">
                    If your download doesn&apos;t begin automatically,
                    <button
                      onClick={initiateDownload}
                      className="ml-1 font-medium text-purple-600 underline"
                    >
                      click here
                    </button>
                  </p>
                </div>
              ) : (
                <div>
                  {os === 'mac' ? (
                    <div className="mb-4">
                      <p className="mb-3 text-sm">
                        Please select your Mac type:
                      </p>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => handlePlatformDownload('mac', 'arm')}
                          className="flex items-center justify-center rounded-lg bg-purple-600 px-6 py-2 font-medium text-white transition duration-300 hover:bg-purple-700"
                        >
                          <FaApple className="mr-2" />
                          Mac with Apple Silicon
                        </button>
                        <button
                          onClick={() => handlePlatformDownload('mac', 'intel')}
                          className="flex items-center justify-center rounded-lg bg-purple-600 px-6 py-2 font-medium text-white transition duration-300 hover:bg-purple-700"
                        >
                          <FaApple className="mr-2" />
                          Mac with Intel Chip
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="mb-4">
                        Your download will begin automatically in{' '}
                        <span className="font-bold">{countdown}</span> seconds
                      </p>
                      <button
                        onClick={initiateDownload}
                        className="mx-auto flex items-center justify-center rounded-lg bg-purple-600 px-8 py-3 font-bold text-white transition duration-300 hover:bg-purple-700"
                      >
                        <FaDownload className="mr-2" />
                        Download Now{' '}
                        {getDownloadFileName() && `(${getDownloadFileName()})`}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <FaWindows className="mx-auto mb-2 text-2xl text-gray-700" />
                <p className="font-medium">Windows</p>
                <button
                  onClick={() => handlePlatformDownload('windows')}
                  className="mt-1 text-sm text-purple-600 underline hover:text-purple-800"
                >
                  Download
                </button>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <FaApple className="mx-auto mb-2 text-2xl text-gray-700" />
                <p className="font-medium">macOS</p>
                <div className="mt-1 flex justify-center space-x-2 text-sm">
                  <button
                    onClick={() => handlePlatformDownload('mac', 'arm')}
                    className="text-purple-600 underline hover:text-purple-800"
                  >
                    Apple Silicon
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={() => handlePlatformDownload('mac', 'intel')}
                    className="text-purple-600 underline hover:text-purple-800"
                  >
                    Intel
                  </button>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <FaLinux className="mx-auto mb-2 text-2xl text-gray-700" />
                <p className="font-medium">Linux</p>
                <button
                  onClick={() => handlePlatformDownload('linux')}
                  className="mt-1 text-sm text-purple-600 underline hover:text-purple-800"
                >
                  Download
                </button>
              </div>
            </div>
          </>
        )}

        <div className="text-center text-gray-600">
          <p className="mb-4">
            Having trouble? Check our{' '}
            <Link
              href="/faq"
              className="text-purple-600 underline hover:text-purple-800"
            >
              FAQ
            </Link>{' '}
            or
            <Link
              href="/contact"
              className="ml-1 text-purple-600 underline hover:text-purple-800"
            >
              contact support
            </Link>
            .
          </p>
          <p className="text-sm">
            By downloading, you agree to our{' '}
            <Link href="/terms" className="text-purple-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and
            <Link
              href="/privacy-policy"
              className="ml-1 text-purple-600 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DownloadPage;
