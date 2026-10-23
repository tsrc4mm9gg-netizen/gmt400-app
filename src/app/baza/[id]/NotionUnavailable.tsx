import Link from 'next/link';

/** Przyjazny stan, gdy Notion nie odpowiada (limit zapytań, awaria) — zamiast strony błędu. */
export default function NotionUnavailable({ retry }: { retry?: () => void }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center bg-black px-5 py-16 text-white">
      <div className="rounded-2xl border border-red-600/40 bg-gradient-to-b from-red-950/40 to-neutral-950 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Baza wiedzy GMT400</p>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Materiał chwilowo niedostępny</h1>
        <p className="mt-4 leading-relaxed text-neutral-300">Źródło danych (Notion) nie odpowiedziało na czas. To przejściowy problem — wpis istnieje, spróbuj ponownie za chwilę.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {retry
            ? <button type="button" onClick={retry} className="inline-flex min-h-11 items-center rounded-lg bg-red-600 px-5 font-semibold text-white transition hover:bg-red-500">Spróbuj ponownie</button>
            : <a href="" className="inline-flex min-h-11 items-center rounded-lg bg-red-600 px-5 font-semibold text-white transition hover:bg-red-500">Spróbuj ponownie</a>}
          <Link href="/" className="inline-flex min-h-11 items-center rounded-lg border border-white/20 px-5 text-neutral-200 transition hover:border-red-500 hover:text-white">Wróć do encyklopedii</Link>
          <Link href="/szukaj" className="inline-flex min-h-11 items-center rounded-lg border border-white/20 px-5 text-neutral-200 transition hover:border-red-500 hover:text-white">Wyszukiwarka</Link>
        </div>
      </div>
    </div>
  );
}
