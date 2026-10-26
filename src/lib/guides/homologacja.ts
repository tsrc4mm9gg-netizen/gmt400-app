import type { Guide } from './types';

export const HOMOLOGACJA_GUIDE: Guide = {
  slug: 'homologacja',
  draft: true, // ukryty: brak źródeł; do przepisania ze źródłami urzędowymi
  title: 'Homologacja GMT400 w Polsce',
  short: 'Badanie techniczne, dokumenty, typowe problemy',
  description: 'Co sprawdzić przed badaniem technicznym GMT400 importowanego z USA. Dokumenty, światła, hamulce, korozja ramy.',
  seoTitle: 'Homologacja GMT400 w Polsce — Tahoe, Suburban, Silverado',
  seoDescription: 'Przewodnik po homologacji i badaniu technicznym Chevrolet/GMC GMT400 w Polsce. Dokumenty, światła EU, typowe usterki.',
  asOf: '25.10.2026',
  bodies: ['tahoe-4d', 'suburban', 'ck-reg', 'sierra'],
  years: '1988–2000',
  summary: ['Badanie techniczne wymaga świateł zgodnych z EU.', 'Sprawdź korozję ramy i przewodów hamulcowych.', 'VIN i dokumenty importowe muszą się zgadzać.'],
  sections: [
    {
      id: 'docs',
      title: 'Dokumenty',
      open: true,
      blocks: [
        { t: 'p', text: 'Do badania potrzebujesz: dowodu rejestracyjnego (lub dokumentu importowego), potwierdzenia opłacenia akcyzy/VAT (jeśli wymagane), tłumaczenia dokumentów.' },
        { t: 'list', items: [{ text: 'VIN musi być zgodny z dokumentami' }, { text: 'Światła muszą spełniać wymagania EU (kierunkowskazy, oświetlenie tablicy)' }, { text: 'Hamulce i zawieszenie bez nadmiernych luzów' }] }
      ]
    },
    {
      id: 'typical',
      title: 'Typowe problemy na badaniu',
      blocks: [
        { t: 'list', items: [{ text: 'Korozja ramy i przewodów hamulcowych' }, { text: 'Światła USA (brak świateł przeciwmgielnych tylnych, inne kierunkowskazy)' }, { text: 'Wycieki z reduktora lub mostów' }, { text: 'Luzy w zawieszeniu (wahacze, tuleje)' }] }
      ]
    }
  ],
  mistakes: ['Zakładanie, że światła USA przejdą bez przeróbki', 'Ignorowanie korozji ramy'],
  faq: [{ q: 'Czy GMT400 przechodzi badanie bez przeróbek?', a: 'Zwykle wymaga przeróbki świateł na EU i sprawdzenia korozji. Sprawdź aktualne wymagania w SKP.' }],
  related: ['swiatla-eu', 'import'],
  keywords: ['homologacja', 'badanie techniczne', 'przegląd']
};
