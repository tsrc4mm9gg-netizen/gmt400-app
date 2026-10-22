import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { VehicleMatchBadge } from '../../VehicleMaterialFilter';
import { NotionContent, readNotionBlocks } from './NotionContent';
import MaterialContents from '../../MaterialContents';
import MaterialText from '../../MaterialText';
import RelatedMaterialSuggestions from '../../RelatedMaterialSuggestions';
const DATABASE = '746973771d604f1e8276502851176af2';
const cleanId = (id: string) => id.replace(/-/g, '').toLowerCase();
const text = (property: any) => (property?.title || property?.rich_text || []).map((part: any) => part.plain_text || part.text?.content || '').join('');
const values = (property: any): string[] => {
  if (Array.isArray(property?.multi_select)) return property.multi_select.map((entry: any) => entry.name).filter((name: unknown): name is string => typeof name === 'string' && !!name.trim());
  if (typeof property?.select?.name === 'string') return [property.select.name];
  return text(property).split(/[;\n]+/).map((value: string) => value.trim()).filter(Boolean);
};
const readEntry = cache(async (id: string) => {
  if (!/^(?:[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i.test(id)) return null;
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error('Baza wiedzy jest chwilowo niedostępna.');
  const response = await fetch(`https://api.notion.com/v1/pages/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${token}`, 'Notion-Version': '2022-06-28' }, next: { revalidate: 300 }, signal: AbortSignal.timeout(10000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Nie udało się pobrać materiału.');
  const page = await response.json();
  if (page.archived || page.in_trash || cleanId(page.parent?.database_id || '') !== DATABASE) return null;
  const p = page.properties || {};
  return {
    id: page.id as string, Nazwa: text(p.Nazwa) || 'Materiał bez tytułu', Typ: p.Typ?.select?.name || '', Model: values(p.Model).join(', '), Lata: values(p.Lata).join('; '),
    Opis: text(p.Opis), Objawy: text(p.Objawy), Rozwiązanie: text(p['Rozwiązanie']), edited: typeof page.last_edited_time === 'string' ? page.last_edited_time.slice(0, 10) : '',
    applicability: { brand: values(p.Marka), model: values(p.Model), years: values(p.Lata), engine: values(p.Silnik), drive: values(p['Napęd']), transmission: values(p.Skrzynia) },
  };
});
function localDiagram(title: string): string | null {
  const value = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
  const mappings: [string[], string][] = [
    [['4l60e','atf','miska'], '/diy-4l60e-pan-pl.jpg'],
    [['kolektor','intake'], '/diy-intake-pl.jpg'],
    [['np231','rozdzielcz'], '/diy-np231-pl.jpg'],
    [['hamulc'], '/diy-brakes-pl.jpg'],
    [['chlodz','termostat','pompa wody'], '/diy-cooling-sys.jpg'],
    [['paliw'], '/diy-fuel.jpg'],
    [['masa','punkt mas'], '/diy-grounds.jpg'],
  ];
  return mappings.find(([terms]) => terms.some(term => value.includes(term)))?.[1] || null;
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
  let blocks: any[] = [];
  let contentError = false;
  try { blocks = await readNotionBlocks(entry.id, process.env.NOTION_TOKEN || ''); } catch { contentError = true; }
  const diagram = entry.Typ === 'Porada' && !hasImage(blocks) ? localDiagram(entry.Nazwa) : null;
  const materialLead = lead(entry);
  const code = obdCode(entry);
  return <main className="mx-auto min-h-screen max-w-4xl bg-black px-5 py-10 pb-28 text-white">
    <nav aria-label="Nawigacja pomocnicza" className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
      <a href="/" className="text-amber-400 underline">Wróć do encyklopedii</a>
      <span aria-hidden="true" className="text-neutral-600">·</span>
      <a href="/szukaj" className="text-amber-400 underline">Wróć do wyników</a>
    </nav>
    <article className="mt-6 space-y-6">
      <div className="flex flex-wrap gap-2">
        {entry.Typ && <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">Typ: {entry.Typ}</span>}
        {entry.Model && <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-neutral-200">Model: {entry.Model}</span>}
        {entry.Lata && <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-neutral-200">Lata: {entry.Lata}</span>}
      </div>
      <h1 className="text-3xl text-amber-400">{entry.Nazwa}</h1>
      {materialLead && <p className="text-lg leading-relaxed text-neutral-200">{materialLead}</p>}
      {code && <p className="rounded border border-sky-400/40 bg-sky-400/10 p-3 text-sm"><a className="font-semibold text-sky-300 underline" href={`/kody-obd/${code}`}>Otwórz kartę kodu OBD {code.toUpperCase()}</a></p>}
      <VehicleMatchBadge item={entry} />
      <MaterialContents entryId={entry.id} />
      <p className="rounded border border-white/20 p-3 text-sm text-neutral-400">Dopasowanie do profilu opiera się na metadanych i nie potwierdza poprawności technicznej. Przed naprawą sprawdź zgodność procedury z pojazdem i dokumentacją serwisową.</p>
      {entry.Opis && <section><h2 className="mb-2 text-xl">Opis</h2><MaterialText text={entry.Opis} field="Opis" /></section>}
      {entry.Objawy && <section><h2 className="mb-2 text-xl">Objawy</h2><MaterialText text={entry.Objawy} field="Objawy" /></section>}
      {entry.Rozwiązanie && <section><h2 className="mb-2 text-xl">Rozwiązanie</h2><MaterialText text={entry.Rozwiązanie} field="Rozwiązanie" /></section>}
      {contentError && <p role="alert" className="rounded border border-amber-400/40 p-3">Nie udało się pobrać dodatkowej zawartości strony Notion. Powyższe pola są dostępne, ale materiał może być niekompletny. Odśwież stronę, aby ponowić pobieranie.</p>}
      {blocks.length > 0 && <section aria-label="Zawartość strony Notion"><h2 className="mb-3 text-xl">Treść materiału i ilustracje</h2><NotionContent blocks={blocks} /></section>}
      {diagram && <figure><a href={diagram} target="_blank" rel="noopener noreferrer"><img src={diagram} alt="Grafika pomocnicza z biblioteki GMT400" loading="lazy" className="h-auto w-full rounded object-contain" /></a><figcaption className="mt-2 text-xs text-neutral-400">Grafika pomocnicza z biblioteki aplikacji, nie ilustracja przypisana w Notion do tego wpisu. Sprawdź jej zgodność z konkretnym pojazdem i procedurą.</figcaption></figure>}
      {!contentError && !entry.Opis && !entry.Objawy && !entry.Rozwiązanie && !blocks.length && <p>Ten wpis nie zawiera jeszcze szczegółowej treści.</p>}
      {entry.edited && <p className="text-xs text-neutral-500">Ostatnia edycja wpisu w Notion: {entry.edited}. To nie jest data weryfikacji merytorycznej.</p>}
    </article>
    <RelatedMaterialSuggestions key={entry.id} current={entry} />
  </main>;
}
