import type { MetadataRoute } from 'next'
import { OBD_CODES } from '@/lib/obd-codes'

const BASE = 'https://www.gmt400.pl'
const UPDATED = new Date('2026-10-22')

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: UPDATED, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/kody-obd`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/narzedzia`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/narzedzia/rpo`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/narzedzia/diagnostyka`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/narzedzia/czesci`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const obdRoutes: MetadataRoute.Sitemap = OBD_CODES.map(code => ({
    url: `${BASE}/kody-obd/${code.code.toLowerCase()}`,
    lastModified: UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...obdRoutes]
}
