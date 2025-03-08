import { Suspense } from 'react';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </>
    </Suspense>
  );
}
