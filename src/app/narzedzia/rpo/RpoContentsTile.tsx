'use client';
import { useId, useState } from 'react';
import { RPO_CONTENTS_MISSING, RPO_CONTENTS_NOTE, type RpoEntry } from '@/lib/rpo-catalog';

const PREVIEW = 3;

/** Kafelek „Zawiera”: co dokumenty GM mówią o zawartości pakietu. Bez zapisu w dokumentach — jawna informacja o braku, nic nie zgadujemy. */
export default function RpoContentsTile({ entry }: { entry: RpoEntry }) {
  const [open, setOpen] = useState(false);
  const panel = useId();
  const contents = entry.contents;
  if (!contents) {
    if (entry.category !== 'Pakiety') return null;
    return <div className="mt-3 rounded-lg border border-dashed border-neutral-700 bg-neutral-950/60 p-3 text-sm text-neutral-400" data-testid="rpo-contents" data-state="missing">
      <span className="font-semibold text-neutral-300">Zawiera: </span>{RPO_CONTENTS_MISSING.toLowerCase()}
    </div>;
  }
  const total = contents.groups.reduce((n, g) => n + g.items.length, 0);
  const first = contents.groups[0];
  const long = total > PREVIEW || contents.groups.length > 1;
  const visible = open ? contents.groups : [{ ...first, items: first.items.slice(0, PREVIEW) }];
  return <div className="mt-3 rounded-lg border border-silver-500/40 bg-neutral-950/70 p-3" data-testid="rpo-contents" data-state={open ? 'open' : 'closed'}>
    <p className="text-xs font-semibold uppercase tracking-wide text-silver-300">Zawiera</p>
    {contents.plain && <p className="mt-1 text-sm text-neutral-200" data-testid="rpo-contents-plain">{contents.plain}</p>}
    <div id={panel} className="mt-2 space-y-3">
      {visible.map(group => <div key={group.scope} data-testid="rpo-contents-group">
        <p className="text-xs font-medium text-neutral-300">{group.scope}</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-neutral-200">{group.items.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="mt-1 text-xs text-neutral-400">Źródło: {group.sources.map((doc, i) => <span key={doc.id}>{i > 0 && ', '}<a href={doc.url} target="_blank" rel="noopener noreferrer" className="underline">{doc.id.replace(/^HER-/, 'GM ').replace(/-/g, ' ')}</a></span>)}</p>
      </div>)}
    </div>
    {long && <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls={panel} data-testid="rpo-contents-toggle" className="mt-2 inline-flex min-h-11 items-center rounded-lg border border-silver-500/60 px-3 text-sm font-medium text-white">
      {open ? 'Zwiń' : `Pokaż całość (${total} pozycji${contents.groups.length > 1 ? `, roczniki: ${contents.groups.length}` : ''})`}
    </button>}
    <p className="mt-2 text-xs text-neutral-400" data-testid="rpo-contents-note">{RPO_CONTENTS_NOTE}</p>
  </div>;
}
