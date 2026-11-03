'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useVehicleProfile } from '../VehicleProfileProvider';
import { ILLUSTRATED_TIPS, ILLUSTRATED_TIPS_MANUAL } from '../AdditionalTips';
import { ILLUSTRATED_SCOPE, OWNER_TIPS, OWNER_TIP_CATEGORIES, ownerTipFit, type OwnerTip, type OwnerTipFit } from '@/lib/owner-tips.mjs';

const ILLUSTRATED: OwnerTip[] = ILLUSTRATED_TIPS.map(t => ({
  ...(ILLUSTRATED_SCOPE[t.id] || {}),
  id: t.id, cat: 'ilustrowane', title: t.title, scope: 'Dotyczy: ' + t.scope, steps: t.steps, warning: t.warning,
  sources: [{ doc: 'Owner’s Manual Chevrolet Tahoe / Suburban 1999', page: t.reference, url: ILLUSTRATED_TIPS_MANUAL }],
  image: { src: `/tips/${t.id}.jpg`, alt: 'Ilustracja: ' + t.title }, check: true,
}));
const ALL: OwnerTip[] = [...OWNER_TIPS, ...ILLUSTRATED];

const BADGE: Record<OwnerTipFit['status'], string> = {
  match: 'Pasuje do Twojego auta',
  general: 'Porada ogólna',
  unknown: 'Sprawdź, czy dotyczy',
  outside: 'Raczej nie dla Twojego auta',
};

export default function OwnerTipsList() {
  const { profile, ready } = useVehicleProfile();
  const [showAll, setShowAll] = useState(false);
  const [cat, setCat] = useState('');
  const rows = useMemo(() => ALL.map(tip => ({ tip, fit: ownerTipFit(tip, ready ? profile : null) })), [profile, ready]);
  const hidden = rows.filter(r => r.fit.status === 'outside').length;
  const visible = rows.filter(r => (showAll || r.fit.status !== 'outside') && (!cat || r.tip.cat === cat));
  const counts = { match: rows.filter(r => r.fit.status === 'match').length };
  const btn = 'inline-flex min-h-11 items-center rounded-lg border px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500';
  return (
    <section aria-labelledby="owner-tips-list" data-testid="owner-tips">
      <h2 id="owner-tips-list" className="sr-only">Lista porad</h2>
      <div className="rounded-xl border border-silver-700/50 bg-neutral-900 p-4" data-testid="owner-tips-filter">
        {ready && profile?.model ? (
          <p className="text-sm text-neutral-200">Filtr wg profilu <strong>Moje auto</strong>: {profile.platform} {profile.model} {profile.year}{profile.drive ? ' ' + profile.drive : ''}. Pasujących: {counts.match}, {showAll ? 'pokazujemy wszystkie' : `ukrytych (inny model/wersja): ${hidden}`}.</p>
        ) : (
          <p className="text-sm text-neutral-300">Ustaw profil w <Link href="/moj-samochod" className="text-silver-300 underline">Moje auto</Link>, a oznaczymy porady pasujące do Twojego modelu, rocznika i napędu.</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" aria-pressed={showAll} onClick={() => setShowAll(v => !v)} className={`${btn} ${showAll ? 'border-silver-300 bg-silver-600 text-neutral-950' : 'border-silver-600 text-silver-200'}`} data-testid="owner-tips-show-all">{showAll ? 'Pokaż tylko pasujące' : 'Pokaż wszystko'}</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Kategorie porad">
          <button type="button" aria-pressed={!cat} onClick={() => setCat('')} className={`${btn} ${!cat ? 'border-silver-300 text-white' : 'border-white/15 text-neutral-300'}`}>Wszystkie tematy</button>
          {OWNER_TIP_CATEGORIES.map(c => <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => setCat(c.id)} className={`${btn} ${cat === c.id ? 'border-silver-300 text-white' : 'border-white/15 text-neutral-300'}`}>{c.label}</button>)}
        </div>
      </div>
      <p className="mt-4 text-sm text-neutral-400" aria-live="polite">Porad: {visible.length}</p>
      <ul className="mt-2 grid gap-4">
        {visible.map(({ tip, fit }) => (
          <li key={tip.id}>
            <article id={'porada-' + tip.id} className="rounded-xl border border-white/10 bg-neutral-900 p-5" data-fit={fit.status} data-testid="owner-tip">
              <p className={`inline-block rounded border px-2 py-0.5 text-xs ${fit.status === 'match' ? 'border-silver-300 text-silver-100' : 'border-white/20 text-neutral-400'}`}>{BADGE[fit.status]}{fit.status !== 'match' && fit.status !== 'general' && fit.reasons.length ? ' — ' + fit.reasons.join('; ') : ''}</p>
              <h3 className="mt-2 text-xl font-semibold text-silver-100">{tip.title}</h3>
              <p className="mt-2 text-sm text-neutral-300">{tip.scope}</p>
              {tip.image && (
                <a href={tip.image.src} target="_blank" rel="noopener noreferrer" className="mt-3 block" aria-label={'Powiększ: ' + tip.title}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tip.image.src} alt={tip.image.alt} loading="lazy" className="h-auto w-full rounded" />
                </a>
              )}
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-sm leading-6 text-neutral-200">{tip.steps.map(s => <li key={s}>{s}</li>)}</ol>
              {tip.warning && <p className="mt-3 rounded border border-red-700/60 bg-red-950/40 p-3 text-sm text-red-100"><strong>Uwaga:</strong> {tip.warning}</p>}
              {tip.check && <p className="mt-3 text-sm text-silver-300">Sprawdź w swoim aucie — wyposażenie i procedury różnią się między rocznikami i wersjami.</p>}
              {tip.link && <Link href={tip.link.href} className="mt-3 inline-flex min-h-11 items-center text-sm text-silver-200 underline">{tip.link.label} →</Link>}
              <div className="mt-3 border-t border-white/10 pt-2 text-xs text-neutral-400">
                <p>Źródło:</p>
                <ul>
                  {tip.sources.map(s => <li key={s.doc + s.page}>{s.url
                    ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center underline">{s.doc}, {s.page}</a>
                    : <span className="flex min-h-11 items-center">{s.doc}, {s.page}</span>}</li>)}
                </ul>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
