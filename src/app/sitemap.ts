import { BODY_STYLES } from '../lib/body-styles';
import type { MetadataRoute } from 'next'
import { OBD_CODES } from '@/lib/obd-codes'
import { notionFetch } from '@/lib/notion-fetch'

const BASE = 'https://www.gmt400.pl'
const DATABASE_ID = '746973771d604f1e8276502851176af2'
const UPDATED = new Date()

async function getKnowledgeIds(): Promise<string[]> {
  const token = process.env.NOTION_TOKEN
  if (!token) return []
  try {
    const response = await notionFetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, { token, method: 'POST', body: JSON.stringify({ page_size: 100 }), revalidate: 3600 })
    if (!response.ok) return []
    const data = await response.json()
    if (!Array.isArray(data.results)) return []
    return data.results
      .map((page: any) => typeof page?.id === 'string' ? page.id : '')
      .filter((id: string) => /^[a-f0-9]{32}$/i.test(id.replace(/-/g, '')))
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: UPDATED, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/baza`, lastModified: UPDATED, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/szukaj`, lastModified: UPDATED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/kody-obd`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/modele`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/schematy`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/vin`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/moj-samochod`, lastModified: UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    ...BODY_STYLES.map(body => ({ url: `${BASE}/modele/${body.id}`, lastModified: UPDATED, changeFrequency: 'monthly' as const, priority: 0.7 })),
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

  const knowledgeIds = await getKnowledgeIds()
  const knowledgeRoutes: MetadataRoute.Sitemap = knowledgeIds.map(id => ({
    url: `${BASE}/baza/${id}`,
    lastModified: UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...obdRoutes, ...knowledgeRoutes]
}
