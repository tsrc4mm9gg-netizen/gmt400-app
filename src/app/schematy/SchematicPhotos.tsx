import Image from 'next/image';
import type { SchematicPhoto } from '@/lib/schematics';

/** Prawdziwe zdjęcia (Wikimedia Commons, wolne licencje) pod schematem — z autorem, licencją, linkiem i modelem. */
export default function SchematicPhotos({ photos, title }: { photos: SchematicPhoto[]; title: string }) {
  return (
    <div className="mt-4" data-testid="schematic-photos">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">Zdjęcie z prawdziwego auta</p>
      <div className={`grid gap-3 ${photos.length > 1 ? 'sm:grid-cols-2' : 'sm:max-w-xl'}`}>
        {photos.map(photo => (
          <figure key={photo.src} className="overflow-hidden rounded-lg border border-white/10 bg-black">
            <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" sizes="(min-width: 640px) 480px, 100vw" className="h-auto w-full" />
            <figcaption className="space-y-1 p-3 text-xs text-neutral-400 [overflow-wrap:anywhere]">
              <span className="block font-medium text-neutral-200">{photo.models}{photo.note ? ` — ${photo.note}` : ''}</span>
              <span className="block">
                Fot. {photo.author},{' '}
                <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer license" className="inline-flex min-h-11 items-center text-red-400 underline">{photo.license}</a>,{' '}
                <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-red-400 underline" aria-label={`Źródło zdjęcia (Wikimedia Commons) — ${title}`}>Wikimedia Commons</a>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
