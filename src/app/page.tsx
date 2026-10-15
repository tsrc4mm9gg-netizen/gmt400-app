'use client';

import { useState, useEffect, useMemo } from 'react';

type Item = {
  Nazwa: string;
  Typ: string;
  Model: string;
  Opis?: string;
  Objawy?: string;
  Rozwiązanie?: string;
  Lata?: string;
};

function getModelImage(nazwa: string): string | null {
  const n = nazwa.toLowerCase();
  if (n.includes('tahoe') && n.includes('2-drzwi')) return '/tahoe-2d.jpg';
  if (n.includes('tahoe') && n.includes('4-drzwi')) return '/tahoe-4d.jpg';
  if (n.includes('tahoe')) return '/tahoe-4d.jpg';
  if (n.includes('suburban')) return '/suburban.jpg';
  if (n.includes('sierra')) return '/sierra.jpg';
  if (n.includes('yukon') && n.includes('2-drzwi')) return '/yukon-2d.jpg';
  if (n.includes('yukon')) return '/yukon-4d.jpg';
  if (n.includes('extended cab') || n.includes('extended')) return '/ck-ext.jpg';
  if (n.includes('regular cab') || n.includes('c/k 1500')) return '/ck-reg.jpg';
  if (n.includes('c/k') || n.includes('1500') || n.includes('2500') || n.includes('3500')) return '/ck-reg.jpg';
  return null;
}

