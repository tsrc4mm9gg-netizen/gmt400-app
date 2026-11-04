'use client';
import { useState } from 'react';

type FAQItem = {
  question: string;
  answer: string;
};

export default function FAQ({ items, title = 'Często zadawane pytania' }: { items: FAQItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="mt-12 rounded-xl border border-white/10 bg-neutral-900/50 p-6">
      <h2 className="text-lg font-semibold text-silver-300">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-white/5 bg-neutral-950/50">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-white hover:bg-white/5"
            >
              {item.question}
              <span className="ml-2 text-silver-400">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && (
              <div className="border-t border-white/5 px-4 py-3 text-sm text-neutral-300">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
