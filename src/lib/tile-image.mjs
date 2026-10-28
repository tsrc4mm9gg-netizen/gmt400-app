// Obrazek miniatury z danych wpisu (kolumna Notion „Obraz”): tylko lokalny plik aplikacji, bez zdalnych adresów i bez „..”.
export function localTileImage(src) {
  if (typeof src !== 'string') return null;
  const s = src.trim();
  return /^\/(?!\/)[\w\-./]+\.(?:jpe?g|png|webp|avif)$/i.test(s) && !s.includes('..') ? s : null;
}
