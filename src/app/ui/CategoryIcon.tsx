import type { ReactNode } from 'react';

/**
 * Jeden spójny zestaw ikon liniowych (SVG, siatka 24×24, jednolita grubość linii 1.6, końcówki okrągłe).
 * Kolor dziedziczony z currentColor; ikony są dekoracyjne (aria-hidden) — znaczenie niesie podpis obok.
 */
const PATHS = {
  diy: <path d="M14.7 6.3a4 4 0 0 0-5 5L3.5 17.5a2.1 2.1 0 0 0 3 3l6.2-6.2a4 4 0 0 0 5-5l-2.4 2.4-2.6-.6-.6-2.6 2.6-2.2Z" />,
  usterki: <><path d="M12 3.5 2.8 19.5h18.4L12 3.5Z" /><path d="M12 10v4.2M12 17v.01" /></>,
  modele: <><path d="M2.5 16v-4l2.2-4.5h9.6l4 4 2.7.8V16" /><path d="M9 7.5V12h8.2" /><circle cx="6.8" cy="16.2" r="2" /><circle cx="17" cy="16.2" r="2" /><path d="M8.8 16.2h6.2" /></>,
  specs: <><path d="M4 17a8 8 0 1 1 16 0" /><path d="m12 17 3.6-4.6" /><path d="M12 17h.01M6.2 11.2l1 .6M17.8 11.2l-1 .6M12 7.2v1.1" /></>,
  owner: <path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5ZM12 6.5v13" />,
  vin: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M7 9v6M10 9v6M13 9v6M16.5 9v6" /></>,
  tools: <><path d="M3 9.5h18V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" /><path d="M8 9.5V6.5A1.5 1.5 0 0 1 9.5 5h5A1.5 1.5 0 0 1 16 6.5v3" /><path d="M3 14h18M11 14v2h2v-2" /></>,
  schematy: <><path d="M9 3v5M15 3v5" /><path d="M6.5 8h11v4a5.5 5.5 0 0 1-11 0V8Z" /><path d="M12 17.5V21" /></>,
  obd: <><path d="M3.5 7h17l-2 9.5h-13L3.5 7Z" /><path d="M8 10.5h1.2M11.4 10.5h1.2M14.8 10.5h1.2M9.7 13.3h1.2M13.1 13.3h1.2" /></>,
  lpg: <><path d="M5 20V5.5A1.5 1.5 0 0 1 6.5 4h6A1.5 1.5 0 0 1 14 5.5V20" /><path d="M3.5 20h12M7 8h5" /><path d="M14 9h2.2a1.8 1.8 0 0 1 1.8 1.8V16a1.5 1.5 0 0 0 3 0V9l-2.5-2.5" /></>,
  import: <><path d="M3 15.5 4.8 19.5h14.4L21 15.5H3Z" /><path d="M6 15.5V11h12v4.5M9 11V7.5h6V11M12 7.5V4.5" /></>,
  lights: <path d="M9 17.5h6M10 20.5h4M12 3.5a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3.5Z" />,
  plate: <><rect x="2.5" y="7" width="19" height="10" rx="2.5" /><path d="M6.5 12h.01M9.5 12h.01M12.5 12h.01M15.5 12h2" /></>,
  homologacja: <><path d="M9 4h6v3H9z" /><path d="M9 5.5H6.5A1.5 1.5 0 0 0 5 7v12.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V7a1.5 1.5 0 0 0-1.5-1.5H15" /><path d="m8.7 14 2.4 2.4 4.2-4.9" /></>,
  przeglady: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /><path d="m9 15 2 2 4-4" /></>,
  wiring: <path d="m3 6.5 6-2.5 6 2.5 6-2.5v13l-6 2.5-6-2.5-6 2.5v-13ZM9 4v13.5M15 6.5V20" />,
  fluid: <path d="M12 3.5s6 6.2 6 10.5a6 6 0 0 1-12 0c0-4.3 6-10.5 6-10.5Z" />,
  fuse: <><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M3.5 9.2h17M3.5 14.8h17M9.2 3.5v17M14.8 3.5v17" /></>,
  grid: <><rect x="4" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" /></>,
} satisfies Record<string, ReactNode>;

export type CategoryIconName = keyof typeof PATHS;

export function CategoryIcon({ name, className = 'h-6 w-6' }: { name: CategoryIconName; className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {PATHS[name]}
    </svg>
  );
}

/** Ikona na małym grafitowym kafelku z połyskiem i cienką jasną ramką (jak na makiecie). */
export function IconTile({ name, className = '' }: { name: CategoryIconName; className?: string }) {
  return (
    <span aria-hidden="true" className={`icon-tile ${className}`}>
      <CategoryIcon name={name} className="h-6 w-6" />
    </span>
  );
}
