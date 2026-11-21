import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Podgląd rysunków rozpoznawczych — GMT400',
  description: 'Wewnętrzna strona podglądu rysunków rozpoznawczych GMT400. Do akceptacji, nieindeksowana.',
  robots: { index: false, follow: false },
};

const RYSUNKI = [
  {
    src: '/rozpoznawanie/przod-1988-93.svg',
    alt: 'Schemat przedniej części GMT400 z lat 1988–1993 z prostokątną atrapą o pionowych żebrach.',
    title: 'Przód 1988–1993',
    note: 'Różnica względem 1994–1998: kształt atrapy.',
  },
  {
    src: '/rozpoznawanie/przod-1994-98.svg',
    alt: 'Schemat przedniej części GMT400 z lat 1994–1998 z atrapą o innym układzie żeber.',
    title: 'Przód 1994–1998',
    note: 'Różnica względem 1988–1993: kształt atrapy.',
  },
  {
    src: '/rozpoznawanie/deska-1988-94-i-1995-98.svg',
    alt: 'Dwa schematy deski rozdzielczej GMT400: prostokątny z lat 1988–1994 i zaokrąglony z lat 1995–1998.',
    title: 'Deska 1988–1994 i 1995–1998',
    note: 'Różnica: prostokątny vs zaokrąglony kształt panelu.',
  },
];

const NIE_TWIERDZI = [
  'Rysunki nie pokazują różnic lamp przednich ani nie przypisują lamp do roczników — to NIE POTWIERDZONO.',
  'Rysunki nie pokazują wnętrza poza kształtem deski: brak foteli, tapicerki, kolorów i wyposażenia.',
  'Rysunki nie pokazują poduszki powietrznej ani jej rocznika wprowadzenia.',
  'Rysunki nie pokazują wymiarów, proporcji ani położenia punktów mocowania.',
  'Rysunki nie rozstrzygają zamienności części między rocznikami.',
  'Rysunki nie przedstawiają znaków towarowych, logo ani nazw marek.',
];

export default async function PodgladRysunkowPage({ searchParams }: { searchParams: Promise<{ theme?: string }> }) {
  const { theme } = await searchParams;
  const dark = theme !== 'light';
  const palette = dark
    ? { bg: '#0b0b0d', panel: '#161618', text: '#ededed', muted: '#a8b0ba', border: 'rgba(255,255,255,.14)' }
    : { bg: '#ffffff', panel: '#f5f6f7', text: '#111827', muted: '#4b5563', border: 'rgba(0,0,0,.14)' };

  return (
    <main style={{ background: palette.bg, color: palette.text, minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ margin: 0, fontSize: '.8rem', letterSpacing: '.08em', textTransform: 'uppercase', color: palette.muted }}>
          Strona do akceptacji · noindex
        </p>
        <h1 style={{ margin: '.5rem 0 0', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>Rysunki rozpoznawcze GMT400 — etap 1</h1>
        <p style={{ margin: '.75rem 0 0', maxWidth: '70ch', color: palette.muted }}>
          Trzy samodzielne schematy wektorowe: przód 1988–1993, przód 1994–1998 oraz deska rozdzielcza w dwóch panelach.
          Rysunki są poglądowe i nie zastępują zdjęcia ani pomiaru w aucie.
        </p>

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '2rem' }}>
          {RYSUNKI.map((rysunek) => (
            <figure key={rysunek.src} style={{ margin: 0, background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: '16px', padding: '1rem' }}>
              <img src={rysunek.src} alt={rysunek.alt} width={800} height={520} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px' }} />
              <figcaption style={{ marginTop: '.75rem' }}>
                <strong style={{ display: 'block', fontSize: '1.05rem' }}>{rysunek.title}</strong>
                <span style={{ display: 'block', marginTop: '.25rem', fontSize: '.9rem', color: palette.muted }}>{rysunek.note}</span>
                <span style={{ display: 'block', marginTop: '.5rem', fontSize: '.8rem', color: palette.muted }}>Schemat poglądowy, nie zdjęcie</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <section style={{ marginTop: '2.5rem', background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: '16px', padding: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.35rem' }}>Co rysunek NIE twierdzi</h2>
          <ul style={{ margin: '.75rem 0 0', paddingLeft: '1.25rem', color: palette.muted, lineHeight: 1.7 }}>
            {NIE_TWIERDZI.map((punkt) => <li key={punkt}>{punkt}</li>)}
          </ul>
        </section>
      </div>
    </main>
  );
}
