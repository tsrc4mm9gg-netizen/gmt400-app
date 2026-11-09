export const AMAZON_ASSOCIATE_TAG = 'gmt400pl-20';

export function amazonProductLink(asin) {
  if (typeof asin !== 'string') return null;
  const value = asin.trim().toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(value)) return null;
  const url = new URL(`https://www.amazon.de/dp/${value}`);
  url.searchParams.set('tag', AMAZON_ASSOCIATE_TAG);
  return url.toString();
}
