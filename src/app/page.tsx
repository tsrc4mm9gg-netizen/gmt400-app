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
  if (n.includes('chłodz') || n.includes('termostat') || n.includes('pompa wody')) return '/diy-cooling-sys.jpg';
  if (n.includes('paliw') || n.includes('pompa paliwa') || n.includes('filtr paliwa')) return '/diy-fuel.jpg';
  if (n.includes('masa') || n.includes('punkt') || n.includes('uziemien')) return '/diy-grounds.jpg';
  if (n.includes('obd') || n.includes('kod') || n.includes('diagnost')) return '/diy-obd.jpg';
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
  const [codeQuery, setCodeQuery] = useState('');
  const [diyQuery, setDiyQuery] = useState('');
  const [schemaQuery, setSchemaQuery] = useState('');
  const [vinInput, setVinInput] = useState('');
  const [vinResult, setVinResult] = useState<Record<string, string> | null>(null);
  const [partsFilter, setPartsFilter] = useState('wszystkie');
  const [partsQuery, setPartsQuery] = useState('');
  const [tuningFilter, setTuningFilter] = useState('wszystkie');
  const [tuningQuery, setTuningQuery] = useState('');
  const [importPrice, setImportPrice] = useState(30000);
  const [importEngine, setImportEngine] = useState('v8');
  const [importSource, setImportSource] = useState('copart');
  const [importTransport, setImportTransport] = useState('roro');
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
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>KODY OBD</h2>
            <input 
              type="text" 
              placeholder="Szukaj kodu (np. P0171, P0300, 12)..." 
              value={codeQuery}
              onChange={(e) => setCodeQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-amber-400 mb-4"
            />
            <p className="text-neutral-500 text-sm mb-4">Znaleziono: {filteredCodes.filter(c => !codeQuery || c.Nazwa.toLowerCase().includes(codeQuery.toLowerCase()) || (c.Opis && c.Opis.toLowerCase().includes(codeQuery.toLowerCase()))).length}</p>
            <div className="space-y-3">
              {filteredCodes.filter(c => !codeQuery || c.Nazwa.toLowerCase().includes(codeQuery.toLowerCase()) || (c.Opis && c.Opis.toLowerCase().includes(codeQuery.toLowerCase()))).map((c, idx) => (
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
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>PORADNIKI DIY</h2>
            <input 
              type="text" 
              placeholder="Szukaj porady (np. 4L60E, filtr, kolektor)..." 
              value={diyQuery}
              onChange={(e) => setDiyQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-amber-400 mb-4"
            />
            <p className="text-neutral-500 text-sm mb-4">Znaleziono: {filteredTips.filter(t => !diyQuery || t.Nazwa.toLowerCase().includes(diyQuery.toLowerCase()) || (t.Rozwiązanie && t.Rozwiązanie.toLowerCase().includes(diyQuery.toLowerCase()))).length}</p>
            <div className="space-y-4">
              {filteredTips.filter(t => !diyQuery || t.Nazwa.toLowerCase().includes(diyQuery.toLowerCase()) || (t.Rozwiązanie && t.Rozwiązanie.toLowerCase().includes(diyQuery.toLowerCase()))).map((t, idx) => {
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
            <input 
              type="text" 
              placeholder="Szukaj schematu (np. masa, punkt, zegary)..." 
              value={schemaQuery}
              onChange={(e) => setSchemaQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-amber-400 mb-4"
            />
            <div className="bg-neutral-950 border border-white/10 p-4">
              {filteredTips.filter(t => (t.Nazwa.toLowerCase().includes('punkt') || t.Nazwa.toLowerCase().includes('masa') || t.Nazwa.toLowerCase().includes('schemat')) && (!schemaQuery || t.Nazwa.toLowerCase().includes(schemaQuery.toLowerCase()) || (t.Rozwiązanie && t.Rozwiązanie.toLowerCase().includes(schemaQuery.toLowerCase())))).map((t, idx) => (
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
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>DEKODER VIN</h2>
            <div className="bg-neutral-950 border border-white/10 p-4 mb-6">
              <input 
                type="text" 
                placeholder="Wpisz 17-znakowy VIN..." 
                value={vinInput}
                onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                maxLength={17}
                className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-lg font-mono tracking-wider focus:outline-none focus:border-amber-400 mb-4"
              />
              <button 
                onClick={() => {
                  if (vinInput.length === 17) {
                    const yearCodes: Record<string, string> = { 'J': '1988', 'K': '1989', 'L': '1990', 'M': '1991', 'N': '1992', 'P': '1993', 'R': '1994', 'S': '1995', 'T': '1996', 'V': '1997', 'W': '1998', 'X': '1999', 'Y': '2000' };
                    const engineCodes: Record<string, string> = { 'Z': '4.3L V6 TBI', 'H': '5.0L V8 TBI', 'K': '5.7L V8 TBI', 'R': '5.7L Vortec V8', 'N': '7.4L V8', 'F': '6.5L Diesel', 'S': '6.5L Turbodiesel', 'C': '4.3L V6 CPI', 'W': '4.3L V6 Vortec' };
                    const plantCodes: Record<string, string> = { '1': 'Oshawa, Kanada', 'Z': 'Fort Wayne, Indiana', 'E': 'Pontiac, Michigan', 'J': 'Janesville, Wisconsin', 'G': 'Flint, Michigan' };
                    const modelCodes: Record<string, string> = { 'C': 'C/K 1500', 'K': 'K1500 4x4', 'V': 'C/K 2500', 'R': 'C/K 3500', 'S': 'Suburban', 'T': 'Tahoe' };
                    const engCode = vinInput[7];
                    const year = yearCodes[vinInput[9]] || 'Nieznany';
                    const engineSpecs: Record<string, {moc: string, moment: string, olej: string, filtr: string}> = {
                      'Z': {moc: '160-200 KM', moment: '230-260 Nm', olej: '4.3 L 5W-30', filtr: 'PF47'},
                      'H': {moc: '175-190 KM', moment: '270 Nm', olej: '4.7 L 5W-30', filtr: 'PF1218'},
                      'K': {moc: '210 KM', moment: '300 Nm', olej: '4.7 L 5W-30', filtr: 'PF1218'},
                      'R': {moc: '255 KM', moment: '330 Nm', olej: '4.7 L 5W-30', filtr: 'PF1218'},
                      'N': {moc: '230-290 KM', moment: '385-410 Nm', olej: '5.7 L 10W-30', filtr: 'PF1218'},
                      'F': {moc: '180 KM', moment: '360 Nm', olej: '6.6 L 15W-40', filtr: 'PF1218'},
                      'S': {moc: '215 KM', moment: '440 Nm', olej: '6.6 L 15W-40', filtr: 'PF1218'},
                      'C': {moc: '200 KM', moment: '260 Nm', olej: '4.3 L 5W-30', filtr: 'PF47'},
                      'W': {moc: '200 KM', moment: '260 Nm', olej: '4.3 L 5W-30', filtr: 'PF47'},
                    };
                    const spec = engineSpecs[engCode] || {moc: '?', moment: '?', olej: '?', filtr: '?'};
                    const trans = engCode === 'N' || engCode === 'F' || engCode === 'S' ? '4L80E (wzmocniona)' : '4L60E';
                    const axle = vinInput[4] === 'R' || vinInput[4] === 'V' ? '14-bolt (2500/3500)' : '10-bolt (1500)';
                    const result: Record<string, string> = {
                      'VIN': vinInput,
                      'Kraj': vinInput[0] === '1' ? 'USA' : vinInput[0] === '2' ? 'Kanada' : 'Meksyk',
                      'Producent': vinInput[1] === 'G' ? 'General Motors' : 'Inny',
                      'Rok produkcji': year,
                      'Model': modelCodes[vinInput[4]] || 'Sprawdź RPO',
                      'Silnik': engineCodes[engCode] || 'Nieznany (' + engCode + ')',
                      'Moc': spec.moc,
                      'Moment': spec.moment,
                      'Skrzynia biegów': trans,
                      'Oś tylna': axle,
                      'Olej silnikowy': spec.olej,
                      'Filtr oleju': 'AC Delco ' + spec.filtr,
                      'Fabryka': plantCodes[vinInput[10]] || 'Nieznana',
                      'Numer seryjny': vinInput.slice(11),
                      'ATF': trans.includes('4L80') ? '6.5 L Dexron VI' : '5.0 L Dexron VI',
                      'Płyn chłodzący': '15 L Dex-Cool',
                      'Hamulce': vinInput[4] === 'R' ? 'Tarcze + bębny (HD)' : 'Tarcze przód + bębny tył',
                      'Zawieszenie': vinInput[4] === 'K' ? '4x4 (torsion bars)' : '2WD (sprężyny)',
                      'Paliwo': engCode === 'F' || engCode === 'S' ? 'Diesel' : 'Benzyna 95',
                      'Pojemność zbiornika': '98-114 L',
                      'Opony': vinInput[4] === 'R' ? 'LT245/75R16' : 'P235/75R15',
                      'Masa własna': vinInput[4] === 'R' ? '2400-2800 kg' : '1800-2200 kg',
                      'Ładowność': vinInput[4] === 'R' ? '1500+ kg' : '500-800 kg',
                    };
                    setVinResult(result);
                  }
                }}
                className="w-full bg-amber-400 text-black py-3 font-semibold hover:bg-amber-300 transition"
              >
                DEKODUJ VIN
              </button>
            </div>

            {vinResult && (
              <div className="space-y-4">
              <div className="bg-neutral-950 border border-amber-400/30 p-4">
                <h3 className="text-lg font-bold text-amber-400 mb-4">PODSTAWOWE DANE</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(vinResult).slice(0, 8).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-neutral-500">{key}:</span>
                      <span className="text-white font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-neutral-950 border border-white/10 p-4">
                <h3 className="text-lg font-bold text-amber-400 mb-4">SPECYFIKACJA TECHNICZNA</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(vinResult).slice(8).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-neutral-500">{key}:</span>
                      <span className="text-white font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-950 border border-white/10 p-4">
                <h3 className="text-lg font-bold text-amber-400 mb-4">NUMERY OEM CZĘŚCI</h3>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between"><span className="text-neutral-400">Filtr oleju</span><span className="text-amber-400">AC Delco PF1218</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Filtr powietrza</span><span className="text-amber-400">AC Delco A1163C</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Filtr paliwa</span><span className="text-amber-400">AC Delco GF626</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Filtr ATF</span><span className="text-amber-400">AC Delco TF289</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Świece (5.7L)</span><span className="text-amber-400">AC Delco 41-932</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Termostat</span><span className="text-amber-400">AC Delco 131-113</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Pompa wody</span><span className="text-amber-400">AC Delco 252-611</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Czujnik MAF</span><span className="text-amber-400">AC Delco 213-252</span></div>
                </div>
              </div>

              <div className="bg-neutral-950 border border-white/10 p-4">
                <h3 className="text-lg font-bold text-amber-400 mb-4">POJEMNOŚCI PŁYNÓW</h3>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between"><span className="text-neutral-400">Olej silnikowy</span><span>4.7 L (5W-30)</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">ATF 4L60E</span><span>5.0 L (Dexron VI)</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Płyn chłodzący</span><span>15 L (Dex-Cool)</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Olej dyferencjału</span><span>2.0 L (75W-90)</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Płyn hamulcowy</span><span>0.5 L (DOT 3)</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Olej NP231</span><span>1.2 L (ATF)</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Płyn wspomagania</span><span>1.0 L</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Paliwo</span><span>98-114 L</span></div>
                </div>
              </div>
                <div className="mt-4 p-3 bg-neutral-900 text-sm text-neutral-400">
                  <p className="mb-2"><strong className="text-white">Struktura VIN GMT400:</strong></p>
                  <p>Poz. 1: Kraj | Poz. 2: Producent | Poz. 4-5: Model</p>
                  <p>Poz. 8: Silnik | Poz. 10: Rok | Poz. 11: Fabryka</p>
                  <p>Poz. 12-17: Numer seryjny</p>
                </div>
              </div>
            )}

            {vinResult && (
              <div className="mt-4 bg-neutral-950 border border-white/10 p-4">
                <h3 className="font-semibold text-amber-400 mb-3">Typowe usterki dla tego rocznika</h3>
                <ul className="text-sm text-neutral-300 space-y-2">
                  <li>• Uszczelki kolektora dolotowego (wyciek płynu)</li>
                  <li>• Korozja przewodów hamulcowych</li>
                  <li>• 4L60E — ślizganie 3-4 biegu</li>
                  <li>• Pompa paliwa (w zbiorniku)</li>
                  <li>• Czujnik MAF (kody P0171/P0174)</li>
                  <li>• Punkty masy (korozja)</li>
                </ul>
                <h3 className="font-semibold text-amber-400 mt-4 mb-3">Zalecany serwis</h3>
                <ul className="text-sm text-neutral-300 space-y-2">
                  <li>• Olej silnikowy: co 5-8 tys. km</li>
                  <li>• ATF: co 50 tys. km</li>
                  <li>• Płyn chłodzący: co 5 lat</li>
                  <li>• Płyn hamulcowy: co 2 lata</li>
                  <li>• Świece: co 50 tys. km</li>
                </ul>
              </div>
            )}

            <div className="mt-6 bg-neutral-950 border border-white/10 p-4">
              <h3 className="font-semibold text-amber-400 mb-3">Kody silników GMT400</h3>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between"><span className="text-neutral-400">Z</span><span>4.3L V6 TBI</span></div>
                <div className="flex justify-between"><span className="text-neutral-400">H</span><span>5.0L V8 TBI</span></div>
                <div className="flex justify-between"><span className="text-neutral-400">K</span><span>5.7L V8 TBI</span></div>
                <div className="flex justify-between"><span className="text-neutral-400">R</span><span>5.7L Vortec V8</span></div>
                <div className="flex justify-between"><span className="text-neutral-400">N</span><span>7.4L V8</span></div>
                <div className="flex justify-between"><span className="text-neutral-400">F/S</span><span>6.5L Diesel</span></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'czesci' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>BAZA CZĘŚCI OEM</h2>
            
            <input 
              type="text" 
              placeholder="Szukaj części (np. filtr, świece, pompa)..." 
              value={partsQuery}
              onChange={(e) => setPartsQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-amber-400 mb-4"
            />
            
            <div className="flex flex-wrap gap-2 mb-6">
              {['wszystkie', 'filtry', 'silnik', 'skrzynia', 'hamulce', 'zawieszenie'].map(f => (
                <button key={f} onClick={() => setPartsFilter(f)}
                  className={`px-3 py-1 text-sm ${partsFilter === f ? 'bg-amber-400 text-black' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {[
                { kat: 'filtry', nazwa: 'Filtr oleju 5.7L', oem: 'AC Delco PF1218', opis: 'Filtr oleju silnikowego dla 5.0/5.7/7.4L V8', model: 'Wszystkie V8' },
                { kat: 'filtry', nazwa: 'Filtr oleju 4.3L', oem: 'AC Delco PF47', opis: 'Filtr oleju silnikowego dla 4.3L V6', model: 'C/K 1500' },
                { kat: 'filtry', nazwa: 'Filtr powietrza', oem: 'AC Delco A1163C', opis: 'Filtr powietrza silnika', model: 'Wszystkie' },
                { kat: 'filtry', nazwa: 'Filtr paliwa', oem: 'AC Delco GF626', opis: 'Filtr paliwa w linii', model: 'Wszystkie' },
                { kat: 'filtry', nazwa: 'Filtr ATF 4L60E', oem: 'AC Delco TF289', opis: 'Filtr oleju skrzyni biegów', model: 'Wszystkie' },
                { kat: 'silnik', nazwa: 'Świece zapłonowe 5.7L', oem: 'AC Delco 41-932', opis: 'Świece irydowe, gap 1.5mm', model: 'Wszystkie V8' },
                { kat: 'silnik', nazwa: 'Termostat', oem: 'AC Delco 131-113', opis: 'Termostat 195°F (91°C)', model: 'Wszystkie' },
                { kat: 'silnik', nazwa: 'Pompa wody', oem: 'AC Delco 252-611', opis: 'Pompa wody silnika', model: 'Wszystkie V8' },
                { kat: 'silnik', nazwa: 'Czujnik MAF', oem: 'AC Delco 213-252', opis: 'Czujnik przepływu powietrza', model: '1996-2000' },
                { kat: 'silnik', nazwa: 'Czujnik O2', oem: 'AC Delco 213-1555', opis: 'Sonda lambda', model: 'Wszystkie' },
                { kat: 'skrzynia', nazwa: 'Uszczelka miski 4L60E', oem: 'Fel-Pro TOS18722', opis: 'Uszczelka miski oleju skrzyni', model: 'Wszystkie' },
                { kat: 'skrzynia', nazwa: 'Solenoid 4L60E', oem: 'AC Delco 24230298', opis: 'Solenoid zmiany biegów', model: 'Wszystkie' },
                { kat: 'hamulce', nazwa: 'Klocki hamulcowe przód', oem: 'AC Delco 17D473CH', opis: 'Klocki hamulcowe przednie', model: '1500' },
                { kat: 'hamulce', nazwa: 'Tarcze hamulcowe przód', oem: 'AC Delco 18A2491', opis: 'Tarcze hamulcowe przednie', model: '1500' },
                { kat: 'hamulce', nazwa: 'Cylinderki hamulcowe', oem: 'AC Delco 18E660', opis: 'Cylinderki bębnów tylnych', model: '1500' },
                { kat: 'zawieszenie', nazwa: 'Amortyzatory przód', oem: 'AC Delco 504-1079', opis: 'Amortyzatory przednie', model: '1500' },
                { kat: 'zawieszenie', nazwa: 'Amortyzatory tył', oem: 'AC Delco 504-1080', opis: 'Amortyzatory tylne', model: '1500' },
                { kat: 'zawieszenie', nazwa: 'Końcówki drążków', oem: 'AC Delco 45A0526', opis: 'Końcówki drążków kierowniczych', model: 'Wszystkie' },
                { kat: 'silnik', nazwa: 'Uszczelka kolektora', oem: 'Fel-Pro MS98016T', opis: 'Uszczelki kolektora dolotowego', model: '5.7L' },
                { kat: 'silnik', nazwa: 'Pompa paliwa', oem: 'AC Delco EP381', opis: 'Pompa paliwa w zbiorniku', model: 'Wszystkie' },
                { kat: 'silnik', nazwa: 'Cewka zapłonowa', oem: 'AC Delco D577', opis: 'Cewka zapłonowa', model: 'Wszystkie' },
                { kat: 'silnik', nazwa: 'Rozdzielacz', oem: 'AC Delco 1103952', opis: 'Rozdzielacz zapłonu', model: '5.7L' },
                { kat: 'skrzynia', nazwa: 'Czujnik prędkości', oem: 'AC Delco 24203876', opis: 'Czujnik prędkości wyjściowej', model: '4L60E' },
                { kat: 'skrzynia', nazwa: 'Uszczelka konwertera', oem: 'AC Delco 24206182', opis: 'Uszczelka konwertera momentu', model: '4L60E' },
                { kat: 'hamulce', nazwa: 'Pompa hamulcowa', oem: 'AC Delco 18M1165', opis: 'Pompa hamulcowa główna', model: 'Wszystkie' },
                { kat: 'hamulce', nazwa: 'Przewody hamulcowe', oem: 'Inline Tube', opis: 'Zestaw przewodów stalowych', model: 'Wszystkie' },
                { kat: 'zawieszenie', nazwa: 'Sworznie wahaczy', oem: 'AC Delco 45D2278', opis: 'Sworznie wahaczy górnych', model: '1500' },
                { kat: 'zawieszenie', nazwa: 'Tuleje wahaczy', oem: 'AC Delco 45G11040', opis: 'Tuleje wahaczy', model: '1500' },
                { kat: 'filtry', nazwa: 'Filtr kabinowy', oem: 'AC Delco CF101', opis: 'Filtr powietrza kabiny', model: '1996+' },
                { kat: 'silnik', nazwa: 'Czujnik MAP', oem: 'AC Delco 213-1545', opis: 'Czujnik ciśnienia kolektora', model: 'Wszystkie' },
                { kat: 'silnik', nazwa: 'Czujnik IAT', oem: 'AC Delco 213-243', opis: 'Czujnik temperatury powietrza', model: 'Wszystkie' },
                { kat: 'silnik', nazwa: 'Czujnik ECT', oem: 'AC Delco 213-928', opis: 'Czujnik temperatury płynu', model: 'Wszystkie' },
                { kat: 'silnik', nazwa: 'Czujnik tlenu', oem: 'AC Delco 213-1552', opis: 'Sonda lambda', model: 'Wszystkie' },
                { kat: 'silnik', nazwa: 'Pompa wodna', oem: 'AC Delco 252-707', opis: 'Pompa wody', model: '5.7L' },
                { kat: 'silnik', nazwa: 'Termostat', oem: 'AC Delco 131-113', opis: 'Termostat 195°F', model: 'Wszystkie' },
                { kat: 'hamulce', nazwa: 'Zacisk przedni', oem: 'AC Delco 18FR1247', opis: 'Zacisk hamulcowy przód', model: '1500' },
                { kat: 'hamulce', nazwa: 'Tarcza przednia', oem: 'AC Delco 18A1532', opis: 'Tarcza hamulcowa przód', model: '1500' },
                { kat: 'zawieszenie', nazwa: 'Wahacz górny', oem: 'AC Delco 45D2278', opis: 'Wahacz górny z sworzniem', model: '1500' },
                { kat: 'zawieszenie', nazwa: 'Wahacz dolny', oem: 'AC Delco 45D2279', opis: 'Wahacz dolny', model: '1500' },
                { kat: 'zawieszenie', nazwa: 'Końcówka drążka', oem: 'AC Delco 45A0526', opis: 'Końcówka drążka kierowniczego', model: 'Wszystkie' },
                { kat: 'skrzynia', nazwa: 'Uszczelka miski', oem: 'AC Delco 24206182', opis: 'Uszczelka miski 4L60E', model: '4L60E' },
                { kat: 'skrzynia', nazwa: 'Solenoid EPC', oem: 'AC Delco 24230298', opis: 'Solenoid ciśnienia', model: '4L60E' },
              ].filter(p => (partsFilter === 'wszystkie' || p.kat === partsFilter) && (!partsQuery || p.nazwa.toLowerCase().includes(partsQuery.toLowerCase()) || p.oem.toLowerCase().includes(partsQuery.toLowerCase()))).map((p, idx) => (
                <div key={idx} className="bg-neutral-950 border border-white/10 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{p.nazwa}</h3>
                    <span className="text-xs bg-amber-400 text-black px-2 py-0.5">{p.oem}</span>
                  </div>
                  <p className="text-neutral-400 text-sm mb-1">{p.opis}</p>
                  <p className="text-neutral-500 text-xs">Model: {p.model}</p>
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
            
            <div className="bg-neutral-950 border border-white/10 overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-amber-400">
                    <th className="p-3 text-left">Czynność</th>
                    <th className="p-3 text-left">Interwał</th>
                    <th className="p-3 text-left">Specyfikacja</th>
                    <th className="p-3 text-left">Część OEM</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  <tr className="border-b border-white/5"><td className="p-3">Olej silnikowy</td><td className="p-3">5-8 tys. km</td><td className="p-3">5W-30 / 10W-30</td><td className="p-3 text-amber-400">PF1218</td></tr>
                  <tr className="border-b border-white/5"><td className="p-3">Filtr oleju</td><td className="p-3">Przy wymianie oleju</td><td className="p-3">AC Delco</td><td className="p-3 text-amber-400">PF1218</td></tr>
                  <tr className="border-b border-white/5"><td className="p-3">Filtr powietrza</td><td className="p-3">30 tys. km</td><td className="p-3">AC Delco</td><td className="p-3 text-amber-400">A1163C</td></tr>
                  <tr className="border-b border-white/5"><td className="p-3">Filtr paliwa</td><td className="p-3">50 tys. km</td><td className="p-3">AC Delco</td><td className="p-3 text-amber-400">GF626</td></tr>
                  <tr className="border-b border-white/5"><td className="p-3">ATF 4L60E</td><td className="p-3">50 tys. km</td><td className="p-3">Dexron VI</td><td className="p-3 text-amber-400">TF289</td></tr>
                  <tr className="border-b border-white/5"><td className="p-3">Płyn chłodzący</td><td className="p-3">5 lat / 150 tys.</td><td className="p-3">Dex-Cool</td><td className="p-3 text-amber-400">—</td></tr>
                  <tr className="border-b border-white/5"><td className="p-3">Płyn hamulcowy</td><td className="p-3">2 lata</td><td className="p-3">DOT 3</td><td className="p-3 text-amber-400">—</td></tr>
                  <tr className="border-b border-white/5"><td className="p-3">Świece zapłonowe</td><td className="p-3">50 tys. km</td><td className="p-3">Gap 1.5mm</td><td className="p-3 text-amber-400">41-932</td></tr>
                  <tr className="border-b border-white/5"><td className="p-3">Pasek klinowy</td><td className="p-3">100 tys. km</td><td className="p-3">Gates/Dayco</td><td className="p-3 text-amber-400">—</td></tr>
                  <tr className="border-b border-white/5"><td className="p-3">Olej dyferencjału</td><td className="p-3">50 tys. km</td><td className="p-3">75W-90 GL-5</td><td className="p-3 text-amber-400">—</td></tr>
                  <tr className="border-b border-white/5"><td className="p-3">Olej NP231</td><td className="p-3">50 tys. km</td><td className="p-3">ATF Dexron</td><td className="p-3 text-amber-400">—</td></tr>
                  <tr className="border-b border-white/5"><td className="p-3">Termostat</td><td className="p-3">Przy problemach</td><td className="p-3">195°F (91°C)</td><td className="p-3 text-amber-400">131-113</td></tr>
                  <tr className="border-b border-white/5"><td className="p-3">Klocki hamulcowe</td><td className="p-3">Wg zużycia</td><td className="p-3">Ceramiczne</td><td className="p-3 text-amber-400">17D473CH</td></tr>
                  <tr><td className="p-3">Amortyzatory</td><td className="p-3">100 tys. km</td><td className="p-3">AC Delco</td><td className="p-3 text-amber-400">504-1079</td></tr>
                </tbody>
              </table>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-neutral-950 border border-white/10 p-4">
                <h3 className="font-semibold text-amber-400 mb-3">Co 5-8 tys. km</h3>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li>• Wymiana oleju silnikowego (4.7 L)</li>
                  <li>• Wymiana filtra oleju (PF1218)</li>
                  <li>• Sprawdzenie poziomu płynów</li>
                  <li>• Kontrola ciśnienia opon</li>
                </ul>
              </div>
              <div className="bg-neutral-950 border border-white/10 p-4">
                <h3 className="font-semibold text-amber-400 mb-3">Co 30-50 tys. km</h3>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li>• Filtr powietrza (A1163C)</li>
                  <li>• Filtr paliwa (GF626)</li>
                  <li>• ATF + filtr (TF289)</li>
                  <li>• Świece zapłonowe (41-932)</li>
                  <li>• Olej dyferencjału</li>
                </ul>
              </div>
              <div className="bg-neutral-950 border border-white/10 p-4">
                <h3 className="font-semibold text-amber-400 mb-3">Co 100 tys. km</h3>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li>• Pasek klinowy</li>
                  <li>• Amortyzatory</li>
                  <li>• Płyn chłodzący (jeśli nie wcześniej)</li>
                  <li>• Kontrola zawieszenia</li>
                </ul>
              </div>
              <div className="bg-neutral-950 border border-white/10 p-4">
                <h3 className="font-semibold text-amber-400 mb-3">Sezonowo</h3>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li>• Płyn hamulcowy (co 2 lata)</li>
                  <li>• Płyn chłodzący (co 5 lat)</li>
                  <li>• Kontrola przewodów hamulcowych</li>
                  <li>• Smarowanie zawiasów</li>
                </ul>
              </div>
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
            
            <input 
              type="text" 
              placeholder="Szukaj modyfikacji (np. lift, headers, LS swap)..." 
              value={tuningQuery}
              onChange={(e) => setTuningQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-amber-400 mb-4"
            />
            
            <div className="flex flex-wrap gap-2 mb-6">
              {['wszystkie', 'zawieszenie', 'silnik', 'wydech', 'skrzynia', 'hamulce'].map(f => (
                <button key={f} onClick={() => setTuningFilter(f)}
                  className={`px-3 py-1 text-sm ${tuningFilter === f ? 'bg-amber-400 text-black' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {[
                { kat: 'zawieszenie', nazwa: 'Lift 4-6 cali', efekt: '+4-6" wysokości, większe opony 33-35"', czesci: 'Rough Country / BDS kit', koszt: '3000-6000 PLN', opis: 'Pełny kit z krzyżownicami, wahaczami i blokami.', model: 'K1500 4x4', img: '/mod-lift.jpg' },
                { kat: 'zawieszenie', nazwa: 'Leveling kit (torsion crank)', efekt: '+1-2" przód, poziomowanie', czesci: 'Fabryczne klucze torsion', koszt: '0 PLN (DIY)', opis: 'Kręcenie kluczy torsion bars. Max 2" bez problemów. Więcej = zużycie części.' },
                { kat: 'zawieszenie', nazwa: 'Drop 4/6 (obniżenie)', efekt: '-4" przód, -6" tył', czesci: 'CPP Drop Springs + Flip Kit', koszt: '2000-4000 PLN', opis: 'Obniżenie dla stylu street. Drop springs + flip kit + shackles.', model: 'C1500 2WD', img: '/mod-drop.jpg' },
                { kat: 'zawieszenie', nazwa: 'Coilover conversion', efekt: 'Regulowana wysokość, lepsza jazda', czesci: 'QA1 / Ridetech kit', koszt: '8000-15000 PLN', opis: 'Zamiana sprężyn na coilover. Pełna regulacja i lepsza kontrola.' },
                { kat: 'silnik', nazwa: 'LS Swap 5.3L', efekt: '+100-150 KM, nowoczesność', czesci: '5.3L LM7 + 4L60E/4L80E', koszt: '8000-15000 PLN', opis: 'Najpopularniejszy swap. 5.3L z GMT800. Wymaga okablowania i ECU.', model: 'Wszystkie GMT400', img: '/mod-ls.jpg' },
                { kat: 'silnik', nazwa: 'LS Swap 6.0L', efekt: '+150-200 KM, moment do holowania', czesci: '6.0L LQ4 + 4L80E', koszt: '12000-20000 PLN', opis: 'Dla cięższych aut i holowania. Więcej momentu niż 5.3L.' },
                { kat: 'silnik', nazwa: 'Headers (kolektory)', efekt: '+10-20 KM, lepszy dźwięk', czesci: 'Flowtech / Hedman headers', koszt: '800-2000 PLN', opis: 'Zamiana fabrycznych kolektorów. Shorty lub long tube.' },
                { kat: 'silnik', nazwa: 'Cold Air Intake', efekt: '+5-10 KM, lepszy dźwięk', czesci: 'K&N / Airaid kit', koszt: '400-800 PLN', opis: 'Zimne powietrze do silnika. Prosty montaż.' },
                { kat: 'wydech', nazwa: 'Cat-back exhaust', efekt: 'Lepszy dźwięk, +5-10 KM', czesci: 'Magnaflow / Flowmaster', koszt: '1500-3000 PLN', opis: 'Wydech od katalizatora. 2.5" lub 3" średnica.' },
                { kat: 'wydech', nazwa: 'Pełny wydech 3"', efekt: '+15-25 KM z headers', czesci: 'Headers + 3" system', koszt: '3000-5000 PLN', opis: 'Headers + Y-pipe + 3" cat-back. Maksymalny przepływ.', model: 'Wszystkie V8', img: '/mod-exhaust.jpg' },
                { kat: 'skrzynia', nazwa: '4L60E rebuild', efekt: 'Niezawodność, trzymanie mocy', czesci: 'Sonnax kit + frictions', koszt: '3000-6000 PLN', opis: 'Regeneracja z ulepszonymi częściami. Shift kit, hardened sun shell.' },
                { kat: 'skrzynia', nazwa: '4L80E swap', efekt: 'Wytrzymałość na moc', czesci: '4L80E + crossmember + shaft', koszt: '5000-10000 PLN', opis: 'Dla LS swap i mocy powyżej 400 KM. Wymaga modyfikacji.' },
                { kat: 'hamulce', nazwa: 'Big brake kit', efekt: 'Krótsza droga hamowania', czesci: 'Wilwood / Pro Performance', koszt: '3000-6000 PLN', opis: 'Większe tarcze i zaciski. Dla obniżonych i szybkich aut.' },
                { kat: 'hamulce', nazwa: 'Tarcze tył (zamiast bębnów)', efekt: 'Lepsze hamowanie tyłu', czesci: 'Disc conversion kit', koszt: '1500-3000 PLN', opis: 'Zamiana bębnów na tarcze. Lepsze hamowanie i łatwiejszy serwis.' },
              ].filter(m => (tuningFilter === 'wszystkie' || m.kat === tuningFilter) && (!tuningQuery || m.nazwa.toLowerCase().includes(tuningQuery.toLowerCase()) || m.opis.toLowerCase().includes(tuningQuery.toLowerCase()))).map((m, idx) => (
                <div key={idx} className="bg-neutral-950 border border-white/10 overflow-hidden">
                  {m.img && <img src={m.img} alt={m.nazwa} className="w-full h-40 object-cover cursor-pointer" onClick={() => setLightbox(m.img)} />}
                  <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{m.nazwa}</h3>
                    <span className="text-xs bg-amber-400 text-black px-2 py-0.5">{m.koszt}</span>
                  </div>
                  <p className="text-amber-400 text-sm mb-2">Efekt: {m.efekt}</p>
                  <p className="text-neutral-300 text-sm mb-2">{m.opis}</p>
                  <p className="text-neutral-500 text-xs">Części: {m.czesci}</p>
                  {m.model && <p className="text-amber-400 text-xs mt-1">Model: {m.model}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'import' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>IMPORT DO POLSKI</h2>
            
            <div className="bg-neutral-950 border border-amber-400/30 p-4 mb-6">
              <h3 className="font-semibold text-amber-400 mb-4">KALKULATOR IMPORTU</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Cena wylicytowana (PLN)</label>
                  <input type="number" value={importPrice} onChange={(e) => setImportPrice(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-white/10 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Portal aukcyjny</label>
                  <select value={importSource} onChange={(e) => setImportSource(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 px-3 py-2 text-sm">
                    <option value="copart">Copart (opłata ~10%)</option>
                    <option value="iaai">IAAI (opłata ~12%)</option>
                    <option value="manheim">Manheim (opłata ~8%)</option>
                    <option value="dealer">Dealer/prywatny (0%)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Silnik</label>
                  <select value={importEngine} onChange={(e) => setImportEngine(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 px-3 py-2 text-sm">
                    <option value="v6">4.3L V6 — akcyza 3.1%</option>
                    <option value="v8">5.0/5.7/7.4L V8 — akcyza 18.6%</option>
                    <option value="diesel">6.5L Diesel — akcyza 18.6%</option>
                    <option value="pickup">Pickup CN 8704 — akcyza 0%</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Transport</label>
                  <select value={importTransport} onChange={(e) => setImportTransport(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 px-3 py-2 text-sm">
                    <option value="roro">RoRo (najtańszy) — 4000 PLN</option>
                    <option value="kontener">Kontener 20ft — 6000 PLN</option>
                    <option value="kontener40">Kontener 40ft — 8000 PLN</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 text-sm mt-4">
                <div className="flex justify-between"><span className="text-neutral-400">Cena:</span><span>{importPrice} PLN</span></div>
                <div className="flex justify-between"><span className="text-neutral-400">Opłata aukcyjna ({importSource}):</span><span>{Math.round(importPrice * (importSource === 'copart' ? 0.10 : importSource === 'iaai' ? 0.12 : importSource === 'manheim' ? 0.08 : 0))} PLN</span></div>
                <div className="flex justify-between"><span className="text-neutral-400">Transport ({importTransport}):</span><span>{importTransport === 'roro' ? 4000 : importTransport === 'kontener' ? 6000 : 8000} PLN</span></div>
                <div className="flex justify-between"><span className="text-neutral-400">Cło 10%:</span><span>{Math.round(importPrice * 0.10)} PLN</span></div>
                <div className="flex justify-between"><span className="text-neutral-400">Akcyza:</span><span>{Math.round(importPrice * (importEngine === 'v6' ? 0.031 : importEngine === 'pickup' ? 0 : 0.186))} PLN</span></div>
                <div className="flex justify-between"><span className="text-neutral-400">VAT 23%:</span><span>{Math.round(importPrice * 1.1 * 0.23)} PLN</span></div>
                <div className="flex justify-between font-bold text-amber-400 text-lg border-t border-amber-400/30 pt-2"><span>SZACUNEK:</span><span>{Math.round(importPrice * 1.5)} PLN</span></div>
              </div>
            </div>

            <div className="bg-neutral-950 border border-white/10 p-4 mb-4">
              <h3 className="font-semibold text-amber-400 mb-3">STAWKI 2026</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/10 text-amber-400"><th className="p-2 text-left">Typ</th><th className="p-2 text-left">Cło</th><th className="p-2 text-left">Akcyza</th><th className="p-2 text-left">VAT</th></tr></thead>
                  <tbody className="text-neutral-300">
                    <tr className="border-b border-white/5"><td className="p-2">Osobowy do 2000cm³</td><td className="p-2">10%</td><td className="p-2">3.1%</td><td className="p-2">23%</td></tr>
                    <tr className="border-b border-white/5"><td className="p-2">Osobowy powyzej 2000cm³</td><td className="p-2">10%</td><td className="p-2 text-red-400">18.6%</td><td className="p-2">23%</td></tr>
                    <tr className="border-b border-white/5"><td className="p-2">Pickup CN 8704</td><td className="p-2">22%</td><td className="p-2 text-green-400">0%</td><td className="p-2">23%</td></tr>
                    <tr><td className="p-2">Zabytkowy 30+ lat</td><td className="p-2 text-green-400">0%</td><td className="p-2">—</td><td className="p-2">—</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-neutral-500 mt-2">* GMT400 z 5.7L/7.4L = 18.6% akcyza. Pickup może być CN 8704 (0% akcyza).</p>
            </div>

            <div className="bg-neutral-950 border border-white/10 p-4 mb-4">
              <h3 className="font-semibold text-amber-400 mb-3">PROCEDURA KROK PO KROKU</h3>
              <ol className="text-sm text-neutral-300 space-y-2 list-decimal list-inside">
                <li><strong>Zakup w USA</strong> — aukcja (Copart, IAAI) lub dealer</li>
                <li><strong>Transport morski</strong> — 2-8 tygodni, koszt 4000-8000 PLN</li>
                <li><strong>Odprawa celna</strong> — cło 10% + VAT 23%</li>
                <li><strong>Akcyza</strong> — deklaracja AKC-U/S w 14 dni, płatność w 30 dni</li>
                <li><strong>Tłumaczenia</strong> — title, faktura (300-600 PLN)</li>
                <li><strong>Przystosowanie</strong> — światła ECE, prędkościomierz km/h (2000-5000 PLN)</li>
                <li><strong>Badanie techniczne</strong> — 149 PLN (z LPG 245 PLN)</li>
                <li><strong>Rejestracja</strong> — wydział komunikacji (160-250 PLN)</li>
              </ol>
            </div>

            <div className="bg-neutral-950 border border-white/10 p-4">
              <h3 className="font-semibold text-amber-400 mb-3">TIPSY Z FORÓW</h3>
              <ul className="text-sm text-neutral-300 space-y-2">
                <li>• <strong>Pickup = 0% akcyza</strong> — jeśli sklasyfikowany jako CN 8704 (ciężarowy)</li>
                <li>• <strong>Homologacja nie wymagana</strong> — dla używanych aut z title wystarczy przystosowanie</li>
                <li>• <strong>Światła</strong> — wymiana na ECE lub naklejki korekcyjne</li>
                <li>• <strong>Prędkościomierz</strong> — wymiana skali lub przeprogramowanie</li>
                <li>• <strong>LPG</strong> — instalacja 3000-6000 PLN, oszczędność ~40% na paliwie</li>
                <li>• <strong>Mienie przesiedleńcze</strong> — 0% cło/VAT/akcyza przy 12 mies. pobytu w USA</li>
              </ul>
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
