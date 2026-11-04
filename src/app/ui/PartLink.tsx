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
      className={`font-semibold text-silver-300 underline decoration-silver-500/50 underline-offset-2 hover:text-white hover:decoration-white ${className}`}
    >
      {partNumber}
    </a>
  );
}
