import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';
import JsonLd from '../ui/JsonLd';
import AffiliateBox from '../ui/AffiliateBox';
import FAQ from '../ui/FAQ';
import PartLink from '../ui/PartLink';
import AccordionSection from '../ui/AccordionSection';
import Link from 'next/link';
import { getListEntries, itemListJsonLd } from '../../lib/notion-entries';

export const metadata: Metadata = {
  title: 'Usterki GMT400 — Tahoe, Suburban, Silverado 1988–2000 | objawy i naprawa',
  description: 'Typowe usterki Chevrolet Tahoe, Suburban, Silverado i GMC Sierra/Yukon (GMT400 1988–2000). Objawy, przyczyny, co sprawdzić najpierw i rozwiązania krok po kroku.',
  alternates: { canonical: 'https://www.gmt400.pl/usterki' },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'GMT400',
    url: 'https://www.gmt400.pl/usterki',
    title: 'Usterki GMT400 — Tahoe, Suburban, Silverado',
    description: 'Objawy, przyczyny i naprawa typowych usterek GMT400. Sprawdź, co warto zbadać jako pierwsze.',
  },
};

export const revalidate = 900;

const QUICK_CHECKS = [
  {
    symptom: 'Nie odpala',
    checks: [
      'Sprawdź napięcie akumulatora (min. 12.4V)',
      'Czy rozrusznik kręci? Jeśli nie — bezpiecznik, przekaźnik',
      'Czy pompa paliwa buczy przy włączeniu zapłonu?',
      'Sprawdź iskrę (świece, cewka)',
    ],
    parts: ['EP381', '41-932', 'D577'],
  },
  {
    symptom: 'Szarpie / gaśnie',
    checks: [
      'Odczytaj kody OBD (skaner)',
      'Sprawdź filtr powietrza',
      'Sprawdź świece i przewody',
      'Sprawdź ciśnienie paliwa (60–66 psi Vortec)',
    ],
    parts: ['41-932', '9718D', 'A1300C', 'GF626'],
  },
  {
    symptom: 'Skrzynia ślizga',
    checks: [
      'Sprawdź poziom i stan ATF',
      'Odczytaj kody (P0700, P0751–P0758)',
      'Sprawdź filtr ATF',
      'Sprawdź czujnik prędkości (VSS)',
    ],
    parts: ['TF289', 'TOS18663'],
  },
  {
    symptom: 'Przegrzewa się',
    checks: [
      'Sprawdź poziom płynu chłodniczego',
      'Sprawdź, czy wentylator się włącza',
      'Sprawdź termostat (otwiera się przy ~91°C)',
      'Sprawdź pompę wody (wycieki, hałas)',
    ],
    parts: ['131-113', '252-711'],
  },
];

const faqItems = [
  {
    question: 'Jakie są najczęstsze usterki GMT400?',
    answer: 'Najczęstsze problemy to: zużyte łożyska kół (piasty), wycieki oleju z miski, problemy z pompą paliwa, zużyte amortyzatory, problemy z elektroniką (czujniki, moduły) oraz korozja progów i podłogi. W modelach z 4L60-E częste są problemy ze skrzynią.',
  },
  {
    question: 'Czy GMT400 jest trudny w naprawie?',
    answer: 'GMT400 jest stosunkowo łatwy w naprawie dzięki prostej konstrukcji i dostępności części. Większość napraw mechanicznych (hamulce, zawieszenie, silnik) można wykonać samodzielnie. Elektronika wymaga czasem diagnostyki skanerem OBD.',
  },
  {
    question: 'Gdzie kupić części do GMT400 w Polsce?',
    answer: 'Części dostępne są w Allegro, Amazon.de, sklepach z częściami amerykańskimi oraz u importerów. Numery GM (ACDelco) są uniwersalne — można je zamawiać z USA lub Europy.',
  },
  {
    question: 'Ile kosztuje naprawa typowej usterki?',
    answer: 'Koszty zależą od usterki: wymiana piasty ~300-600 zł (część + robocizna), pompa paliwa ~500-1000 zł, amortyzatory ~400-800 zł za komplet. Samodzielna naprawa obniża koszty o 50-70%.',
  },
];

export default async function Page() {
  const items = await getListEntries();
  const list = (items ?? []).filter(entry => entry.Typ === 'Usterka');
  return <>
    <Encyclopedia initialTab="usterki" initialItems={items} />
    <div className="mx-auto max-w-3xl px-4">
      <AccordionSection title="Szybka diagnoza — co sprawdzić najpierw" defaultOpen>
        <p className="mb-3 text-sm text-neutral-400">Wybierz objaw i sprawdź najczęstsze przyczyny przed wymianą części.</p>
        <div className="space-y-3">
          {QUICK_CHECKS.map(item => (
            <div key={item.symptom} className="rounded-lg border border-white/10 bg-neutral-800 p-3">
              <h3 className="font-semibold text-silver-200">{item.symptom}</h3>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-neutral-300">
                {item.checks.map((check, i) => <li key={i}>{check}</li>)}
              </ol>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.parts.map(part => <PartLink key={part} partNumber={part} />)}
              </div>
            </div>
          ))}
        </div>
        <Link href="/diagnoza" className="mt-3 inline-block text-sm font-semibold text-silver-300 underline-offset-2 hover:underline">
          Pełna diagnoza objawów →
        </Link>
      </AccordionSection>

      <AccordionSection title="Części do najczęstszych usterek">
        <ul className="list-inside list-disc space-y-2 text-neutral-300">
          <li>Pompa paliwa: <PartLink partNumber="EP381" /></li>
          <li>Filtr paliwa: <PartLink partNumber="GF626" /></li>
          <li>Świece zapłonowe: <PartLink partNumber="41-932" /></li>
          <li>Przewody zapłonowe: <PartLink partNumber="9718D" /></li>
          <li>Klocki hamulcowe: <PartLink partNumber="14D52" /></li>
          <li>Filtr oleju: <PartLink partNumber="PF52" /></li>
        </ul>
      </AccordionSection>

      <AccordionSection title="Przydatne przy diagnostyce">
        <AffiliateBox
          title=""
          items={[
            { name: 'Skaner OBD2', search: 'OBD2 scanner' },
            { name: 'Multimetr', search: 'digital multimeter' },
            { name: 'Manometr paliwa', search: 'fuel pressure gauge' },
            { name: 'Termometr laserowy', search: 'infrared thermometer' },
          ]}
        />
      </AccordionSection>

      <AccordionSection title="Częste pytania">
        <FAQ items={faqItems} />
      </AccordionSection>
    </div>
    {list.length > 0 && <JsonLd data={itemListJsonLd('Usterki Chevrolet/GMC GMT400', 'https://www.gmt400.pl/usterki', list)} />}
  </>;
}
