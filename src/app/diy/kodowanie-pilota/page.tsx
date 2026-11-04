import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Kodowanie pilota centralnego zamka GMT400 — instrukcja krok po kroku',
  description: 'Jak zaprogramować pilot do centralnego zamka w GMT400 (Tahoe, Suburban, Silverado). Procedura z gniazdem OBD2, kody RPO AU0, rozwiązywanie problemów.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/kodowanie-pilota' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Sprawdź kod RPO', desc: 'Na naklejce w schowku lub na słupku drzwi znajdź kod AU0. To oznacza fabryczny centralny zamek z pilotem. Bez tego kodu auto nie ma systemu keyless entry.' },
  { step: 2, title: 'Przygotuj pilota', desc: 'Sprawdź baterię w pilocie (CR2032). Wymień jeśli słaba. Oczyść styki przycisków jeśli są brudne.' },
  { step: 3, title: 'Zamknij drzwi', desc: 'Zamknij wszystkie drzwi. Usiądź w aucie z kluczykiem w stacyjce (pozycja OFF).' },
  { step: 4, title: 'Zewrzyj piny OBD2', desc: 'Znajdź gniazdo OBD2 (pod deską, po lewej stronie). Zewrzyj pin 4 i pin 8 spinaczem lub kawałkiem drutu. Zamki powinny zablokować i odblokować się — to znak, że jesteś w trybie programowania.' },
  { step: 5, title: 'Zaprogramuj pilota', desc: 'Przytrzymaj jednocześnie przyciski LOCK i UNLOCK na pilocie (ok. 5–15 sekund). Zamki powinny znowu zablokować/odblokować się — pilot zaprogramowany.' },
  { step: 6, title: 'Dodaj kolejne piloty', desc: 'Jeśli masz więcej pilotów (max 4), powtórz krok 5 dla każdego. Nie powtarzaj całej procedury — tylko przytrzymaj przyciski na kolejnym pilocie.' },
  { step: 7, title: 'Zakończ', desc: 'Usuń spinacz z gniazda OBD2. Przetestuj piloty. Jeśli nie działają, powtórz procedurę.' },
];

const TIPS = [
  { title: 'Pin 4 i pin 8', tip: 'Pin 4 to masa (ground), pin 8 to sygnał programowania. Oba są w górnym rzędzie gniazda OBD2 (patrząc od przodu).' },
  { title: 'Max 4 piloty', tip: 'System zapamiętuje maksymalnie 4 piloty. Przy programowaniu nowego, stare zostają w pamięci (chyba że powtórzysz całą procedurę od początku).' },
  { title: 'FCC ID', tip: 'Piloty muszą mieć pasujący FCC ID. Typowe dla GMT400: AB01502T, AB01502R. Sprawdź na pilocie i na module odbiornika (pod deską, przy kolumnie kierownicy).' },
  { title: 'Bateria', tip: 'Jeśli pilot nie działa po programowaniu, sprawdź baterię. CR2032 jest standardem. Wymień i spróbuj ponownie.' },
];

const USER_TIPS = [
  { title: 'Programuj wszystkie piloty w jednej sesji', tip: 'Jeśli powtórzysz całą procedurę dla każdego pilota osobno, poprzednie zostaną wymazane. Po pierwszym pilocie od razu programuj kolejne (przytrzymaj LOCK+UNLOCK), bez powtarzania zwarcia pinów.' },
  { title: 'Tanie piloty z Amazon/eBay', tip: 'Użytkownicy zgłaszają, że tanie zamienniki często nie działają lub działają krótko. Szukaj pilotów z dokładnym FCC ID (AB01502T). Oryginalne GM są droższe, ale pewniejsze.' },
  { title: 'Styki przycisków', tip: 'Jeśli pilot nie reaguje, otwórz go i oczyść styki przycisków alkoholem izopropylowym. Brud i korozja to częsta przyczyna.' },
  { title: 'Moduł odbiornika', tip: 'Jeśli procedura nie działa mimo poprawnego kodu AU0, problem może być w module odbiornika (pod deską, przy kolumnie kierownicy). Użytkownicy zgłaszają problemy z lutami na płytce.' },
  { title: 'Tylko drzwi kierowcy', tip: 'Jeśli pilot otwiera tylko drzwi kierowcy, problem może być w przekaźnikach w module lub okablowaniu do pozostałych drzwi. Drzwi kierowcy mają osobne połączenie.' },
  { title: 'Aftermarket radio', tip: 'Niektórzy użytkownicy zgłaszają problemy z programowaniem po instalacji radia aftermarket. Spróbuj odłączyć radio i powtórzyć procedurę.' },
];

