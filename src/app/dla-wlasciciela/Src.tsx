import { getSource, KIND_LABEL } from '../../lib/guides/sources';

const host = (url: string) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; } };

/** Odnośniki do źródeł: domena, rodzaj i data ("stan na"). */
export default function Src({ ids }: { ids?: string[] }) {
  if (!ids || ids.length === 0) return null;
  return (
    <span className="mt-1 block text-xs leading-6 text-neutral-400" data-testid="src">
      <span className="sr-only">Źródła: </span>
      {ids.map((id, i) => {
        const s = getSource(id);
        if (!s) return null;
        return (
          <span key={id}>
            {i > 0 && ' · '}
            <a href={s.url} target="_blank" rel="noopener noreferrer" title={`${s.label} — ${KIND_LABEL[s.kind]}`} className="text-silver-300 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">{host(s.url)}</a>
            <span> ({KIND_LABEL[s.kind]}, {s.date})</span>
          </span>
        );
      })}
    </span>
  );
}
