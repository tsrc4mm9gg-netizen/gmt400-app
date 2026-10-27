import type { MediaFigure } from '../../../lib/entry-media';

/** Zdjęcie lub własny rysunek przypisany do wpisu — atrybucja zawsze widoczna w podpisie. */
export default function EntryFigure({ figure }: { figure: MediaFigure }) {
  const c = figure.credit;
  return (
    <figure data-testid="entry-figure" className="min-w-0 rounded-xl border border-white/10 bg-neutral-950 p-3">
      <a href={figure.src} target="_blank" rel="noopener noreferrer" aria-label={`Otwórz w pełnym rozmiarze: ${figure.alt}`}>
        <img src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} loading="lazy" decoding="async" className="mx-auto h-auto max-h-[80vh] w-full rounded object-contain" />
      </a>
      <figcaption className="mt-2 space-y-1 text-xs text-neutral-300">
        <span className="block">{figure.caption} <span className="text-neutral-400">Dotknij obrazu, aby otworzyć go w pełnym rozmiarze.</span></span>
        {c ? (
          <span data-testid="figure-credit" className="block text-neutral-400">
            Autor: {c.author}. Licencja: {c.licenceUrl ? <a className="underline" href={c.licenceUrl} target="_blank" rel="noopener noreferrer">{c.licence}</a> : c.licence}. Źródło: <a className="underline" href={c.sourceUrl} target="_blank" rel="noopener noreferrer">{c.sourceLabel}</a>.
          </span>
        ) : (
          <span data-testid="figure-credit" className="block text-neutral-400">
            Własny rysunek gmt400.pl, wykonany od nowa{figure.basis ? ` na podstawie: ${figure.basis}` : ''}. Sprawdź w swoim aucie / manualu.
          </span>
        )}
      </figcaption>
    </figure>
  );
}