const TROUBLESHOOTING = [
  { problem: 'Zamki nie reagują na zwarcie pinów', solution: 'Sprawdź bezpieczniki. Sprawdź, czy auto ma kod AU0. Sprawdź połączenie spinacza (musi być pewne). Sprawdź, czy nie ma aftermarket systemu.' },
  { problem: 'Pilot nie programuje się', solution: 'Sprawdź baterię. Oczyść styki przycisków. Sprawdź FCC ID — musi pasować do modułu. Spróbuj innego pilota.' },
  { problem: 'Pilot działa tylko z bliska', solution: 'Słaba bateria lub uszkodzony pilot. Wymień baterię lub pilot. Tanie zamienniki często mają słaby zasięg.' },
  { problem: 'Po programowaniu stary pilot nie działa', solution: 'Powtórzyłeś całą procedurę dla nowego pilota. Programuj wszystkie piloty w jednej sesji (krok 5–6).' },
  { problem: 'Pilot otwiera tylko drzwi kierowcy', solution: 'Problem w module odbiornika lub okablowaniu. Sprawdź przekaźniki w module. Może wymagać naprawy lutów.' },
];

const faqItems = [
  {
    question: 'Jak sprawdzić, czy moje auto ma centralny zamek z pilotem?',
    answer: 'Sprawdź kod RPO na naklejce w schowku lub na słupku drzwi. Kod AU0 oznacza fabryczny keyless entry. AU3 to tylko elektryczne zamki bez pilota.',
  },
  {
    question: 'Ile pilotów można zaprogramować?',
    answer: 'Maksymalnie 4 piloty. Przy programowaniu nowego, stare zostają w pamięci, jeśli programujesz je w tej samej sesji.',
  },
  {
    question: 'Jaki pilot kupić?',
    answer: 'Szukaj pilota z FCC ID AB01502T lub AB01502R. To standardowe piloty GMT400. Użytkownicy zgłaszają problemy z tanimi zamiennikami — oryginalne GM są pewniejsze.',
  },
  {
    question: 'Co jeśli procedura nie działa?',
    answer: 'Sprawdź bezpieczniki, baterię w pilocie, FCC ID. Jeśli nadal nie działa, problem może być w module odbiornika (pod deską) lub okablowaniu.',
  },
  {
    question: 'Pilot działał, a teraz nie działa — co robić?',
    answer: 'Sprawdź baterię, oczyść styki, spróbuj resynchronizacji (przytrzymaj LOCK+UNLOCK przez 30-45 sekund bez spinacza). Jeśli nie pomoże — kup nowy pilot.',
  },
];

