import { headerMeta, type HeaderMetaInput } from '../../../lib/entry-header-meta';

/** Zwarty pasek meta w nagłówku wpisu; pozycje bez danych w ogóle się nie pojawiają. */
export default function EntryHeaderMeta(props: HeaderMetaInput) {
  const items = headerMeta(props);
  if (!items.length) return null;
  return (
    <dl data-testid="entry-meta" className="grid gap-2 sm:grid-cols-3">
      {items.map(item => (
        <div key={item.key} data-testid={`entry-meta-${item.key}`} className="min-w-0 rounded-2xl border border-white/12 bg-neutral-950 px-3 py-2">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-silver-300">{item.label}</dt>
          <dd className="mt-0.5 text-sm font-semibold leading-snug text-white [overflow-wrap:anywhere]" style={{ maxWidth: 'none' }}>{item.value}</dd>
          {item.note && <dd className="mt-0.5 text-[11px] leading-snug text-neutral-400" style={{ maxWidth: 'none' }}>{item.note}</dd>}
        </div>
      ))}
    </dl>
  );
}
