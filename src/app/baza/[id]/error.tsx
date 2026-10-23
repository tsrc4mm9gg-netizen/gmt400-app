'use client';
export default function EntryError({ reset }: { reset: () => void }) {
  return <main className="mx-auto min-h-screen max-w-3xl bg-black p-8 text-white"><h1 className="text-2xl text-red-400">Nie udało się pobrać materiału</h1><p className="my-4">To błąd pobierania, nie potwierdzenie braku wpisu. Spróbuj ponownie.</p><button onClick={reset} className="rounded bg-red-600 px-4 py-3 text-white">Ponów pobieranie</button><a className="ml-4 underline" href="/">Wróć do encyklopedii</a></main>;
}
