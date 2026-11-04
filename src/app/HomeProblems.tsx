'use client';
import Link from 'next/link';
import { IconTile } from './ui/CategoryIcon';
import { HOME_PROBLEMS } from '../lib/home-problems';
import CollapsibleSection from './ui/CollapsibleSection';

export default function HomeProblems() {
  return (
    <CollapsibleSection
      title="Najczęstsze problemy"
      subtitle="Skróty do diagnozy objawów — tematy, o które właściciele najczęściej pytają."
      id="home-problems"
      defaultOpen={false}
    >
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {HOME_PROBLEMS.map(problem => (
          <li key={problem.id} style={{ maxWidth: 'none' }}>
            <Link href={problem.href} data-testid={`home-problem-${problem.id}`} className="group flex h-full min-h-20 flex-col rounded-2xl border border-white/15 bg-neutral-900 p-3 transition hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">
              <IconTile name={problem.icon} className="!h-9 !w-9 !rounded-xl" />
              <span className="mt-2 text-sm font-bold leading-tight text-white">{problem.title}</span>
              <span className="mt-0.5 text-[11px] leading-snug text-neutral-300">{problem.hint}</span>
            </Link>
          </li>
        ))}
      </ul>
    </CollapsibleSection>
  );
}
