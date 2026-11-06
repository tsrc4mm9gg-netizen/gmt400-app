import { BODY_STYLES } from '../lib/body-styles';
import { GUIDES } from '../lib/guides';
import { DIAG_GUIDES } from '../lib/diagnosis-guides';
import type { MetadataRoute } from 'next'
import { OBD_CODES } from '@/lib/obd-codes'
import { getKnowledgeSlugs } from '@/lib/knowledge-slugs'

const BASE = 'https://www.gmt400.pl'
const UPDATED = new Date()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: UPDATED, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/baza`, lastModified: UPDATED, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/diagnoza`, lastModified: UPDATED, changeFrequency: 'weekly', priority: 0.9 },
    ...DIAG_GUIDES.map(g => ({ url: `${BASE}/diagnoza/${g.slug}`, lastModified: UPDATED, changeFrequency: 'monthly' as const, priority: 0.7 })),
    { url: `${BASE}/usterki`, lastModified: UPDATED, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/diy`, lastModified: UPDATED, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/poradniki`, lastModified: UPDATED, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/kody-obd`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/modele`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/schematy`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/vin`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/moj-samochod`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/przeglady`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/pojemnosci`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/momenty-dokrecania`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/poradnik-kupujacego`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    ...BODY_STYLES.map(body => ({ url: `${BASE}/modele/${body.id}`, lastModified: UPDATED, changeFrequency: 'monthly' as const, priority: 0.7 })),
    { url: `${BASE}/dla-wlasciciela`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/porady-wlasciciela`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    ...GUIDES.map(guide => ({ url: `${BASE}/dla-wlasciciela/${guide.slug}`, lastModified: UPDATED, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: `${BASE}/narzedzia`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/narzedzia/rpo`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/narzedzia/diagnostyka`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/narzedzia/czesci`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/narzedzia/historia-vin`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const obdRoutes: MetadataRoute.Sitemap = OBD_CODES.map(code => ({
    url: `${BASE}/kody-obd/${code.code.toLowerCase()}`,
    lastModified: UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Kanoniczne, trwałe adresy wpisów. Stare adresy UUID pozostają dostępne
  // jako 301, więc dotychczasowe linki i indeksacja nie zostają utracone.
  const knowledgeSlugs = await getKnowledgeSlugs()
  const knowledgeRoutes: MetadataRoute.Sitemap = knowledgeSlugs.map(({ slug }) => ({
    url: `${BASE}/baza/${encodeURIComponent(slug)}`,
    lastModified: UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...obdRoutes, ...knowledgeRoutes]
}
