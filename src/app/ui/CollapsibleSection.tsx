'use client';
import { useId, useState, type ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  id?: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
};

export default function CollapsibleSection({ title, subtitle, children, defaultOpen = false, id, headingLevel = 2 }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const instanceId = useId();
  const triggerId = `${instanceId}-trigger`;
  const panelId = `${instanceId}-panel`;
  const subtitleId = `${instanceId}-subtitle`;
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return (
    <section className="px-4 pt-6" data-testid={id} aria-labelledby={triggerId}>
      <Heading className="m-0 text-xl font-bold text-white">
        <button
          id={triggerId}
          type="button"
          onClick={() => setOpen(previous => !previous)}
          className="flex min-h-11 w-full items-center justify-between gap-3 rounded text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-400"
          aria-expanded={open}
          aria-controls={panelId}
          aria-describedby={subtitle ? subtitleId : undefined}
        >
          <span>{title}</span>
          <span aria-hidden="true" className="ml-2 shrink-0 text-2xl text-silver-400">{open ? '−' : '+'}</span>
        </button>
      </Heading>
      {subtitle && <p id={subtitleId} className="mt-0.5 text-xs text-neutral-300">{subtitle}</p>}
      <div id={panelId} aria-labelledby={triggerId} hidden={!open} className="mt-3">
        {open ? children : null}
      </div>
    </section>
  );
}
