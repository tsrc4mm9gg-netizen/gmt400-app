import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { VehicleMatchBadge } from '../../VehicleMaterialFilter';

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
  const response = await fetch(`https://api.notion.com/v1/pages/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token}`, 'Notion-Version': '2022-06-28' },
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(10000),
  });
  if (response.status === 404) return null;
  if (!response.ok) { console.error('Knowledge entry fetch failed', response.status); throw new Error('Nie udało się pobrać materiału.'); }
  const page = await response.json();
  if (page.archived || page.in_trash || cleanId(page.parent?.database_id || '') !== DATABASE) return null;
  const p = page.properties || {};
  return {
    id: page.id as string, Nazwa: text(p.Nazwa) || 'Materiał bez tytułu', Typ: p.Typ?.select?.name || '', Model: values(p.Model).join(', '), Lata: values(p.Lata).join('; '),
    Opis: text(p.Opis), Objawy: text(p.Objawy), Rozwiązanie: text(p['Rozwiązanie']), edited: typeof page.last_edited_time === 'string' ? page.last_edited_time.slice(0, 10) : '',
    applicability: { brand: values(p.Marka), model: values(p.Model), years: values(p.Lata), engine: values(p.Silnik), drive: values(p['Napęd']), transmission: values(p.Skrzynia) },
  };
});
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = await readEntry((await params).id);
  if (!entry) return { title: 'Nie znaleziono materiału — GMT400', robots: { index: false, follow: false } };
  return { title: `${entry.Nazwa} — GMT400`, description: (entry.Opis || entry.Objawy || entry.Rozwiązanie || entry.Nazwa).slice(0, 160), alternates: { canonical: `https://www.gmt400.pl/baza/${entry.id}` } };
}
export default async function KnowledgeEntry({ params }: Props) {
  const entry = await readEntry((await params).id);
  if (!entry) notFound();
  return <main className="mx-auto min-h-screen max-w-4xl bg-black px-5 py-10 pb-28 text-white">
    <a href="/" className="text-amber-400 underline">Wróć do encyklopedii</a>
    <article className="mt-6 space-y-6">
      <p className="text-sm text-neutral-400">{entry.Typ} · {entry.Model} {entry.Lata}</p>
      <h1 className="text-3xl text-amber-400">{entry.Nazwa}</h1>
      <VehicleMatchBadge item={entry} />
      <p className="rounded border border-white/20 p-3 text-sm text-neutral-400">Dopasowanie do profilu opiera się na metadanych i nie potwierdza poprawności technicznej. Przed naprawą sprawdź zgodność procedury z pojazdem i dokumentacją serwisową.</p>
      {entry.Opis && <section><h2 className="mb-2 text-xl">Opis</h2><p className="whitespace-pre-line text-neutral-300">{entry.Opis}</p></section>}
      {entry.Objawy && <section><h2 className="mb-2 text-xl">Objawy</h2><p className="whitespace-pre-line text-neutral-300">{entry.Objawy}</p></section>}
      {entry.Rozwiązanie && <section><h2 className="mb-2 text-xl">Rozwiązanie</h2><p className="whitespace-pre-line text-neutral-300">{entry.Rozwiązanie}</p></section>}
      {!entry.Opis && !entry.Objawy && !entry.Rozwiązanie && <p>Ten wpis nie zawiera jeszcze szczegółowej treści.</p>}
      {entry.edited && <p className="text-xs text-neutral-500">Ostatnia edycja wpisu w Notion: {entry.edited}. To nie jest data weryfikacji merytorycznej.</p>}
    </article>
  </main>;
}
