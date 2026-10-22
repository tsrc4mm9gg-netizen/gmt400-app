'use client';

import { useState } from 'react';
import Image from 'next/image';

type Model = {
  id: string;
  name: string;
  years: string;
  image: string;
  specs: string;
};

const MODELS: Model[] = [
  { id: 'tahoe-1997', name: '1997 Tahoe 5.7L', years: '1995–2000', image: '/tahoe-4d-green.jpg', specs: '5.7L V8 · 4WD · 4L60-E' },
  { id: 'suburban', name: 'Suburban 1500', years: '1992–1999', image: '/suburban-beige.jpg', specs: '5.7L / 7.4L · 4x2 / 4x4' },
  { id: 'k1500', name: 'K1500 Extended', years: '1988–1998', image: '/k1500-black.jpg', specs: '5.7L Vortec · 4x4 · NP241' },
  { id: 'sierra', name: 'GMC Sierra', years: '1988–1998', image: '/sierra-burgundy.jpg', specs: 'C/K 1500–3500 · 4x2 / 4x4' },
  { id: 'yukon', name: 'GMC Yukon', years: '1992–2000', image: '/yukon-white.jpg', specs: '5.7L · 2D / 4D' },
];

export default function ModelHero({
  onModelChange,
}: {
  onModelChange?: (modelId: string | null) => void;
}) {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const model = MODELS[index];

  const next = () => {
    const nextIndex = (index + 1) % MODELS.length;
    setIndex(nextIndex);
    onModelChange?.(MODELS[nextIndex].id);
  };

  const prev = () => {
    const prevIndex = (index - 1 + MODELS.length) % MODELS.length;
    setIndex(prevIndex);
    onModelChange?.(MODELS[prevIndex].id);
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
  };

  return (
    <section className="px-4 pt-6 pb-4">
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold tracking-wider text-white">
          GMT<span className="text-red-600">400</span>
        </h1>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-neutral-400">Encyklopedia</p>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute left-3 top-3 z-10 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
          {model.years.split('–')[0]}
        </div>

        <div className="relative aspect-[16/9] w-full">
          <Image
            src={model.image}
            alt={model.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h2 className="text-xl font-bold">{model.name}</h2>
          <p className="text-sm text-neutral-300">{model.specs}</p>
        </div>

        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm"
          aria-label="Poprzedni model"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm"
          aria-label="Następny model"
        >
          ›
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {MODELS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i);
              onModelChange?.(MODELS[i].id);
            }}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-red-600' : 'w-1.5 bg-white/30'
            }`}
            aria-label={`Model ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
