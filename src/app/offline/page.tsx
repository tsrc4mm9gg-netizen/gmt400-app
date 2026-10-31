import type { Metadata } from 'next';
import Link from 'next/link';
import SavedOfflineList from './SavedOfflineList';

export const metadata: Metadata = { title: 'Brak połączenia', robots: { index: false, follow: false } };

/** Strona zastępcza service workera, gdy nie ma sieci, a strony nie ma w pamięci. */
export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-white">
      <h1 className="text-2xl font-bold">Brak połączenia z internetem</h1>
      <p className="mt-3 text-neutral-300">Tej strony nie ma jeszcze w pamięci telefonu. Otwórz ją ponownie, gdy wróci zasięg. Działają strony, które już oglądałeś, i poradniki zapisane przyciskiem „Zapisz offline”.</p>
      <SavedOfflineList />
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/diy" className="inline-flex min-h-11 items-center rounded-xl border border-white/20 px-4 font-semibold hover:border-silver-400">Poradniki DIY</Link>
        <Link href="/usterki" className="inline-flex min-h-11 items-center rounded-xl border border-white/20 px-4 font-semibold hover:border-silver-400">Usterki</Link>
      </div>
    </div>
  );
}
