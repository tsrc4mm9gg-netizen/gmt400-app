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
  if (n.includes('4l60e') || n.includes('skrzyni') || n.includes('atf') || n.includes('filtr')) return '/diy-4l60e-pl.jpg';
  if (n.includes('kolektor') || n.includes('uszczelk') || n.includes('intake')) return '/diy-intake-pl.jpg';
  if (n.includes('np231') || n.includes('4x4') || n.includes('rozdzielcz')) return '/diy-np231-pl.jpg';
  if (n.includes('chłodz') || n.includes('płyn chłod') || n.includes('termostat') || n.includes('pompa wody')) return '/diy-cooling-pl.jpg';
  if (n.includes('hamulc') || n.includes('klock') || n.includes('tarcze') || n.includes('bęben')) return '/diy-brakes-pl.jpg';
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
  const [menuOpen, setMenuOpen] = useState(false);

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
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold tracking-widest mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>GMT400</div>
          <div className="text-neutral-500">Ładowanie...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      
      {lightbox && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="powiększony" className="max-w-full max-h-full object-contain" />
          <button className="absolute top-6 right-6 text-white text-4xl hover:text-amber-400 transition" onClick={() => setLightbox(null)}>×</button>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              GMT<span className="text-amber-400">400</span>
            </span>
            <span className="hidden sm:block text-xs text-neutral-500 tracking-widest uppercase">Encyklopedia</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide">
            {['modele', 'usterki', 'kody', 'porady'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`uppercase tracking-wider transition ${
                  tab === t ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t === 'modele' ? 'Modele' : t === 'usterki' ? 'Usterki' : t === 'kody' ? 'Kody' : 'DIY'}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <input
              type="search"
              placeholder="Szukaj..."
              className="hidden sm:block bg-white/5 border border-white/10 rounded px-4 py-2 text-sm w-48 focus:outline-none focus:border-amber-400/50 placeholder:text-neutral-600"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-black border-t border-white/10 px-6 py-4 space-y-3">
            {['modele', 'usterki', 'kody', 'porady'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setMenuOpen(false); }}
                className={`block w-full text-left uppercase tracking-wider py-2 ${
                  tab === t ? 'text-amber-400' : 'text-neutral-400'
                }`}
              >
                {t === 'modele' ? 'Modele' : t === 'usterki' ? 'Usterki' : t === 'kody' ? 'Kody' : 'DIY'}
              </button>
            ))}
            <input
              type="search"
              placeholder="Szukaj..."
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-sm focus:outline-none focus:border-amber-400/50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        <img 
          src="/tahoe-4d.jpg" 
          alt="GMT400" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-amber-400" />
              <span className="text-amber-400 text-sm tracking-widest uppercase">1988–2000</span>
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-none tracking-tight mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              GMT400<br />ENCYKLOPEDIA
            </h1>
            <p className="text-neutral-300 text-lg max-w-md mb-8">
              Kompletna baza wiedzy o Chevrolet C/K, Tahoe, Suburban i GMC Yukon. Modele, usterki, kody, porady.
            </p>
            <button 
              onClick={() => document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-amber-400 text-black px-8 py-4 font-semibold tracking-wider uppercase text-sm hover:bg-amber-300 transition flex items-center gap-2"
            >
              Przeglądaj bazę <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Model filter */}
      <div className="bg-neutral-950 border-y border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex gap-2 overflow-x-auto">
          {uniqueModels.map(m => (
            <button
              key={m}
              onClick={() => setSelectedModel(m)}
              className={`px-4 py-2 text-sm whitespace-nowrap tracking-wide transition ${
                selectedModel === m 
                  ? 'bg-amber-400 text-black' 
                  : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div id="content" className="max-w-7xl mx-auto px-6 py-16">
        
        {tab === 'modele' && (
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-px bg-amber-400" />
              <h2 className="text-3xl tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>MODELE</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((m, idx) => {
                const img = getModelImage(m.Nazwa);
                return (
                  <div key={idx} className="group bg-neutral-950 border border-white/10 overflow-hidden hover:border-amber-400/50 transition">
                    {img && (
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={img} 
                          alt={m.Nazwa} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer" 
                          onClick={() => setLightbox(img)} 
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{m.Nazwa}</h3>
                      <p className="text-amber-400 text-sm mb-3">{m.Lata} • {m.Model}</p>
                      <p className={`text-neutral-400 text-sm leading-relaxed ${expanded === idx ? '' : 'line-clamp-3'}`}>{m.Opis}</p>
                      <button 
                        onClick={() => setExpanded(expanded === idx ? null : idx)} 
                        className="mt-4 text-amber-400 text-sm tracking-wide uppercase hover:text-amber-300 transition"
                      >
                        {expanded === idx ? 'Zwiń' : 'Więcej →'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'usterki' && (
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-px bg-amber-400" />
              <h2 className="text-3xl tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>USTERKI</h2>
            </div>
            <div className="space-y-4">
              {filteredIssues.map((i, idx) => (
                <div key={idx} className="bg-neutral-950 border border-white/10 p-6 hover:border-white/20 transition">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{i.Nazwa}</h3>
                    <span className="text-xs bg-white/10 px-3 py-1 text-neutral-400">{i.Model}</span>
                  </div>
                  {i.Objawy && <p className="text-neutral-400 text-sm mb-3"><span className="text-amber-400">Objawy:</span> {i.Objawy}</p>}
                  {i.Rozwiązanie && <p className="text-neutral-300 text-sm whitespace-pre-line leading-relaxed">{i.Rozwiązanie}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'kody' && (
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-px bg-amber-400" />
              <h2 className="text-3xl tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>KODY BŁĘDÓW</h2>
            </div>
            <div className="space-y-4">
              {filteredCodes.map((c, idx) => (
                <div key={idx} className="bg-neutral-950 border border-white/10 p-6 hover:border-white/20 transition">
                  <h3 className="text-lg font-semibold text-amber-400 mb-2">{c.Nazwa}</h3>
                  {c.Opis && <p className="text-neutral-400 text-sm mb-3">{c.Opis}</p>}
                  {c.Rozwiązanie && <p className="text-neutral-300 text-sm whitespace-pre-line leading-relaxed">{c.Rozwiązanie}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'porady' && (
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-px bg-amber-400" />
              <h2 className="text-3xl tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>PORADY DIY</h2>
            </div>
            <div className="space-y-6">
              {filteredTips.map((t, idx) => {
                const tipImg = getTipImage(t.Nazwa);
                return (
                  <div key={idx} className="bg-neutral-950 border border-white/10 overflow-hidden hover:border-white/20 transition">
                    {tipImg && (
                      <img 
                        src={tipImg} 
                        alt="diagram" 
                        className="w-full max-h-80 object-contain bg-white cursor-pointer hover:opacity-90 transition" 
                        onClick={() => setLightbox(tipImg)}
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-3">{t.Nazwa}</h3>
                      <p className="text-neutral-300 text-sm whitespace-pre-line leading-relaxed">{t.Rozwiązanie}</p>
                      {tipImg && <p className="text-xs text-neutral-600 mt-4 uppercase tracking-wide">Kliknij diagram aby powiększyć</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-bold tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            GMT<span className="text-amber-400">400</span>
          </div>
          <div className="text-neutral-500 text-sm">
            gmt400.pl • info@gmt400.pl
          </div>
        </div>
      </footer>
    </div>
  );
}
