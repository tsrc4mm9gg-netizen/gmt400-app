'use client';
import { useContext, useId, useState } from 'react';
import { AccordionHeadingLevelContext } from './AccordionSection';

type FAQItem = { question: string; answer: string };
type Level = 2 | 3 | 4 | 5;
type Props = { items: FAQItem[]; title?: string; headingLevel?: Level };

export default function FAQ({ items, title = 'Często zadawane pytania', headingLevel }: Props) {
  const parentLevel = useContext(AccordionHeadingLevelContext);
  const resolvedLevel: Level = headingLevel ?? (parentLevel === null ? 2 : Math.min(parentLevel + 1, 5) as Level);
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();
  const Heading = `h${resolvedLevel}` as 'h2' | 'h3' | 'h4' | 'h5';
  const QuestionHeading = `h${resolvedLevel + 1}` as 'h3' | 'h4' | 'h5' | 'h6';
  return (
    <section aria-labelledby={`${id}-title`} className="mt-12 rounded-xl border border-white/10 bg-neutral-900/50 p-6">
      <Heading id={`${id}-title`} className="text-lg font-semibold text-silver-300">{title}</Heading>
      <div className="mt-4 space-y-3">
        {items.map((item, i) => {
          const triggerId = `${id}-question-${i}`;
          const panelId = `${id}-answer-${i}`;
          return (
            <div key={`${i}-${item.question}`} className="rounded-lg border border-white/5 bg-neutral-950/50">
              <QuestionHeading className="m-0 text-sm">
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={open === i}
                  aria-controls={panelId}
                  onClick={() => setOpen(previous => previous === i ? null : i)}
                  className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-white hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-400"
                >
                  {item.question}
                  <span aria-hidden="true" className="ml-2 shrink-0 text-silver-400">{open === i ? '−' : '+'}</span>
                </button>
              </QuestionHeading>
              <div id={panelId} aria-labelledby={triggerId} hidden={open !== i} className="border-t border-white/5 px-4 py-3 text-sm text-neutral-300">
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
