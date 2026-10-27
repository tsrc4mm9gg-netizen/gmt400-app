import { getSearchExcerpt } from '../lib/search-excerpt';
import { getHighlightSegments } from '../lib/search-highlight';
export default function SearchExcerpt({ item, query }: { item: { Opis?: string; Objawy?: string; Rozwiązanie?: string }; query: string }) {
  const excerpt = getSearchExcerpt(item, query);
  if (!excerpt) return null;
  const segments = excerpt.matched ? getHighlightSegments(excerpt.text, query) : [{ text: excerpt.text, highlighted: false }];
  return <p data-search-excerpt className="mt-1 whitespace-pre-line break-words text-sm text-neutral-300"><span className="text-xs text-neutral-400">{excerpt.field}{excerpt.matched ? ' — fragment dopasowania' : ' — początek treści'}: </span>{segments.map((segment, index) => segment.highlighted ? <mark key={index} className="bg-silver-600/30 text-silver-200">{segment.text}</mark> : <span key={index}>{segment.text}</span>)}</p>;
}
