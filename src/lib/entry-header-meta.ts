/**
 * Pola nagłówka wpisu (/baza/[id]): „Poziom trudności”, „Szacowany czas”, „Ostatnia aktualizacja”.
 * Zasada: pokazujemy wartość tylko wtedy, gdy jest w polu Notion (`Trudność`, `Czas`) albo jawnie podana w treści wpisu
 * (czas robocizny wg GM). Nic nie szacujemy sami — brak danych = brak pozycji.
 */
export type HeaderMetaItem = { key: 'trudnosc' | 'czas' | 'aktualizacja'; label: string; value: string; note?: string };

/** „2026-10-27” → „27.10.2026”; wszystko inne → pusty napis. */
export function formatEditDate(iso?: string): string {
  const m = (iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : '';
}

const clip = (value: string, max: number): string => {
  const v = value.replace(/\s+/g, ' ').trim().replace(/[\s.;,:]+$/, '');
  if (v.length <= max) return v;
  const cut = v.slice(0, max);
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 20)).replace(/[\s,;:(–-]+$/, '') + '…';
};

/** Czas podany wprost w treści: „Czas robocizny wg GM (kod E7200): C/K 0,4 h; …” albo „GM podaje 2,7 h robocizny dla C/K”. */
export function labourTimeFromText(text: string): string {
  const flat = (text || '').replace(/https?:\/\/\S+/g, ' ').replace(/\s+/g, ' ');
  const a = flat.match(/Czas robocizny wg GM[^:]{0,40}:\s*([^.]*\d[^.]*)/iu);
  if (a) return clip(a[1], 90);
  const b = flat.match(/GM podaje (\d+(?:[,.]\d+)?)\s*h robocizny(?: dla ([\p{L}0-9/ ]{1,20}?))?(?=[.;,]|$| \p{L})/iu);
  if (b) return `${b[1]} h${b[2] ? ` (${b[2].trim()})` : ''}`;
  return '';
}

export type HeaderMetaInput = { edited?: string; difficulty?: string; time?: string; texts?: string[] };

export function headerMeta({ edited, difficulty, time, texts }: HeaderMetaInput): HeaderMetaItem[] {
  const items: HeaderMetaItem[] = [];
  const d = (difficulty || '').trim();
  if (d) items.push({ key: 'trudnosc', label: 'Poziom trudności', value: clip(d, 40) });
  const t = (time || '').trim();
  if (t) {
    items.push({ key: 'czas', label: 'Szacowany czas', value: clip(t, 90), note: 'orientacyjnie' });
  } else {
    const derived = labourTimeFromText((texts || []).join(' \n'));
    if (derived) items.push({ key: 'czas', label: 'Szacowany czas', value: `robocizna wg GM: ${derived}`, note: 'orientacyjnie, z treści wpisu' });
  }
  const date = formatEditDate(edited);
  if (date) items.push({ key: 'aktualizacja', label: 'Ostatnia aktualizacja', value: date, note: 'edycja wpisu w Notion, nie weryfikacja merytoryczna' });
  return items;
}
