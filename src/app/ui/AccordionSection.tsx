'use client';

import { createContext, useId, useState, type ReactNode } from 'react';

export const AccordionHeadingLevelContext = createContext<number | null>(null);

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
};

export default function AccordionSection({ title, children, defaultOpen = false, headingLevel = 2 }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return (
    <div className="mb-3 rounded-xl border border-white/10 bg-neutral-900">
      <Heading className="m-0 text-base">
        <button
          id={triggerId}
          type="button"
          onClick={() => setOpen(value => !value)}
          className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-400"
          aria-expanded={open}
          aria-controls={panelId}
        >
          <span className="font-medium text-silver-200">{title}</span>
          <svg
            aria-hidden="true"
            focusable="false"
            className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </Heading>
      <div
        id={panelId}
        aria-labelledby={triggerId}
        hidden={!open}
        className="border-t border-white/10 px-4 py-3"
      >
        <AccordionHeadingLevelContext.Provider value={headingLevel}>
          {children}
        </AccordionHeadingLevelContext.Provider>
      </div>
    </div>
  );
}
