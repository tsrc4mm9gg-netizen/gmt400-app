/** Wspólna logika kafelków list (DIY, usterki, kody, poradniki): miniatura, fragment opisu, tagi. */

export interface TileEntry {
  id?: string;
  Nazwa: string;
  Opis?: string;
  Objawy?: string;
  Rozwiązanie?: string;
  Model?: string;
  Modele?: string[];
  Lata?: string;
  /** Opcjonalny obrazek miniatury z danych (kolumna Notion „Obraz”); brak = ikona kategorii. */
  Obraz?: string;
}

export function getTipImage(nazwa: string): string | null {
  const n = nazwa.toLowerCase();
  if (n.includes('4l60e') || n.includes('skrzyni') || n.includes('atf') || n.includes('miska')) return '/diy-4l60e-pan-pl.jpg';
  if (n.includes('kolektor') || n.includes('uszczelk') || n.includes('intake')) return '/diy-intake-pl.jpg';
  if (n.includes('np231') || n.includes('4x4') || n.includes('rozdzielcz')) return '/diy-np231-pl.jpg';
  if (n.includes('hamulc') || n.includes('przewod')) return '/diy-brakes-pl.jpg';
  if (n.includes('chłodz') || n.includes('termostat') || n.includes('pompa wody')) return '/diy-cooling-sys.jpg';
  if (n.includes('paliw') || n.includes('pompa paliwa') || n.includes('filtr paliwa')) return '/diy-fuel.jpg';
  if (n.includes('masa') || n.includes('punkt') || n.includes('uziemien')) return '/diy-grounds.jpg';
  if (n.includes('obd') || n.includes('kod') || n.includes('diagnost')) return '/diy-obd.jpg';
  if (n.includes('czujnik') || n.includes('maf') || n.includes('sonda') || n.includes('tps') || n.includes('iac')) return '/diy-sensors.jpg';
  if (n.includes('pompa paliwa') || n.includes('fuel pump')) return '/diy-fuelpump.jpg';
  if (n.includes('rdza') || n.includes('korozj') || n.includes('rama')) return '/issue-rust.jpg';
  return null;
}

/** Nazwy ikon liniowych (podzbiór CategoryIconName) używanych jako zastępnik miniatury DIY. */
export type TileIconName = 'diy' | 'brake' | 'gear' | 'engine' | 'drop' | 'bolt' | 'snow' | 'thermo' | 'obd' | 'wave';

/**
 * Ikona zastępcza kafelka DIY (gdy wpis nie ma zdjęcia ani rysunku) wg tematu wpisu: hamulce, skrzynia, silnik, płyny,
 * elektryka, klimatyzacja, chłodzenie, diagnostyka, zawieszenie. Bez dopasowania zostaje ogólna ikona „klucz”.
 */
export function getTipIcon(nazwa: string): TileIconName {
  const n = nazwa.toLowerCase();
  const rules: [TileIconName, string[]][] = [
    ['brake', ['hamulc', 'klock', 'tarcz', 'zacisk', 'abs']],
    ['gear', ['skrzyni', '4l60', '4l80', 'np231', 'rozdzielcz', 'sprzęg', 'sprzeg', 'most ', 'dyferencj']],
    ['snow', ['klima', 'ogrzew', 'nagrzewnic']],
    ['thermo', ['chłodz', 'chlodz', 'termostat', 'chłodnic', 'chlodnic']],
    ['drop', ['płyn', 'plyn', 'olej', 'paliw', 'atf', 'wyciek']],
    ['bolt', ['elektr', 'akumulator', 'alternator', 'rozrusz', 'bezpiecz', 'przekaź', 'przekaz', 'żarów', 'zarow', 'reflektor', 'lamp', 'światł', 'swiatl', 'instalacj']],
    ['obd', ['obd', 'kod ', 'diagnost']],
    ['wave', ['zawiesz', 'amortyz', 'wahacz', 'stabiliz', 'sworz']],
    ['engine', ['silnik', 'kolektor', 'wtrysk', 'głowic', 'glowic', 'rozrząd', 'rozrzad', 'świec', 'swiec', 'uszczelk']],
  ];
  for (const [icon, keys] of rules) if (keys.some(k => n.includes(k))) return icon;
  return 'diy';
}

/** Zdjęcie wpisu usterki (gdy jest) — w przeciwnym razie ilustracja z mapy tytułów. */
export function getIssueImage(nazwa: string): string | null {
  const n = nazwa.toLowerCase();
  if (n.includes('kolektor')) return '/issue-intake.jpg';
  if (n.includes('4l60')) return '/issue-4l60e.jpg';
  return getTipImage(nazwa);
}

/** Zwarty fragment tekstu: bez adresów URL, „Źródło:”, znaków nowej linii; łączy kolejne pola, aż fragment jest treściwy. */
export function excerptOf(item: TileEntry, order: ('Opis' | 'Objawy' | 'Rozwiązanie')[], max = 200): string {
  const clean = (raw?: string) => (raw || '')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/(^|[\s.;])(Źródła?|Source)\s*:[^.]*$/i, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  // Łączymy kolejne pola, aż fragment będzie treściwy (krótkie „Objawy” + „Opis” itd.).
  let text = '';
  for (const k of order) {
    const part = clean(item[k]);
    if (!part) continue;
    text = text ? `${text}${/[.!?…:;]$/.test(text) ? '' : '.'} ${part}` : part;
    if (text.length >= 90) break;
  }
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 30)).replace(/[\s,;:(–-]+$/, '') + '…';
}

/** Skrót lat do tagu kafelka (pełny opis zakresu jest na stronie wpisu): „1996–1999 (wg instrukcji…)” → „1996–1999”. */
export function yearsLabel(lata?: string): string {
  const raw = (lata || '').replace(/\s*[—–-]\s*sprawdź w swoim aucie.*$/i, '').trim();
  const range = raw.match(/^\d{2,4}(?:\s*[–-]\s*\d{2,4})?(?:\s*,\s*\d{2,4}(?:\s*[–-]\s*\d{2,4})?)*/);
  return range && /[(;]/.test(raw) ? range[0].trim() : raw;
}

export function modelLabel(item: TileEntry): string {
  const list = (item.Modele || []).filter(Boolean);
  const raw = list.length ? list.join(', ') : (item.Model || '');
  if (!raw || /wszystk/i.test(raw)) return 'Wszystkie';
  return raw;
}
