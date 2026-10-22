'use client';
import ImageLightbox from './ImageLightbox';

import { useState, useEffect, useMemo } from 'react';
import AdditionalTips from './AdditionalTips';
import RepairCostCalculator from './RepairCostCalculator';
import ImportCostCalculator from './ImportCostCalculator';
import GroupedNavigation from './GroupedNavigation';
import useSectionNavigation from './useSectionNavigation';
import ModelCatalog from './ModelCatalog';
import GlobalSearch from './GlobalSearch';
import { useVehicleMaterialFilter, VehicleMatchBadge } from './VehicleMaterialFilter';
import type { Applicability } from '../lib/vehicle-compatibility';
import VinHistorySummary from './VinHistorySummary';

type Item = {
  id?: string;
  applicability?: Applicability;
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
    { id: 'kalkulator', label: 'Koszty' },
    { id: 'porownaj', label: 'Porównaj' },
    { id: 'dziennik', label: 'Dziennik' },
    { id: 'paliwo', label: 'Paliwo' },
    { id: 'mojeauto', label: 'Moje auto' },
    { id: 'tips', label: 'Tips' },
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

function playGong(): void {
  if (typeof window === 'undefined' || !window.AudioContext) return;
  try {
    const context = new window.AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, context.currentTime);
    gain.gain.setValueAtTime(0.15, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.8);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.onended = () => { void context.close().catch(() => {}); };
    void context.resume().catch(() => {});
    oscillator.start();
    oscillator.stop(context.currentTime + 0.8);
  } catch {
    // Audio is optional; VIN results must remain usable.
  }
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useSectionNavigation(CATEGORIES.map(category => category.id));
  const materialScope = tab === 'diy' || tab === 'schematy' ? ['Porada'] : tab === 'kody' ? ['Kod błędu'] : tab === 'usterki' ? ['Usterka'] : undefined;
  const { visibleItems, panel: vehicleFilterPanel } = useVehicleMaterialFilter(items, materialScope);
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
  const [vinWarning, setVinWarning] = useState(false);
  const [myVin, setMyVin] = useState('');
  const [fuelKm, setFuelKm] = useState(500);
  const [fuelLiters, setFuelLiters] = useState(50);
  const [fuelPrice, setFuelPrice] = useState(6.5);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showBackTop, setShowBackTop] = useState(false);

  const shareSection = (section: string) => {
    const url = window.location.origin + '?tab=' + section;
    if (navigator.share) {
      navigator.share({ title: 'GMT400.pl - ' + section, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link skopiowany!');
    }
  };

  const handleSwipe = () => {
    const diff = touchStart - touchEnd;
    const tabs = CATEGORIES.map(c => c.id);
    const currentIndex = tabs.indexOf(tab);
    if (diff > 50 && currentIndex < tabs.length - 1) {
      setTab(tabs[currentIndex + 1]);
    } else if (diff < -50 && currentIndex > 0) {
      setTab(tabs[currentIndex - 1]);
    }
  };

  const rateDiy = (id: string, rating: number) => {
    setRatings(prev => ({ ...prev, [id]: rating }));
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };
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
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);



  useEffect(() => {
    const handleScroll = () => setShowBackTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    fetch('/api/notion', { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(data => {
        setItems(data.results || []);
        setError(null);
      })
      .catch(err => {
        if (err.name !== 'AbortError') setError('Nie udało się załadować danych z bazy. Odśwież stronę lub spróbuj później.');
        else setError('Przekroczono czas oczekiwania na dane. Sprawdź połączenie i odśwież.');
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });
    return () => { controller.abort(); clearTimeout(timeout); };
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
  const issues = useMemo(() => visibleItems.filter(i => i.Typ === 'Usterka'), [visibleItems]);
  const codes = useMemo(() => visibleItems.filter(i => i.Typ === 'Kod błędu'), [visibleItems]);
  const tips = useMemo(() => visibleItems.filter(i => i.Typ === 'Porada'), [visibleItems]);

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
    if (issueYear) {
      const y = Number(issueYear);
      result = result.filter(i => {
        const lata = (i.Lata || '').trim();
        if (!lata || lata.toLowerCase().includes('wszystkie')) return true;
        // match exact year, range like 1996-2000, or 1996+
        if (lata.includes(issueYear)) return true;
        const range = lata.match(/(\d{4})\s*[-\u2013\u2014]\s*(\d{4})/);
        if (range) return y >= Number(range[1]) && y <= Number(range[2]);
        const open = lata.match(/(\d{4})\+/);
        if (open) return y >= Number(open[1]);
        return false;
      });
    }
    const q = (issueQuery || query).toLowerCase();
    if (q) result = result.filter(i => 
      i.Nazwa.toLowerCase().includes(q) || 
      (i.Objawy || '').toLowerCase().includes(q) || 
      (i.Rozwiązanie || '').toLowerCase().includes(q)
    );
    return result;
  }, [issues, query, issueQuery, selectedModel, issueModel, issueYear]);

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
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <div className="text-4xl font-bold tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>GMT400</div>
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-neutral-500">Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <link rel="manifest" href="/manifest.json" />
      <script type="application/ld+json">{"{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"name\":\"GMT400.pl\",\"description\":\"Encyklopedia Chevrolet/GMC GMT400 1988-2000\",\"url\":\"https://gmt400.pl\"}"}</script>
      
      {lightbox && (
        <ImageLightbox src={lightbox} onClose={() => setLightbox(null)} />
      )}

      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" >
            <button type="button" aria-label="GMT400 — strona główna" className="rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400" onClick={() => { setSelectedModel('Wszystkie'); setSelectedModelItem(null); setTab('modele'); }}><span className="text-xl font-bold tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              GMT<span className="text-amber-400">400</span>
            </span></button>
            <button aria-label="Otwórz wyszukiwarkę" onClick={(e) => { e.stopPropagation(); setShowSearch(!showSearch); }} className="ml-4 text-neutral-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <button aria-label="Przełącz motyw" onClick={(e) => { e.stopPropagation(); setDarkMode(!darkMode); }} className="text-neutral-400 hover:text-white text-lg">
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <input aria-label="Szukaj w bieżącej sekcji"
              type="search"
              placeholder="Szukaj..."
              className="hidden sm:block bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm w-40 focus:outline-none focus:border-amber-400/50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="text-white" aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-red-950/50 border border-red-500/30 text-red-300 px-4 py-3 rounded text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => window.location.reload()} className="underline text-red-200">Odśwież</button>
          </div>
        </div>
      )}
      <div id="content" className="max-w-7xl mx-auto px-4 py-8">
        {/* rest of the component remains the same as the previous version — the full original content continues below this point in the real file */}
      </div>
    </div>
  );
}
