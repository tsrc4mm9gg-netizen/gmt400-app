import type { Metadata } from 'next';
import { NotionContent, readNotionBlocks } from '../../baza/[id]/NotionContent';

export const metadata: Metadata = {
  title: 'Felgi i opony GMT400 — poradnik modułowy',
  description: 'Dane fabryczne, rozmiary 2WD i 4WD, średnice opon, offset, numery części, opinie właścicieli, przepisy PL i FAQ.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/felgi-i-opony' },
};
export const revalidate = 300;

const modules = [
  ['dane-fabryczne', 'Dane fabryczne i numery części', '414d7bf1-c139-819c-acca-eca7d3daba7b'],
  ['rozmiary-fabryczne', 'Rozmiary fabryczne według rocznika i napędu', '414d7bf1-c139-81c9-8e72-fdfc467ac7da'],
  ['srednice-opon', 'Średnice opon', '414d7bf1-c139-8147-a27e-d017dc4b30de'],
  ['offset-backspacing', 'Offset i backspacing', '414d7bf1-c139-8132-9ceb-c07cd83464a3'],
  ['opinie', 'Opinie właścicieli', '414d7bf1-c139-81e5-92e1-d94762f55348'],
  ['przepisy', 'Przepisy w Polsce', '414d7bf1-c139-819f-8e02-f1f100ff2f9b'],
  ['narzedzia', 'Narzędzia i listy kontrolne', '414d7bf1-c139-8199-9888-e651202fb3c0'],
  ['faq', 'FAQ', '414d7bf1-c139-817f-a9b7-c1868258b1d1'],
] as const;

export default async function Page() {
  const token = process.env.NOTION_TOKEN;
  const sections = await Promise.all(modules.map(async ([slug, title, id]) => {
    try {
      if (!token) throw new Error('Brak konfiguracji Notion');
      const blocks = await readNotionBlocks(id, token);
      return { slug, title, blocks, error: false };
    } catch {
      return { slug, title, blocks: [], error: true };
    }
  }));
  return <article className="mx-auto max-w-4xl space-y-6 px-4 py-8 text-neutral-200">
    <a href="/diy" className="inline-flex min-h-11 items-center rounded text-amber-400 underline focus-visible:outline-2 focus-visible:outline-amber-400">Wróć do tematów DIY</a>
    <header className="space-y-3">
      <h1 className="text-3xl font-bold">Felgi i opony GMT400</h1>
      <p>Kliknij tytuł podkategorii, aby rozwinąć jej tabele, kroki i źródła. Ponowne kliknięcie zwija treść.</p>
      <p className="rounded-xl border border-amber-400/40 p-4 text-sm">Wersja robocza. Status POTWIERDZONE w materiale nie stanowi gwarancji dopasowania do konkretnego auta. Dane i momenty dokręcania sprawdź w instrukcji właściwego modelu i rocznika. OPINIA oznacza relację właściciela; DO WERYFIKACJI — dane niepotwierdzone; OBLICZONE — wynik wzoru.</p>
    </header>
    {sections.some(section => section.error) && <p role="alert" className="rounded-xl border border-amber-400/40 p-4">Nie udało się pobrać wszystkich modułów. Poradnik jest niekompletny. Odśwież stronę, aby ponowić próbę.</p>}
    <section aria-label="Podkategorie poradnika felg i opon" className="space-y-3">
      {sections.map((section, index) => <details id={section.slug} key={section.slug} className="scroll-mt-32 rounded-xl border border-white/15 p-4">
        <summary className="min-h-11 cursor-pointer rounded text-xl font-semibold focus-visible:outline-2 focus-visible:outline-amber-400">{index + 1}. {section.title}</summary>
        {section.error ? <p className="mt-3">Nie udało się pobrać tego modułu. Odśwież stronę, aby spróbować ponownie.</p> : <NotionContent blocks={section.blocks} />}
      </details>)}
    </section>
  </article>;
}
