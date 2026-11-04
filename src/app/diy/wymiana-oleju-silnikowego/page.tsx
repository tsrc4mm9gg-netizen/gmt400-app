import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana oleju silnikowego GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić olej silnikowy w GMT400. Procedura, pojemności, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-oleju-silnikowego' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Rozgrzej silnik (5 minut). Podnieś auto na podpory. Przygotuj pojemnik na olej.' },
  { step: 2, title: 'Spust oleju', desc: 'Odkręć korek spustowy miski olejowej. Pozwól olejowi spłynąć (5–10 minut).' },
  { step: 3, title: 'Wymień filtr', desc: 'Odkręć stary filtr kluczem do filtrów. Posmaruj uszczelkę nowego filtra olejem. Wkręć ręcznie.' },
  { step: 4, title: 'Zakręć korek', desc: 'Zakręć korek spustowy z nową uszczelką. Dokręć momentem.' },
  { step: 5, title: 'Wlej olej', desc: 'Wlej nowy olej przez korek wlewu. Sprawdź pojemność dla swojego silnika.' },
  { step: 6, title: 'Sprawdź poziom', desc: 'Uruchom silnik na 30 sekund. Wyłącz. Sprawdź poziom bagnetem. Uzupełnij jeśli trzeba.' },
];

const CAPACITIES = [
  { engine: 'Vortec 4.3', capacity: '4.7 L' },
  { engine: 'Vortec 5.0', capacity: '4.7 L' },
  { engine: 'Vortec 5.7', capacity: '4.7 L' },
  { engine: 'Vortec 7.4', capacity: '6.6 L' },
  { engine: 'Diesel 6.5', capacity: '6.6 L' },
];

const faqItems = [
  {
    question: 'Jaki olej do GMT400?',
    answer: 'Silniki benzynowe: 5W-30 lub 10W-30. Diesel 6.5: 15W-40. Sprawdź w instrukcji.',
  },
  {
    question: 'Jak często wymieniać olej?',
    answer: 'Co 5000–8000 km lub co 6 miesięcy. Częściej przy ciężkiej eksploatacji.',
  },
];

export default function WymianaOlejuSilnikowegoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana oleju silnikowego' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana oleju silnikowego</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany oleju silnikowego w GMT400. Podstawowa konserwacja.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Łatwa | <strong>Czas:</strong> 30–45 minut | <strong>Narzędzia:</strong> podnośnik, klucz do filtra, pojemnik
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

        <AccordionSection title="Pojemności oleju">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 text-left text-silver-200">Silnik</th>
                  <th className="py-2 text-left text-silver-200">Pojemność</th>
                </tr>
              </thead>
              <tbody>
                {CAPACITIES.map(c => (
                  <tr key={c.engine} className="border-b border-white/5">
                    <td className="py-2 text-neutral-300">{c.engine}</td>
                    <td className="py-2 text-neutral-300">{c.capacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Olej silnikowy (5W-30 lub 10W-30)</li>
              <li>Filtr oleju</li>
              <li>Uszczelka korka spustowego</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=5W-30+motor+oil&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj oleju na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Olej 5W-30', search: '5W-30 motor oil' },
                { name: 'Filtr oleju GMT400', search: 'GMT400 oil filter' },
                { name: 'Klucz do filtra', search: 'oil filter wrench' },
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
