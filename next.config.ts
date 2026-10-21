import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs/config';

const nextConfig: NextConfig = {
  cacheComponents: false,
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
