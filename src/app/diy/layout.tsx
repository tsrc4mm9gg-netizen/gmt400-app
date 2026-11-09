import type { ReactNode } from 'react';
import Link from 'next/link';

export default function DiyLayout({ children }: { children: ReactNode }) {
  return <>
    <nav aria-label="Działy poradników DIY" className="mx-auto flex max-w-5xl flex-wrap gap-4 px-4 py-3 text-sm text-neutral-300">
      <Link href="/diy" className="rounded underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400">Wszystkie poradniki DIY</Link>
      <Link href="/diy/ls-swap" className="rounded underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400">LS swap — plan i etapy (wersja robocza)</Link>
    </nav>
    {children}
  </>;
}
