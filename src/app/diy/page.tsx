import type { Metadata } from 'next';
import { getListEntries } from '../../lib/notion-entries';
import DIYTopics from './DIYTopics';

export const metadata: Metadata = {
  title: 'DIY GMT400 — tematy i instrukcje krok po kroku',
  description: 'Poradniki GMT400 pogrupowane w tematy. LS swap oraz felgi i opony z modułami, etapami i źródłami.',
  alternates: { canonical: 'https://www.gmt400.pl/diy' },
};
export const revalidate = 900;

export default async function Page() {
  const items = await getListEntries();
  return <section className="mx-auto max-w-5xl px-4 py-8" aria-labelledby="diy-title">
    <h1 id="diy-title" className="mb-6 text-3xl font-bold text-neutral-100">Poradniki DIY</h1>
    <a href="/diy/felgi-i-opony" className="mb-4 block min-h-11 rounded-2xl border border-white/15 bg-neutral-950 p-4 text-neutral-100 focus-visible:outline-2 focus-visible:outline-amber-400">
      <h2 className="text-lg font-semibold">Felgi i opony</h2>
      <p className="mt-2 text-sm text-neutral-400">Osiem modułów: dane fabryczne, rozmiary, średnice, offset, opinie, przepisy, narzędzia i FAQ.</p>
    </a>
    {items === null ? <p role="alert">Nie udało się pobrać listy poradników. Odśwież stronę, aby spróbować ponownie.</p> : <DIYTopics items={items.filter(item => item.Typ === 'Porada' && !/^felgi i opony/i.test(item.Nazwa))} />}
    <nav aria-label="Narzędzia i dodatkowe materiały" className="mt-8 flex flex-wrap gap-4 text-amber-400 underline">
      <a href="/narzedzia">Narzędzia</a>
      <a href="/baza">Pełna baza wiedzy</a>
    </nav>
  </section>;
}
