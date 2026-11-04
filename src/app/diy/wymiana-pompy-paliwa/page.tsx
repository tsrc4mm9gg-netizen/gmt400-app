import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana pompy paliwa GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić pompę paliwa w GMT400 (Tahoe, Suburban, Silverado). Procedura z opuszczeniem zbiornika, lista narzędzi i części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-pompy-paliwa' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Odłącz minus akumulatora. Opróżnij zbiornik paliwa (najlepiej do 1/4 lub mniej). Podnieś auto na podpory.' },
  { step: 2, title: 'Odłącz przewody', desc: 'Zlokalizuj zbiornik paliwa (pod ławką lub za kabiną). Odłącz przewody paliwowe (użyj narzędzia do szybkozłączek). Odłącz złącze elektryczne pompy.' },
  { step: 3, title: 'Opuść zbiornik', desc: 'Podeprzyj zbiornik podnośnikiem lub pomocnikiem. Odkręć śruby pasów zbiornika. Opuść zbiornik ostrożnie.' },
  { step: 4, title: 'Wymień pompę', desc: 'Odkręć pierścień blokujący (kluczem do pierścieni lub młotkiem i dłutem). Wyjmij moduł pompy. Wymień pompę i filtr (jeśli jest w module).' },
  { step: 5, title: 'Złóż', desc: 'Załóż nową uszczelkę. Wkręć pierścień blokujący. Podnieś zbiornik, przykręć pasy. Podłącz przewody i złącze.' },
  { step: 6, title: 'Test', desc: 'Podłącz akumulator. Włącz zapłon (nie uruchamiaj) — pompa powinna zabuczeć. Sprawdź szczelność. Uruchom silnik.' },
];

const TIPS = [
  { title: 'Opróżnij zbiornik', tip: 'Im mniej paliwa, tym łatwiej. Możesz jeździć do rezerwy lub odessać pompą.' },
  { title: 'Uszczelka', tip: 'Zawsze wymieniaj uszczelkę modułu pompy. Stara może przeciekać.' },
  { title: 'Pierścień blokujący', tip: 'Jeśli nie masz klucza, użyj młotka i dłuta. Uderzaj delikatnie, żeby nie uszkodzić zbiornika.' },
  { title: 'Filtr', tip: 'Wymień filtr paliwa (zewnętrzny) przy okazji. Jest tani i wpływa na żywotność pompy.' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać uszkodzoną pompę paliwa?',
    answer: 'Objawy: auto nie odpala, gaśnie w czasie jazdy, szarpie przy przyspieszaniu, brak buczenia pompy przy włączeniu zapłonu.',
  },
  {
    question: 'Ile trwa wymiana?',
    answer: 'Dla doświadczonego mechanika 1–2 godziny. Dla DIY z pierwszą wymianą — 2–4 godziny.',
  },
  {
    question: 'Czy muszę opuszczać zbiornik?',
    answer: 'Tak, w GMT400 pompa jest wewnątrz zbiornika. Nie ma dostępu przez klapę w podłodze (jak w niektórych nowszych autach).',
  },
];

export default function WymianaPompyPaliwaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana pompy paliwa' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana pompy paliwa</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany pompy paliwa w GMT400 (1988–2000). Pompa znajduje się wewnątrz zbiornika paliwa.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Średnia | <strong>Czas:</strong> 2–4 godziny | <strong>Narzędzia:</strong> podnośnik, klucze, narzędzie do szybkozłączek
        </p>
      </div>

      <div className="mt-6">
        <AccordionSection title="Procedura krok po kroku" defaultOpen>
          <ol className="space-y-4">
            {STEPS.map(s => (
              <li key={s.step} className="rounded-lg border border-white/10 bg-neutral-800 p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-silver-600 text-sm font-bold text-neutral-950">{s.step}</span>
                  <h3 className="font-semibold text-silver-200">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm text-neutral-300">{s.desc}</p>
              </li>
            ))}
          </ol>
        </AccordionSection>

        <AccordionSection title="Schemat — lokalizacja zbiornika">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z boku (pickup):

    ┌──────────────────────────────┐
    │  KABINA          │  SKRZYNIA  │
    │                 │           │
    │    [ŁAWKA]       │           │
    └────────────────┬────────────────┘
                   │
              ┌────┴────┐
              │ ZBIORNIK │  ← pod ławką
              │  PALIWA  │     lub za kabiną
              └───────────┘

SUV (Tahoe/Suburban):
Zbiornik pod podłogą, za tylną osią lub między osiami.
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Wskazówki">
          <div className="space-y-3">
            {TIPS.map(t => (
              <div key={t.title} className="rounded-lg border border-white/10 bg-neutral-800 p-3">
                <h3 className="font-semibold text-silver-200">{t.title}</h3>
                <p className="mt-1 text-sm text-neutral-300">{t.tip}</p>
              </div>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Pompa paliwa (sprawdź rok i silnik)</li>
              <li>Uszczelka modułu pompy</li>
              <li>Filtr paliwa (zalecany)</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+fuel+pump&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj pompy paliwa na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Pompa paliwa GMT400', search: 'GMT400 fuel pump' },
                { name: 'Filtr paliwa', search: 'GMT400 fuel filter' },
                { name: 'Narzędzie do szybkozłączek', search: 'fuel line disconnect tool' },
              ]}
            />
          </div>
        </AccordionSection>

        <AccordionSection title="Częste pytania">
          <FAQ items={faqItems} />
        </AccordionSection>
      </div>

      <p className="mt-6 text-sm text-neutral-400">
        <Link href="/diy" className="text-silver-400 hover:underline">← Wróć do DIY</Link>
      </p>
    </div>
  );
}
