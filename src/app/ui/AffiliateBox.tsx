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
    <aside className="my-4 rounded-xl border border-silver-500/30 bg-gradient-to-br from-neutral-900 to-neutral-950 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-silver-400">{title}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.name}>
            <a
              href={amazonLink(item.search)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-1 rounded-lg border border-silver-500/40 bg-silver-600/10 px-3 py-1.5 text-sm font-medium text-silver-300 transition hover:border-silver-400 hover:bg-silver-600/20 hover:text-white"
            >
              {item.name}
              <span className="text-xs opacity-50">↗</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] text-neutral-500">Link afiliacyjny — nie płacisz więcej</p>
    </aside>
  );
}
