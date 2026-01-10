if (!self.define) {
  let e,
    a = {};
  const s = (s, c) => (
    (s = new URL(s + '.js', c).href),
    a[s] ||
      new Promise((a) => {
        if ('document' in self) {
          const e = document.createElement('script');
          ((e.src = s), (e.onload = a), document.head.appendChild(e));
        } else ((e = s), importScripts(s), a());
      }).then(() => {
        let e = a[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, i) => {
    const n =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href;
    if (a[n]) return;
    let t = {};
    const f = (e) => s(e, n),
      r = { module: { uri: n }, exports: t, require: f };
    a[n] = Promise.all(c.map((e) => r[e] || f(e))).then((e) => (i(...e), t));
  };
}
define(['./workbox-e9849328'], function (e) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/297acff1ac6e47caabdb6c837b11a1c4.txt',
          revision: 'fc24cc1ef7192452788cbb40dee7e9e0',
        },
        {
          url: '/_next/static/Kn-iP-2dNBQ6oBMaxV4qP/_buildManifest.js',
          revision: '63207833c7e9b9977586e5f5a3de2a3b',
        },
        {
          url: '/_next/static/Kn-iP-2dNBQ6oBMaxV4qP/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/chunks/182-59534322e73cbfba.js',
          revision: '59534322e73cbfba',
        },
        {
          url: '/_next/static/chunks/2618-62d4214a2f699930.js',
          revision: '62d4214a2f699930',
        },
        {
          url: '/_next/static/chunks/3257-5b6d72cd9f152ce9.js',
          revision: '5b6d72cd9f152ce9',
        },
        {
          url: '/_next/static/chunks/3653-427074e866882f0c.js',
          revision: '427074e866882f0c',
        },
        {
          url: '/_next/static/chunks/398-c5c4611f7f4f152b.js',
          revision: 'c5c4611f7f4f152b',
        },
        {
          url: '/_next/static/chunks/5328-0a4abebb8b27b302.js',
          revision: '0a4abebb8b27b302',
        },
        {
          url: '/_next/static/chunks/6626-b958be5bcf764d53.js',
          revision: 'b958be5bcf764d53',
        },
        {
          url: '/_next/static/chunks/6968-0cf4e114b58870e3.js',
          revision: '0cf4e114b58870e3',
        },
        {
          url: '/_next/static/chunks/7071-45c3132e496bc2d7.js',
          revision: '45c3132e496bc2d7',
        },
        {
          url: '/_next/static/chunks/7237-83a03cd24e76edca.js',
          revision: '83a03cd24e76edca',
        },
        {
          url: '/_next/static/chunks/7722-d23a282ce0625e03.js',
          revision: 'd23a282ce0625e03',
        },
        {
          url: '/_next/static/chunks/8812-226ee9468cfc1526.js',
          revision: '226ee9468cfc1526',
        },
        {
          url: '/_next/static/chunks/8913-46bc700006641a39.js',
          revision: '46bc700006641a39',
        },
        {
          url: '/_next/static/chunks/896-b06568a1cb0dcb85.js',
          revision: 'b06568a1cb0dcb85',
        },
        {
          url: '/_next/static/chunks/8a667b53-7f165d23c9e3cd6e.js',
          revision: '7f165d23c9e3cd6e',
        },
        {
          url: '/_next/static/chunks/9408-4928feb2fb72bbb3.js',
          revision: '4928feb2fb72bbb3',
        },
        {
          url: '/_next/static/chunks/9965-bd7178312e42d7ee.js',
          revision: 'bd7178312e42d7ee',
        },
        {
          url: '/_next/static/chunks/af5fd2ec-de53a9ebb26dec1c.js',
          revision: 'de53a9ebb26dec1c',
        },
        {
          url: '/_next/static/chunks/app/_global-error/page-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-fe7ee356b75c72d4.js',
          revision: 'fe7ee356b75c72d4',
        },
        {
          url: '/_next/static/chunks/app/about/page-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/admin/feedback/page-7edca6055b45ef68.js',
          revision: '7edca6055b45ef68',
        },
        {
          url: '/_next/static/chunks/app/admin/inbox/page-32cf4a9a17a114fa.js',
          revision: '32cf4a9a17a114fa',
        },
        {
          url: '/_next/static/chunks/app/admin/layout-236f577696050add.js',
          revision: '236f577696050add',
        },
        {
          url: '/_next/static/chunks/app/admin/leads/page-3fab7bcaaca8ba5a.js',
          revision: '3fab7bcaaca8ba5a',
        },
        {
          url: '/_next/static/chunks/app/admin/marketing-campaigns/page-32afdc29fcf11b22.js',
          revision: '32afdc29fcf11b22',
        },
        {
          url: '/_next/static/chunks/app/admin/page-65f7717b407d776a.js',
          revision: '65f7717b407d776a',
        },
        {
          url: '/_next/static/chunks/app/api/feedback/reply/route-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/api/feedback/route-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/api/og/route-4f068d03ab200fc1.js',
          revision: '4f068d03ab200fc1',
        },
        {
          url: '/_next/static/chunks/app/api/send-campaign/route-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/api/send-test-email/route-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/api/webhooks/inbound-email/route-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/api/webhooks/resend/route-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/auth/callback/route-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/auth/confirm/route-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/auth/signout/route-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/blog/%5B...slug%5D/page-12fc9ca13a0eabb9.js',
          revision: '12fc9ca13a0eabb9',
        },
        {
          url: '/_next/static/chunks/app/blog/layout-0475b9df827f730e.js',
          revision: '0475b9df827f730e',
        },
        {
          url: '/_next/static/chunks/app/blog/page-cda0faef2472b766.js',
          revision: 'cda0faef2472b766',
        },
        {
          url: '/_next/static/chunks/app/download/page-42f670737c65cee9.js',
          revision: '42f670737c65cee9',
        },
        {
          url: '/_next/static/chunks/app/error/page-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/feedback/layout-0475b9df827f730e.js',
          revision: '0475b9df827f730e',
        },
        {
          url: '/_next/static/chunks/app/feedback/page-44ce55f454761c20.js',
          revision: '44ce55f454761c20',
        },
        {
          url: '/_next/static/chunks/app/layout-3768ef1e21d57464.js',
          revision: '3768ef1e21d57464',
        },
        {
          url: '/_next/static/chunks/app/login/layout-0475b9df827f730e.js',
          revision: '0475b9df827f730e',
        },
        {
          url: '/_next/static/chunks/app/login/otp-input/page-62abfc531b75ef66.js',
          revision: '62abfc531b75ef66',
        },
        {
          url: '/_next/static/chunks/app/login/page-d185af01a6afc9aa.js',
          revision: 'd185af01a6afc9aa',
        },
        {
          url: '/_next/static/chunks/app/offline/page-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/page-f1c2886a11c699dd.js',
          revision: 'f1c2886a11c699dd',
        },
        {
          url: '/_next/static/chunks/app/pricing/layout-0475b9df827f730e.js',
          revision: '0475b9df827f730e',
        },
        {
          url: '/_next/static/chunks/app/pricing/page-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/privacy-policy/layout-0475b9df827f730e.js',
          revision: '0475b9df827f730e',
        },
        {
          url: '/_next/static/chunks/app/privacy-policy/page-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/robots.txt/route-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/sitemap.xml/route-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/app/tags/%5Btag%5D/page-186c3ba504b93715.js',
          revision: '186c3ba504b93715',
        },
        {
          url: '/_next/static/chunks/app/tags/layout-0475b9df827f730e.js',
          revision: '0475b9df827f730e',
        },
        {
          url: '/_next/static/chunks/app/tags/page-186c3ba504b93715.js',
          revision: '186c3ba504b93715',
        },
        {
          url: '/_next/static/chunks/b59c0c5a-06410871bfb4ce8c.js',
          revision: '06410871bfb4ce8c',
        },
        {
          url: '/_next/static/chunks/c1152fbf-398c02af7cd1fe56.js',
          revision: '398c02af7cd1fe56',
        },
        {
          url: '/_next/static/chunks/framework-2c60a385f551e86b.js',
          revision: '2c60a385f551e86b',
        },
        {
          url: '/_next/static/chunks/main-6349fcfb04210415.js',
          revision: '6349fcfb04210415',
        },
        {
          url: '/_next/static/chunks/main-app-6f644761636808bf.js',
          revision: '6f644761636808bf',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/app-error-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/forbidden-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/global-error-87560b29b9b82a03.js',
          revision: '87560b29b9b82a03',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/not-found-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/unauthorized-0eff5b463b1a63ec.js',
          revision: '0eff5b463b1a63ec',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-118cf4a6db7401b1.js',
          revision: '118cf4a6db7401b1',
        },
        {
          url: '/_next/static/css/6f73e4fcc01cc78b.css',
          revision: '6f73e4fcc01cc78b',
        },
        {
          url: '/_next/static/css/827658ac991ae42e.css',
          revision: '827658ac991ae42e',
        },
        {
          url: '/_next/static/css/982f0ee232ea754e.css',
          revision: '982f0ee232ea754e',
        },
        {
          url: '/_next/static/media/19cfc7226ec3afaa-s.woff2',
          revision: '9dda5cfc9a46f256d0e131bb535e46f8',
        },
        {
          url: '/_next/static/media/21350d82a1f187e9-s.woff2',
          revision: '4e2553027f1d60eff32898367dd4d541',
        },
        {
          url: '/_next/static/media/8e9860b6e62d6359-s.woff2',
          revision: '01ba6c2a184b8cba08b0d57167664d75',
        },
        {
          url: '/_next/static/media/ba9851c3c22cd980-s.woff2',
          revision: '9e494903d6b0ffec1a1e14d34427d44d',
        },
        {
          url: '/_next/static/media/c5fe6dc8356a8c31-s.woff2',
          revision: '027a89e9ab733a145db70f09b8a18b42',
        },
        {
          url: '/_next/static/media/df0a9ae256c0569c-s.woff2',
          revision: 'd54db44de5ccb18886ece2fda72bdfe0',
        },
        {
          url: '/_next/static/media/e4af272ccee01ff0-s.p.woff2',
          revision: '65850a373e258f1c897a2b3d75eb74de',
        },
        {
          url: '/_next/static/media/logo.8c40d331.svg',
          revision: 'afd839198ed69e71a5015e4b4f1f6856',
        },
        {
          url: '/android-chrome-192x192.png',
          revision: '7046531d99181086c2fa6a98fe1310ae',
        },
        {
          url: '/android-chrome-512x512.png',
          revision: '3402835eba05f4836fb85a0d248a1169',
        },
        {
          url: '/app-screenshot.png',
          revision: 'bbd56bcefc74373f9b6367e3b6a2f8f1',
        },
        {
          url: '/apple-touch-icon.png',
          revision: 'f61de8b0ff5c40b804b92cd4045ec047',
        },
        {
          url: '/blog/appearance-setting.png',
          revision: '3ce606bfb73c53d5066eebd854a0a2ab',
        },
        {
          url: '/blog/dark-mode-settings.png',
          revision: 'c14819896a3d70452b5e0d42ce4f9f58',
        },
        {
          url: '/blog/pause-resume-session.png',
          revision: 'b6f4746a236e1f58dc7389110883ba9d',
        },
        {
          url: '/blog/sidebar-layout.png',
          revision: '012cb4192e3367853fd882ef566d3b5c',
        },
        {
          url: '/blog/tasks-management-feature-update.png',
          revision: 'b7b547bb163731e933c7d12a6452019a',
        },
        {
          url: '/blog/the-ultimate-guide-to-effective-note-taking-with-ai.jpeg',
          revision: '9a799528a038a806438c231a77065a80',
        },
        {
          url: '/blog/unlimited-focus-mode.png',
          revision: 'a2b7ceb07769de169f01c288280359ef',
        },
        {
          url: '/digital-nomad.svg',
          revision: '0a17289fd16eb767a5acf25dad9619f9',
        },
        { url: '/favicon.ico', revision: 'c5e843370e6a1e85adef4aca1f8c8682' },
        { url: '/favicon.png', revision: 'd091df46bc9fb0a5d4f19bb3fc266379' },
        { url: '/icon-300.png', revision: '2b9b19e4736bdd32ac7463f0c6730e06' },
        {
          url: '/images/clock-icon.png',
          revision: 'b1619cc677d90a89abf6b703731dd683',
        },
        {
          url: '/images/memory-icon.png',
          revision: '1867568a89a69a6ce6efe72529072725',
        },
        {
          url: '/images/tired-icon.png',
          revision: '05361be9616c62bd680c6f4b8d02f3b8',
        },
        {
          url: '/learnifytube-icon.png',
          revision: '6e6a3dd6013b122caf9ea80a6de64a4c',
        },
        { url: '/logo-1024.png', revision: 'be39e8f99398a05ecba1d330f07b118b' },
        { url: '/logo-128.png', revision: '62b6b4affbd77992262f549fdec2a794' },
        { url: '/logo-16.png', revision: '5b027ef69df61f98cabfd42909cef10a' },
        { url: '/logo-256.png', revision: 'd4631c2d73c2d32e08fe806d2d4f073d' },
        { url: '/logo-48.png', revision: '133a3992bbf2221d179d29a33b800328' },
        { url: '/logo-64.png', revision: 'd9e8f0f74394a4fdddd1a6bd50a6978d' },
        { url: '/logo.png', revision: 'be39e8f99398a05ecba1d330f07b118b' },
        { url: '/logo.svg', revision: '6dc0b887e342a7c735ffa706a84daff0' },
        { url: '/next.svg', revision: '8e061864f388b47f33a1c3780831193e' },
        { url: '/robots.txt ', revision: '9b4a7a8db257aa49f6106217f46c9547' },
        {
          url: '/screenshots/achievements.png',
          revision: 'd0e2e8045cad553d9e86de672a67ca61',
        },
        {
          url: '/screenshots/activity-classification.png',
          revision: '76e5f50fc9e4b7f56b3133136c72a9e1',
        },
        {
          url: '/screenshots/activity-tracking.png',
          revision: '49f644e9140fbc4e0dc56fad62b7b586',
        },
        {
          url: '/screenshots/project-management.png',
          revision: 'a9016d5175f4a3b51a758f4dd6d9a5ff',
        },
        {
          url: '/screenshots/rule-classification.png',
          revision: 'd8b3490ba5c639e35d189ac747ae847c',
        },
        {
          url: '/screenshots/time-analytics.png',
          revision: 'e1196aaa325dfa5ffd092066f4242206',
        },
        { url: '/vercel.svg', revision: '61c6b19abff40ea7acd577be818f3976' },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: a,
              event: s,
              state: c,
            }) =>
              a && 'opaqueredirect' === a.type
                ? new Response(a.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: a.headers,
                  })
                : a,
          },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const a = e.pathname;
        return !a.startsWith('/api/auth/') && !!a.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET',
    ));
});
