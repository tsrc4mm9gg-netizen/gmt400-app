import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  cacheComponents: false,
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
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
