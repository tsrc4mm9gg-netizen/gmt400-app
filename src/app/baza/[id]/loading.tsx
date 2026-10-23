export default function KnowledgeEntryLoading() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl bg-black px-5 py-10 pb-28 text-white" aria-busy="true">
      <a href="/" className="text-red-400 underline">Wróć do encyklopedii</a>
      <h1 className="mt-6 text-2xl text-red-400">Ładowanie materiału</h1>
      <p role="status" className="mt-4 text-neutral-400">Pobieramy treść wpisu. Proszę czekać…</p>
    </main>
  );
}