function getTipImage(nazwa: string): string | null {
  const n = nazwa.toLowerCase();
  if (n.includes('4l60e') && (n.includes('filtr') || n.includes('płyn') || n.includes('wymiana') || n.includes('misk'))) return '/diy-4l60e-pl.jpg';
  if (n.includes('4l60e') || n.includes('skrzyni') || n.includes('atf')) return '/diy-4l60e-pl.jpg';
  if (n.includes('kolektor') || n.includes('uszczelk') || n.includes('intake')) return '/diy-intake-pl.jpg';
  if (n.includes('np231') || n.includes('4x4') || n.includes('rozdzielcz')) return '/diy-np231-pl.jpg';
  if (n.includes('czujnik') || n.includes('maf') || n.includes('sonda') || n.includes('lean') || n.includes('p0171')) return '/diy-sensors.jpg';
  return null;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('modele');
  const [selectedModel, setSelectedModel] = useState('Wszystkie');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/notion')
      .then(r => r.json())
      .then(data => {
        setItems(data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const models = useMemo(() => items.filter(i => i.Typ === 'Model'), [items]);
  const issues = useMemo(() => items.filter(i => i.Typ === 'Usterka'), [items]);
  const codes = useMemo(() => items.filter(i => i.Typ === 'Kod błędu'), [items]);
  const tips = useMemo(() => items.filter(i => i.Typ === 'Porada'), [items]);

  const uniqueModels = ['Wszystkie', ...Array.from(new Set(models.map(m => m.Model).filter(Boolean)))];

  const filterByModel = (list: Item[]) => {
    if (selectedModel === 'Wszystkie') return list;
    return list.filter(i => i.Model === selectedModel || i.Model === 'Wszystkie');
  };

  const filteredModels = useMemo(() =>
    models.filter(m =>
      m.Nazwa.toLowerCase().includes(query.toLowerCase()) ||
      (m.Opis || '').toLowerCase().includes(query.toLowerCase())
    ), [models, query]);

  const filteredIssues = useMemo(() => {
    let result = filterByModel(issues);
    return result.filter(i =>
      i.Nazwa.toLowerCase().includes(query.toLowerCase()) ||
      (i.Objawy || '').toLowerCase().includes(query.toLowerCase()) ||
      (i.Rozwiązanie || '').toLowerCase().includes(query.toLowerCase())
    );
  }, [issues, query, selectedModel]);

  const filteredCodes = useMemo(() => {
    let result = filterByModel(codes);
    return result.filter(c =>
      c.Nazwa.toLowerCase().includes(query.toLowerCase()) ||
      (c.Opis || '').toLowerCase().includes(query.toLowerCase()) ||
      (c.Rozwiązanie || '').toLowerCase().includes(query.toLowerCase())
    );
  }, [codes, query, selectedModel]);

  const filteredTips = useMemo(() => {
    let result = filterByModel(tips);
    return result.filter(t =>
      t.Nazwa.toLowerCase().includes(query.toLowerCase()) ||
      (t.Rozwiązanie || '').toLowerCase().includes(query.toLowerCase())
    );
  }, [tips, query, selectedModel]);

  if (loading) {
    return <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">Ładowanie bazy...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@500;700&display=swap" rel="stylesheet" />
      
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="powiększony diagram" className="max-w-full max-h-full object-contain" />
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setLightbox(null)}>×</button>
        </div>
      )}

      <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <h1 className="text-3xl tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            GMT<span className="text-amber-400">400</span>
          </h1>
          <input
            type="search"
            placeholder="Szukaj..."
            className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm w-full sm:w-80 focus:outline-none focus:border-amber-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <section className="bg-gradient-to-b from-neutral-900 to-neutral-950 py-12 px-4 text-center">
        <h2 className="text-5xl sm:text-6xl mb-4 tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Encyklopedia GMT400
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">Chevrolet C/K, Tahoe, Suburban, Yukon (1988–2000)</p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {uniqueModels.map(m => (
            <button
              key={m}
              onClick={() => setSelectedModel(m)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedModel === m ? 'bg-amber-400 text-black' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {['modele', 'usterki', 'kody', 'porady'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                tab === t ? 'bg-amber-400 text-black' : 'bg-neutral-900 text-neutral-400'
              }`}
            >
              {t === 'modele' ? 'Modele' : t === 'usterki' ? 'Usterki' : t === 'kody' ? 'Kody błędów' : 'Porady DIY'}
            </button>
          ))}
        </div>

        {tab === 'modele' && (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredModels.map((m, idx) => {
              const img = getModelImage(m.Nazwa);
              return (
                <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-amber-400 transition">
                  {img && <img src={img} alt={m.Nazwa} className="w-full h-48 object-cover bg-neutral-800 cursor-pointer" onClick={() => setLightbox(img)} />}
                  <div className="p-5">
                    <h3 className="text-amber-400 font-semibold text-lg" style={{ fontFamily: "'Oswald', sans-serif" }}>{m.Nazwa}</h3>
                    <p className="text-sm text-neutral-500 mb-2">{m.Lata} • {m.Model}</p>
                    <p className={`text-neutral-300 text-sm ${expanded === idx ? '' : 'line-clamp-3'}`}>{m.Opis}</p>
                    <button onClick={() => setExpanded(expanded === idx ? null : idx)} className="mt-3 text-amber-400 text-sm font-medium">
                      {expanded === idx ? 'Zwiń' : 'Rozwiń więcej'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'usterki' && (
          <div className="space-y-4">
            {filteredIssues.map((i, idx) => (
              <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-amber-400">{i.Nazwa}</h3>
                  <span className="text-xs bg-neutral-800 px-2 py-1 rounded">{i.Model}</span>
                </div>
                {i.Objawy && <p className="text-sm text-neutral-400 mb-2"><strong>Objawy:</strong> {i.Objawy}</p>}
                {i.Rozwiązanie && <p className="text-neutral-300 text-sm whitespace-pre-line">{i.Rozwiązanie}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === 'kody' && (
          <div className="space-y-4">
            {filteredCodes.map((c, idx) => (
              <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <h3 className="font-semibold text-amber-400 mb-1">{c.Nazwa}</h3>
                {c.Opis && <p className="text-sm text-neutral-400 mb-2">{c.Opis}</p>}
                {c.Rozwiązanie && <p className="text-neutral-300 text-sm whitespace-pre-line">{c.Rozwiązanie}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === 'porady' && (
          <div className="space-y-4">
            {filteredTips.map((t, idx) => {
              const tipImg = getTipImage(t.Nazwa);
              return (
                <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                  {tipImg && (
                    <img 
                      src={tipImg} 
                      alt="diagram" 
                      className="w-full max-h-64 object-contain bg-white cursor-pointer hover:opacity-90 transition" 
                      onClick={() => setLightbox(tipImg)}
                    />
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-amber-400 mb-2">{t.Nazwa}</h3>
                    <p className="text-neutral-300 text-sm whitespace-pre-line">{t.Rozwiązanie}</p>
                    {tipImg && <p className="text-xs text-neutral-500 mt-2">Kliknij diagram aby powiększyć</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer className="border-t border-neutral-800 py-8 text-center text-neutral-500 text-sm">
        GMT400.pl • Dane z Notion • info@gmt400.pl
      </footer>
    </div>
  );
}
