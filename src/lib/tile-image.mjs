// Obrazek miniatury z danych wpisu (kolumna Notion „Obraz”): tylko lokalny plik z biblioteki legalnych zdjęć /baza/
// (Commons CC/PD z atrybucją albo własne rysunki), bez zdalnych adresów, bez „..” i bez starych grafik AI z katalogu głównego.
export function localTileImage(src) {
  if (typeof src !== 'string') return null;
  const s = src.trim();
  return /^\/baza\/[\w\-./]+\.(?:jpe?g|png|webp|avif)$/i.test(s) && !s.includes('..') && !s.includes('//') ? s : null;
}
