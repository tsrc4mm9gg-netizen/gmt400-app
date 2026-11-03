'use client';
import { useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Miejsce w arkuszu „Filtry” (pasek listy) na filtry danej sekcji (kategorie, model, rocznik, źródła).
// Filtry zostają w komponencie sekcji (stan bez zmian), a renderują się w arkuszu przez portal.
let target: HTMLElement | null = null;
const listeners = new Set<() => void>();
export function setFilterSheetTarget(element: HTMLElement | null) {
  if (target === element) return;
  target = element;
  listeners.forEach(listener => listener());
}
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
/** Zakładki list z paskiem „Filtry” (Usterki, Kody, DIY, Schematy, Modele). */
export const listTab = (tab: string) => ['usterki', 'kody', 'diy', 'schematy', 'modele'].includes(tab);
export default function InSheet({ children, inline = false }: { children: ReactNode; inline?: boolean }) {
  const element = useSyncExternalStore(subscribe, () => target, () => null);
  if (inline) return <>{children}</>;
  return element ? createPortal(children, element) : null;
}
