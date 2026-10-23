import { CHECK_NOTE, ENGINES, FLUIDS, SOURCES, TRANSFER_CASES } from '../lib/verified-specs';

function Src({ id }: { id: string }) {
  const s = SOURCES[id];
  if (!s) return null;
  return <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-red-300 underline" title={s.label}>[{id}]</a>;
}

export function CheckNote() {
  return <p className="mt-3 rounded-lg border border-red-600/30 bg-red-950/30 p-3 text-sm text-neutral-300">{CHECK_NOTE}</p>;
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
      <p className="mb-3 text-sm text-neutral-400">Pickupy C/K, moc SAE net. Moment: lb-ft (Nm).</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-red-400">
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
      <p className="mt-3 text-sm text-neutral-400">Skrzynie biegów: 700R4/4L60 → 4L60-E od 1993; THM400 → 4L80-E od 1991 (powyżej 8600 lb GVWR, z 7.4 i 6.2) <Src id="W1" />.</p>
      <CheckNote />
    </div>
  );
}

export function FluidsTable() {
  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
      <h3 className="mb-3 font-semibold text-red-400">Płyny, pojemności i interwały (z instrukcji GM)</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-red-400">
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
