const AFFILIATE_TAG = 'gmt400pl-20';

type Props = {
  partNumber: string;
  className?: string;
};

export default function PartLink({ partNumber, className = '' }: Props) {
  const searchQuery = encodeURIComponent(partNumber);
  const href = `https://www.amazon.de/s?k=${searchQuery}&tag=${AFFILIATE_TAG}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center gap-1 rounded bg-amber-600/20 px-2 py-0.5 font-semibold text-amber-400 underline decoration-amber-400 underline-offset-2 transition hover:bg-amber-600/40 hover:text-amber-300 ${className}`}
    >
      {partNumber}
      <span className="text-xs opacity-60">↗</span>
    </a>
  );
}
