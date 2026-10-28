'use client';
import { useEffect, useRef } from 'react';
export default function ImageLightbox({ src, alt = 'powiększony', tall = false, onClose }: { src: string; alt?: string; tall?: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement;
    const element = dialog.current;
    element?.showModal();
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      element?.close();
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={dialog} aria-label="Powiększenie ilustracji" onCancel={event => { event.preventDefault(); onClose(); }} className={`fixed inset-0 m-0 h-dvh w-screen max-h-none max-w-none border-0 bg-black/95 p-4 text-white open:flex backdrop:bg-black/80 ${tall ? 'items-start justify-center overflow-y-auto' : 'items-center justify-center'}`}>
    <button type="button" tabIndex={-1} aria-label="Zamknij powiększenie — tło" onClick={onClose} className="fixed inset-0" />
    <img src={src} alt={alt} className={`relative object-contain ${tall ? 'h-auto w-full max-w-3xl pt-12' : 'max-h-full max-w-full'}`} />
    <button ref={closeButton} type="button" aria-label="Zamknij powiększenie" onClick={onClose} className="fixed right-4 top-4 z-10 min-h-11 min-w-11 rounded border border-white/40 bg-black px-3 text-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver-500">×</button>
  </dialog>;
}
