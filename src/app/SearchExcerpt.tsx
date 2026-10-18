import { getSearchExcerpt } from '../lib/search-excerpt';
export default function SearchExcerpt({ item, query }: { item: { Opis?: string; Objawy?: string; Rozwiązanie?: string }; query: string }) {
  const excerpt = getSearchExcerpt(item, query);
  if (!excerpt) return null;
  return <p data-search-excerpt className="mt-1 whitespace-pre-line break-words text-sm text-neutral-300"><span className="text-xs text-neutral-400">{excerpt.field}{excerpt.matched ? ' — fragment dopasowania' : ' — początek treści'}: </span>{excerpt.text}</p>;
}
