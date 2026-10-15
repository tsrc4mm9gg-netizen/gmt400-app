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
  { id: 'modele', label: 'Modele' },
  { id: 'kody', label: 'Kody OBD' },
  { id: 'usterki', label: 'Usterki' },
  { id: 'diy', label: 'DIY' },
  { id: 'schematy', label: 'Schematy' },
  { id: 'vin', label: 'VIN/RPO' },
  { id: 'czesci', label: 'Części' },
  { id: 'specyfikacje', label: 'Specyfikacje' },
  { id: 'serwis', label: 'Serwis' },
  { id: 'kupujacy', label: 'Kupujący' },
  { id: 'tuning', label: 'Tuning' },
  { id: 'import', label: 'Import' },
  { id: 'historia', label: 'Historia' },
];

function getModelImage(nazwa: string): string | null {
  const n = nazwa.toLowerCase();
  // Tahoe
  if (n.includes('tahoe') && (n.includes('2-drzwi') || n.includes('2 drzwi'))) return '/tahoe-2d-red.jpg';
  if (n.includes('tahoe') && (n.includes('4-drzwi') || n.includes('4 drzwi'))) return '/tahoe-4d-green.jpg';
  if (n.includes('tahoe')) return '/tahoe-4d-green.jpg';
  // Suburban
  if (n.includes('suburban')) return '/suburban-beige.jpg';
  // Sierra / GMC
  if (n.includes('sierra')) return '/sierra-burgundy.jpg';
  // Yukon
  if (n.includes('yukon')) return '/yukon-white.jpg';
  // C/K pickups
  if (n.includes('3500') && (n.includes('dually') || n.includes('dual'))) return '/ck-3500-dually.jpg';
  if (n.includes('k1500') || (n.includes('4x4') && !n.includes('tahoe'))) return '/k1500-black.jpg';
  if (n.includes('extended')) return '/k1500-black.jpg';
  if (n.includes('regular cab') || n.includes('c/k') || n.includes('1500') || n.includes('2500') || n.includes('3500')) return '/ck-1500-blue.jpg';
  return '/tahoe-4d-green.jpg';
}