export default function KodowaniePilotaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Kodowanie pilota' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Kodowanie pilota centralnego zamka</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja programowania pilota do centralnego zamka w GMT400 (1996–2000). Procedura wymaga tylko spinacza i działa na fabrycznym systemie (kod RPO AU0).
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Wymagania:</strong> Auto z kodem RPO AU0 (fabryczny keyless entry). Pilot z pasującym FCC ID (AB01502T lub AB01502R). Spinacz lub kawałek drutu.
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

        <AccordionSection title="Schemat gniazda OBD2 — zwarcie pinów" defaultOpen>
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <p className="mb-4 text-sm text-neutral-300">Gniazdo OBD2 znajduje się pod deską rozdzielczą, po lewej stronie (pod kolumną kierownicy). Ma 16 pinów w dwóch rzędach.</p>
            
            <div className="mb-4 rounded-lg bg-neutral-900 p-4">
              <p className="mb-2 text-center text-xs font-semibold text-silver-400">WIDOK OD PRZODU (jak patrzysz na gniazdo)</p>
              <pre className="overflow-x-auto text-center text-sm text-neutral-300">
{`
    ┌───────────────────────────────────┐
    │  1   2   3   4   5   6   7   8  │  ← GÓRNY RZĄD
    │                             │
    │  9  10  11  12  13  14  15  16 │  ← DOLNY RZĄD
    └───────────────────────────────────┘

         ↑           ↑
       PIN 4       PIN 8
       (masa)    (sygnał)
`}
              </pre>
            </div>

            <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-950/30 p-3">
              <p className="text-sm font-semibold text-amber-300">Jak zewrzeć piny:</p>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-neutral-300">
                <li>Weź spinacz biurowy lub kawałek drutu (ok. 5 cm)</li>
                <li>Wsuń jeden koniec do <strong>pinu 4</strong> (4. od lewej w górnym rzędzie)</li>
                <li>Wsuń drugi koniec do <strong>pinu 8</strong> (ostatni w górnym rzędzie)</li>
                <li>Zamki powinny zablokować i odblokować się — jesteś w trybie programowania</li>
              </ol>
            </div>

            <div className="rounded-lg border border-silver-500/30 bg-silver-950/20 p-3">
              <p className="text-sm text-neutral-300">
                <strong>Uwaga:</strong> Pin 4 to masa (ground), pin 8 to sygnał programowania. Oba są w <strong>górnym rzędzie</strong>. Nie myl z dolnym rzędem!
              </p>
            </div>
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

        <AccordionSection title="Porady od użytkowników">
          <p className="mb-3 text-sm text-neutral-400">Zebrane z forów GMT400.com i doświadczeń właścicieli.</p>
          <div className="space-y-3">
            {USER_TIPS.map(t => (
              <div key={t.title} className="rounded-lg border border-silver-500/30 bg-silver-950/20 p-3">
                <h3 className="font-semibold text-silver-300">{t.title}</h3>
                <p className="mt-1 text-sm text-neutral-300">{t.tip}</p>
              </div>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title="Pilot synchronizuje się, ale nie działa">
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Opis problemu</h3>
            <p className="mt-2 text-sm text-neutral-300">
              Procedura wygląda poprawnie: po zwarciu pinów 4 i 8 zamki reagują. Przytrzymujesz LOCK+UNLOCK i zamki znowu reagują — pilot się synchronizuje. Ale po usunięciu spinacza pilot nie działa.
            </p>
            <h3 className="mt-4 font-semibold text-amber-300">Rozwiązanie</h3>
            <p className="mt-2 text-sm text-neutral-300">
              <strong>Kup inny pilot.</strong> Użytkownicy potwierdzają, że nowy pilot z dokładnym FCC ID AB01502T rozwiązuje problem. Tanie zamienniki często mają ten problem.
            </p>
          </div>
        </AccordionSection>

        <AccordionSection title="Pilot działał, a teraz nie działa">
          <div className="rounded-lg border border-silver-500/30 bg-silver-950/20 p-4">
            <h3 className="font-semibold text-silver-300">Pilot wcześniej działał, a teraz synchronizuje się ale nie działa</h3>
            <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-neutral-300">
              <li><strong>Słaba bateria</strong> — sprawdź napięcie (~3V)</li>
              <li><strong>Brudne styki</strong> — oczyść alkoholem</li>
              <li><strong>Rozsynchronizowanie</strong> — spróbuj resynchronizacji</li>
              <li><strong>Zużyty pilot</strong> — tanie zamienniki mają krótką żywotność</li>
            </ol>
            <h3 className="mt-4 font-semibold text-silver-300">Resynchronizacja (bez spinacza)</h3>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-neutral-300">
              <li>Stań przy drzwiach kierowcy</li>
              <li>Przytrzymaj LOCK + UNLOCK przez 30–45 sekund</li>
              <li>Klakson powinien krótko zabrzmieć</li>
            </ol>
          </div>
        </AccordionSection>

        <AccordionSection title="Rozwiązywanie problemów">
          <div className="space-y-3">
            {TROUBLESHOOTING.map(t => (
              <div key={t.problem} className="rounded-lg border border-white/10 bg-neutral-800 p-3">
                <h3 className="font-semibold text-amber-400">{t.problem}</h3>
                <p className="mt-1 text-sm text-neutral-300">{t.solution}</p>
              </div>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title="Gdzie kupić pilot" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Polecany pilot</h3>
            <p className="mt-2 text-sm text-neutral-300">
              Szukaj pilota z FCC ID <strong>AB01502T</strong> lub <strong>AB01502R</strong>. To standardowe piloty GMT400.
            </p>
            <a
              href={`https://www.amazon.de/s?k=GMT400+keyless+remote+AB01502T&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj pilota na Amazon.de ↗
            </a>
            <p className="mt-3 text-xs text-neutral-400">
              Użytkownicy forów GMT400.com polecają piloty KeylessOption i oryginalne GM. Tanie zamienniki często nie działają lub działają krótko.
            </p>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Pilot GMT400 AB01502T', search: 'GMT400 keyless remote AB01502T' },
                { name: 'Bateria CR2032', search: 'CR2032 battery' },
                { name: 'Alkohol izopropylowy', search: 'isopropyl alcohol' },
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
