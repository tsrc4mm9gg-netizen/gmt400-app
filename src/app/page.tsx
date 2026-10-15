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

const CATEGORIES = [
  { id: 'modele', label: 'Modele', icon: '🚙' },
  { id: 'kody', label: 'Kody OBD', icon: '⚠️' },
  { id: 'usterki', label: 'Usterki', icon: '🔧' },
  { id: 'diy', label: 'DIY', icon: '📐' },
  { id: 'schematy', label: 'Schematy', icon: '⚡' },
  { id: 'vin', label: 'VIN/RPO', icon: '🔍' },
  { id: 'czesci', label: 'Części', icon: '🛠️' },
  { id: 'specyfikacje', label: 'Specyfikacje', icon: '📊' },
  { id: 'serwis', label: 'Serwis', icon: '🛢️' },
  { id: 'kupujacy', label: 'Kupujący', icon: '✅' },
  { id: 'tuning', label: 'Tuning', icon: '🏎️' },
  { id: 'import', label: 'Import PL', icon: '🇵🇱' },
  { id: 'historia', label: 'Historia', icon: '📜' },
];

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
  if (n.includes('chłodz') || n.includes('płyn chłod') || n.includes('termostat')) return '/diy-cooling-pl.jpg';
  if (n.includes('hamulc') || n.includes('klock') || n.includes('tarcze')) return '/diy-brakes-pl.jpg';
  if (n.includes('czujnik') || n.includes('maf') || n.includes('sonda')) return '/diy-sensors.jpg';
  return null;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('modele');
  const [selectedModel, setSelectedModel] = useState('Wszystkie');
  const [selectedModelItem, setSelectedModelItem] = useState<Item | null>(null);
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

  const filteredModels = useMemo(() => {
    let result = models;
    if (selectedModel !== 'Wszystkie') result = result.filter(m => m.Model === selectedModel);
    return result.filter(m => m.Nazwa.toLowerCase().includes(query.toLowerCase()) || (m.Opis || '').toLowerCase().includes(query.toLowerCase()));
  }, [models, query, selectedModel]);

  const filteredIssues = useMemo(() => {
    let result = filterByModel(issues);
    return result.filter(i => i.Nazwa.toLowerCase().includes(query.toLowerCase()) || (i.Objawy || '').toLowerCase().includes(query.toLowerCase()) || (i.Rozwiązanie || '').toLowerCase().includes(query.toLowerCase()));
  }, [issues, query, selectedModel]);

  const filteredCodes = useMemo(() => {
    let result = filterByModel(codes);
    return result.filter(c => c.Nazwa.toLowerCase().includes(query.toLowerCase()) || (c.Opis || '').toLowerCase().includes(query.toLowerCase()) || (c.Rozwiązanie || '').toLowerCase().includes(query.toLowerCase()));
  }, [codes, query, selectedModel]);

  const filteredTips = useMemo(() => {
    let result = filterByModel(tips);
    return result.filter(t => t.Nazwa.toLowerCase().includes(query.toLowerCase()) || (t.Rozwiązanie || '').toLowerCase().includes(query.toLowerCase()));
  }, [tips, query, selectedModel]);

  const selectModel = (model: string, item?: Item) => {
    setSelectedModel(model);
    setSelectedModelItem(item || null);
    setTab('modele');
    setTimeout(() => document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-4xl font-bold tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>GMT400</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      
      {lightbox && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="powiększony" className="max-w-full max-h-full object-contain" />
          <button className="absolute top-6 right-6 text-white text-4xl" onClick={() => setLightbox(null)}>×</button>
        </div>
      )}

      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSelectedModel('Wszystkie'); setSelectedModelItem(null); setTab('modele'); }}>
            <span className="text-xl font-bold tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              GMT<span className="text-amber-400">400</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="Szukaj..."
              className="hidden sm:block bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm w-40 focus:outline-none focus:border-amber-400/50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="text-white" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="bg-black border-t border-white/10 px-4 py-3">
            <input
              type="search"
              placeholder="Szukaj..."
              className="sm:hidden w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm mb-3 focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setTab(cat.id); setMenuOpen(false); }}
                  className={`px-3 py-2 text-sm text-left rounded transition ${
                    tab === cat.id ? 'bg-amber-400 text-black' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <section className="relative min-h-[50vh] flex items-center pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
        <img 
          src={selectedModelItem ? (getModelImage(selectedModelItem.Nazwa) || '/tahoe-4d.jpg') : '/tahoe-4d.jpg'} 
          alt="GMT400" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 py-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-px bg-amber-400" />
              <span className="text-amber-400 text-xs tracking-widest uppercase">
                {selectedModel === 'Wszystkie' ? '1988–2000' : selectedModel}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-none mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {selectedModelItem ? selectedModelItem.Nazwa : 'ENCYKLOPEDIA GMT400'}
            </h1>
            <p className="text-neutral-300 text-sm max-w-md">
              {selectedModelItem ? (selectedModelItem.Opis?.slice(0, 150) + '...') : 'Kompletna baza wiedzy o Chevrolet C/K, Tahoe, Suburban i GMC.'}
            </p>
          </div>
        </div>
      </section>

      <div className="bg-neutral-950 border-y border-white/5 py-3 sticky top-[57px] z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto">
          {uniqueModels.map(m => (
            <button
              key={m}
              onClick={() => selectModel(m)}
              className={`px-3 py-1.5 text-xs whitespace-nowrap transition ${
                selectedModel === m ? 'bg-amber-400 text-black' : 'bg-white/5 text-neutral-400 hover:bg-white/10'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-neutral-900 border-b border-white/5 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setTab(cat.id)}
              className={`px-3 py-2 text-xs whitespace-nowrap transition ${
                tab === cat.id ? 'bg-amber-400 text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div id="content" className="max-w-7xl mx-auto px-4 py-8">
        
        {selectedModel !== 'Wszystkie' && (
          <div className="mb-6 flex items-center justify-between">
            <span className="text-amber-400 text-sm">Filtr: <strong>{selectedModel}</strong></span>
            <button onClick={() => selectModel('Wszystkie')} className="text-xs text-neutral-500 hover:text-white">Wyczyść ×</button>
          </div>
        )}

        {tab === 'modele' && (
          <div>
            <h2 className="text-xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>MODELE ({filteredModels.length})</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModels.map((m, idx) => {
                const img = getModelImage(m.Nazwa);
                return (
                  <div key={idx} className="bg-neutral-950 border border-white/10 overflow-hidden hover:border-amber-400/50 transition cursor-pointer" onClick={() => selectModel(m.Model, m)}>
                    {img && <img src={img} alt={m.Nazwa} className="w-full h-40 object-cover" />}
                    <div className="p-4">
                      <h3 className="font-semibold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{m.Nazwa}</h3>
                      <p className="text-amber-400 text-xs mb-2">{m.Lata}</p>
                      <p className={`text-neutral-400 text-sm ${expanded === idx ? '' : 'line-clamp-3'}`}>{m.Opis}</p>
                      <button onClick={(e) => { e.stopPropagation(); setExpanded(expanded === idx ? null : idx); }} className="mt-2 text-amber-400 text-xs">
                        {expanded === idx ? 'Zwiń' : 'Więcej'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'kody' && (
          <div>
            <h2 className="text-xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>KODY OBD ({filteredCodes.length})</h2>
            <div className="space-y-3">
              {filteredCodes.map((c, idx) => (
                <div key={idx} className="bg-neutral-950 border border-white/10 p-4">
                  <h3 className="font-semibold text-amber-400 mb-1">{c.Nazwa}</h3>
                  {c.Opis && <p className="text-neutral-400 text-sm mb-2">{c.Opis}</p>}
                  {c.Rozwiązanie && <p className="text-neutral-300 text-sm whitespace-pre-line">{c.Rozwiązanie}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'usterki' && (
          <div>
            <h2 className="text-xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>USTERKI ({filteredIssues.length})</h2>
            <div className="space-y-3">
              {filteredIssues.map((i, idx) => (
                <div key={idx} className="bg-neutral-950 border border-white/10 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{i.Nazwa}</h3>
                    <span className="text-xs bg-white/10 px-2 py-0.5 text-neutral-400">{i.Model}</span>
                  </div>
                  {i.Objawy && <p className="text-neutral-400 text-sm mb-2"><span className="text-amber-400">Objawy:</span> {i.Objawy}</p>}
                  {i.Rozwiązanie && <p className="text-neutral-300 text-sm whitespace-pre-line">{i.Rozwiązanie}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'diy' && (
          <div>
            <h2 className="text-xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>PORADNIKI DIY ({filteredTips.length})</h2>
            <div className="space-y-4">
              {filteredTips.map((t, idx) => {
                const tipImg = getTipImage(t.Nazwa);
                return (
                  <div key={idx} className="bg-neutral-950 border border-white/10 overflow-hidden">
                    {tipImg && <img src={tipImg} alt="diagram" className="w-full max-h-64 object-contain bg-white cursor-pointer" onClick={() => setLightbox(tipImg)} />}
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{t.Nazwa}</h3>
                      <p className="text-neutral-300 text-sm whitespace-pre-line">{t.Rozwiązanie}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'schematy' && (
          <div>
            <h2 className="text-xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>SCHEMATY ELEKTRYCZNE</h2>
            <div className="bg-neutral-950 border border-white/10 p-6 text-center">
              <p className="text-neutral-400 mb-4">Sekcja w budowie. Wkrótce: pinouty, punkty masy, schematy układów.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
                {['Zegary', 'Zapłon', 'ECM/PCM', 'Oświetlenie', 'Zasilanie', 'Audio'].map(s => (
                  <div key={s} className="bg-white/5 p-3 border border-white/10">
                    <span className="text-neutral-300">{s}</span>
                    <span className="text-xs text-neutral-600 block">Wkrótce</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'vin' && (
          <div>
            <h2 className="text-xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>DEKODER VIN / RPO</h2>
            <div className="bg-neutral-950 border border-white/10 p-6">
              <p className="text-neutral-400 mb-4">Podstawowy dekoder VIN dostępny w poradach. Pełny dekoder RPO w budowie.</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-amber-400">VIN pozycja 8:</span> Silnik (Z=4.3, K=5.7, N=7.4, F=6.5D)</p>
                <p><span className="text-amber-400">VIN pozycja 10:</span> Rok (S=1995, T=1996, V=1997...)</p>
                <p className="text-neutral-500 mt-4">Pełny dekoder RPO wymaga naklejki ze schowka.</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'czesci' && (
          <div>
            <h2 className="text-xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>BAZA CZĘŚCI</h2>
            <div className="bg-neutral-950 border border-white/10 p-6 text-center">
              <p className="text-neutral-400">Sekcja w budowie. Wkrótce: numery OEM, zamienniki, kompatybilność.</p>
            </div>
          </div>
        )}

        {tab === 'specyfikacje' && (
          <div>
            <h2 className="text-xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>SPECYFIKACJE</h2>
            <div className="bg-neutral-950 border border-white/10 p-4">
              {filteredTips.filter(t => t.Nazwa.toLowerCase().includes('specyfikacj') || t.Nazwa.toLowerCase().includes('pojemności') || t.Nazwa.toLowerCase().includes('silnik')).map((t, idx) => (
                <div key={idx} className="mb-4 pb-4 border-b border-white/10 last:border-0">
                  <h3 className="font-semibold mb-2">{t.Nazwa}</h3>
                  <p className="text-neutral-300 text-sm whitespace-pre-line">{t.Rozwiązanie}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'serwis' && (
          <div>
            <h2 className="text-xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>HARMONOGRAM SERWISOWY</h2>
            <div className="bg-neutral-950 border border-white/10 p-4">
              {filteredTips.filter(t => t.Nazwa.toLowerCase().includes('harmonogram') || t.Nazwa.toLowerCase().includes('serwis') || t.Nazwa.toLowerCase().includes('wymiana')).map((t, idx) => (
                <div key={idx} className="mb-4 pb-4 border-b border-white/10 last:border-0">
                  <h3 className="font-semibold mb-2">{t.Nazwa}</h3>
                  <p className="text-neutral-300 text-sm whitespace-pre-line">{t.Rozwiązanie}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'kupujacy' && (
          <div>
            <h2 className="text-xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>PORADNIK KUPUJĄCEGO</h2>
            <div className="bg-neutral-950 border border-white/10 p-4">
              {filteredTips.filter(t => t.Nazwa.toLowerCase().includes('kupuj') || t.Nazwa.toLowerCase().includes('checklist')).map((t, idx) => (
                <div key={idx}>
                  <h3 className="font-semibold mb-2">{t.Nazwa}</h3>
                  <p className="text-neutral-300 text-sm whitespace-pre-line">{t.Rozwiązanie}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'tuning' && (
          <div>
            <h2 className="text-xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>TUNING I MODYFIKACJE</h2>
            <div className="bg-neutral-950 border border-white/10 p-6 text-center">
              <p className="text-neutral-400">Sekcja w budowie. Wkrótce: modyfikacje silnika, zawieszenia, off-road.</p>
            </div>
          </div>
        )}

        {tab === 'import' && (
          <div>
            <h2 className="text-xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>IMPORT DO POLSKI</h2>
            <div className="bg-neutral-950 border border-white/10 p-4">
              {filteredTips.filter(t => t.Nazwa.toLowerCase().includes('import') || t.Nazwa.toLowerCase().includes('polski')).map((t, idx) => (
                <div key={idx}>
                  <h3 className="font-semibold mb-2">{t.Nazwa}</h3>
                  <p className="text-neutral-300 text-sm whitespace-pre-line">{t.Rozwiązanie}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'historia' && (
          <div>
            <h2 className="text-xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>HISTORIA GMT400</h2>
            <div className="bg-neutral-950 border border-white/10 p-6">
              <p className="text-neutral-300 mb-4">Platforma GMT400 była produkowana w latach 1988–2000 (niektóre modele do 2002).</p>
              <div className="space-y-2 text-sm text-neutral-400">
                <p><span className="text-amber-400">1988:</span> Debiut C/K 1500/2500/3500</p>
                <p><span className="text-amber-400">1992:</span> Suburban na platformie GMT400</p>
                <p><span className="text-amber-400">1995:</span> Debiut Tahoe i Yukon</p>
                <p><span className="text-amber-400">1996:</span> Wprowadzenie silników Vortec</p>
                <p><span className="text-amber-400">1999:</span> Ostatni rok Tahoe 2-drzwi</p>
                <p><span className="text-amber-400">2000:</span> Koniec produkcji (Suburban do 2002 w niektórych rynkach)</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="font-bold tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>GMT<span className="text-amber-400">400</span></div>
          <div className="text-neutral-500 text-xs">gmt400.pl</div>
        </div>
      </footer>
    </div>
  );
}
