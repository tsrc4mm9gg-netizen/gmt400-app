'use client';
import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => { frame = 0; setVisible(window.scrollY > Math.max(900, window.innerHeight * 1.5)); };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return (
    <button
      type="button"
      aria-label="Przewiń na górę strony"
      data-testid="back-to-top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        document.getElementById('main-content')?.focus({ preventScroll: true });
      }}
      className={`fixed left-4 z-[89] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-neutral-900/95 text-lg text-white shadow-lg shadow-black/50 transition-[opacity,visibility] duration-200 hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500 ${visible ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'}`}
      style={{ bottom: 'calc(16px + var(--tabbar-h, 0px) + env(safe-area-inset-bottom, 0px))' }}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
