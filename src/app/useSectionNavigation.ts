'use client';
import { useCallback, useEffect, useRef, useState, type SetStateAction } from 'react';
export default function useSectionNavigation(allowed: string[]) {
  const key = allowed.join('|');
  const fallback = allowed[0] || 'modele';
  const [section, setSection] = useState(fallback);
  const current = useRef(fallback);
  const ready = useRef(false);
  const restoring = useRef(false);
  const valid = useCallback((value: string | null) => { const candidate = value === 'diy_content' || value === 'diycontent' ? 'diy' : value; return candidate && key.split('|').includes(candidate) ? candidate : null; }, [key]);
  const persist = useCallback((value: string) => { try { localStorage.setItem('gmt400_tab', value); } catch {} }, []);
  const savePosition = useCallback(() => { if (!ready.current || restoring.current) return; window.history.replaceState({ ...window.history.state, gmt400Section: current.current, gmt400ScrollY: window.scrollY }, '', window.location.href); }, []);
  useEffect(() => {
    const url = new URL(window.location.href);
    const explicit = valid(url.searchParams.get('tab'));
    let saved: string | null = null;
    try { saved = valid(localStorage.getItem('gmt400_tab')); } catch {}
    const initial = explicit || saved || fallback;
    const position = typeof window.history.state?.gmt400ScrollY === 'number' ? window.history.state.gmt400ScrollY : null;
    current.current = initial; setSection(initial); persist(initial);
    url.searchParams.set('tab', initial);
    window.history.replaceState({ ...window.history.state, gmt400Section: initial, gmt400ScrollY: position ?? window.scrollY }, '', url.toString());
    ready.current = true;
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;
    let observer: MutationObserver | undefined;
    let observerTimer: ReturnType<typeof setTimeout> | undefined;
    const restoreInitial = () => {
      const content = document.getElementById('content');
      if (!content) return false;
      observer?.disconnect();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (stopped) return;
        if (position !== null) window.scrollTo({ top: position, behavior: 'instant' });
        else if (explicit) { const target = content.querySelector<HTMLElement>('h2, h1') || content; const header = Math.max(0, document.querySelector('header')?.getBoundingClientRect().bottom || 0); window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - header - 16), behavior: 'instant' }); }
      }));
      return true;
    };
    if (explicit || position !== null) { if (!restoreInitial()) { observer = new MutationObserver(restoreInitial); observer.observe(document.body, { childList: true, subtree: true }); observerTimer = setTimeout(() => observer?.disconnect(), 30000); } }
    const pop = (event: PopStateEvent) => {
      if (timer) clearTimeout(timer);
      restoring.current = true;
      const next = valid(new URL(window.location.href).searchParams.get('tab')) || fallback;
      current.current = next; setSection(next); persist(next);
      const top = typeof event.state?.gmt400ScrollY === 'number' ? event.state.gmt400ScrollY : 0;
      requestAnimationFrame(() => requestAnimationFrame(() => { if (!stopped) { window.scrollTo({ top, behavior: 'instant' }); restoring.current = false; } }));
    };
    const scroll = () => { if (timer) clearTimeout(timer); timer = setTimeout(savePosition, 180); };
    window.addEventListener('popstate', pop);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('pagehide', savePosition);
    return () => { stopped = true; if (timer) clearTimeout(timer); if (observerTimer) clearTimeout(observerTimer); observer?.disconnect(); window.removeEventListener('popstate', pop); window.removeEventListener('scroll', scroll); window.removeEventListener('pagehide', savePosition); window.history.scrollRestoration = previousRestoration; };
  }, [valid, fallback, persist, savePosition]);
  const navigate = useCallback((value: SetStateAction<string>) => {
    const next = valid(typeof value === 'function' ? value(current.current) : value);
    if (!next || typeof window === 'undefined') return;
    if (next !== current.current) {
      savePosition();
      const url = new URL(window.location.href); url.searchParams.set('tab', next);
      window.history.pushState({ ...window.history.state, gmt400Section: next, gmt400ScrollY: 0 }, '', url.toString());
    }
    current.current = next; setSection(next); persist(next);
  }, [valid, savePosition, persist]);
  return [section, navigate] as const;
}
