import type { MetadataRoute } from 'next'
import { OBD_CODES } from '@/lib/obd-codes'

const BASE = 'https://www.gmt400.pl'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/kody-obd`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/szukaj`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/narzedzia`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/narzedzia/rpo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/narzedzia/diagnostyka`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/narzedzia/czesci`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const obdRoutes: MetadataRoute.Sitemap = OBD_CODES.map(code => ({
    url: `${BASE}/kody-obd/${code.code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...obdRoutes]
}
