'use client';
import { useEffect, useState } from 'react';

const KEY = 'gmt400_ios_install_hint_v1';

/** Jednorazowa, dyskretna podpowiedź „Dodaj do ekranu początkowego” — tylko iPhone/iPad w Safari, gdy strona nie działa jako aplikacja. */
export default function IosInstallHint() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) return;
      const ua = navigator.userAgent;
      const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const safari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\/|Instagram|FBAN|FBAV/.test(ua);
      const standalone = (navigator as Navigator & { standalone?: boolean }).standalone === true || window.matchMedia('(display-mode: standalone)').matches;
      if (!ios || !safari || standalone) return;
      const t = window.setTimeout(() => setShow(true), 2500);
      return () => window.clearTimeout(t);
    } catch { /* brak localStorage — nie pokazujemy */ }
  }, []);
  if (!show) return null;
  const close = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch { /* nic */ } setShow(false); };
  return (
    <div
      role="dialog"
      aria-label="Dodaj GMT400 do ekranu początkowego"
      data-testid="ios-install-hint"
      className="fixed inset-x-3 z-[96] mx-auto max-w-md rounded-2xl border border-white/15 bg-[linear-gradient(180deg,#26262b,#111113)] p-3 pr-2 text-sm text-neutral-200 shadow-2xl shadow-black/70"
      style={{ bottom: 'calc(var(--tabbar-h, 0px) + env(safe-area-inset-bottom, 0px) + 12px)' }}
    >
      <div className="flex items-start gap-3">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-6 w-6 shrink-0 text-silver-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M8 7l4-4 4 4" /><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" /></svg>
        <p className="min-w-0 flex-1 leading-snug">
          <strong className="text-white">Dodaj GMT400 do ekranu początkowego.</strong>{' '}
          Stuknij <span className="font-semibold text-white">Udostępnij</span> na pasku Safari, potem <span className="font-semibold text-white">„Do ekranu początkowego”</span>. Zapisane poradniki działają też bez internetu.
        </p>
        <button type="button" onClick={close} aria-label="Zamknij podpowiedź" className="-my-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg text-neutral-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500">×</button>
      </div>
    </div>
  );
}
