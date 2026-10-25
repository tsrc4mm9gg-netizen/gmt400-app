import type { Guide } from './types';

export const PRZEGLADY_GUIDE: Guide = {
  slug: 'przeglady',
  title: 'Przeglądy i interwały GMT400',
  short: 'Co sprawdzać regularnie w Polsce',
  description: 'Interwały serwisowe i typowe problemy GMT400 eksploatowanych w Polsce (LPG, korozja, płyny).',
  seoTitle: 'Przeglądy GMT400 — interwały, LPG, korozja',
  seoDescription: 'Co sprawdzać w Chevrolet/GMC GMT400 w Polsce. Interwały oleju, płynów, typowe usterki LPG i korozji.',
  asOf: '25.10.2026',
  bodies: ['tahoe-4d', 'suburban', 'yukon', 'ck-reg'],
  years: '1988–2000',
  summary: ['Olej silnikowy co 8–10 tys. km (lub częściej na LPG).', 'Sprawdzaj korozję ramy i przewodów co rok.', 'DEX-COOL vs zielony płyn — nie mieszaj.'],
  sections: [
    {
      id: 'intervals',
      title: 'Interwały',
      open: true,
      blocks: [
        { t: 'list', items: [{ text: 'Olej silnikowy: 8–10 tys. km (na LPG częściej)' }, { text: 'ATF 4L60-E: 50–100 tys. mil (zależnie od eksploatacji)' }, { text: 'Płyn chłodniczy: DEX-COOL 150 tys. mil / 60 mies. (nie mieszaj z zielonym)' }, { text: 'Reduktor: sprawdź poziom i wycieki co 30–50 tys. km' }] }
      ]
    },
    {
      id: 'pl',
      title: 'Specyfika PL',
      blocks: [
        { t: 'p', text: 'W Polsce najczęstsze problemy to korozja (rama, progi, przewody hamulcowe) i instalacje LPG na Vortec/TBI. Sprawdzaj te miejsca przy każdym przeglądzie.' },
        { t: 'list', items: [{ text: 'Korozja ramy i wsporników' }, { text: 'Przewody hamulcowe (zwłaszcza przy zbiorniku)' }, { text: 'LPG: reduktor, wtryskiwacze, szczelność' }] }
      ]
    }
  ],
  mistakes: ['Mieszanie DEX-COOL z zielonym płynem', 'Ignorowanie korozji przewodów hamulcowych'],
  faq: [{ q: 'Jak często wymieniać olej na LPG?', a: 'Zalecane częściej niż na benzynie — co 8–10 tys. km lub zgodnie z zaleceniami instalatora. Sprawdź w swoim aucie / manualu.' }],
  related: ['lpg', 'homologacja'],
  keywords: ['przegląd', 'interwały', 'LPG', 'korozja']
};
