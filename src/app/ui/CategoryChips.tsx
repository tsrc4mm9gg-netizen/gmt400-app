'use client';

export type ChipCategory = { id: string; label: string };

/**
 * Wspólne chipy kategorii (DIY, Usterki): grafit/srebro, cel dotyku ≥ 44 px, zawijane w wiersze.
 * Aktywny chip: srebrne tło + znacznik ✓ (nie tylko kolor); nieaktywny: biała etykieta na grafitowym tle (kontrast > 12:1).
 */
export default function CategoryChips({ categories, value, onChange, prefix, label }: { categories: ChipCategory[]; value: string; onChange: (id: string) => void; prefix: string; label: string }) {
  return (
    <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label={label} data-testid={`${prefix}-categories`}>
      {categories.map(c => {
        const active = value === c.id;
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(c.id)}
            data-testid={`${prefix}-cat-${c.id}`}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-[0.9375rem] font-semibold leading-tight transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-300 ${active ? 'border-silver-200 bg-silver-600 text-neutral-950' : 'border-white/35 bg-neutral-900 text-white hover:border-silver-300 hover:bg-neutral-800'}`}
          >
            {active && <span aria-hidden="true">✓</span>}
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
