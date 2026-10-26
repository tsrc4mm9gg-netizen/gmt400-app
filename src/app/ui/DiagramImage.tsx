import Image from 'next/image';

/** Ilustracja poglądowa w karcie (DIY/usterki): next/image (AVIF/WebP, srcset), znane wymiary (bez skoku układu).
 *  Pierwsza widoczna ilustracja na stronie jest `priority` (to zwykle element LCP), reszta ładuje się leniwie. */
export default function DiagramImage({ src, alt, priority = false, maxHeightClass = 'max-h-64' }: { src: string; alt: string; priority?: boolean; maxHeightClass?: string }) {
  return (
    <Image
      src={src.split('?')[0]}
      alt={alt}
      width={1168}
      height={784}
      sizes="(min-width: 896px) 832px, 100vw"
      priority={priority}
      className={`h-auto w-full ${maxHeightClass} cursor-pointer bg-white object-contain`}
    />
  );
}
