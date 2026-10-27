import Image from 'next/image';
import Link from 'next/link';
import type { BodyStyle } from '../lib/body-styles';
import { bodyYears } from '../lib/body-styles';
import { bodyImage, modelHref } from '../lib/model-images';

/** Mała miniatura zdjęcia modelu (lazy, optymalizowana przez next/image) z linkiem do strony modelu. */
export default function ModelThumb({ body, size = 'sm', label = true }: { body: BodyStyle; size?: 'sm' | 'md'; label?: boolean }) {
  const w = size === 'md' ? 120 : 72;
  const h = Math.round(w * 0.5625);
  return (
    <Link href={modelHref(body)} className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-neutral-950 p-1 pr-3 text-xs text-neutral-300 transition hover:border-silver-600/60 hover:text-white" aria-label={`Strona modelu ${body.name} (${bodyYears(body)})`}>
      <span className="studio shrink-0 rounded-xl" style={{ width: w, height: h }}><Image src={bodyImage(body)} alt="" width={w} height={h} sizes={`${w}px`} loading="lazy" className="object-cover" style={{ width: w, height: h }} /></span>
      {label && <span className="leading-tight"><span className="block font-semibold text-neutral-100 group-hover:text-silver-300">{body.name}</span><span className="block text-neutral-400">{bodyYears(body)}</span></span>}
    </Link>
  );
}
