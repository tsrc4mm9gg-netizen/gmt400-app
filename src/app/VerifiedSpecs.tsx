import { CHECK_NOTE, ENGINES, FLUIDS, SOURCES, TRANSFER_CASES } from '../lib/verified-specs';
import { PARTS, PART_SOURCES, STATUS_LABEL, type Part } from '../lib/parts-catalog';
import { TORQUE_SPECS } from '../lib/torque-specs';

function Src({ id }: { id: string }) {
  const s = SOURCES[id];
  if (!s) return null;
  return <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-silver-300 underline" title={s.label}>[{id}]</a>;
}

export function CheckNote() {
  return <p className="mt-3 rounded-lg border border-silver-600/30 bg-silver-950/30 p-3 text-sm text-neutral-300">{CHECK_NOTE}</p>;
}

export function SourceList() {
  return (
    <ul className="mt-3 space-y-1 text-xs text-neutral-500">
      {Object.entries(SOURCES).map(([id, s]) => (
        <li key={id}>[{id}] <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-300">{s.label}</a></li>
      ))}
    </ul>
  );
}

export function EngineTable() {
  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
      <p className="mb-3 text-sm text-neutral-400">Pickupy C/K, moc SAE net. Moment: N·m (w nawiasie lb-ft jak w źródle).</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-silver-400">
              <th className="p-2">Silnik</th><th className="p-2">RPO</th><th className="p-2">Lata</th><th className="p-2">Moc / moment</th><th className="p-2">Źródło</th>
            </tr>
          </thead>
          <tbody className="text-neutral-300">
            {ENGINES.map(e => (
              <tr key={e.rpo + e.years} className="border-b border-white/5 align-top">
                <td className="p-2 font-medium text-white">{e.name}</td>
                <td className="p-2">{e.rpo}</td>
                <td className="p-2 whitespace-nowrap">{e.years}</td>
                <td className="p-2">{e.output}{e.note && <span className="block text-xs text-neutral-500">{e.note}</span>}</td>
                <td className="p-2"><Src id={e.src} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-neutral-400">Skrzynie biegów: 700R4/4L60 → 4L60-E od 1993; THM400 → 4L80-E od 1991 (powyżej 3901 kg / 8600 lb GVWR, z 7.4 i 6.2) <Src id="W1" />.</p>
      <CheckNote />
    </div>
  );
}

export function FluidsTable() {
  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
      <h3 className="mb-3 font-semibold text-silver-400">Płyny, pojemności i interwały (z instrukcji GM)</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-silver-400">
              <th className="p-2">Pozycja</th><th className="p-2">Specyfikacja</th><th className="p-2">Pojemność</th><th className="p-2">Interwał</th><th className="p-2">Źródło</th>
            </tr>
          </thead>
          <tbody className="text-neutral-300">
            {FLUIDS.map(f => (
              <tr key={f.item} className="border-b border-white/5 align-top">
                <td className="p-2 font-medium text-white">{f.item}</td>
                <td className="p-2">{f.spec}</td>
                <td className="p-2">{f.capacity}</td>
                <td className="p-2">{f.interval}</td>
                <td className="p-2"><Src id={f.src} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-neutral-400">{TRANSFER_CASES}</p>
      <p className="mt-2 text-sm text-neutral-400">Harmonogram GM dla GMT400 nie przewiduje wymiany paska rozrządu — wymienia tylko kontrolę paska osprzętu <Src id="OM99" />.</p>
      <CheckNote />
      <SourceList />
    </div>
  );
}

const STATUS_CLASS: Record<Part['status'], string> = {
  potwierdzone: 'border-silver-200/50 text-silver-100',
  poprawione: 'border-silver-500/50 text-silver-300',
  niezweryfikowane: 'border-silver-500/50 text-silver-300',
};

/** Mały przypis ze statusem i linkami do źródeł — czytelny na telefonie (linki ≥ 44 px wysokości dotyku). */
export function PartSourceNote({ part }: { part: Part }) {
  return (
    <div className="mt-2 text-xs leading-relaxed">
      <span className={`inline-block rounded border px-1.5 py-0.5 ${STATUS_CLASS[part.status]}`}>{STATUS_LABEL[part.status]}</span>
      {part.uwaga && <p className="mt-1 text-neutral-400">{part.uwaga}</p>}
      {part.src && part.src.length > 0 && (
        <p className="mt-1 flex flex-wrap gap-x-3 text-neutral-500">
          <span>Źródło:</span>
          {part.src.map(id => (
            <a key={id} href={PART_SOURCES[id].url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center text-silver-300 underline underline-offset-2 hover:text-silver-200">{PART_SOURCES[id].label}</a>
          ))}
        </p>
      )}
      <p className="mt-1 text-neutral-500">Sprawdź w swoim aucie / manualu.</p>
    </div>
  );
}

const QUICK = ['AC Delco PF1218', 'AC Delco PF52', 'AC Delco A1300C', 'AC Delco GF626', 'AC Delco TF289', 'AC Delco 41-932', 'AC Delco 131-113', 'AC Delco 252-711'];

export function OemQuickList({ filtersOnly = false }: { filtersOnly?: boolean }) {
  const items = PARTS.filter(p => QUICK.includes(p.oem) && (!filtersOnly || p.kat === 'filtry'));
  return (
    <div className="space-y-3 text-sm">
      {items.map(p => (
        <div key={p.oem} className="border-b border-white/5 pb-2 last:border-0">
          <div className="flex items-start justify-between gap-3">
            <span className="text-neutral-300">{p.nazwa}</span>
            <span className="shrink-0 text-right font-medium text-silver-400">{p.oem.replace('AC Delco ', '')}</span>
          </div>
          <p className="text-xs text-neutral-500">{p.model}</p>
          {p.src && <p className="text-xs text-neutral-500">Źródło: {p.src.map((id, i) => <span key={id}>{i > 0 && ', '}<a href={PART_SOURCES[id].url} target="_blank" rel="noopener noreferrer" className="text-silver-300 underline underline-offset-2">{PART_SOURCES[id].label}</a></span>)}</p>}
        </div>
      ))}
      <CheckNote />
    </div>
  );
}

export function TorqueTable() {
  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
      <h3 className="mb-3 font-semibold text-silver-400">Momenty dokręcania (z dokumentacji GM)</h3>
      <ul className="space-y-3 text-sm">
        {TORQUE_SPECS.map(t => (
          <li key={t.id} className="border-b border-white/5 pb-3 last:border-0">
            <div className="flex items-start justify-between gap-3">
              <span className="font-medium text-white">{t.component}</span>
              <span className="shrink-0 text-right text-silver-400">{t.valueNm} N·m ({t.valueLbFt} lb-ft)</span>
            </div>
            <p className="text-xs text-neutral-400">{t.appliesTo}</p>
            <p className="mt-1 text-xs text-neutral-500">{t.notes}</p>
            <a href={t.source} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-8 items-center text-xs text-silver-300 underline underline-offset-2">Źródło: {t.sourceTitle}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
