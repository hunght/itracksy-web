'use client';

import { useState, useEffect } from 'react';
import {
  getLatestVersionFromApi,
  buildAppLinks,
  fallbackVersion,
} from '@/config/app-links';

export function useAppVersion() {
  const [version, setVersion] = useState(fallbackVersion);
  const [links, setLinks] = useState(buildAppLinks(fallbackVersion));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchVersion() {
      try {
        const latestVersion = await getLatestVersionFromApi();
        setVersion(latestVersion);
        setLinks(buildAppLinks(latestVersion));
      } catch (err) {
        console.error('Failed to load version:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchVersion();
  }, []);

  return { version, links, loading, error };
}
