import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.gmt400.pl',
      lastModified: new Date('2026-10-15'),
    },
  ]
}
