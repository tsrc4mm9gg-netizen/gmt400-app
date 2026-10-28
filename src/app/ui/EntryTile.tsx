import Image from 'next/image';
import type { ReactNode } from 'react';
import { CategoryIcon, type CategoryIconName } from './CategoryIcon';
import { modelLabel, yearsLabel, type TileEntry } from '../../lib/entry-tile';

interface EntryTileProps {
  item: TileEntry;
  /** Nazwa ikony kategorii używanej, gdy wpis nie ma własnej miniatury. */
  icon: CategoryIconName;
  image?: string | null;
  excerpt: string;
  headingLevel?: 2 | 3;
  sourced?: boolean;
  sourcedTestId?: string;
  /** Elementy interaktywne (np. plakietka dopasowania do auta) — poza linkiem, pod kafelkiem. */
  children?: ReactNode;
}

const PILL = 'inline-block max-w-full truncate rounded-full border px-2 py-0.5 text-[11px] leading-4';

/**
 * Zwarty kafelek listy: miniatura, tytuł, tagi (model + lata), krótki fragment opisu (line-clamp).
 * Cały kafelek jest jednym linkiem do pełnego wpisu /baza/[id] — bez rozwijania, więc bez „skakania” po dotknięciu.
 */
export default function EntryTile({ item, icon, image, excerpt, headingLevel = 3, sourced, sourcedTestId, children }: EntryTileProps) {
  const years = yearsLabel(item.Lata);
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const href = item.id ? '/baza/' + encodeURIComponent(item.id) : null;
  const titleClass = '!m-0 !text-[15px] !leading-snug !font-semibold text-neutral-100 line-clamp-2 break-words';
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 transition-colors hover:border-white/25 has-[a:active]:border-white/30 has-[a:active]:[background-image:none] has-[a:active]:bg-neutral-900 has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-2 has-[a:focus-visible]:outline-silver-400"
      data-testid="entry-tile"
    >
      <div className="p-3">
        <div className="flex items-start gap-3">
          <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-neutral-900 shadow-[inset_0_1px_0_rgba(255,255,255,.12)]" data-testid="tile-thumb">
            {image ? (
              <Image src={image} alt="" width={128} height={128} sizes="64px" className="h-full w-full object-cover" />
            ) : (
              <span aria-hidden="true" className="icon-tile !h-full !w-full !rounded-none !border-0">
                <CategoryIcon name={icon} className="h-8 w-8" />
              </span>
            )}
          </span>
          <div className="min-w-0 flex-1">
            <Heading className={titleClass} data-testid="tile-title">
              {href ? (
                <a href={href} className="[-webkit-tap-highlight-color:transparent] outline-none after:absolute after:inset-0 after:content-['']">{item.Nazwa}</a>
              ) : item.Nazwa}
            </Heading>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <span className={`${PILL} border-white/15 bg-white/5 text-neutral-300`} data-testid="tile-model">{modelLabel(item)}</span>
              {years && <span className={`${PILL} border-silver-600/40 text-silver-300`} data-testid="tile-years">{years}</span>}
              {sourced && <span className={`${PILL} border-silver-200/40 text-silver-100`} data-testid={sourcedTestId || 'tile-sourced'}>ze źródłem</span>}
            </div>
          </div>
          {href && <span aria-hidden="true" className="self-center text-xl text-silver-400">›</span>}
        </div>
        {excerpt && <p className="mt-2 text-sm leading-snug text-neutral-400 line-clamp-2 break-words" data-testid="tile-excerpt">{excerpt}</p>}
      </div>
      {children && <div className="relative z-10 px-3 pb-2 empty:hidden">{children}</div>}
    </div>
  );
}
