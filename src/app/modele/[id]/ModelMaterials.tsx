'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useModelSelection } from '../../ModelSelectionContext';
import { isGeneralEntry, isSpecificToBody } from '../../../lib/model-images';

type Entry = { id: string; Nazwa: string; Typ: string; Model: string; Modele?: string[]; Lata?: string; Opis?: string };

const SECTIONS = [
  { typ: 'Usterka', label: 'Usterki', href: '/usterki' },
  { typ: 'Porada', label: 'Poradniki DIY', href: '/diy' },
  { typ: 'Kod błędu', label: 'Kody błędów', href: '/kody-obd' },
];

export default function ModelMaterials({ bodyId, bodyName }: { bodyId: string; bodyName: string }) {
  const [items, setItems] = useState<Entry[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const { bodyId: selected, setSelection } = useModelSelection();
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/notion', { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setItems(Array.isArray(data.results) ? data.results : []); setStatus('ready'); })
      .catch(() => { if (!controller.signal.aborted) setStatus('error'); });
    return () => controller.abort();
  }, []);

  const groups = useMemo(() => SECTIONS.map(section => {
    const list = items.filter(item => item.Typ === section.typ);
    const specific = list.filter(item => isSpecificToBody(item, bodyId));
    const general = list.filter(item => isGeneralEntry(item) && !specific.includes(item));
    return { ...section, specific, general: general.length };
  }), [items, bodyId]);
  const profiles = useMemo(() => items.filter(item => item.Typ === 'Model' && isSpecificToBody(item, bodyId)).slice(0, 6), [items, bodyId]);

  const open = (href: string) => {
    setSelection({ bodyId, filters: {} });
    router.push(href);
  };

  return (
    <section aria-labelledby="materials-title" className="mt-8">
      <h2 id="materials-title" className="text-2xl font-semibold">Usterki, DIY i kody dla: {bodyName}</h2>
      <p className="mt-1 text-sm text-neutral-400">Przyciski ustawiają ten model jako filtr (zapamiętany w tej karcie przeglądarki) i otwierają sekcję.{selected === bodyId && ' Ten model jest już wybrany.'}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {groups.map(group => (
          <button key={group.typ} type="button" onClick={() => open(group.href)} className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-red-600/50 bg-red-600/10 px-4 py-3 text-left font-semibold text-white transition hover:bg-red-600/25">
            <span>{group.label}<span className="block text-xs font-normal text-neutral-300">{status === 'ready' ? `${group.specific.length} dla modelu + ${group.general} ogólnych GMT400` : status === 'loading' ? 'Ładowanie…' : 'Otwórz sekcję'}</span></span>
            <span aria-hidden="true" className="text-red-300">→</span>
          </button>
        ))}
      </div>
      {status === 'error' && <p role="alert" className="mt-3 text-sm text-red-300">Nie udało się pobrać wpisów z bazy. Sekcje otworzą się z filtrem modelu.</p>}
      {status === 'ready' && (groups.some(g => g.specific.length) || profiles.length > 0) && (
        <div className="mt-4 rounded-xl border border-white/10 bg-neutral-950 p-4">
          <h3 className="text-lg font-semibold">Wpisy oznaczone tym modelem</h3>
          <ul className="mt-2 divide-y divide-white/10">
            {[...profiles, ...groups.flatMap(g => g.specific)].slice(0, 12).map(item => (
              <li key={item.id}>
                <Link href={`/baza/${encodeURIComponent(item.id)}`} className="flex min-h-11 items-center justify-between gap-3 py-2 text-neutral-100 hover:text-red-300">
                  <span>{item.Nazwa}<span className="block text-xs text-neutral-500">{item.Typ}{item.Lata ? ` · ${item.Lata}` : ''}</span></span>
                  <span aria-hidden="true" className="text-red-400">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
