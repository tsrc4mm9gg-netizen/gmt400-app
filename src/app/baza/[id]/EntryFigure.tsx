'use client';
import { useState, type MouseEvent } from 'react';
import type { MediaFigure } from '../../../lib/entry-media';
import ImageLightbox from '../../ImageLightbox';

/** Zdjęcie lub własny rysunek przypisany do wpisu — atrybucja zawsze widoczna w podpisie. */
export default function EntryFigure({ figure }: { figure: MediaFigure }) {
  const c = figure.credit;
  const [open, setOpen] = useState(false);
  // Progresywne ulepszenie: zwykły klik otwiera powiększenie na stronie; Ctrl/⌘/środkowy przycisk i brak JS — pełny plik w nowej karcie.
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpen(true);
  };
  return (
    <figure data-testid="entry-figure" className="min-w-0 rounded-xl border border-white/10 bg-neutral-950 p-3">
      <a href={figure.src} target="_blank" rel="noopener noreferrer" onClick={onClick} aria-haspopup="dialog" aria-label={`Powiększ: ${figure.alt}`} className="block rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver-500 [-webkit-tap-highlight-color:transparent]">
        <img src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} loading="lazy" decoding="async" className="mx-auto h-auto max-h-[80vh] w-full rounded object-contain" />
      </a>
      <figcaption className="mt-2 space-y-1 text-xs text-neutral-300">
        <span className="block">{figure.caption} <span className="text-neutral-400">Dotknij obrazu, aby go powiększyć.</span></span>
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
      {open && <ImageLightbox src={figure.src} alt={figure.alt} tall={figure.height > figure.width} onClose={() => setOpen(false)} />}
    </figure>
  );
}
