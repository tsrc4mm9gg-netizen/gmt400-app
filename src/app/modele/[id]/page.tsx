import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import { notFound } from 'next/navigation';
import { BODY_STYLES, bodyYears, findBody } from '../../../lib/body-styles';
import { bodyImage, modelHref } from '../../../lib/model-images';
import { enginesForBody } from '../../../lib/model-engines';
import { CHECK_NOTE, SOURCES, TRANSFER_CASES } from '../../../lib/verified-specs';
import { SCHEMATICS } from '../../../lib/schematics';
import ModelMaterials from './ModelMaterials';

type Props = { params: Promise<{ id: string }> };

const DESCRIPTIONS: Record<string, string> = {
  'tahoe-4d': 'Pięciodrzwiowy SUV na ramie GMT400, wprowadzony na rok modelowy 1995. Napęd 4x2 lub 4x4, głównie V8 5.7.',
  'tahoe-2d': 'Trzydrzwiowy SUV: K5 Blazer (1992–1994), od 1995 jako Tahoe 2-drzwi. Jedyna wersja z opcjonalnym 6.5 turbodieslem w 4WD.',
  suburban: 'Długi SUV (C/K 1500 i 2500) z trzecim rzędem siedzeń. W 2500 dostępne V8 7.4 i 6.5 turbodiesel.',
  yukon: 'Bliźniak Tahoe marki GMC: 2-drzwi od 1992, 4-drzwi od 1995. Denali od 1998 (4-drzwi).',
  'ck-reg': 'Pickup z kabiną pojedynczą, krótką lub długą skrzynią. Serie 1500/2500/3500, napęd C (4x2) lub K (4x4).',
  'ck-ext': 'Pickup z kabiną przedłużoną (Extended Cab). Od 1996 opcjonalne trzecie drzwi po stronie pasażera.',
  k1500: 'Półtonowy pickup 4x4 (K = napęd 4WD). Przednie zawieszenie niezależne na drążkach skrętnych.',
  sierra: 'Pickup marki GMC — technicznie bliźniak Chevroleta C/K, różni się atrapą, wyposażeniem i oznaczeniami.',
  dually: 'Ciężka seria 3500 z podwójnymi tylnymi kołami. C3500HD produkowany do 2002 roku.',
};

