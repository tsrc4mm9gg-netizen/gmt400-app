import Link from 'next/link';
import Breadcrumbs from '../ui/Breadcrumbs';
import {
  CAPACITY_DOUBTS, CAPACITY_GROUPS, FLUID_SPECS, GM_DOCS, SERVICE_PARTS, WHEEL_NUT_TORQUE, type Cite,
} from '@/lib/gm-capacities';

export const metadata = {
  title: 'Pojemności i płyny GMT400 1988–1999 — z dokumentów GM',
  description: 'Pojemności układu chłodzenia, oleju, zbiorników, skrzyń, skrzyń rozdzielczych, mostów i klimatyzacji GMT400 1988–1999 oraz specyfikacje płynów i numery filtrów — z instrukcji GM, z podaniem strony.',
  alternates: { canonical: 'https://www.gmt400.pl/pojemnosci' },
};

function Sources({ src }: { src: Cite[] }) {
  return (
    <span className="text-xs text-neutral-500">
      {src.map((s, i) => (
        <span key={s.doc + s.page} title={GM_DOCS[s.doc]}>{i > 0 ? '; ' : ''}{s.doc} {s.page}</span>
      ))}
    </span>
  );
}

const th = 'p-2 text-left font-medium text-silver-400';
const td = 'p-2 align-top';

