'use client';
import { useEffect, useRef } from 'react';
export default function ImageLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement;
    const element = dialog.current;
    element?.showModal();
    return () => {
      element?.close();
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={dialog} aria-label="Powiększenie ilustracji" onCancel={event => { event.preventDefault(); onClose(); }} className="fixed inset-0 m-0 h-dvh w-screen max-h-none max-w-none items-center justify-center border-0 bg-black/95 p-4 text-white open:flex backdrop:bg-black/80">
    <button type="button" aria-label="Zamknij powiększenie — tło" onClick={onClose} className="absolute inset-0" />
    <img src={src} alt="powiększony" className="relative max-h-full max-w-full object-contain" />
    <button type="button" autoFocus aria-label="Zamknij powiększenie" onClick={onClose} className="absolute right-4 top-4 z-10 min-h-11 min-w-11 rounded border border-white/40 bg-black px-3 text-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400">×</button>
  </dialog>;
}
