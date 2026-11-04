const AFFILIATE_TAG = 'gmt400pl-20';

type Props = {
  title?: string;
  items: { name: string; search: string }[];
};

function amazonLink(search: string) {
  return `https://www.amazon.de/s?k=${encodeURIComponent(search)}&tag=${AFFILIATE_TAG}`;
}

export default function AffiliateBox({ title = 'Gdzie kupić', items }: Props) {
  if (!items.length) return null;
  return (
    <aside className="my-4 rounded-lg border border-silver-600/20 bg-neutral-900/40 px-4 py-3">
      <p className="text-xs font-medium text-neutral-400">{title}</p>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item.name}>
            <a
              href={amazonLink(item.search)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-silver-300 hover:text-silver-200 hover:underline"
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] text-neutral-600">Link afiliacyjny — nie płacisz więcej</p>
    </aside>
  );
}
