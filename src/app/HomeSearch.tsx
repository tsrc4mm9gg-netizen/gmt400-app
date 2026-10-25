export default function HomeSearch() {
  return (
    <form action="/szukaj" method="get" role="search" className="px-4 pb-4">
      <label htmlFor="home-search" className="sr-only">Szukaj w encyklopedii GMT400</label>
      <div className="flex gap-2">
        <input
          id="home-search"
          name="q"
          type="search"
          maxLength={120}
          placeholder="Szukaj: kod, objaw, część…"
          className="min-h-14 min-w-0 flex-1 rounded-xl border-2 border-red-600 bg-neutral-900 px-4 text-lg text-white placeholder:text-neutral-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-600/40"
        />
        <button type="submit" className="min-h-14 shrink-0 rounded-xl bg-red-600 px-5 text-lg font-bold text-white shadow-lg shadow-red-600/30 hover:bg-red-500">
          Szukaj
        </button>
      </div>
    </form>
  );
}
