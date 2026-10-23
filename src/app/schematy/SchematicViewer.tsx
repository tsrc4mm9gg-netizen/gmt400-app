'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = { src: string; alt: string; width: number; height: number; title: string };
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export default function SchematicViewer({ src, alt, width, height, title }: Props) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Otwórz schemat na pełnym ekranie: ${title}`}
        className={`group relative block w-full overflow-hidden ${height > width ? 'mx-auto max-w-xl' : ''} rounded-lg border border-white/10 bg-[#0d0d0f] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500`}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {!loaded && <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-white/5" />}
        {/* SVG serwowany bezpośrednio (wektor, bez optymalizacji rastrowej) */}
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} className="relative h-auto w-full" />
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/80 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20 group-hover:bg-red-600">⤢ Pełny ekran</span>
      </button>
      {open && <ZoomDialog src={src} alt={alt} title={title} onClose={() => setOpen(false)} />}
    </>
  );
}

function ZoomDialog({ src, alt, title, onClose }: { src: string; alt: string; title: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ dist: number; s: number; x: number; y: number; cx: number; cy: number } | null>(null);
  const lastTap = useRef(0);

  useEffect(() => {
    const previous = document.activeElement;
    const el = dialog.current;
    el?.showModal();
    closeBtn.current?.focus({ preventScroll: true });
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevOverflow;
      el?.close();
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);

  const zoomBy = useCallback((f: number) => setView(v => { const s = clamp(v.s * f, 1, 6); return s === 1 ? { s: 1, x: 0, y: 0 } : { s, x: v.x * (s / v.s), y: v.y * (s / v.s) }; }), []);

  const onDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    if (pts.length === 2) {
      gesture.current = { dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1, s: view.s, x: view.x, y: view.y, cx: (pts[0].x + pts[1].x) / 2, cy: (pts[0].y + pts[1].y) / 2 };
    } else if (pts.length === 1) {
      const now = Date.now();
      if (now - lastTap.current < 300) { setView(v => (v.s > 1 ? { s: 1, x: 0, y: 0 } : { s: 2.5, x: 0, y: 0 })); lastTap.current = 0; }
      else lastTap.current = now;
      gesture.current = { dist: 0, s: view.s, x: view.x, y: view.y, cx: e.clientX, cy: e.clientY };
    }
  };
  const onMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    const g = gesture.current;
    if (pts.length >= 2 && g.dist) {
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const s = clamp(g.s * (d / g.dist), 1, 6);
      const cx = (pts[0].x + pts[1].x) / 2, cy = (pts[0].y + pts[1].y) / 2;
      setView(s === 1 ? { s: 1, x: 0, y: 0 } : { s, x: g.x * (s / g.s) + (cx - g.cx), y: g.y * (s / g.s) + (cy - g.cy) });
    } else if (pts.length === 1 && view.s > 1) {
      setView(v => ({ ...v, x: g.x + (e.clientX - g.cx), y: g.y + (e.clientY - g.cy) }));
    }
  };
  const onUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    const rest = [...pointers.current.values()];
    gesture.current = rest.length === 1 ? { dist: 0, s: view.s, x: view.x, y: view.y, cx: rest[0].x, cy: rest[0].y } : null;
  };

  const btn = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/25 bg-black/80 px-3 text-lg font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500';
  return (
    <dialog
      ref={dialog}
      aria-label={`Schemat: ${title}`}
      data-testid="schematic-dialog"
      onCancel={e => { e.preventDefault(); onClose(); }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-black p-0 text-white backdrop:bg-black"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-white/10 bg-neutral-950 px-3 py-2" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-red-300">{title}</p>
          <button type="button" className={btn} aria-label="Pomniejsz" onClick={() => zoomBy(1 / 1.5)}>−</button>
          <button type="button" className={btn} aria-label="Powiększ" onClick={() => zoomBy(1.5)}>+</button>
          <button type="button" className={`${btn} text-sm`} aria-label="Dopasuj do ekranu" onClick={() => setView({ s: 1, x: 0, y: 0 })}>1:1</button>
          <button ref={closeBtn} type="button" className={`${btn} text-2xl`} aria-label="Zamknij schemat" onClick={onClose}>×</button>
        </div>
        <div
          className="relative flex-1 touch-none select-none overflow-hidden"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onWheel={e => zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15)}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            data-scale={view.s.toFixed(2)}
            className="absolute inset-0 m-auto h-full w-full object-contain p-2"
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`, transformOrigin: 'center center' }}
          />
        </div>
        <p className="border-t border-white/10 bg-neutral-950 px-3 py-2 text-center text-xs text-neutral-400" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>Rozsuń dwa palce, aby powiększyć · stuknij dwa razy · przeciągnij, by przesunąć</p>
      </div>
    </dialog>
  );
}
