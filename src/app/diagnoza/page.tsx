import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '../ui/JsonLd';
import AffiliateBox from '../ui/AffiliateBox';
import FAQ from '../ui/FAQ';
import PartLink from '../ui/PartLink';
import AccordionSection from '../ui/AccordionSection';
import { DIAG_GUIDES } from '../../lib/diagnosis-guides';
import DiagnozaTool from './DiagnozaTool';
import { getListEntries } from '../../lib/notion-entries';
import { buildMeta } from '../../lib/diagnosis-meta';
import { SYMPTOMS } from '../../lib/diagnosis';

export const metadata: Metadata = {
  title: 'Diagnoza objawów GMT400 — nie odpala, szarpie, Check Engine | Tahoe, Suburban',
  description: 'Wybierz objaw (nie odpala, szarpie, wycieki, skrzynia 4L60-E, hamulce, klima, przegrzewanie). Odpowiedz na 1–2 pytania i zobacz możliwe przyczyny z linkami do usterek i DIY dla GMT400.',
  alternates: { canonical: 'https://www.gmt400.pl/diagnoza' },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'GMT400',
    url: 'https://www.gmt400.pl/diagnoza',
    title: 'Diagnoza objawów GMT400',
    description: 'Szybka diagnoza problemów Tahoe, Suburban, Silverado i innych GMT400.',
  },
};

export const revalidate = 900;

const DIAGNOSTIC_TIPS = [
  { title: 'Zacznij od prostych rzeczy', tip: 'Sprawdź poziom płynów, stan filtrów, napięcie akumulatora. 50% problemów to proste przyczyny.' },
  { title: 'Odczytaj kody OBD', tip: 'Skaner OBD2 pokaże kody błędów. Zapisz je przed czyszczeniem — pomogą w diagnozie.' },
  { title: 'Nie wymieniaj części na oślep', tip: 'Potwierdź usterkę pomiarami. Wymiana sprawnej części nie rozwiąże problemu.' },
  { title: 'Sprawdź połączenia', tip: 'Luźne złącza i skorodowane styki powodują wiele problemów. Sprawdź przed wymianą części.' },
];

const faqItems = [
  {
    question: 'Jak zdiagnozować problem z GMT400?',
    answer: 'Zacznij od objawów: czy auto nie odpala, szarpie, świeci Check Engine? Sprawdź kody OBD (skaner), poziom płynów, stan filtrów. Użyj narzędzia diagnozy na tej stronie — wybierz objaw i odpowiedz na pytania.',
  },
  {
    question: 'Co sprawdzić, gdy auto nie odpala?',
    answer: 'Sprawdź: akumulator (napięcie), rozrusznik (czy kręci), iskrę (świece, cewka), paliwo (pompa, filtr, przekaźnik). W modelach 1996+ odczytaj kody OBD. W starszych sprawdź bezpieczniki i przekaźniki.',
  },
  {
    question: 'Dlaczego świeci Check Engine?',
    answer: 'Check Engine oznacza problem wykryty przez komputer. Odczytaj kod skanerem OBD2. Najczęstsze przyczyny: zużyte świece, problemy z paliwem (mieszanka), czujniki (MAF, O2), problemy z emisjami.',
  },
  {
    question: 'Jak sprawdzić, czy pompa paliwa działa?',
    answer: 'Włącz zapłon (nie kręć) — powinieneś usłyszeć buczenie pompy przez 2–3 sekundy. Jeśli nie, sprawdź bezpiecznik, przekaźnik i zasilanie. Ciśnienie paliwa można zmierzyć manometrem (norma: 60–66 psi dla Vortec).',
  },
];

export default async function Page() {
  const entries = await getListEntries();
  const meta = entries ? buildMeta(entries) : null;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Objawy w diagnozie GMT400',
    url: 'https://www.gmt400.pl/diagnoza',
    numberOfItems: SYMPTOMS.length,
    itemListElement: SYMPTOMS.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.label })),
  };
  return <>
    <DiagnozaTool initialMeta={meta} />
    <section data-testid="diag-guides" aria-labelledby="poradniki-gm" className="mx-auto w-full max-w-5xl px-4 pb-8">
      <h2 id="poradniki-gm" className="text-xl font-semibold text-white">Poradniki diagnostyczne z instrukcji GM</h2>
      <p className="mt-1 max-w-prose text-sm text-neutral-300">Typowe odczyty testera, hałasy, olej, pasek, detonacja i falowanie — kolejność kontroli według instrukcji serwisowych, opisana własnymi słowami, ze stronami źródła.</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {DIAG_GUIDES.map(g => <li key={g.slug}><Link href={`/diagnoza/${g.slug}`} className="flex min-h-11 flex-col justify-center rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 text-sm text-silver-100 hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-silver-500"><span className="font-semibold">{g.title}</span></Link></li>)}
      </ul>
    </section>
    <div className="mx-auto max-w-3xl px-4 pb-20">
      <AccordionSection title="Wskazówki diagnostyczne" defaultOpen>
        <div className="grid gap-3 sm:grid-cols-2">
          {DIAGNOSTIC_TIPS.map(item => (
            <div key={item.title} className="rounded-lg border border-white/10 bg-neutral-800 p-3">
              <h3 className="font-semibold text-silver-200">{item.title}</h3>
              <p className="mt-1 text-sm text-neutral-300">{item.tip}</p>
            </div>
          ))}
        </div>
      </AccordionSection>

      <AccordionSection title="Części do diagnostyki">
        <ul className="list-inside list-disc space-y-2 text-neutral-300">
          <li>Świece zapłonowe: <PartLink partNumber="41-932" /></li>
          <li>Przewody zapłonowe: <PartLink partNumber="9718D" /></li>
          <li>Pompa paliwa: <PartLink partNumber="EP381" /></li>
          <li>Filtr paliwa: <PartLink partNumber="GF626" /></li>
          <li>Cewka zapłonowa: <PartLink partNumber="D577" /></li>
        </ul>
      </AccordionSection>

      <AccordionSection title="Narzędzia do diagnostyki">
        <AffiliateBox
          title=""
          items={[
            { name: 'Skaner OBD2', search: 'OBD2 scanner' },
            { name: 'Multimetr', search: 'digital multimeter' },
            { name: 'Manometr paliwa', search: 'fuel pressure gauge' },
            { name: 'Lampa stroboskopowa', search: 'timing light' },
          ]}
        />
      </AccordionSection>

      <AccordionSection title="Częste pytania">
        <FAQ items={faqItems} />
      </AccordionSection>
    </div>
    <JsonLd data={jsonLd} />
  </>;
}