export function generateStaticParams() {
  return BODY_STYLES.map(body => ({ id: body.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const body = findBody((await params).id);
  if (!body) return { title: 'Nie znaleziono modelu — GMT400', robots: { index: false, follow: false } };
  const title = `${body.name} (${bodyYears(body)}) — GMT400`;
  const description = DESCRIPTIONS[body.id] || `${body.name} GMT400: lata, silniki, usterki, DIY i kody OBD.`;
  return {
    title,
    description,
    alternates: { canonical: `https://www.gmt400.pl${modelHref(body)}` },
    openGraph: { type: 'article', locale: 'pl_PL', url: modelHref(body), title, description, images: [{ url: bodyImage(body) }] },
  };
}

export default async function ModelPage({ params }: Props) {
  const body = findBody((await params).id);
  if (!body) notFound();
  const engines = enginesForBody(body.id, body.from, body.to);
  const index = BODY_STYLES.findIndex(b => b.id === body.id);
  const prev = BODY_STYLES[(index - 1 + BODY_STYLES.length) % BODY_STYLES.length];
  const next = BODY_STYLES[(index + 1) % BODY_STYLES.length];
  const has4wd = !['ck-ext'].includes(body.id);
  // Zakres lat, których dotyczy schemat (wg źródła w schematics.ts) — pokazujemy tylko pasujące do rocznika nadwozia.
  const yearRange: Record<string, [number, number]> = {
    'aldl-12-pin': [1988, 1995], 'obd-ii-16-pin': [1996, 2000], 'vortec-cooling': [1996, 2000], 'fuel-system': [1988, 2000],
    'vortec-intake-gaskets': [1996, 2000], 'ground-points': [1996, 1996], 'brakes-abs': [1995, 1999], 'fluids-1995-1999': [1995, 1999],
  };
  const inYears = (id: string) => { const r = yearRange[id]; return !r || (body.from <= r[1] && body.to >= r[0]); };
  const schematics = SCHEMATICS.filter(s => s.diagram && inYears(s.id) && (s.id !== 'fuse-locations' || ['tahoe-4d', 'tahoe-2d', 'suburban', 'yukon', 'ck-reg', 'ck-ext', 'k1500', 'sierra'].includes(body.id)));

  return (
    <div className="mx-auto min-h-screen max-w-5xl bg-black px-4 py-6 pb-28 text-white sm:px-5 sm:py-10">
      <Breadcrumbs items={[{ href: '/modele', label: 'Modele' }, { label: body.name }]} />

      <header className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950">
        <div className="studio relative aspect-[16/9] w-full bg-neutral-900">
          <Image src={bodyImage(body)} alt={`${body.name} — zdjęcie poglądowe modelu GMT400`} fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
        </div>
        <div className="p-4 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-silver-400">Model GMT400</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{body.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-silver-600/50 bg-silver-600/10 px-3 py-1 text-silver-200">Lata: {bodyYears(body)}</span>
            {body.note && <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-neutral-200">{body.note}</span>}
          </div>
          {DESCRIPTIONS[body.id] && <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-300">{DESCRIPTIONS[body.id]}</p>}
          <p className="mt-3 text-xs text-neutral-500">Zdjęcie poglądowe z katalogu modeli — kolor i wyposażenie mogą się różnić od Twojego auta.</p>
          {body.credit && (
            <p className="mt-1 text-xs text-neutral-500">
              Zdjęcie: {body.credit.author}, {body.credit.license}, <a href={body.credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">Wikimedia Commons</a> ({body.credit.changes}).
            </p>
          )}
        </div>
      </header>

      <ModelMaterials bodyId={body.id} bodyName={body.name} />

      <section aria-labelledby="engines-title" className="mt-8">
        <h2 id="engines-title" className="text-2xl font-semibold">Silniki</h2>
        <p className="mt-1 text-sm text-neutral-400">Typowe opcje w latach {bodyYears(body)}. Dostępność zależy od serii (1500/2500/3500), GVWR i rynku.</p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-neutral-900 text-neutral-300"><tr><th className="p-3">Silnik</th><th className="p-3">RPO</th><th className="p-3">Lata</th><th className="p-3">Moc / moment</th></tr></thead>
            <tbody>
              {engines.map(engine => (
                <tr key={engine.rpo + engine.name} className="border-t border-white/10 align-top">
                  <td className="p-3 font-medium text-white">{engine.name}</td>
                  <td className="p-3 text-silver-300">{engine.rpo}</td>
                  <td className="p-3 text-neutral-300">{engine.years}</td>
                  <td className="p-3 text-neutral-300">{engine.output}{engine.note && <span className="block text-xs text-neutral-500">{engine.note}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {has4wd && <p className="mt-3 text-sm text-neutral-400">{TRANSFER_CASES}</p>}
        <p className="mt-3 rounded-lg border border-silver-600/40 bg-silver-600/10 p-3 text-sm text-silver-100">⚠ {CHECK_NOTE} Kod silnika (RPO) znajdziesz na naklejce Service Parts Identification w schowku.</p>
        <p className="mt-2 text-xs text-neutral-500">Źródła: <a className="inline-flex min-h-11 items-center text-silver-400 underline" href={SOURCES.W1.url} target="_blank" rel="noopener noreferrer">{SOURCES.W1.label}</a> · <a className="inline-flex min-h-11 items-center text-silver-400 underline" href={SOURCES.W2.url} target="_blank" rel="noopener noreferrer">{SOURCES.W2.label}</a></p>
      </section>

      {schematics.length > 0 && (
        <section aria-labelledby="schem-title" className="mt-8">
          <h2 id="schem-title" className="text-2xl font-semibold">Schematy dla tego modelu</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {schematics.map(s => (
              <li key={s.id}>
                <Link href={`/schematy#${s.id}`} className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 text-neutral-100 hover:border-silver-600/60">
                  <span>{s.title}<span className="block text-xs text-neutral-400">{s.diagram?.models}</span></span>
                  <span aria-hidden="true" className="text-silver-400">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="other-title" className="mt-10">
        <h2 id="other-title" className="text-2xl font-semibold">Inne nadwozia GMT400</h2>
        <div className="mt-3 flex justify-between gap-2 text-sm">
          <Link href={modelHref(prev)} className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-3 text-neutral-200 hover:border-silver-600">← {prev.name}</Link>
          <Link href={modelHref(next)} className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-3 text-right text-neutral-200 hover:border-silver-600">{next.name} →</Link>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BODY_STYLES.filter(b => b.id !== body.id).map(b => (
            <li key={b.id}>
              <Link href={modelHref(b)} className="block overflow-hidden rounded-xl border border-white/10 bg-neutral-950 hover:border-silver-600/60">
                <Image src={bodyImage(b)} alt="" width={320} height={180} sizes="(max-width: 640px) 45vw, 300px" loading="lazy" className="aspect-video h-auto w-full object-cover" />
                <span className="block p-2 text-sm font-semibold text-neutral-100">{b.name}<span className="block text-xs font-normal text-neutral-400">{bodyYears(b)}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
