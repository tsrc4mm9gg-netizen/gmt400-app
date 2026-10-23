import Link from 'next/link';

export type Crumb = { href?: string; label: string };

export default function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ href: '/', label: 'Strona główna' }, ...items];
  return (
    <nav aria-label="Okruszki" className={`text-sm text-neutral-400 ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-1">
        {all.map((item, index) => {
          const last = index === all.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-x-1">
              {index > 0 && <span aria-hidden="true" className="text-neutral-600">/</span>}
              {item.href && !last ? (
                <Link href={item.href} className="inline-flex min-h-11 items-center px-1 text-red-400 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">{item.label}</Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className="max-w-[60vw] truncate px-1 text-neutral-300 sm:max-w-md">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
