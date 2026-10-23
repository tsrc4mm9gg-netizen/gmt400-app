// Wpisy Notion oznaczone do przeglądu jako zastąpione przez nowszy, skonsolidowany wpis.
// Nic nie jest usuwane z Notion: wpis wraca na stronę po usunięciu znacznika z pola Opis.
export const SUPERSEDED_PREFIX = 'Do usunięcia – zastąpione przez';

/** True, gdy Opis zaczyna się od znacznika „Do usunięcia – zastąpione przez” (myślnik – lub -). */
export function isSuperseded(item) {
  const opis = typeof item?.Opis === 'string' ? item.Opis.trim() : '';
  return /^Do usunięcia\s*[–-]\s*zastąpione przez/i.test(opis);
}

export function withoutSuperseded(items) {
  return Array.isArray(items) ? items.filter(item => !isSuperseded(item)) : [];
}
