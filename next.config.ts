import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  // Osobny katalog buildu dla CI: drugi build z atrapą Notion (testy SSR list) obok zwykłego bez danych (test błędu pobierania).
  distDir: process.env.NEXT_DIST_DIR || '.next',
  cacheComponents: false,
  env: {
    // Tylko prawdziwe VERCEL_ENV — wcześniej fallback na NODE_ENV dawał „production” w każdym lokalnym/CI buildzie,
    // przez co testy na 127.0.0.1 raportowały do Sentry jako produkcja.
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || '',
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || '',
  },
  async headers() {
    return [
      { source: '/sw.js', headers: [
        { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
        { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        { key: 'Service-Worker-Allowed', value: '/' },
      ] },
      { source: '/manifest.json', headers: [{ key: 'Content-Type', value: 'application/manifest+json; charset=utf-8' }] },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withSentryConfig(nextConfig, {
  org: 'gmt400',
  project: 'gmt400-app',
  silent: true,
  sourcemaps: { disable: true },
});
