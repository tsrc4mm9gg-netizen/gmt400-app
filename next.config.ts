import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  cacheComponents: false,
  env: {
    // Tylko prawdziwe VERCEL_ENV — wcześniej fallback na NODE_ENV dawał „production” w każdym lokalnym/CI buildzie,
    // przez co testy na 127.0.0.1 raportowały do Sentry jako produkcja.
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || '',
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || '',
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
