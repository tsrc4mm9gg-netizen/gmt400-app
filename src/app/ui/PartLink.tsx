import { amazonProductLink } from '../../lib/amazon-product-link.mjs';

type Props = {
  partNumber: string;
  asin?: string;
  className?: string;
};

export default function PartLink({ partNumber, asin, className = '' }: Props) {
  const href = amazonProductLink(asin);

  if (!href) {
    return <span className={className}>{partNumber}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center gap-1 rounded bg-amber-600/20 px-2 py-0.5 font-semibold text-amber-400 underline decoration-amber-400 underline-offset-2 transition hover:bg-amber-600/40 hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 ${className}`}
    >
      {partNumber}
      <span aria-hidden="true" className="text-xs opacity-60">↗</span>
      <span className="sr-only"> — Amazon.de, link afiliacyjny, otwiera nową kartę</span>
    </a>
  );
}
