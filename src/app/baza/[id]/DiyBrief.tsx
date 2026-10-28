import { extractDiyBrief, blocksToBriefText } from '../../../lib/diy-brief.mjs';

type Entry = { Typ: string; Opis?: string; Objawy?: string; Rozwiązanie?: string };

const safeHref = (url: string) => (/^https?:\/\//i.test(url) ? url : null);

/** Góra pełnej procedury: uwagi z treści wpisu, lista narzędzi/części (tylko gdy wpis ją zawiera), źródła i weryfikacja w manualu. */
export default function DiyBrief({ entry, blocks }: { entry: Entry; blocks: any[] }) {
  const brief = extractDiyBrief(entry, blocksToBriefText(blocks));
  const showLists = brief.tools.length > 0 || brief.parts.length > 0;
  const hasSource = brief.sources.length > 0;
  return <>
    {brief.applies && brief.safety.length > 0 && <section data-testid="diy-safety" aria-labelledby="diy-safety-h" className="rounded-2xl border border-white/15 border-l-4 border-l-danger-600 bg-neutral-950 p-4">
      <h2 id="diy-safety-h" className="flex items-center gap-2 text-lg font-semibold text-white"><span aria-hidden="true">⚠</span> Zanim zaczniesz — uwagi z treści wpisu</h2>
      <ul className="mt-3 space-y-2">{brief.safety.map(item => <li key={item.tag + item.text} className="flex flex-col items-start gap-1 text-neutral-100 sm:flex-row sm:gap-3"><span className="mt-0.5 shrink-0 self-start whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-xs font-medium text-silver-300">{item.tag}</span><span>{item.text}</span></li>)}</ul>
      <p className="mt-3 text-xs text-neutral-400">Fragmenty z tego wpisu, bez dopisków. Pełna lista ostrzeżeń jest w treści poniżej.</p>
    </section>}
    {brief.applies && showLists && <section data-testid="diy-checklist" aria-labelledby="diy-checklist-h" className="rounded-2xl border border-white/15 bg-neutral-950 p-4">
      <h2 id="diy-checklist-h" className="text-lg font-semibold text-white">Narzędzia i części do przygotowania</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {brief.tools.length > 0 && <div data-testid="diy-tools"><h3 className="text-sm font-semibold uppercase tracking-wide text-silver-400">{brief.toolsLabel}</h3><ul className="mt-2 space-y-1.5">{brief.tools.map(t => <li key={t} className="flex gap-2 text-neutral-100"><span aria-hidden="true" className="text-silver-400">☐</span><span>{t}</span></li>)}</ul></div>}
        {brief.parts.length > 0 && <div data-testid="diy-parts"><h3 className="text-sm font-semibold uppercase tracking-wide text-silver-400">Części / materiały</h3><ul className="mt-2 space-y-1.5">{brief.parts.map(t => <li key={t} className="flex gap-2 text-neutral-100"><span aria-hidden="true" className="text-silver-400">☐</span><span>{t}</span></li>)}</ul></div>}
      </div>
    </section>}
    {brief.applies && !showLists && brief.isProcedure && <p data-testid="diy-no-list" className="text-sm text-neutral-500">Brak listy narzędzi i części w tym wpisie — sprawdź kroki poniżej.</p>}
    <aside data-testid="entry-verify" aria-label="Źródła i weryfikacja" className="rounded-2xl border border-silver-600/50 bg-silver-600/10 p-4">
      <h2 className="text-lg font-semibold text-silver-300"><span aria-hidden="true">✓ </span>Sprawdź w swoim aucie / manualu</h2>
      <p className="mt-1 text-sm text-neutral-200">Wpis opisuje typowe GMT400 z lat 1988–1998. Numery części, momenty dokręcania i kolejność kroków zależą od rocznika, silnika, napędu i skrzyni — zanim zaczniesz, porównaj je z manualem swojego auta. Dopasowanie do profilu opiera się na metadanych i nie potwierdza poprawności technicznej.</p>
      <div data-testid="entry-sources" className="mt-3 border-t border-white/10 pt-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-silver-400">Źródła</h3>
        {hasSource
          ? <ul className="mt-1 space-y-1 text-sm text-neutral-100">{brief.sources.map(s => <li key={s.text + s.urls.join()}>{s.text}{s.urls.map(u => { const href = safeHref(u); return href ? <a key={u} href={href} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex min-h-11 items-center text-silver-300 underline">Otwórz źródło ↗</a> : null; })}</li>)}</ul>
          : <p className="mt-1 text-sm text-neutral-300">Ten wpis nie podaje źródła — potraktuj go jako wskazówkę i zweryfikuj w manualu.</p>}
        {brief.paraphrase && <p className="mt-1 text-xs text-neutral-400">Treść jest parafrazą źródła, nie cytatem.</p>}
      </div>
    </aside>
  </>;
}