export default function PojemnosciPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 text-white sm:py-10">
      <Breadcrumbs className="mb-2" items={[{ label: 'Mój samochód', href: '/moj-samochod' }, { label: 'Pojemności i płyny' }]} />
      <h1 className="text-3xl font-bold text-silver-400">Pojemności i płyny (1988–1999)</h1>
      <p className="mt-2 text-neutral-300">
        Wartości wyłącznie z instrukcji serwisowych, naprawczych i instrukcji obsługi GM, z numerem strony pliku PDF.
        GM podaje je jako przybliżone — po wymianie zawsze sprawdź poziom (bagnet, korek wlewu, zbiornik wyrównawczy).
        Gdy dokumenty się różnią, wartości nie podajemy — trafia na listę rozbieżności na dole strony. Sprawdź w swoim aucie.
        Momenty dokręcania śrub i korków: <Link href="/momenty-dokrecania" className="text-silver-300 underline">Momenty dokręcania</Link>.
      </p>
      <nav aria-label="Spis treści" className="mt-4 flex flex-wrap gap-2 text-sm">
        {CAPACITY_GROUPS.map(g => (
          <a key={g.id} href={`#${g.id}`} className="rounded-lg border border-white/10 px-3 py-1 text-neutral-300 hover:border-silver-400/50 hover:text-white">{g.title}</a>
        ))}
        <a href="#plyny" className="rounded-lg border border-white/10 px-3 py-1 text-neutral-300 hover:border-silver-400/50 hover:text-white">Specyfikacje płynów</a>
        <a href="#czesci" className="rounded-lg border border-white/10 px-3 py-1 text-neutral-300 hover:border-silver-400/50 hover:text-white">Filtry i części</a>
        <a href="#rozbieznosci" className="rounded-lg border border-white/10 px-3 py-1 text-neutral-300 hover:border-silver-400/50 hover:text-white">Rozbieżności</a>
      </nav>

      {CAPACITY_GROUPS.map(g => (
        <section key={g.id} id={g.id} className="mt-8 scroll-mt-20">
          <h2 className="text-xl font-semibold text-silver-300">{g.title}</h2>
          {g.intro && <p className="mt-1 text-sm text-neutral-400">{g.intro}</p>}
          <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-neutral-950">
            <table className="w-full min-w-[640px] text-sm">
              <thead><tr className="border-b border-white/10"><th className={th}>Pozycja</th><th className={th}>Wariant</th><th className={th}>Lata</th><th className={th}>Pojemność</th><th className={th}>Źródło</th></tr></thead>
              <tbody className="text-neutral-300">
                {g.rows.map(r => (
                  <tr key={r.item + r.variant + r.years} className="border-b border-white/5">
                    <td className={`${td} font-medium text-white`}>{r.item}</td>
                    <td className={td}>{r.variant}</td>
                    <td className={`${td} whitespace-nowrap`}>{r.years}</td>
                    <td className={`${td} whitespace-nowrap font-semibold text-white`}>{r.value}{r.note && <span className="block whitespace-normal text-xs font-normal text-neutral-500">{r.note}</span>}</td>
                    <td className={td}><Sources src={r.src} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section id="plyny" className="mt-8 scroll-mt-20">
        <h2 className="text-xl font-semibold text-silver-300">Specyfikacje płynów i smarów</h2>
        <p className="mt-1 text-sm text-neutral-400">Numery GM to oryginalne opakowania z epoki — dziś kupisz odpowiednik o tej samej specyfikacji.</p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-neutral-950">
          <table className="w-full min-w-[640px] text-sm">
            <thead><tr className="border-b border-white/10"><th className={th}>Układ</th><th className={th}>Lata</th><th className={th}>Specyfikacja</th><th className={th}>Źródło</th></tr></thead>
            <tbody className="text-neutral-300">
              {FLUID_SPECS.map(r => (
                <tr key={r.item + r.years} className="border-b border-white/5">
                  <td className={`${td} font-medium text-white`}>{r.item}</td>
                  <td className={`${td} whitespace-nowrap`}>{r.years}</td>
                  <td className={td}>{r.spec}</td>
                  <td className={td}><Sources src={r.src} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="czesci" className="mt-8 scroll-mt-20">
        <h2 className="text-xl font-semibold text-silver-300">Filtry i części eksploatacyjne</h2>
        <p className="mt-1 text-sm text-neutral-400">Numery AC Delco / GM z tabel „Maintenance Items” i „Normal Maintenance Replacement Parts”. Litery w nawiasach to kod silnika (8. znak VIN).</p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-neutral-950">
          <table className="w-full min-w-[640px] text-sm">
            <thead><tr className="border-b border-white/10"><th className={th}>Część</th><th className={th}>Silnik</th><th className={th}>Lata</th><th className={th}>Numer</th><th className={th}>Źródło</th></tr></thead>
            <tbody className="text-neutral-300">
              {SERVICE_PARTS.map(r => (
                <tr key={r.item + r.variant + r.years} className="border-b border-white/5">
                  <td className={`${td} font-medium text-white`}>{r.item}</td>
                  <td className={td}>{r.variant}</td>
                  <td className={`${td} whitespace-nowrap`}>{r.years}</td>
                  <td className={td}>{r.part}</td>
                  <td className={td}><Sources src={r.src} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-neutral-400">Nakrętki kół ({WHEEL_NUT_TORQUE.variant}, {WHEEL_NUT_TORQUE.years}): <strong className="text-white">{WHEEL_NUT_TORQUE.value}</strong> <Sources src={WHEEL_NUT_TORQUE.src} />.</p>
      </section>

      <section id="rozbieznosci" className="mt-8 scroll-mt-20 rounded-xl border border-white/10 bg-neutral-950 p-4">
        <h2 className="text-xl font-semibold text-silver-300">Rozbieżności między dokumentami (nie publikujemy tych wartości)</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-300">
          {CAPACITY_DOUBTS.map(d => <li key={d}>{d}</li>)}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-silver-300">Dokumenty</h2>
        <ul className="mt-2 space-y-1 text-xs text-neutral-500">
          {Object.entries(GM_DOCS).map(([k, v]) => <li key={k}><strong className="text-neutral-400">{k}</strong> — {v}</li>)}
        </ul>
        <p className="mt-3 text-sm text-neutral-400">Interwały wymian znajdziesz w <Link href="/przeglady" className="text-silver-300 underline">harmonogramie przeglądów</Link>.</p>
      </section>
    </div>
  );
}