function getTipImage(nazwa: string): string | null {
  const n = nazwa.toLowerCase();
  if (n.includes('4l60e') || n.includes('skrzyni') || n.includes('atf') || n.includes('miska')) return '/diy-4l60e-pan-pl.jpg';
  if (n.includes('kolektor') || n.includes('uszczelk') || n.includes('intake')) return '/diy-intake-pl.jpg';
  if (n.includes('np231') || n.includes('4x4') || n.includes('rozdzielcz')) return '/diy-np231-pl.jpg';
  if (n.includes('hamulc') || n.includes('przewod')) return '/diy-brakes-pl.jpg';
  if (n.includes('chłodz') || n.includes('płyn chłod') || n.includes('termostat')) return '/diy-cooling-pl.jpg';
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
  const [issueYear, setIssueYear] = useState('');
  const [issueModel, setIssueModel] = useState('');
  const [issueQuery, setIssueQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');

  useEffect(() => {
    fetch('/api/notion')
      .then(r => r.json())
      .then(data => {
        setItems(data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Swipe from left edge to go back
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    const threshold = 80;
    const edgeZone = 40;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = Math.abs(endY - startY);

      // Swipe right from left edge
      if (startX < edgeZone && deltaX > threshold && deltaY < 100) {
        // Close lightbox first
        if (lightbox) {
          setLightbox(null);
          return;
        }
        // Close menu
        if (menuOpen) {
          setMenuOpen(false);
          return;
        }
        // Go back to all models
        if (selectedModel !== 'Wszystkie') {
          setSelectedModel('Wszystkie');
          setSelectedModelItem(null);
          return;
        }
        // Go back to modele tab
        if (tab !== 'modele') {
          setTab('modele');
          return;
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [lightbox, menuOpen, selectedModel, tab]);

  const models = useMemo(() => items.filter(i => i.Typ === 'Model'), [items]);
  const issues = useMemo(() => items.filter(i => i.Typ === 'Usterka'), [items]);
  const codes = useMemo(() => items.filter(i => i.Typ === 'Kod błędu'), [items]);
  const tips = useMemo(() => items.filter(i => i.Typ === 'Porada'), [items]);

  const uniqueModels = ['Wszystkie', ...Array.from(new Set(models.map(m => m.Model).filter(Boolean)))];
  const years = ['1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000'];

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
    let result = issues;
    if (issueModel) result = result.filter(i => i.Model === issueModel || i.Model === 'Wszystkie');
    if (selectedModel !== 'Wszystkie' && !issueModel) result = result.filter(i => i.Model === selectedModel || i.Model === 'Wszystkie');
    return result.filter(i => i.Nazwa.toLowerCase().includes(query.toLowerCase()) || (i.Objawy || '').toLowerCase().includes(query.toLowerCase()) || (i.Rozwiązanie || '').toLowerCase().includes(query.toLowerCase()));
  }, [issues, query, selectedModel, issueModel]);

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
          <div className="bg-black border-t border-white/10 px-4 py-4">
            <input
              type="search"
              placeholder="Szukaj..."
              className="sm:hidden w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm mb-4 focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setTab(cat.id); setMenuOpen(false); }}
                  className={`px-4 py-3 text-sm font-medium rounded transition ${
                    tab === cat.id ? 'bg-amber-400 text-black' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <section className="relative min-h-[40vh] flex items-center pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
        <img 
          src={selectedModelItem ? (getModelImage(selectedModelItem.Nazwa) || '/tahoe-4d.jpg') : '/tahoe-4d.jpg'} 
          alt="GMT400" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 py-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-px bg-amber-400" />
              <span className="text-amber-400 text-xs tracking-widest uppercase">
                {selectedModel === 'Wszystkie' ? '1988–2000' : selectedModel}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-none mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {selectedModelItem ? selectedModelItem.Nazwa : 'ENCYKLOPEDIA GMT400'}
            </h1>
          </div>
        </div>
      </section>

      {selectedModel !== 'Wszystkie' && (
        <div className="bg-neutral-900 border-y border-white/5 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button onClick={() => setTab('modele')} className={`p-4 text-center transition ${
                tab === 'modele' ? 'bg-amber-400 text-black' : 'bg-neutral-800 hover:bg-neutral-700'
              }`}>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{filteredModels.length}</div>
                <div className="text-xs uppercase mt-1">Modele</div>
              </button>
              <button onClick={() => setTab('usterki')} className={`p-4 text-center transition ${
                tab === 'usterki' ? 'bg-amber-400 text-black' : 'bg-neutral-800 hover:bg-neutral-700'
              }`}>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{filteredIssues.length}</div>
                <div className="text-xs uppercase mt-1">Usterki</div>
              </button>
              <button onClick={() => setTab('kody')} className={`p-4 text-center transition ${
                tab === 'kody' ? 'bg-amber-400 text-black' : 'bg-neutral-800 hover:bg-neutral-700'
              }`}>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{filteredCodes.length}</div>
                <div className="text-xs uppercase mt-1">Kody</div>
              </button>
              <button onClick={() => setTab('diy')} className={`p-4 text-center transition ${
                tab === 'diy' ? 'bg-amber-400 text-black' : 'bg-neutral-800 hover:bg-neutral-700'
              }`}>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{filteredTips.length}</div>
                <div className="text-xs uppercase mt-1">Porady</div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-neutral-950 border-y border-white/5 py-3">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto">
          {uniqueModels.map(m => (
            <button
              key={m}
              onClick={() => selectModel(m)}
              className={`px-4 py-2 text-sm whitespace-nowrap transition ${
                selectedModel === m ? 'bg-amber-400 text-black' : 'bg-white/5 text-neutral-400 hover:bg-white/10'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-neutral-900 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setTab(cat.id)}
                className={`px-3 py-3 text-sm font-medium text-center transition ${
                  tab === cat.id ? 'bg-amber-400 text-black' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div id="content" className="max-w-7xl mx-auto px-4 py-8">
        
        {selectedModel !== 'Wszystkie' && (
          <div className="mb-6 flex items-center justify-between bg-amber-400/10 border border-amber-400/30 p-3">
            <span className="text-amber-400">Filtr: <strong>{selectedModel}</strong></span>
            <button onClick={() => selectModel('Wszystkie')} className="text-sm text-neutral-400 hover:text-white">Wyczyść ×</button>
          </div>
        )}

        {tab === 'modele' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>MODELE ({filteredModels.length})</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModels.map((m, idx) => {
                const img = getModelImage(m.Nazwa);
                return (
                  <div key={idx} className="bg-neutral-950 border border-white/10 overflow-hidden hover:border-amber-400/50 transition">
                    {img && <img src={img} alt={m.Nazwa} className="w-full h-44 object-cover cursor-pointer" onClick={() => selectModel(m.Model, m)} />}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{m.Nazwa}</h3>
                      <p className="text-amber-400 text-sm mb-2">{m.Lata} • {m.Model}</p>
                      <p className={`text-neutral-400 text-sm leading-relaxed whitespace-pre-line ${expanded === idx ? '' : 'line-clamp-6'}`}>{m.Opis}</p>
                      <div className="flex gap-3 mt-3">
                        <button onClick={() => setExpanded(expanded === idx ? null : idx)} className="text-amber-400 text-sm">
                          {expanded === idx ? 'Zwiń' : 'Czytaj więcej'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'kody' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>KODY OBD ({filteredCodes.length})</h2>
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
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>USTERKI</h2>
            
            <div className="bg-neutral-950 border border-white/10 p-4 mb-6">
              <input 
                type="text" 
                placeholder="Szukaj usterki (np. wyciek, 4L60E, kolektor)..." 
                value={issueQuery}
                onChange={(e) => setIssueQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-amber-400 mb-4"
              />
              <p className="text-neutral-400 text-sm mb-4">Lub filtruj po modelu i roczniku:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-500 block mb-2">MODEL</label>
                  <select 
                    value={issueModel} 
                    onChange={(e) => setIssueModel(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="">Wszystkie modele</option>
                    {uniqueModels.filter(m => m !== 'Wszystkie').map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-2">ROCZNIK</label>
                  <select 
                    value={issueYear} 
                    onChange={(e) => setIssueYear(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="">Wszystkie roczniki</option>
                    {years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {(issueModel || issueYear || issueQuery || selectedModel !== 'Wszystkie') && (
              <div className="space-y-3">
                <p className="text-neutral-500 text-sm mb-4">Znaleziono: {filteredIssues.filter(i => !issueQuery || i.Nazwa.toLowerCase().includes(issueQuery.toLowerCase()) || (i.Objawy && i.Objawy.toLowerCase().includes(issueQuery.toLowerCase())) || (i.Rozwiązanie && i.Rozwiązanie.toLowerCase().includes(issueQuery.toLowerCase()))).length} usterek</p>
                {filteredIssues.filter(i => !issueQuery || i.Nazwa.toLowerCase().includes(issueQuery.toLowerCase()) || (i.Objawy && i.Objawy.toLowerCase().includes(issueQuery.toLowerCase())) || (i.Rozwiązanie && i.Rozwiązanie.toLowerCase().includes(issueQuery.toLowerCase()))).map((i, idx) => {
                  const issueImg = i.Nazwa.toLowerCase().includes('kolektor') ? '/issue-intake.jpg' : i.Nazwa.toLowerCase().includes('4l60') ? '/issue-4l60e.jpg' : null;
                  return (
                    <div key={idx} className="bg-neutral-950 border border-white/10 overflow-hidden">
                      {issueImg && <img src={issueImg} alt="schemat" className="w-full max-h-48 object-contain bg-white cursor-pointer" onClick={() => setLightbox(issueImg)} />}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{i.Nazwa}</h3>
                          <span className="text-xs bg-white/10 px-2 py-0.5 text-neutral-400">{i.Model}</span>
                        </div>
                        {i.Objawy && <p className="text-neutral-400 text-sm mb-2"><span className="text-amber-400">Objawy:</span> {i.Objawy}</p>}
                        {i.Rozwiązanie && <p className="text-neutral-300 text-sm whitespace-pre-line">{i.Rozwiązanie}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!issueModel && !issueYear && !issueQuery && selectedModel === 'Wszystkie' && (
              <div className="text-center py-8">
                <p className="text-neutral-500 mb-4">Wpisz słowo kluczowe lub wybierz model aby zobaczyć usterki.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  {['wyciek', '4L60E', 'kolektor', 'hamulce', '4x4', 'pompa'].map(k => (
                    <button key={k} onClick={() => setIssueQuery(k)} className="bg-neutral-800 hover:bg-neutral-700 px-3 py-2">{k}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'diy' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>PORADNIKI DIY ({filteredTips.length})</h2>
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
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>SCHEMATY ELEKTRYCZNE</h2>
            <div className="bg-neutral-950 border border-white/10 p-4">
              {filteredTips.filter(t => t.Nazwa.toLowerCase().includes('punkt') || t.Nazwa.toLowerCase().includes('masa') || t.Nazwa.toLowerCase().includes('schemat')).map((t, idx) => (
                <div key={idx} className="mb-4 pb-4 border-b border-white/10 last:border-0">
                  <h3 className="font-semibold mb-2">{t.Nazwa}</h3>
                  <p className="text-neutral-300 text-sm whitespace-pre-line">{t.Rozwiązanie}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'vin' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>DEKODER VIN / RPO</h2>
            <div className="bg-neutral-950 border border-white/10 p-4">
              {filteredTips.filter(t => t.Nazwa.toLowerCase().includes('vin') || t.Nazwa.toLowerCase().includes('rpo')).map((t, idx) => (
                <div key={idx} className="mb-4 pb-4 border-b border-white/10 last:border-0">
                  <h3 className="font-semibold mb-2">{t.Nazwa}</h3>
                  <p className="text-neutral-300 text-sm whitespace-pre-line">{t.Rozwiązanie}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'czesci' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>BAZA CZĘŚCI</h2>
            <div className="bg-neutral-950 border border-white/10 p-4">
              {filteredTips.filter(t => t.Nazwa.toLowerCase().includes('części') || t.Nazwa.toLowerCase().includes('numer') || t.Nazwa.toLowerCase().includes('filtr')).map((t, idx) => (
                <div key={idx} className="mb-4 pb-4 border-b border-white/10 last:border-0">
                  <h3 className="font-semibold mb-2">{t.Nazwa}</h3>
                  <p className="text-neutral-300 text-sm whitespace-pre-line">{t.Rozwiązanie}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'specyfikacje' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>SPECYFIKACJE SILNIKÓW</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                { id: '43', name: '4.3L V6', img: '/engine-43.jpg', power: '160–200 KM' },
                { id: '50', name: '5.0L V8', img: '/engine-43.jpg', power: '175–230 KM' },
                { id: '57tbi', name: '5.7L TBI', img: '/engine-vortec.jpg', power: '210 KM' },
                { id: '57vortec', name: '5.7L Vortec', img: '/engine-vortec.jpg', power: '255 KM' },
                { id: '74', name: '7.4L V8', img: '/engine-vortec.jpg', power: '230–290 KM' },
                { id: '65d', name: '6.5L Diesel', img: '/engine-diesel.jpg', power: '180–215 KM' },
              ].map(e => (
                <button key={e.id} onClick={() => setSelectedEngine(selectedEngine === e.id ? '' : e.id)}
                  className={`p-3 text-center transition ${selectedEngine === e.id ? 'bg-amber-400 text-black' : 'bg-neutral-900 hover:bg-neutral-800'}`}>
                  <img src={e.img} alt={e.name} className="w-full h-20 object-contain mb-2" />
                  <div className="font-semibold text-sm">{e.name}</div>
                  <div className="text-xs opacity-70">{e.power}</div>
                </button>
              ))}
            </div>

            {selectedEngine === '57vortec' && (
              <div className="bg-neutral-950 border border-white/10 p-4 mb-6">
                <img src="/engine-vortec.jpg" alt="5.7L Vortec" className="w-full max-h-48 object-contain mb-4" />
                <h3 className="text-xl font-bold text-amber-400 mb-3">5.7L Vortec V8 (L31)</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-neutral-500">Moc:</span> <span className="text-white">255 KM @ 4600 rpm</span></div>
                  <div><span className="text-neutral-500">Moment:</span> <span className="text-white">330 Nm @ 2800 rpm</span></div>
                  <div><span className="text-neutral-500">Lata:</span> <span className="text-white">1996–2000</span></div>
                  <div><span className="text-neutral-500">Kod:</span> <span className="text-white">L31</span></div>
                  <div><span className="text-neutral-500">Wtrysk:</span> <span className="text-white">Sekwencyjny (SFI)</span></div>
                  <div><span className="text-neutral-500">Kompresja:</span> <span className="text-white">9.4:1</span></div>
                </div>
                <div className="mt-4 text-neutral-300 text-sm">
                  <p className="mb-2"><strong>Cechy:</strong> Najpopularniejszy silnik GMT400. Wprowadzony w 1996 jako zamiennik TBI.</p>
                  <p className="mb-2"><strong>Filtr oleju:</strong> AC Delco PF1218</p>
                  <p className="mb-2"><strong>Świece:</strong> AC Delco 41-932 (gap 1.5mm)</p>
                  <p><strong>Olej:</strong> 4.7 L, 5W-30 lub 10W-30</p>
                </div>
              </div>
            )}

            {selectedEngine === '65d' && (
              <div className="bg-neutral-950 border border-white/10 p-4 mb-6">
                <img src="/engine-diesel.jpg" alt="6.5L Diesel" className="w-full max-h-48 object-contain mb-4" />
                <h3 className="text-xl font-bold text-amber-400 mb-3">6.5L Turbodiesel</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-neutral-500">Moc:</span> <span className="text-white">180–215 KM</span></div>
                  <div><span className="text-neutral-500">Moment:</span> <span className="text-white">360–440 Nm</span></div>
                  <div><span className="text-neutral-500">Lata:</span> <span className="text-white">1992–2000</span></div>
                  <div><span className="text-neutral-500">Typ:</span> <span className="text-white">Turbodiesel</span></div>
                </div>
                <div className="mt-4 text-neutral-300 text-sm">
                  <p className="mb-2"><strong>Cechy:</strong> Jedyny diesel w GMT400. Popularny do holowania.</p>
                  <p className="mb-2"><strong>Problemy:</strong> Pompa wtryskowa, głowice (pękanie)</p>
                  <p><strong>Olej:</strong> 6.6 L, 15W-40 diesel</p>
                </div>
              </div>
            )}

            {selectedEngine === '43' && (
              <div className="bg-neutral-950 border border-white/10 p-4 mb-6">
                <img src="/engine-43.jpg" alt="4.3L V6" className="w-full max-h-48 object-contain mb-4" />
                <h3 className="text-xl font-bold text-amber-400 mb-3">4.3L V6</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-neutral-500">Moc:</span> <span className="text-white">160–200 KM</span></div>
                  <div><span className="text-neutral-500">Moment:</span> <span className="text-white">230–260 Nm</span></div>
                  <div><span className="text-neutral-500">Lata:</span> <span className="text-white">1988–2000</span></div>
                  <div><span className="text-neutral-500">Typ:</span> <span className="text-white">V6 TBI/CPI</span></div>
                </div>
                <div className="mt-4 text-neutral-300 text-sm">
                  <p className="mb-2"><strong>Cechy:</strong> Podstawowy silnik. Ekonomiczny, ale słabszy.</p>
                  <p><strong>Olej:</strong> 4.3 L, 5W-30</p>
                </div>
              </div>
            )}

            {!selectedEngine && (
              <p className="text-neutral-500 text-center py-4">Wybierz silnik powyżej aby zobaczyć szczegóły.</p>
            )}

            <img src="/spec-fluids-map.jpg" alt="Lokalizacje płynów" className="w-full mb-6 cursor-pointer" onClick={() => setLightbox('/spec-fluids-map.jpg')} />

            <div className="bg-neutral-950 border border-white/10 p-4 mb-6">
              <h3 className="font-semibold text-amber-400 mb-4">Płyny eksploatacyjne — interwały</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-amber-400">
                      <th className="p-2 text-left">Płyn</th>
                      <th className="p-2 text-left">Specyfikacja</th>
                      <th className="p-2 text-left">Pojemność</th>
                      <th className="p-2 text-left">Interwał</th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-300">
                    <tr className="border-b border-white/5"><td className="p-2">Olej silnikowy</td><td className="p-2">5W-30 / 10W-30</td><td className="p-2">4.3–6.6 L</td><td className="p-2">5–8 tys. km</td></tr>
                    <tr className="border-b border-white/5"><td className="p-2">ATF 4L60E</td><td className="p-2">Dexron VI</td><td className="p-2">5.0 L</td><td className="p-2">50 tys. km</td></tr>
                    <tr className="border-b border-white/5"><td className="p-2">Płyn chłodzący</td><td className="p-2">Dex-Cool</td><td className="p-2">15 L</td><td className="p-2">5 lat / 150 tys.</td></tr>
                    <tr className="border-b border-white/5"><td className="p-2">Płyn hamulcowy</td><td className="p-2">DOT 3</td><td className="p-2">0.5 L</td><td className="p-2">2 lata</td></tr>
                    <tr className="border-b border-white/5"><td className="p-2">Olej dyferencjału</td><td className="p-2">75W-90 GL-5</td><td className="p-2">2.0 L</td><td className="p-2">50 tys. km</td></tr>
                    <tr><td className="p-2">Olej NP231</td><td className="p-2">ATF Dexron</td><td className="p-2">1.2 L</td><td className="p-2">50 tys. km</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-neutral-950 border border-white/10 p-4 mt-6">
              <h3 className="font-semibold text-amber-400 mb-3">Numery OEM — filtry</h3>
              <div className="text-sm text-neutral-300 space-y-2">
                <div className="flex justify-between"><span>Filtr oleju 5.7L</span><span className="text-amber-400">AC Delco PF1218</span></div>
                <div className="flex justify-between"><span>Filtr powietrza</span><span className="text-amber-400">AC Delco A1163C</span></div>
                <div className="flex justify-between"><span>Filtr ATF 4L60E</span><span className="text-amber-400">AC Delco TF289</span></div>
                <div className="flex justify-between"><span>Filtr paliwa</span><span className="text-amber-400">AC Delco GF626</span></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'serwis' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>HARMONOGRAM SERWISOWY</h2>
            <div className="bg-neutral-950 border border-white/10 p-4">
              {filteredTips.filter(t => t.Nazwa.toLowerCase().includes('harmonogram') || t.Nazwa.toLowerCase().includes('serwis') || t.Nazwa.toLowerCase().includes('wymiana') || t.Nazwa.toLowerCase().includes('chłodz')).map((t, idx) => (
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
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>PORADNIK KUPUJĄCEGO</h2>
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
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>TUNING I MODYFIKACJE</h2>
            <div className="bg-neutral-950 border border-white/10 p-6 text-center">
              <p className="text-neutral-400">Sekcja w budowie.</p>
            </div>
          </div>
        )}

        {tab === 'import' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>IMPORT DO POLSKI</h2>
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
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>HISTORIA GMT400</h2>
            <div className="bg-neutral-950 border border-white/10 p-6">
              <p className="text-neutral-300 mb-4">Platforma GMT400 była produkowana w latach 1988–2000.</p>
              <div className="space-y-2 text-sm text-neutral-400">
                <p><span className="text-amber-400">1988:</span> Debiut C/K 1500/2500/3500</p>
                <p><span className="text-amber-400">1992:</span> Suburban na platformie GMT400</p>
                <p><span className="text-amber-400">1995:</span> Debiut Tahoe i Yukon</p>
                <p><span className="text-amber-400">1996:</span> Wprowadzenie silników Vortec</p>
                <p><span className="text-amber-400">1999:</span> Ostatni rok Tahoe 2-drzwi</p>
                <p><span className="text-amber-400">2000:</span> Koniec produkcji</p>
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
// cache bust 1792074178
