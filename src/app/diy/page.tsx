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
  return <main className="mx-auto max-w-5xl px-4 py-8">
    <h1 className="mb-6 text-3xl font-bold text-neutral-100">Poradniki DIY</h1>
    <DIYTopics items={(items ?? []).filter(item => item.Typ === 'Porada')} />
    <nav aria-label="Narzędzia i dodatkowe materiały" className="mt-8 flex flex-wrap gap-4 text-amber-400 underline">
      <a href="/narzedzia">Narzędzia</a>
      <a href="/baza">Pełna baza wiedzy</a>
    </nav>
  </main>;
}
