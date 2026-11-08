'use client';
import { useEffect, useState } from 'react';
import { DEFAULT_COLLECTION_ID, SAVED_EVENT, readSaved, removeSaved, saveMaterial } from '../lib/saved-materials';

type Props = { id: string; title: string; href: string; type: string };

export default function SavedMaterialButton({ id, title, href, type }: Props) {
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sync = () => setSaved(readSaved().items.some(item => item.id === id));
    sync();
    window.addEventListener(SAVED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(SAVED_EVENT, sync); window.removeEventListener('storage', sync); };
  }, [id]);

  const toggle = () => {
    const removing = saved;
    const ok = removing
      ? removeSaved(id)
      : saveMaterial({ id, title, href, type, collectionId: DEFAULT_COLLECTION_ID });
    if (!ok) {
      setMessage('Nie udało się zmienić zapisanych materiałów. Pamięć przeglądarki może być niedostępna lub pełna albo dane materiału są nieprawidłowe.');
      return;
    }
    setSaved(!removing);
    setMessage(removing ? 'Usunięto z zapisanych.' : 'Zapisano w kolekcji „Do sprawdzenia”.');
  };

  return <>
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Zapisano: ${title}. Usuń z zapisanych` : `Zapisz materiał: ${title}`}
      className="inline-flex min-h-11 min-w-11 max-w-full items-center gap-2 rounded-xl border border-white/20 bg-[linear-gradient(180deg,#2a2a2f,#151517)] px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-silver-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500 motion-reduce:transition-none"
    >
      <span aria-hidden="true">{saved ? '★' : '☆'}</span>
      {saved ? 'Zapisano' : 'Zapisz'}
    </button>
    <p role="status" aria-atomic="true" className="mt-2 text-sm text-neutral-300">{message}</p>
  </>;
}
