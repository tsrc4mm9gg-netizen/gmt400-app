'use client';
import { useState, type ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  id?: string;
};

export default function CollapsibleSection({ title, subtitle, children, defaultOpen = false, id }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="px-4 pt-6" data-testid={id}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-neutral-300">{subtitle}</p>}
        </div>
        <span className="ml-2 text-2xl text-silver-400">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </section>
  );
}
