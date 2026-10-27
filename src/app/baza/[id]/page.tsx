import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { VehicleMatchBadge } from '../../VehicleMaterialFilter';
import { NotionContent, readNotionBlocks } from './NotionContent';
import MaterialContents from '../../MaterialContents';
import MaterialText from '../../MaterialText';
import RelatedMaterialSuggestions from '../../RelatedMaterialSuggestions';
import ModelThumb from '../../ModelThumb';
import * as Sentry from '@sentry/nextjs';
import { bodyForEntry } from '../../../lib/model-images';
import { notionFetch, NotionUnavailableError } from '../../../lib/notion-fetch';
import NotionUnavailable from './NotionUnavailable';
import { findObdCode } from '../../../lib/obd-codes';
import Breadcrumbs, { type Crumb } from '../../ui/Breadcrumbs';
import BackLink from '../../ui/BackLink';
import { SCHEMATICS } from '../../../lib/schematics';
import { getEntryMedia } from '../../../lib/entry-media';
import EntryFigure from './EntryFigure';

const SECTION_OF: Record<string, Crumb> = {
  'Usterka': { href: '/usterki', label: 'Usterki' },
  'Kod błędu': { href: '/kody-obd', label: 'Kody OBD' },
  'Porada': { href: '/poradniki', label: 'Poradniki' },
  'Model': { href: '/modele', label: 'Modele' },
};
const DATABASE = '746973771d604f1e8276502851176af2';
const cleanId = (id: string) => id.replace(/-/g, '').toLowerCase();
const text = (property: any) => (property?.title || property?.rich_text || []).map((part: any) => part.plain_text || part.text?.content || '').join('');
const values = (property: any): string[] => {
  if (Array.isArray(property?.multi_select)) return property.multi_select.map((entry: any) => entry.name).filter((name: unknown): name is string => typeof name === 'string' && !!name.trim());
  if (typeof property?.select?.name === 'string') return [property.select.name];
  return text(property).split(/[;\n]+/).map((value: string) => value.trim()).filter(Boolean);
};
const UNAVAILABLE = { unavailable: true } as const;
const readEntry = cache(async (id: string) => {
  // Zły format id to po prostu brak wpisu → 404 (nie błąd, nie trafia do Sentry).
  if (!/^(?:[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i.test(id)) return null;
  const token = process.env.NOTION_TOKEN;
  if (!token) return UNAVAILABLE;
  let response: Response;
  try {
    // Ponawianie przy 429/5xx/timeout; udane odpowiedzi są w cache danych Next przez 5 min.
    response = await notionFetch(`${process.env.NOTION_API_BASE || 'https://api.notion.com'}/v1/pages/${encodeURIComponent(id)}`, { token, revalidate: 300 });
  } catch (error) {
    Sentry.captureException(error, { level: 'warning', tags: { notion: 'page' } });
    return UNAVAILABLE;
  }
  // 400 (np. id spoza integracji), 404 → brak wpisu.
  if (response.status === 404 || response.status === 400) return null;
  if (!response.ok) {
    Sentry.captureException(new NotionUnavailableError(`Notion HTTP ${response.status} dla strony wpisu.`), { level: 'warning', tags: { notion: 'page' } });
    return UNAVAILABLE;
  }
  const page = await response.json();
  if (page.archived || page.in_trash || cleanId(page.parent?.database_id || '') !== DATABASE) return null;
  const p = page.properties || {};
  const modele = values(p.Modele);
  return {
    unavailable: false as const,
    id: page.id as string, Nazwa: text(p.Nazwa) || 'Materiał bez tytułu', Typ: p.Typ?.select?.name || '', Model: values(p.Model).join(', '), Modele: modele, Lata: values(p.Lata).join('; '),
    Opis: text(p.Opis), Objawy: text(p.Objawy), Rozwiązanie: text(p['Rozwiązanie']), edited: typeof page.last_edited_time === 'string' ? page.last_edited_time.slice(0, 10) : '',
    applicability: { brand: values(p.Marka), model: values(p.Model), years: values(p.Lata), engine: values(p.Silnik), drive: values(p['Napęd']), transmission: values(p.Skrzynia) },
  };
});
function localDiagram(title: string): string | null {
  const value = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
  const mappings: [string[], string][] = [
    [['4l60e','atf','miska'], '/diy-4l60e-pan-pl.jpg'],
    [['kolektor','intake','uszczelk'], '/diy-intake-pl.jpg'],
    [['np231','rozdzielcz','4x4'], '/diy-np231-pl.jpg'],
    [['hamulc','przewod'], '/diy-brakes-pl.jpg'],
    [['chlodz','termostat','pompa wody'], '/diy-cooling-sys.jpg'],
    [['paliw','pompa paliwa'], '/diy-fuel.jpg'],
    [['masa','punkt mas','uziemien'], '/diy-grounds.jpg'],
    [['obd','kod'], '/diy-obd.jpg'],
    [['czujnik','maf','sonda','tps','iac'], '/diy-sensors.jpg'],
    [['pompa paliwa','fuel pump'], '/diy-fuelpump.jpg'],
    [['rdza','korozj','rama'], '/issue-rust.jpg'],
  ];
  return mappings.find(([terms]) => terms.some(term => value.includes(term)))?.[1] || null;
}
// Powiązane schematy SVG (/schematy#id) po słowach kluczowych z tytułu — tylko dodatkowy link, grafiki AI bez zmian.
function relatedSchematics(title: string, forced?: string[]): { id: string; title: string }[] {
  if (forced) return forced.map(id => SCHEMATICS.find(s => s.id === id)).filter((s): s is NonNullable<typeof s> => Boolean(s)).map(s => ({ id: s.id, title: s.title }));
  const value = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
  const map: [string[], string][] = [
    [['chlodz', 'termostat', 'pompa wody', 'przegrz', 'plyn chlodn', 'chlodnic'], 'vortec-cooling'],
    [['hamul', 'abs', 'hydro-boost', 'hydroboost'], 'brakes-abs'],
    [['paliw', 'csfi', 'sfi', 'tbi', 'wtrysk', 'pulsator', 'pajak'], 'fuel-system'],
    [['kolektor', 'intake', 'uszczelk'], 'vortec-intake-gaskets'],
    [['masa', 'masy', 'punkt mas', 'uziemien', 'g101'], 'ground-points'],
    [['plyny', 'przeglad', 'pojemnos', 'olej'], 'fluids-1995-1999'],
    [['aldl', 'obd-i', 'kody migow'], 'aldl-12-pin'],
    [['obd-ii', 'obd2', 'obd ii'], 'obd-ii-16-pin'],
    [['bezpiecz'], 'fuse-locations'],
    [['4l60', 'atf'], '4l60e-atf-filter'],
  ];
  const ids = [...new Set(map.filter(([terms]) => terms.some(t => value.includes(t))).map(([, id]) => id))];
  return ids.map(id => SCHEMATICS.find(s => s.id === id)).filter((s): s is NonNullable<typeof s> => Boolean(s)).slice(0, 3).map(s => ({ id: s.id, title: s.title }));
}
const hasImage = (blocks: any[]): boolean => blocks.some(block => block.type === 'image' || hasImage(block.children || []));
const obdCode = (entry: { Nazwa: string; Opis: string; Objawy: string; Rozwiązanie: string }): string | null => {
  const source = `${entry.Nazwa} ${entry.Opis} ${entry.Objawy} ${entry.Rozwiązanie}`;
  return source.match(/\b([POBU][0-3][0-9]{3})\b/i)?.[1]?.toLowerCase() || null;
};
const lead = (entry: { Opis: string; Objawy: string }): string => {
  const source = (entry.Opis || entry.Objawy).replace(/\s+/g, ' ').trim();
  return source.length > 180 ? `${source.slice(0, 177).trimEnd()}…` : source;
};
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = await readEntry((await params).id);
  if (!entry) return { title: 'Nie znaleziono materiału — GMT400', robots: { index: false, follow: false } };
  if (entry.unavailable) return { title: 'Baza wiedzy chwilowo niedostępna — GMT400', robots: { index: false, follow: false } };
  const description = (entry.Opis || entry.Objawy || entry.Rozwiązanie || entry.Nazwa).slice(0, 160);
  const url = `/baza/${entry.id}`;
  return {
    title: `${entry.Nazwa} — GMT400`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'pl_PL',
      url,
      title: `${entry.Nazwa} — GMT400`,
      description,
    },
    twitter: {
      card: 'summary',
      title: `${entry.Nazwa} — GMT400`,
      description,
    },
  };
}
export default async function KnowledgeEntry({ params }: Props) {
  const entry = await readEntry((await params).id);
  if (!entry) notFound();
  if (entry.unavailable) return <NotionUnavailable />;
  let blocks: any[] = [];
  let contentError = false;
  try { blocks = await readNotionBlocks(entry.id, process.env.NOTION_TOKEN || ''); } catch { contentError = true; }
  const media = getEntryMedia(entry.id);
  const photos = (media?.figures || []).filter(f => f.credit);
  const drawings = (media?.figures || []).filter(f => !f.credit);
  const diagram = !media && entry.Typ === 'Porada' && !hasImage(blocks) ? localDiagram(entry.Nazwa) : null;
  const materialLead = lead(entry);
  const rawCode = obdCode(entry);
  const code = rawCode && findObdCode(rawCode) ? rawCode : null;
  const body = entry.Typ === 'Kod błędu' ? null : bodyForEntry(entry);
  return <div className="mx-auto min-h-screen max-w-4xl bg-black px-5 py-10 pb-28 text-white">
    <Breadcrumbs items={[...(SECTION_OF[entry.Typ] ? [SECTION_OF[entry.Typ]] : [{ href: '/baza', label: 'Baza wiedzy' }]), { label: entry.Nazwa }]} />
    <div className="mt-1 flex flex-wrap items-center gap-x-3 text-sm">
      <BackLink fallback="/szukaj" label="← Wróć" className="inline-flex min-h-11 items-center text-silver-400 underline" />
    </div>
    <article className="mt-6 min-w-0 space-y-6 [overflow-wrap:anywhere]">
      <div className="flex flex-wrap gap-2">
        {entry.Typ && <span className="rounded-full border border-silver-600/40 bg-silver-600/10 px-3 py-1 text-xs font-medium text-silver-300">Typ: {entry.Typ}</span>}
        {(entry.Modele.length ? entry.Modele.join(', ') : entry.Model) && <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-neutral-200">Model: {entry.Modele.length ? entry.Modele.map(m => m === 'Wszystkie' ? 'Wszystkie GMT400' : m).join(', ') : entry.Model}</span>}
        {entry.Lata && <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-neutral-200">Lata: {entry.Lata}</span>}
      </div>
      {body && <div className="flex flex-wrap items-center gap-3"><ModelThumb body={body} size="md" /><span className="text-xs text-neutral-500">Zdjęcie poglądowe modelu z katalogu</span></div>}
      <h1 className="text-3xl text-silver-400">{entry.Nazwa}</h1>
      {materialLead && <p className="text-lg leading-relaxed text-neutral-200">{materialLead}</p>}
      {code && <p className="rounded border border-silver-600/40 bg-silver-600/10 px-3 text-sm"><a className="inline-flex min-h-11 items-center font-semibold text-silver-300 underline" href={`/kody-obd/${code}`}>Otwórz kartę kodu OBD {code.toUpperCase()}</a></p>}
      <VehicleMatchBadge item={entry} />
      <MaterialContents entryId={entry.id} />
      {photos.length > 0 && <section aria-label="Zdjęcia do tego tematu" className="space-y-3">{photos.map(f => <EntryFigure key={f.src} figure={f} />)}</section>}
      <p className="rounded border border-white/20 p-3 text-sm text-neutral-400">Dopasowanie do profilu opiera się na metadanych i nie potwierdza poprawności technicznej. Przed naprawą sprawdź zgodność procedury z pojazdem i dokumentacją serwisową.</p>
      {entry.Opis && <section><h2 className="mb-2 text-xl">Opis</h2><MaterialText text={entry.Opis} field="Opis" /></section>}
      {entry.Objawy && <section><h2 className="mb-2 text-xl">Objawy</h2><MaterialText text={entry.Objawy} field="Objawy" /></section>}
      {entry.Rozwiązanie && <section><h2 className="mb-2 text-xl">Rozwiązanie</h2><MaterialText text={entry.Rozwiązanie} field="Rozwiązanie" /></section>}
      {contentError && <p role="alert" className="rounded border border-danger-600/40 p-3">Nie udało się pobrać dodatkowej zawartości strony Notion. Powyższe pola są dostępne, ale materiał może być niekompletny. Odśwież stronę, aby ponowić pobieranie.</p>}
      {blocks.length > 0 && <section aria-label="Zawartość strony Notion"><h2 className="mb-3 text-xl">Treść materiału i ilustracje</h2><NotionContent blocks={blocks} /></section>}
      {drawings.length > 0 && <section aria-label="Rysunki do tego tematu" className="space-y-3"><h2 className="text-xl">Rysunek do tego tematu</h2>{drawings.map(f => <EntryFigure key={f.src} figure={f} />)}</section>}
      {diagram && <figure><a href={diagram} target="_blank" rel="noopener noreferrer"><img src={diagram} alt="Grafika pomocnicza z biblioteki GMT400" loading="lazy" className="h-auto w-full rounded object-contain" /></a><figcaption className="mt-2 text-xs text-neutral-400">Grafika pomocnicza z biblioteki aplikacji, nie ilustracja przypisana w Notion do tego wpisu. Sprawdź jej zgodność z konkretnym pojazdem i procedurą.</figcaption></figure>}
      {(() => { const sch = relatedSchematics(entry.Nazwa, media?.schematics); return sch.length > 0 && <aside aria-label="Powiązane schematy" className="rounded-xl border border-silver-600/40 bg-neutral-950 p-4"><h2 className="text-lg font-semibold text-white">Schemat do tego tematu</h2><ul className="mt-2 space-y-2">{sch.map(s => <li key={s.id}><a href={`/schematy#${s.id}`} className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2 text-neutral-100 hover:border-silver-600">{s.title}<span aria-hidden="true" className="text-silver-400">→</span></a></li>)}</ul><p className="mt-2 text-xs text-neutral-400">Schematy mają podany model i lata — sprawdź w swoim aucie / manualu.</p></aside>; })()}
      {!contentError && !entry.Opis && !entry.Objawy && !entry.Rozwiązanie && !blocks.length && <p>Ten wpis nie zawiera jeszcze szczegółowej treści.</p>}
      {entry.edited && <p className="text-xs text-neutral-500">Ostatnia edycja wpisu w Notion: {entry.edited}. To nie jest data weryfikacji merytorycznej.</p>}
    </article>
    <RelatedMaterialSuggestions key={entry.id} current={entry} />
  </div>;
}
