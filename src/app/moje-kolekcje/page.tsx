'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { DEFAULT_COLLECTION_ID, SAVED_EVENT, clearCollection, createCollection, readSaved, removeCollection, removeSaved, changeCollection, type SavedCollection, type SavedMaterial } from '../../lib/saved-materials';

const buttonClass = 'min-h-11 min-w-11 rounded border border-white/20 px-3 text-sm text-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500';
const storageError = 'Nie udało się zapisać zmian. Pamięć przeglądarki może być niedostępna lub pełna. Spróbuj ponownie.';

export default function SavedCollectionsPage() {
  const [items, setItems] = useState<SavedMaterial[]>([]);
  const [collections, setCollections] = useState<SavedCollection[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [ready, setReady] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const sync = () => {
      const state = readSaved();
      setItems(state.items);
      setCollections(state.collections);
      setReady(true);
    };
    sync();
    window.addEventListener(SAVED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(SAVED_EVENT, sync); window.removeEventListener('storage', sync); };
  }, []);

  const focusHeading = () => requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const created = createCollection(name);
    if (!created) {
      setMessage('Nie udało się utworzyć kolekcji. Sprawdź, czy nazwa jest niepusta i unikalna oraz czy pamięć przeglądarki jest dostępna.');
      return;
    }
    setName('');
    setMessage(`Utworzono kolekcję „${created.name}”.`);
  };
  const bulkAction = (collection: SavedCollection, action: 'remove' | 'clear') => {
    const count = readSaved().items.filter(item => item.collectionId === collection.id).length;
    const question = action === 'remove'
      ? `Usunąć kolekcję „${collection.name}” oraz zapisane w niej materiały (${count})? Tej operacji nie można cofnąć. Artykuły na stronie pozostaną bez zmian.`
      : `Usunąć wszystkie zapisane materiały (${count}) z kolekcji „${collection.name}”? Tej operacji nie można cofnąć. Kolekcja i artykuły na stronie pozostaną bez zmian.`;
    if (!window.confirm(question)) return;
    const ok = action === 'remove' ? removeCollection(collection.id) : clearCollection(collection.id);
    if (!ok) { setMessage(storageError); return; }
    setMessage(action === 'remove' ? `Usunięto kolekcję „${collection.name}”.` : `Wyczyszczono kolekcję „${collection.name}”.`);
    focusHeading();
  };

  return <div className="mx-auto min-h-screen min-w-0 max-w-4xl bg-black px-5 py-10 pb-28 text-white">
    <h1 ref={headingRef} tabIndex={-1} className="text-3xl text-silver-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">Moje kolekcje</h1>
    <p className="mt-2 text-neutral-300">Zapisane materiały są przechowywane lokalnie w tej przeglądarce.</p>
    <form onSubmit={submit} className="mt-6 flex flex-wrap items-end gap-3">
      <label className="block min-w-0 flex-1">
        <span className="block text-sm text-neutral-300">Nowa kolekcja</span>
        <input value={name} onChange={event => setName(event.target.value)} required maxLength={60} className="mt-1 block min-h-11 w-full rounded border border-white/20 bg-neutral-900 p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500" />
      </label>
      <button type="submit" disabled={!ready} className="min-h-11 rounded border border-white/20 bg-silver-600 px-4 py-3 font-semibold text-neutral-950 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500">Utwórz</button>
    </form>
    <p role="status" aria-atomic="true" className="mt-3 text-sm text-silver-400">{message}</p>
    {!ready && <p className="mt-3 text-sm text-neutral-300">Wczytywanie zapisanych materiałów…</p>}
    <section aria-label="Zapisane materiały" aria-busy={!ready} className="mt-8 space-y-8">
      {collections.map(collection => {
        const collectionItems = items.filter(item => item.collectionId === collection.id);
        return <div key={collection.id} className="min-w-0 rounded-xl border border-white/15 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="min-w-0 break-words text-lg text-silver-400">{collection.name}</h2>
            {collection.id !== DEFAULT_COLLECTION_ID && <button type="button" aria-label={`Usuń kolekcję: ${collection.name}`} onClick={() => bulkAction(collection, 'remove')} className={buttonClass}>Usuń kolekcję</button>}
          </div>
          {collectionItems.length ? <ul className="mt-3 space-y-2">
            {collectionItems.map(item => <li key={item.id} className="min-w-0 rounded border border-white/10 p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link href={item.href} className="flex min-h-11 min-w-0 flex-1 items-center break-words text-silver-400 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">{item.title}</Link>
                <button type="button" aria-label={`Usuń materiał: ${item.title}`} onClick={() => {
                  if (!removeSaved(item.id)) { setMessage(storageError); return; }
                  setMessage(`Usunięto materiał „${item.title}”.`);
                  focusHeading();
                }} className={buttonClass}>Usuń</button>
              </div>
              <label className="mt-2 block text-xs text-neutral-400">
                Kolekcja<span className="sr-only"> dla materiału „{item.title}”</span>
                <select value={item.collectionId} onChange={event => {
                  if (!changeCollection(item.id, event.target.value)) { setMessage(storageError); return; }
                  setMessage(`Przeniesiono materiał „${item.title}”.`);
                  focusHeading();
                }} className="mt-1 block min-h-11 w-full rounded border border-white/20 bg-neutral-900 p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500">
                  {collections.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
                </select>
              </label>
            </li>)}
          </ul> : <p className="mt-3 text-sm text-neutral-400">Brak materiałów w tej kolekcji.</p>}
          {collectionItems.length > 0 && <button type="button" aria-label={`Wyczyść kolekcję: ${collection.name}`} onClick={() => bulkAction(collection, 'clear')} className={`mt-3 ${buttonClass}`}>Wyczyść kolekcję</button>}
        </div>;
      })}
    </section>
  </div>;
}
