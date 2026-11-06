'use client';
import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { DEFAULT_COLLECTION_ID, SAVED_EVENT, clearCollection, createCollection, readSaved, removeCollection, removeSaved, changeCollection, type SavedCollection, type SavedMaterial } from '../../lib/saved-materials';

export default function SavedCollectionsPage() {
  const [items, setItems] = useState<SavedMaterial[]>([]);
  const [collections, setCollections] = useState<SavedCollection[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sync = () => {
      const state = readSaved();
      setItems(state.items);
      setCollections(state.collections);
    };
    sync();
    window.addEventListener(SAVED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(SAVED_EVENT, sync); window.removeEventListener('storage', sync); };
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const created = createCollection(name);
    if (!created) { setMessage('Nie udało się utworzyć kolekcji. Sprawdź nazwę.'); return; }
    setName('');
    setMessage(`Utworzono kolekcję „${created.name}”.`);
  };

  return <main id="main-content" className="mx-auto min-h-screen max-w-4xl bg-black px-5 py-10 pb-28 text-white">
    <h1 className="text-3xl text-silver-400">Moje kolekcje</h1>
    <p className="mt-2 text-neutral-300">Zapisane materiały są przechowywane lokalnie w tej przeglądarce.</p>
    <form onSubmit={submit} className="mt-6 flex flex-wrap items-end gap-3">
      <label className="block min-w-0 flex-1">
        <span className="block text-sm text-neutral-300">Nowa kolekcja</span>
        <input value={name} onChange={event => setName(event.target.value)} maxLength={60} className="mt-1 block min-h-11 w-full rounded border border-white/20 bg-neutral-900 p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500" />
      </label>
      <button type="submit" className="min-h-11 rounded border border-white/20 bg-silver-600 px-4 py-3 font-semibold text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500">Utwórz</button>
    </form>
    <p role="status" className="mt-3 text-sm text-silver-400">{message}</p>
    <section aria-label="Zapisane materiały" className="mt-8 space-y-8">
      {collections.map(collection => {
        const collectionItems = items.filter(item => item.collectionId === collection.id);
        return <div key={collection.id} className="rounded-xl border border-white/15 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg text-silver-400">{collection.name}</h2>
            {collection.id !== DEFAULT_COLLECTION_ID && <button type="button" onClick={() => { removeCollection(collection.id); setMessage(`Usunięto kolekcję „${collection.name}”.`); }} className="min-h-11 rounded border border-white/20 px-3 text-sm text-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500">Usuń kolekcję</button>}
          </div>
          {collectionItems.length ? <ul className="mt-3 space-y-2">
            {collectionItems.map(item => <li key={item.id} className="rounded border border-white/10 p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link href={item.href} className="min-h-11 flex-1 text-silver-400 underline">{item.title}</Link>
                <button type="button" onClick={() => { removeSaved(item.id); setMessage('Usunięto materiał.'); }} className="min-h-11 rounded border border-white/20 px-3 text-sm text-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500">Usuń</button>
              </div>
              <label className="mt-2 block text-xs text-neutral-400">
                Kolekcja
                <select value={item.collectionId} onChange={event => { changeCollection(item.id, event.target.value); setMessage('Przeniesiono materiał.'); }} className="mt-1 block min-h-11 w-full rounded border border-white/20 bg-neutral-900 p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500">
                  {collections.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
                </select>
              </label>
            </li>)}
          </ul> : <p className="mt-3 text-sm text-neutral-400">Brak materiałów w tej kolekcji.</p>}
          {collectionItems.length > 0 && <button type="button" onClick={() => { clearCollection(collection.id); setMessage(`Wyczyszczono kolekcję „${collection.name}”.`); }} className="mt-3 min-h-11 rounded border border-white/20 px-3 text-sm text-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500">Wyczyść kolekcję</button>}
        </div>;
      })}
    </section>
  </main>;
}
