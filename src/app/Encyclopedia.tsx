'use client';
import Link from 'next/link';
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
import { matchesYearRules } from '../lib/year-range.mjs';
import VinDecoder from './VinDecoder';
import OfficialVehicleData from './OfficialVehicleData';
import { useModelSelection } from './ModelSelectionContext';
import CategoryChips from './ui/CategoryChips';
import { findBody } from '../lib/body-styles';
import { EngineTable, FluidsTable, PartSourceNote, OemQuickList, TorqueTable } from './VerifiedSpecs';
import { PARTS } from '../lib/parts-catalog';
import ModelThumb from './ModelThumb';
import EntryTile from './ui/EntryTile';
import { excerptOf, getIssueImage, getTipIcon, getTipImage } from '../lib/entry-tile';
import { hasDrawingOnly, tileImageFor } from '../lib/entry-media';
import { isGeneralEntry, isSpecificToBody } from '../lib/model-images';
import { hasSource } from './IssueDetails';

type Item = {
  id?: string;
  Obraz?: string;
  applicability?: Applicability;
  Nazwa: string;
  Typ: string;
  Model: string;
  Modele?: string[];
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
  if (n.includes('tahoe') && (n.includes('4-drzwi') || n.includes('4 drzwi'))) return '/carousel-tahoe-gold.jpg?v=4';
  if (n.includes('tahoe')) return '/carousel-tahoe-gold.jpg?v=4';
  // Suburban
  if (n.includes('suburban')) return '/carousel-suburban-navy.jpg?v=4';
  // Sierra / GMC
  if (n.includes('sierra')) return '/sierra-burgundy.jpg';
  // Yukon
  if (n.includes('yukon')) return '/yukon-white.jpg';
  // C/K pickups
  if (n.includes('3500') && (n.includes('dually') || n.includes('dual'))) return '/ck-3500-dually.jpg';
  if (n.includes('k1500') || (n.includes('4x4') && !n.includes('tahoe'))) return '/k1500-black.jpg';
  if (n.includes('extended')) return '/k1500-black.jpg';
  if (n.includes('regular cab') || n.includes('c/k') || n.includes('1500') || n.includes('2500') || n.includes('3500')) return '/ck-1500-blue.jpg';
  return '/carousel-tahoe-gold.jpg?v=4';
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

export default function Encyclopedia({ initialTab, initialItems }: { initialTab?: string; initialItems?: Item[] | null } = {}) {
  // initialItems: lista wyrenderowana na serwerze (ISR) — trafia do HTML dla wyszukiwarek, a użytkownik nie widzi ekranu ładowania.
  // Po montażu i tak pobieramy świeże dane z /api/notion (cache 5 min), więc nowe wpisy pojawiają się bez czekania na ISR.
  const [items, setItems] = useState<Item[]>(initialItems ?? []);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [loading, setLoading] = useState(!initialItems);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useSectionNavigation(CATEGORIES.map(category => category.id), initialTab);
  const materialScope = tab === 'diy' || tab === 'schematy' ? ['Porada'] : tab === 'kody' ? ['Kod błędu'] : tab === 'usterki' ? ['Usterka'] : undefined;
  const { visibleItems, panel: vehicleFilterPanel, profileNarrowing, profileModeChanged, resetMode: resetProfileMode, showAllMode: showAllProfileMode } = useVehicleMaterialFilter(items, materialScope);
  const [selectedModel, setSelectedModel] = useState('Wszystkie');
  const [selectedModelItem, setSelectedModelItem] = useState<Item | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [issueYear, setIssueYear] = useState('');
  const [issueSourcedOnly, setIssueSourcedOnly] = useState(false);
  const [issueModel, setIssueModel] = useState('');
  const [issueQuery, setIssueQuery] = useState('');
  const [issueCategory, setIssueCategory] = useState('wszystkie');
  const [codeQuery, setCodeQuery] = useState('');
  const [diyQuery, setDiyQuery] = useState('');
  const [diySourcedOnly, setDiySourcedOnly] = useState(false);
  const [diyCategory, setDiyCategory] = useState('wszystkie');
  const [schemaQuery, setSchemaQuery] = useState('');
  const [vinResult, setVinResult] = useState<Record<string, string> | null>(null);
  const [vinWarning, setVinWarning] = useState(false);
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
      // Rejestracja SW może się nie udać u prawdziwych użytkowników (tryb prywatny, blokada SW, zerwane połączenie,
      // Safari „Script …/sw.js load failed”). To nie jest awaria strony — strona działa bez SW, więc nie zgłaszamy
      // tego jako nieobsłużonego błędu (wcześniej odrzucona obietnica trafiała do Sentry).
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
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
        if (initialItems && (!Array.isArray(data.results) || data.complete === false)) return;
        setItems(data.results || []);
        setError(null);
      })
      .catch(err => {
        if (initialItems) return; // zostają dane z serwera; błąd odświeżenia nie psuje strony
        if (err.name !== 'AbortError') setError('Nie udało się załadować danych z bazy. Odśwież stronę lub spróbuj później.');
        else setError('Przekroczono czas oczekiwania na dane. Sprawdź połączenie i odśwież.');
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });
    return () => { controller.abort(); clearTimeout(timeout); };
  }, [initialItems]);

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

  const { bodyId, filters: modelFilters, clearSelection } = useModelSelection();
  const selectedBody = findBody(bodyId);

  const filterByModel = (list: Item[]) => {
    let result = list;
    if (selectedModel !== 'Wszystkie') {
      result = result.filter(i => i.Model === selectedModel || i.Model === 'Wszystkie');
    }
    if (bodyId) {
      // Pole „Modele” z Notion ma pierwszeństwo; bez niego — dotychczasowe słowa kluczowe (BODY_MATCH).
      result = result.filter(i => isGeneralEntry(i) || isSpecificToBody(i, bodyId));
    }
    if (modelFilters.year) {
      result = result.filter(i => {
        const lata = (i.Lata || '').trim();
        if (!lata) return true;
        return matchesYearRules(modelFilters.year!, [lata]) !== false;
      });
    }
    return result;
  };

  const filteredModels = useMemo(() => {
    let result = models;
    if (selectedModel !== 'Wszystkie') result = result.filter(m => m.Model === selectedModel);
    return result.filter(m => m.Nazwa.toLowerCase().includes(query.toLowerCase()) || (m.Opis || '').toLowerCase().includes(query.toLowerCase()));
  }, [models, query, selectedModel]);

  const ISSUE_CATEGORIES = [
    { id: 'wszystkie', label: 'Wszystkie', keywords: [] as string[] },
    { id: 'silnik', label: 'Silnik', keywords: ['silnik', 'nie odpala', 'szarpie', 'gaśnie', 'pompa', 'wtrysk', 'kolektor', 'świec'] },
    { id: 'skrzynia', label: 'Skrzynia', keywords: ['skrzyni', '4l60', '4l80', 'ślizga', 'atf', 'transmis'] },
    { id: 'hamulce', label: 'Hamulce', keywords: ['hamulc', 'abs', 'klock', 'tarcz', 'zacisk'] },
    { id: 'zawieszenie', label: 'Zawieszenie', keywords: ['zawiesz', 'amortyz', 'stuk', 'sworz', 'wahacz'] },
    { id: 'elektryka', label: 'Elektryka', keywords: ['elektr', 'czujnik', 'przekaź', 'kontrolka', 'obd'] },
    { id: 'klima', label: 'Klima/Ogrzewanie', keywords: ['klima', 'ogrzew', 'sprężarka', 'nagrzewnica', 'dmuchawa'] },
  ];
  const filteredIssues = useMemo(() => {
    let result = issueModel ? issues.filter(i => i.Model === issueModel || i.Model === 'Wszystkie') : filterByModel(issues);
    if (issueYear) {
      result = result.filter(i => {
        const lata = (i.Lata || '').trim();
        if (!lata) return true;
        return matchesYearRules(issueYear, [lata]) !== false;
      });
    }
    const q = (issueQuery || query).toLowerCase();
    if (q) result = result.filter(i => 
      i.Nazwa.toLowerCase().includes(q) || 
      (i.Objawy || '').toLowerCase().includes(q) || 
      (i.Rozwiązanie || '').toLowerCase().includes(q) ||
      (i.Opis || '').toLowerCase().includes(q)
    );
    if (issueSourcedOnly) result = result.filter(hasSource);
    const catWords = ISSUE_CATEGORIES.find(c => c.id === issueCategory)?.keywords ?? [];
    if (catWords.length) result = result.filter(i => {
      const hay = `${i.Nazwa} ${i.Objawy || ''} ${i.Opis || ''} ${i.Rozwiązanie || ''}`.toLowerCase();
      return catWords.some(k => hay.includes(k));
    });
    return result;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issues, query, issueQuery, selectedModel, issueModel, issueYear, bodyId, modelFilters, issueSourcedOnly, issueCategory]);
  const issueCategoryLabel = ISSUE_CATEGORIES.find(c => c.id === issueCategory)?.label ?? 'Wszystkie';
  const issueFiltersActive = profileModeChanged || !!issueQuery || issueCategory !== 'wszystkie' || !!issueModel || !!issueYear || issueSourcedOnly || selectedModel !== 'Wszystkie';
  const clearIssueFilters = () => { setIssueQuery(''); setIssueCategory('wszystkie'); setIssueModel(''); setIssueYear(''); setIssueSourcedOnly(false); setSelectedModel('Wszystkie'); setSelectedModelItem(null); resetProfileMode(); };

  const filteredCodes = useMemo(() => {
    let result = filterByModel(codes);
    return result.filter(c => c.Nazwa.toLowerCase().includes(query.toLowerCase()) || (c.Opis || '').toLowerCase().includes(query.toLowerCase()) || (c.Rozwiązanie || '').toLowerCase().includes(query.toLowerCase()));
  }, [codes, query, selectedModel, bodyId, modelFilters]);

  const filteredTips = useMemo(() => {
    let result = filterByModel(tips);
    return result.filter(t => t.Nazwa.toLowerCase().includes(query.toLowerCase()) || (t.Rozwiązanie || '').toLowerCase().includes(query.toLowerCase()));
  }, [tips, query, selectedModel, bodyId, modelFilters]);
  const DIY_CATEGORIES = [
    { id: 'wszystkie', label: 'Wszystkie', keywords: [] as string[] },
    { id: 'silnik', label: 'Silnik', keywords: ['silnik', 'olej', 'filtr', 'kolektor', 'świec', 'zapłon', 'rozrząd', 'pompa', 'wtrysk'] },
    { id: 'skrzynia', label: 'Skrzynia', keywords: ['skrzyni', '4l60', '4l80', 'atf', 'transmis', 'reduktor', 'np241', 'np243'] },
    { id: 'hamulce', label: 'Hamulce', keywords: ['hamulc', 'klock', 'tarcz', 'zacisk', 'abs'] },
    { id: 'zawieszenie', label: 'Zawieszenie', keywords: ['zawiesz', 'amortyz', 'sworz', 'wahacz', 'resory'] },
    { id: 'elektryka', label: 'Elektryka', keywords: ['elektr', 'czujnik', 'przekaź', 'alternator', 'rozrusznik', 'vin', 'obd'] },
    { id: 'plyny', label: 'Płyny', keywords: ['płyn', 'olej', 'chłodnic', 'atf', 'dyferencjał', 'most'] },
  ];
  const diyTips = useMemo(() => {
    const q = diyQuery.toLowerCase();
    const keywords = DIY_CATEGORIES.find(c => c.id === diyCategory)?.keywords ?? [];
    return filteredTips.filter(t => {
      const hay = `${t.Nazwa} ${t.Opis || ''} ${t.Rozwiązanie || ''}`.toLowerCase();
      return (!q || hay.includes(q)) && (!keywords.length || keywords.some(k => hay.includes(k))) && (!diySourcedOnly || hasSource(t));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTips, diyQuery, diySourcedOnly, diyCategory]);
  const diyCategoryLabel = DIY_CATEGORIES.find(c => c.id === diyCategory)?.label ?? 'Wszystkie';
  const diyFiltersActive = profileModeChanged || !!diyQuery || diyCategory !== 'wszystkie' || diySourcedOnly || selectedModel !== 'Wszystkie';
  const clearDiyFilters = () => { setDiyQuery(''); setDiyCategory('wszystkie'); setDiySourcedOnly(false); setSelectedModel('Wszystkie'); setSelectedModelItem(null); resetProfileMode(); };
  const profileScoped = !!bodyId || profileNarrowing;
  const showAllProfile = () => { clearSelection(); showAllProfileMode(); };

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
        <div className="w-8 h-8 border-2 border-silver-600 border-t-transparent rounded-full animate-spin"></div>
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


      <div className="flex items-center bg-neutral-900/50 border-b border-white/5 px-4 text-sm text-neutral-500">
        <a href="/" className="inline-flex min-h-11 items-center hover:text-white">Strona główna</a>
        <span className="mx-2">›</span>
        <span className="text-silver-400">{CATEGORIES.find(c => c.id === tab)?.label || tab}</span>
      </div>
      <h1 className="sr-only">{CATEGORIES.find(c => c.id === tab)?.label || tab} — GMT400</h1>

      {showSearch && <GlobalSearch items={items} onClose={() => setShowSearch(false)} />}


      {selectedModel !== 'Wszystkie' && (
        <div className="bg-neutral-900 border-y border-white/5 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button onClick={() => setTab('modele')} className={`p-4 text-center transition ${
                tab === 'modele' ? 'bg-silver-600 text-neutral-950' : 'bg-neutral-800 hover:bg-neutral-700'
              }`}>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{filteredModels.length}</div>
                <div className="text-xs uppercase mt-1">Modele</div>
              </button>
              <button onClick={() => setTab('usterki')} className={`p-4 text-center transition ${
                tab === 'usterki' ? 'bg-silver-600 text-neutral-950' : 'bg-neutral-800 hover:bg-neutral-700'
              }`}>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{filteredIssues.length}</div>
                <div className="text-xs uppercase mt-1">Usterki</div>
              </button>
              <button onClick={() => setTab('kody')} className={`p-4 text-center transition ${
                tab === 'kody' ? 'bg-silver-600 text-neutral-950' : 'bg-neutral-800 hover:bg-neutral-700'
              }`}>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{filteredCodes.length}</div>
                <div className="text-xs uppercase mt-1">Kody</div>
              </button>
              <button onClick={() => setTab('diy')} className={`p-4 text-center transition ${
                tab === 'diy' ? 'bg-silver-600 text-neutral-950' : 'bg-neutral-800 hover:bg-neutral-700'
              }`}>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{filteredTips.length}</div>
                <div className="text-xs uppercase mt-1">Porady</div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-neutral-950 border-y border-white/5 py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center gap-2 text-sm">
          {selectedBody ? (
            <>
              <ModelThumb body={selectedBody} label={false} />
              <span className="text-neutral-400">Pokazuję materiały dla:</span>
              <span className="rounded-md bg-silver-600 px-3 py-1.5 font-semibold text-neutral-950">
                {selectedBody.name}{modelFilters.year ? ` · ${modelFilters.year}` : ` · ${selectedBody.from}–${selectedBody.to}`}{modelFilters.engine ? ` · ${modelFilters.engine}` : ''}{modelFilters.drivetrain ? ` · ${modelFilters.drivetrain.toUpperCase()}` : ''}
              </span>
              <a href={`/modele/${selectedBody.id}`} className="inline-flex min-h-11 items-center px-2 text-silver-300 underline">Strona modelu</a>
              <a href="/" className="inline-flex min-h-11 items-center px-2 text-silver-300 underline">Zmień model</a>
              <button type="button" onClick={clearSelection} className="min-h-11 px-2 text-neutral-400 underline hover:text-white">Wszystkie modele</button>
              <a href="#sekcje" className="inline-flex min-h-11 items-center px-2 text-neutral-400 underline md:hidden">Inne działy ↓</a>
            </>
          ) : (
            <>
              <span className="text-neutral-400">Wszystkie modele GMT400.</span>
              <a href="/" className="inline-flex min-h-11 items-center px-2 text-silver-300 underline">Wybierz swój model na stronie głównej</a>
              <a href="/modele" className="inline-flex min-h-11 items-center px-2 text-silver-300 underline">Katalog modeli</a>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col [&>*]:w-full [&>*]:min-w-0 [overflow-wrap:anywhere]">
      <div id="sekcje" className="order-last bg-neutral-900 py-4 md:order-none">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
            <GroupedNavigation categories={CATEGORIES} active={tab} instance="sections" onSelect={setTab} />
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-silver-950/50 border border-silver-500/30 text-silver-300 px-4 py-3 rounded text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => window.location.reload()} className="min-h-11 px-2 underline text-silver-200">Odśwież</button>
          </div>
        </div>
      )}
      <div id="content" className="max-w-7xl mx-auto px-4 py-8">
        {['usterki', 'kody', 'diy', 'schematy'].includes(tab) && vehicleFilterPanel}
        
        {selectedModel !== 'Wszystkie' && (
          <div className="mb-6 flex items-center justify-between bg-silver-600/10 border border-silver-600/30 p-3">
            <span className="text-silver-400">Filtr: <strong>{selectedModel}</strong></span>
            <button onClick={() => selectModel('Wszystkie')} className="min-h-11 px-2 text-sm text-neutral-400 hover:text-white">Wyczyść ×</button>
          </div>
        )}

        {tab === 'modele' && <ModelCatalog items={filteredModels} onChoose={item => selectModel(item.Model, item)} />}

        {tab === 'kody' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>KODY OBD</h2>
            <input aria-label="Szukaj kodu OBD" 
              type="text" 
              placeholder="Szukaj kodu (np. P0171, P0300, 12)..." 
              value={codeQuery}
              onChange={(e) => setCodeQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-silver-600 mb-4"
            />
            <p className="text-neutral-500 text-sm mb-4">Znaleziono: {filteredCodes.filter(c => !codeQuery || c.Nazwa.toLowerCase().includes(codeQuery.toLowerCase()) || (c.Opis && c.Opis.toLowerCase().includes(codeQuery.toLowerCase()))).length}</p>
            <div className="space-y-3">
              {filteredCodes.filter(c => !codeQuery || c.Nazwa.toLowerCase().includes(codeQuery.toLowerCase()) || (c.Opis && c.Opis.toLowerCase().includes(codeQuery.toLowerCase()))).map((c, idx) => (
                <EntryTile key={c.id || idx} item={c} icon="obd" excerpt={excerptOf(c, ['Opis', 'Rozwiązanie'])}>
                  <VehicleMatchBadge item={c} />
                </EntryTile>
              ))}
            </div>
          </div>
        )}

        {tab === 'usterki' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>USTERKI</h2>
            
            <div className="bg-neutral-950 border border-white/10 p-4 mb-6">
              <div className="relative mb-4">
                <input aria-label="Szukaj usterki" 
                  type="text" 
                  placeholder="Szukaj usterki (np. wyciek, 4L60E, kolektor)..." 
                  value={issueQuery}
                  onChange={(e) => setIssueQuery(e.target.value)}
                  className={`w-full bg-neutral-900 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-silver-600 ${issueQuery ? 'pr-28' : ''}`}
                />
                {issueQuery && (
                  <button type="button" onClick={() => setIssueQuery('')} data-testid="issue-search-clear" className="absolute right-1 top-1/2 flex min-h-11 -translate-y-1/2 items-center rounded-full border border-white/20 bg-neutral-800 px-3 text-sm text-silver-200 hover:bg-neutral-700">Wyczyść</button>
                )}
              </div>
              <CategoryChips categories={ISSUE_CATEGORIES} value={issueCategory} onChange={setIssueCategory} prefix="issue" label="Kategorie usterek" />
              <p className="text-neutral-400 text-sm mb-4">Lub filtruj po modelu i roczniku:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-500 block mb-2">MODEL</label>
                  <select aria-label="Model pojazdu — filtr usterek" 
                    value={issueModel} 
                    onChange={(e) => setIssueModel(e.target.value)}
                    className="min-h-11 w-full bg-neutral-900 border border-white/10 px-3 py-2 text-base focus:outline-none focus:border-silver-600"
                  >
                    <option value="">Wszystkie modele</option>
                    {uniqueModels.filter(m => m !== 'Wszystkie').map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-2">ROCZNIK</label>
                  <select aria-label="Rocznik pojazdu — filtr usterek" 
                    value={issueYear} 
                    onChange={(e) => setIssueYear(e.target.value)}
                    className="min-h-11 w-full bg-neutral-900 border border-white/10 px-3 py-2 text-base focus:outline-none focus:border-silver-600"
                  >
                    <option value="">Wszystkie roczniki</option>
                    {years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 text-sm text-neutral-300">
                <input type="checkbox" checked={issueSourcedOnly} onChange={(e) => setIssueSourcedOnly(e.target.checked)} className="h-5 w-5 accent-silver-600" data-testid="issue-sourced-only" />
                Tylko wpisy ze źródłami (biuletyny GM, instrukcje, katalogi)
              </label>
            </div>

            
              <div className="space-y-3">
                <p className="text-neutral-400 text-sm mb-4" role="status" data-testid="issue-count">
                  Pokazano {filteredIssues.length} z {issues.length} usterek{issueCategory !== 'wszystkie' && ` · kategoria: ${issueCategoryLabel}`}{(issueModel || selectedModel !== 'Wszystkie') && ` · pojazd: ${issueModel || selectedModel}`}{issueYear && ` · rocznik: ${issueYear}`}
                </p>
                {filteredIssues.length === 0 && (
                  <div className="rounded-2xl border border-white/15 bg-neutral-900 p-4" data-testid="issue-empty">
                    <p className="mb-3 font-semibold text-white" style={{ maxWidth: 'none' }} data-testid="issue-empty-title">{profileScoped ? 'Brak wyników dla Twojego profilu auta. ' : 'Brak wyników'}</p>
                    <p className="mb-3 text-sm text-neutral-300" style={{ maxWidth: 'none' }}>Żadna usterka nie pasuje do wybranych filtrów.</p>
                    <div className="flex flex-wrap gap-2">
                      {profileScoped && <button type="button" onClick={showAllProfile} data-testid="issue-show-all" className="min-h-11 rounded-full border border-silver-300 bg-silver-600 px-4 text-sm font-semibold text-neutral-950">Pokaż wszystko</button>}
                      {issueFiltersActive && <button type="button" onClick={clearIssueFilters} data-testid="issue-clear-filters" className="min-h-11 rounded-full border border-silver-300 bg-neutral-800 px-4 text-sm font-semibold text-silver-100">Wyczyść filtry</button>}
                    </div>
                  </div>
                )}
                {filteredIssues.map((i, idx) => (
                  <EntryTile key={i.id || idx} item={i} icon="usterki" image={tileImageFor(i.id, getIssueImage(i.Nazwa), i.Obraz)} drawing={hasDrawingOnly(i.id)} excerpt={excerptOf(i, ['Objawy', 'Opis', 'Rozwiązanie'])} sourced={hasSource(i)} sourcedTestId="issue-sourced">
                    <VehicleMatchBadge item={i} />
                  </EntryTile>
                ))}
              </div>
            

            {!issueModel && !issueYear && !issueQuery && selectedModel === 'Wszystkie' && (
              <div>
                <div className="text-center py-4">
                  <p className="text-neutral-500 mb-4">Lista usterek jest widoczna poniżej. Użyj filtrów lub wyszukiwania, aby zawęzić wyniki.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-8">
                    {['wyciek', '4L60E', 'kolektor', 'hamulce', '4x4', 'pompa'].map(k => (
                      <button key={k} onClick={() => setIssueQuery(k)} className="min-h-11 bg-neutral-800 hover:bg-neutral-700 px-3 py-2">{k}</button>
                    ))}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-silver-400 mb-4">Najczęstsze usterki GMT400</h3>
                <div className="space-y-3">
                  <div className="bg-neutral-950 border border-white/10 p-4">
                    <h4 className="font-semibold text-silver-400">Uszczelka kolektora dolotowego</h4>
                    <p className="text-sm text-neutral-400">Objawy: wyciek płynu, przegrzewanie. Rozwiązanie: wymiana uszczelki. Numer OEM 12554863 — niezweryfikowany, sprawdź w manualu / katalogu GM po VIN.</p>
                  </div>
                  <div className="bg-neutral-950 border border-white/10 p-4">
                    <h4 className="font-semibold text-silver-400">Ślizganie 4L60E</h4>
                    <p className="text-sm text-neutral-400">Objawy: wysokie obroty przy zmianie 3-4. Rozwiązanie: regeneracja skrzyni.</p>
                  </div>
                  <div className="bg-neutral-950 border border-white/10 p-4">
                    <h4 className="font-semibold text-silver-400">Pompa paliwa</h4>
                    <p className="text-sm text-neutral-400">Objawy: nie odpala, gaśnie. Rozwiązanie: wymiana pompy w zbiorniku.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'diy' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>PORADNIKI DIY</h2>
            <div className="relative mb-3">
              <input aria-label="Szukaj porady DIY" 
                type="text" 
                placeholder="Szukaj porady (np. 4L60E, filtr, kolektor)..." 
                value={diyQuery}
                onChange={(e) => setDiyQuery(e.target.value)}
                className={`w-full bg-neutral-900 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-silver-600 ${diyQuery ? 'pr-28' : ''}`}
              />
              {diyQuery && (
                <button type="button" onClick={() => setDiyQuery('')} data-testid="diy-search-clear" className="absolute right-1 top-1/2 flex min-h-11 -translate-y-1/2 items-center rounded-full border border-white/20 bg-neutral-800 px-3 text-sm text-silver-200 hover:bg-neutral-700">Wyczyść</button>
              )}
            </div>
            <CategoryChips categories={DIY_CATEGORIES} value={diyCategory} onChange={setDiyCategory} prefix="diy" label="Kategorie poradników" />
            <label className="mb-3 flex min-h-11 items-center gap-3 text-sm text-neutral-300">
              <input type="checkbox" checked={diySourcedOnly} onChange={(e) => setDiySourcedOnly(e.target.checked)} className="h-5 w-5 accent-silver-600" data-testid="diy-sourced-only" />
              Tylko procedury ze źródłami (instrukcje GM, biuletyny)
            </label>
            <p className="text-neutral-400 text-sm mb-4" role="status" data-testid="diy-count">
              Pokazano {diyTips.length} z {filteredTips.length} poradników{diyCategory !== 'wszystkie' && ` · kategoria: ${diyCategoryLabel}`}{selectedModel !== 'Wszystkie' && ` · pojazd: ${selectedModel}`}
            </p>
            {diyTips.length === 0 && (
              <div className="mb-4 rounded-2xl border border-white/15 bg-neutral-900 p-4" data-testid="diy-empty">
                <p className="mb-3 font-semibold text-white" style={{ maxWidth: 'none' }} data-testid="diy-empty-title">{profileScoped ? 'Brak wyników dla Twojego profilu auta. ' : 'Brak wyników'}</p>
                <p className="mb-3 text-sm text-neutral-300" style={{ maxWidth: 'none' }}>Żaden poradnik nie pasuje do wybranych filtrów.</p>
                <div className="flex flex-wrap gap-2">
                  {profileScoped && <button type="button" onClick={showAllProfile} data-testid="diy-show-all" className="min-h-11 rounded-full border border-silver-300 bg-silver-600 px-4 text-sm font-semibold text-neutral-950">Pokaż wszystko</button>}
                  {diyFiltersActive && <button type="button" onClick={clearDiyFilters} data-testid="diy-clear-filters" className="min-h-11 rounded-full border border-silver-300 bg-neutral-800 px-4 text-sm font-semibold text-silver-100">Wyczyść filtry</button>}
                </div>
              </div>
            )}
            <div className="space-y-3">
              {diyTips.map((t, idx) => (
                <EntryTile key={t.id || idx} item={t} icon={getTipIcon(t.Nazwa)} image={tileImageFor(t.id, getTipImage(t.Nazwa), t.Obraz)} drawing={hasDrawingOnly(t.id)} excerpt={excerptOf(t, ['Opis', 'Rozwiązanie'])} sourced={hasSource(t)} sourcedTestId="diy-sourced">
                  <VehicleMatchBadge item={t} />
                </EntryTile>
              ))}
            </div>
          </div>
        )}

        {tab === 'diy' && (
          <div className="mb-6 bg-neutral-950 border border-white/10 p-4">
            <h3 className="font-semibold text-silver-400 mb-3">PORADNIKI WIDEO</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="aspect-video bg-neutral-900 flex items-center justify-center">
                <a href="https://www.youtube.com/results?search_query=GMT400+DIY+repair" target="_blank" className="inline-flex min-h-11 items-center text-silver-400 hover:underline">
                  ▶ YouTube: GMT400 DIY
                </a>
              </div>
              <div className="aspect-video bg-neutral-900 flex items-center justify-center">
                <a href="https://www.youtube.com/results?search_query=GMT400+4L60E+rebuild" target="_blank" className="inline-flex min-h-11 items-center text-silver-400 hover:underline">
                  ▶ YouTube: 4L60E
                </a>
              </div>
            </div>
          </div>
        )}

        {tab === 'schematy' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>SCHEMATY ELEKTRYCZNE</h2>
            <input aria-label="Szukaj schematu" 
              type="text" 
              placeholder="Szukaj schematu (np. masa, punkt, zegary)..." 
              value={schemaQuery}
              onChange={(e) => setSchemaQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-silver-600 mb-4"
            />
            <div className="bg-neutral-950 border border-white/10 p-4">
              {filteredTips.filter(t => (t.Nazwa.toLowerCase().includes('punkt') || t.Nazwa.toLowerCase().includes('masa') || t.Nazwa.toLowerCase().includes('schemat')) && (!schemaQuery || t.Nazwa.toLowerCase().includes(schemaQuery.toLowerCase()) || (t.Rozwiązanie && t.Rozwiązanie.toLowerCase().includes(schemaQuery.toLowerCase())))).map((t, idx) => (
                <div key={idx} className="mb-4 pb-4 border-b border-white/10 last:border-0">
                  <h3 className="font-semibold mb-2">{t.Nazwa}</h3>
                      <VehicleMatchBadge item={t} />
                  <p className="text-neutral-300 text-sm whitespace-pre-line">{t.Rozwiązanie}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'vin' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>DEKODER VIN</h2>
            <p className="mb-4 text-sm text-neutral-300">Dekoder ma teraz własną stronę: <Link href="/vin" className="text-silver-400 underline">gmt400.pl/vin</Link>.</p>
            <VinDecoder withRpo onDecoded={(vin, year) => { setVinResult(vin ? { VIN: vin, Rok: year ? String(year) : '' } : null); setVinWarning(false); }} />

            {vinResult && (
              <div className="mt-4 space-y-4">
              <div className="bg-neutral-950 border border-white/10 p-4">
                <h3 className="text-lg font-bold text-silver-400 mb-4">NUMERY OEM CZĘŚCI</h3>
                <OemQuickList />
              </div>

              <div className="bg-neutral-950 border border-white/10 p-4">
                <h3 className="text-lg font-bold text-silver-400 mb-2">POJEMNOŚCI PŁYNÓW</h3>
                <p className="text-sm text-neutral-300">Pojemności zależą od silnika i rocznika. Zweryfikowane dane z instrukcji GM 1995 i 1999 znajdziesz w zakładce <button type="button" onClick={() => setTab('specyfikacje')} className="text-silver-300 underline">Specyfikacje</button>.</p>
              </div>
              </div>
            )}

            {vinResult && (
              <div className="mt-4 bg-neutral-950 border border-silver-600/30 p-4">
                <h3 className="font-semibold text-silver-400 mb-3">OFICJALNE DANE NHTSA</h3>
                <OfficialVehicleData key={vinResult.VIN} vin={vinResult.VIN} />

                <h4 className="font-semibold text-silver-400 mb-2">POWIĄZANE INFORMACJE</h4>
                <div className="space-y-2">
                  <a href={`https://www.gmt400.com/search/search?keywords=${vinResult['Rok'] || ''} ${vinResult['Model'] || ''}`} target="_blank" className="block bg-neutral-900 p-3 hover:bg-neutral-800">
                    <p className="text-sm font-medium text-silver-400">Forum GMT400.com</p>
                    <p className="text-xs text-neutral-500">Dyskusje o tym roczniku i modelu</p>
                  </a>
                  <a href={`https://www.google.com/search?q=${vinResult['Rok'] || ''} ${vinResult['Model'] || 'GMT400'} recall`} target="_blank" className="block bg-neutral-900 p-3 hover:bg-neutral-800">
                    <p className="text-sm font-medium text-silver-400">Akcje serwisowe</p>
                    <p className="text-xs text-neutral-500">Sprawdź recall dla tego rocznika</p>
                  </a>
                  <a href={`https://www.google.com/search?q=${vinResult['Rok'] || ''} ${vinResult['Model'] || 'GMT400'} common problems`} target="_blank" className="block bg-neutral-900 p-3 hover:bg-neutral-800">
                    <p className="text-sm font-medium text-silver-400">Typowe problemy</p>
                    <p className="text-xs text-neutral-500">Najczęstsze usterki tego modelu</p>
                  </a>
                  <a href={`https://www.youtube.com/results?search_query=${vinResult['Rok'] || ''} ${vinResult['Model'] || 'GMT400'} review`} target="_blank" className="block bg-neutral-900 p-3 hover:bg-neutral-800">
                    <p className="text-sm font-medium text-silver-400">YouTube</p>
                    <p className="text-xs text-neutral-500">Recenzje i poradniki wideo</p>
                  </a>
                </div>
              </div>
            )}

            {vinResult && (
              <div className="mt-4 bg-neutral-950 border border-white/10 p-4">
                <h3 className="font-semibold text-silver-400 mb-3">Typowe usterki dla tego rocznika</h3>
                <ul className="text-sm text-neutral-300 space-y-2">
                  <li>• Uszczelki kolektora dolotowego (wyciek płynu)</li>
                  <li>• Korozja przewodów hamulcowych</li>
                  <li>• 4L60E — ślizganie 3-4 biegu</li>
                  <li>• Pompa paliwa (w zbiorniku)</li>
                  <li>• Czujnik MAF (kody P0171/P0174)</li>
                  <li>• Punkty masy (korozja)</li>
                </ul>
                <h3 className="font-semibold text-silver-400 mt-4 mb-3">Zalecany serwis</h3>
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
              <h3 className="font-semibold text-silver-400 mb-3">Kody silników GMT400</h3>
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
            <p className="mb-4 rounded-lg border border-silver-600/30 bg-silver-950/30 p-3 text-sm text-neutral-300">Numery części i momenty dokręcania są orientacyjne. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO). Zawsze weryfikuj w katalogu dla swojego VIN.</p>
            
            <input aria-label="Szukaj części" 
              type="text" 
              placeholder="Szukaj części (np. filtr, świece, pompa)..." 
              value={partsQuery}
              onChange={(e) => setPartsQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-silver-600 mb-4"
            />
            
            <div className="flex flex-wrap gap-2 mb-6">
              {['wszystkie', 'filtry', 'silnik', 'skrzynia', 'hamulce', 'zawieszenie'].map(f => (
                <button key={f} type="button" aria-pressed={partsFilter === f} onClick={() => setPartsFilter(f)}
                  className={`min-h-11 px-3 py-2 text-sm ${partsFilter === f ? 'bg-silver-600 text-neutral-950' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {PARTS.filter(p => (partsFilter === 'wszystkie' || p.kat === partsFilter) && (!partsQuery || p.nazwa.toLowerCase().includes(partsQuery.toLowerCase()) || p.oem.toLowerCase().includes(partsQuery.toLowerCase()) || p.opis.toLowerCase().includes(partsQuery.toLowerCase()))).map((p, idx) => (
                <div key={idx} className="bg-neutral-950 border border-white/10 overflow-hidden">
                  {p.img && <button type="button" aria-label="Powiększ ilustrację" className="block w-full rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver-500" onClick={() => setLightbox(p.img ?? null)}><img loading="lazy" src={p.img} alt={p.nazwa} className="w-full h-32 object-contain bg-white cursor-pointer"  /></button>}
                  <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{p.nazwa}</h3>
                    <span className="text-xs bg-silver-600 text-neutral-950 px-2 py-0.5">{p.oem}</span>
                  </div>
                  <p className="text-neutral-400 text-sm mb-1">{p.opis}</p>
                  <p className="text-neutral-500 text-xs">Model / lata: {p.model}</p>
                  <PartSourceNote part={p} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'specyfikacje' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>SPECYFIKACJE SILNIKÓW</h2>
            
            <EngineTable />

            <button type="button" aria-label="Powiększ ilustrację" className="block w-full rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver-500" onClick={() => setLightbox('/spec-komora-silnika-chevrolet-1500-1990.webp')}><img loading="lazy" src="/spec-komora-silnika-chevrolet-1500-1990.webp" width={1600} height={1067} alt="Komora silnika Chevroleta 1500 z 1990 roku — zdjęcie poglądowe" className="w-full h-auto cursor-pointer"  /></button>
            <p className="text-xs text-neutral-400 mt-1 mb-6">Zdjęcie poglądowe (zmniejszone) — nie pokazuje punktów płynów; ich położenie sprawdź w swoim aucie / manualu. <a href="https://commons.wikimedia.org/wiki/File:2017_Bois_d%27Arc_Spring_Car_Show_50_(1990_Chevrolet_1500_engine).jpg" className="inline-flex min-h-11 items-center text-silver-300 underline underline-offset-2 hover:text-white">Fot. Michael Barera</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pl" rel="license" className="inline-flex min-h-11 items-center text-silver-300 underline underline-offset-2 hover:text-white">CC BY-SA 4.0</a></p>

            <FluidsTable />

            <div className="bg-neutral-950 border border-white/10 p-4 mt-6">
              <h3 className="font-semibold text-silver-400 mb-3">Numery OEM — filtry</h3>
              <OemQuickList filtersOnly />
            </div>
            <TorqueTable />
          </div>
        )}

        {tab === 'serwis' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>HARMONOGRAM SERWISOWY</h2>
            
            <p className="mb-4 text-sm text-neutral-400">Interwały wg instrukcji GM (1995 i 1999). Numery części sprawdzaj w katalogu dla swojego VIN i RPO.</p>
            <FluidsTable />

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-neutral-950 border border-white/10 p-4">
                <h3 className="font-semibold text-silver-400 mb-3">Co 5-8 tys. km</h3>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li>• Wymiana oleju silnikowego (4.7 L)</li>
                  <li>• Wymiana filtra oleju (PF1218)</li>
                  <li>• Sprawdzenie poziomu płynów</li>
                  <li>• Kontrola ciśnienia opon</li>
                </ul>
              </div>
              <div className="bg-neutral-950 border border-white/10 p-4">
                <h3 className="font-semibold text-silver-400 mb-3">Co 30-50 tys. km</h3>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li>• Filtr powietrza (A1300C — V8 1996+)</li>
                  <li>• Filtr paliwa (GF626 — 1996+; 1995: GF481)</li>
                  <li>• ATF + filtr (TF289)</li>
                  <li>• Świece zapłonowe (41-932 — Vortec 1996+)</li>
                  <li>• Olej dyferencjału</li>
                </ul>
              </div>
              <div className="bg-neutral-950 border border-white/10 p-4">
                <h3 className="font-semibold text-silver-400 mb-3">Co 100 tys. km</h3>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li>• Pasek klinowy</li>
                  <li>• Amortyzatory</li>
                  <li>• Płyn chłodzący (jeśli nie wcześniej)</li>
                  <li>• Kontrola zawieszenia</li>
                </ul>
              </div>
              <div className="bg-neutral-950 border border-white/10 p-4">
                <h3 className="font-semibold text-silver-400 mb-3">Sezonowo</h3>
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
            
            <div className="bg-neutral-950 border border-white/10 overflow-hidden mb-4">
              <button type="button" aria-label="Powiększ ilustrację" className="block w-full rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver-500" onClick={() => setLightbox('/guide-rdza-schemat.svg')}><img loading="lazy" src="/guide-rdza-schemat.svg" width={1200} height={840} alt="Schemat: gdzie szukać rdzy w GMT400 — progi, nadkola, podłoga kabiny, rama przy resorach, klapa, narożniki kabiny" className="w-full h-auto object-contain cursor-pointer"  /></button>
              <div className="p-4">
                <h3 className="font-semibold text-silver-400 mb-2">1. RDZA — NAJWIĘKSZY WRÓG</h3>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li>• <strong>Progi</strong> — sprawdź od spodu, rdza często ukryta pod listwami</li>
                  <li>• <strong>Nadkola</strong> — szczególnie tylne, woda zbiera się za błotnikiem</li>
                  <li>• <strong>Podłoga kabiny</strong> — pod dywanikami, przy pedałach</li>
                  <li>• <strong>Rama</strong> — przy mocowaniach resorów, za kołami</li>
                  <li>• <strong>Klapa</strong> — dolna krawędź, zawiasy</li>
                </ul>
                <p className="text-xs text-neutral-500 mt-2">Koszt naprawy: 2000-8000 PLN za progi, 5000-15000 PLN za ramę</p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-white/10 overflow-hidden mb-4">
              <button type="button" aria-label="Powiększ ilustrację" className="block w-full rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver-500" onClick={() => setLightbox('/guide-rama-schemat.svg')}><img loading="lazy" src="/guide-rama-schemat.svg" width={1200} height={840} alt="Schemat: rama GMT400 — co sprawdzić: mocowania zawieszenia, rama za kabiną, mocowania resorów, spawy i otwory, przód ramy, numer ramy" className="w-full h-auto object-contain cursor-pointer"  /></button>
              <div className="p-4">
                <h3 className="font-semibold text-silver-400 mb-2">2. RAMA — SPRAWDŹ DOKŁADNIE</h3>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li>• <strong>Pęknięcia</strong> — przy mocowaniach zawieszenia, za kabiną</li>
                  <li>• <strong>Korozja</strong> — szczególnie przy spawach i otworach</li>
                  <li>• <strong>Naprawy</strong> — świeże spawy = ukryta historia wypadku</li>
                  <li>• <strong>Numer ramy</strong> — musi zgadzać się z VIN</li>
                </ul>
                <p className="text-xs text-neutral-500 mt-2">Rama to szkielet auta — uszkodzona = duży problem</p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-white/10 overflow-hidden mb-4">
              <button type="button" aria-label="Powiększ ilustrację" className="block w-full rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver-500" onClick={() => setLightbox('/guide-engine.jpg')}><img loading="lazy" src="/guide-engine.jpg" alt="Silnik 5.7L" className="w-full h-48 object-cover cursor-pointer"  /></button>
              <div className="p-4">
                <h3 className="font-semibold text-silver-400 mb-2">3. SILNIK — CO SPRAWDZIĆ</h3>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li>• <strong>Olej</strong> — mleczny = uszczelka głowicy, metaliczne = zużycie</li>
                  <li>• <strong>Wycieki</strong> — uszczelka kolektora (typowy problem Vortec)</li>
                  <li>• <strong>Dym</strong> — niebieski = olej, biały = płyn, czarny = paliwo</li>
                  <li>• <strong>Kompresja</strong> — min. 10 bar na każdym cylindrze</li>
                  <li>• <strong>Rozruch</strong> — powinien odpalić w 2-3 sekundy</li>
                </ul>
                <p className="text-xs text-neutral-500 mt-2">Uszczelka kolektora: 1500-3000 PLN. Silnik: 5000-15000 PLN</p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-white/10 p-4 mb-4">
              <h3 className="font-semibold text-silver-400 mb-2">4. SKRZYNIA BIEGÓW</h3>
              <ul className="text-sm text-neutral-300 space-y-1">
                <li>• <strong>4L60E</strong> — szarpanie przy zmianie 2-3 = typowy problem</li>
                <li>• <strong>ATF</strong> — ciemny/spalony = zużycie, metaliczne = problem</li>
                <li>• <strong>Opóźnienie</strong> — długie przejście D-R = zużyta skrzynia</li>
                <li>• <strong>Jazda próbna</strong> — sprawdź wszystkie biegi, szczególnie 4.</li>
              </ul>
              <p className="text-xs text-neutral-500 mt-2">Regeneracja 4L60E: 3000-6000 PLN</p>
            </div>

            <div className="bg-neutral-950 border border-white/10 p-4 mb-4">
              <h3 className="font-semibold text-silver-400 mb-2">5. ZAWIESZENIE I HAMULCE</h3>
              <ul className="text-sm text-neutral-300 space-y-1">
                <li>• <strong>Tuleje</strong> — stukanie na nierównościach = zużyte</li>
                <li>• <strong>Sworznie</strong> — luz na kole = wymiana</li>
                <li>• <strong>Amortyzatory</strong> — kołysanie po naciśnięciu = zużyte</li>
                <li>• <strong>Hamulce</strong> — tarcze min. 28mm, klocki min. 3mm</li>
                <li>• <strong>Przewody</strong> — rdza na przewodach hamulcowych = wymiana</li>
              </ul>
              <p className="text-xs text-neutral-500 mt-2">Komplet zawieszenia: 2000-4000 PLN. Hamulce: 1000-2000 PLN</p>
            </div>

            <div className="bg-neutral-950 border border-silver-600/30 p-4">
              <h3 className="font-semibold text-silver-400 mb-2">CHECKLIST PRZED ZAKUPEM</h3>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-neutral-300">
                <div>☐ VIN zgodny z dokumentami</div>
                <div>☐ Numer ramy zgodny z VIN</div>
                <div>☐ Brak poważnej rdzy na ramie</div>
                <div>☐ Silnik odpala bez problemu</div>
                <div>☐ Brak dymu z wydechu</div>
                <div>☐ Skrzynia zmienia biegi płynnie</div>
                <div>☐ Brak stuków w zawieszeniu</div>
                <div>☐ Hamulce działają prawidłowo</div>
                <div>☐ Klimatyzacja działa (jeśli jest)</div>
                <div>☐ Wszystkie światła działają</div>
                <div>☐ Szyby otwierają się</div>
                <div>☐ Brak wycieków płynów</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'tuning' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>TUNING I MODYFIKACJE</h2>
            
            <input aria-label="Szukaj modyfikacji" 
              type="text" 
              placeholder="Szukaj modyfikacji (np. lift, headers, LS swap)..." 
              value={tuningQuery}
              onChange={(e) => setTuningQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-silver-600 mb-4"
            />
            
            <div className="flex flex-wrap gap-2 mb-6">
              {['wszystkie', 'zawieszenie', 'silnik', 'wydech', 'skrzynia', 'hamulce'].map(f => (
                <button key={f} onClick={() => setTuningFilter(f)}
                  className={`px-3 py-1 text-sm ${tuningFilter === f ? 'bg-silver-600 text-neutral-950' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {[
                { kat: 'zawieszenie', nazwa: 'Lift 10–15 cm (4–6 cali)', efekt: '+10–15 cm (4–6") wysokości, większe opony 33–35"', czesci: 'Rough Country / BDS kit', koszt: '3000-6000 PLN', opis: 'Pełny kit z krzyżownicami, wahaczami i blokami.', model: 'K1500 4x4', img: '/mod-lift.jpg' },
                { kat: 'zawieszenie', nazwa: 'Leveling kit (torsion crank)', efekt: '+2,5–5 cm (1–2") przód, poziomowanie', czesci: 'Fabryczne klucze torsion', koszt: '0 PLN (DIY)', opis: 'Kręcenie kluczy torsion bars. Maks. 5 cm (2") bez problemów. Więcej = zużycie części.' },
                { kat: 'zawieszenie', nazwa: 'Drop 4/6 (obniżenie)', efekt: '−10 cm (4") przód, −15 cm (6") tył', czesci: 'CPP Drop Springs + Flip Kit', koszt: '2000-4000 PLN', opis: 'Obniżenie dla stylu street. Drop springs + flip kit + shackles.', model: 'C1500 2WD', img: '/mod-drop.jpg' },
                { kat: 'zawieszenie', nazwa: 'Coilover conversion', efekt: 'Regulowana wysokość, lepsza jazda', czesci: 'QA1 / Ridetech kit', koszt: '8000-15000 PLN', opis: 'Zamiana sprężyn na coilover. Pełna regulacja i lepsza kontrola.' },
                { kat: 'silnik', nazwa: 'LS Swap 5.3L', efekt: '+100-150 KM, nowoczesność', czesci: '5.3L LM7 + 4L60E/4L80E', koszt: '8000-15000 PLN', opis: 'Najpopularniejszy swap. 5.3L z GMT800. Wymaga okablowania i ECU.', model: 'Wszystkie GMT400', img: '/mod-ls.jpg' },
                { kat: 'silnik', nazwa: 'LS Swap 6.0L', efekt: '+150-200 KM, moment do holowania', czesci: '6.0L LQ4 + 4L80E', koszt: '12000-20000 PLN', opis: 'Dla cięższych aut i holowania. Więcej momentu niż 5.3L.' },
                { kat: 'silnik', nazwa: 'Headers (kolektory)', efekt: '+10-20 KM, lepszy dźwięk', czesci: 'Flowtech / Hedman headers', koszt: '800-2000 PLN', opis: 'Zamiana fabrycznych kolektorów. Shorty lub long tube.' },
                { kat: 'silnik', nazwa: 'Cold Air Intake', efekt: '+5-10 KM, lepszy dźwięk', czesci: 'K&N / Airaid kit', koszt: '400-800 PLN', opis: 'Zimne powietrze do silnika. Prosty montaż.' },
                { kat: 'wydech', nazwa: 'Cat-back exhaust', efekt: 'Lepszy dźwięk, +5-10 KM', czesci: 'Magnaflow / Flowmaster', koszt: '1500-3000 PLN', opis: 'Wydech od katalizatora. Średnica 64 mm (2,5") lub 76 mm (3").' },
                { kat: 'wydech', nazwa: 'Pełny wydech 76 mm (3")', efekt: '+15-25 KM z headers', czesci: 'Headers + system 76 mm (3")', koszt: '3000-5000 PLN', opis: 'Headers + Y-pipe + cat-back 76 mm (3"). Maksymalny przepływ.', model: 'Wszystkie V8', img: '/mod-exhaust.jpg' },
                { kat: 'skrzynia', nazwa: '4L60E rebuild', efekt: 'Niezawodność, trzymanie mocy', czesci: 'Sonnax kit + frictions', koszt: '3000-6000 PLN', opis: 'Regeneracja z ulepszonymi częściami. Shift kit, hardened sun shell.' },
                { kat: 'skrzynia', nazwa: '4L80E swap', efekt: 'Wytrzymałość na moc', czesci: '4L80E + crossmember + shaft', koszt: '5000-10000 PLN', opis: 'Dla LS swap i mocy powyżej 400 KM. Wymaga modyfikacji.' },
                { kat: 'hamulce', nazwa: 'Big brake kit', efekt: 'Krótsza droga hamowania', czesci: 'Wilwood / Pro Performance', koszt: '3000-6000 PLN', opis: 'Większe tarcze i zaciski. Dla obniżonych i szybkich aut.' },
                { kat: 'hamulce', nazwa: 'Tarcze tył (zamiast bębnów)', efekt: 'Lepsze hamowanie tyłu', czesci: 'Disc conversion kit', koszt: '1500-3000 PLN', opis: 'Zamiana bębnów na tarcze. Lepsze hamowanie i łatwiejszy serwis.' },
                { kat: 'silnik', nazwa: 'Chip/tuner', efekt: '+15-30 KM', czesci: 'Hypertech / DiabloSport', koszt: '800-1500 PLN', opis: 'Zmiana mapy silnika. Więcej mocy bez modyfikacji mechanicznych.', model: 'Vortec 1996+' },
                { kat: 'silnik', nazwa: 'Przepustnica większa', efekt: '+5-10 KM', czesci: 'BBK / Edelbrock', koszt: '600-1200 PLN', opis: 'Większa przepustnica = więcej powietrza. Wymaga tuningu.', model: 'Vortec' },
                { kat: 'wydech', nazwa: 'Usunięcie katalizatora', efekt: '+10-15 KM', czesci: 'Test pipe', koszt: '300-600 PLN', opis: 'Tylko na tor! Nielegalne na drodze w PL.', model: 'Wszystkie' },
                { kat: 'zawieszenie', nazwa: 'Sway bar (stabilizator)', efekt: 'Mniej przechyłów', czesci: 'Hellwig / Addco', koszt: '800-1500 PLN', opis: 'Grubszy stabilizator = mniej przechyłów w zakrętach.', model: 'Wszystkie' },
                { kat: 'zawieszenie', nazwa: 'Polyurethane bushings', efekt: 'Sztywniejsze zawieszenie', czesci: 'Energy Suspension', koszt: '400-800 PLN', opis: 'Zamiana gumowych tulei na poliuretanowe. Lepsza kontrola.', model: 'Wszystkie' },
              ].filter(m => (tuningFilter === 'wszystkie' || m.kat === tuningFilter) && (!tuningQuery || m.nazwa.toLowerCase().includes(tuningQuery.toLowerCase()) || m.opis.toLowerCase().includes(tuningQuery.toLowerCase()))).map((m, idx) => (
                <div key={idx} className="bg-neutral-950 border border-white/10 overflow-hidden">
                  {m.img && <button type="button" aria-label="Powiększ ilustrację" className="block w-full rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver-500" onClick={() => setLightbox(m.img)}><img loading="lazy" src={m.img} alt={m.nazwa} className="w-full h-40 object-cover cursor-pointer"  /></button>}
                  <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{m.nazwa}</h3>
                    <span className="text-xs bg-silver-600 text-neutral-950 px-2 py-0.5">{m.koszt}</span>
                  </div>
                  <p className="text-silver-400 text-sm mb-2">Efekt: {m.efekt}</p>
                  <p className="text-neutral-300 text-sm mb-2">{m.opis}</p>
                  <p className="text-neutral-500 text-xs">Części: {m.czesci}</p>
                  {m.model && <p className="text-silver-400 text-xs mt-1">Model: {m.model}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'import' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>IMPORT DO POLSKI</h2>
            
            <ImportCostCalculator />

            <div className="bg-neutral-950 border border-silver-600/60 p-4 mb-4" data-testid="import-guide-link">
              <h3 className="font-semibold text-silver-400 mb-3">AKTUALNY PORADNIK Z ŹRÓDŁAMI (stan na 24.10.2026)</h3>
              <p className="text-sm text-neutral-300 leading-6">Pełny opis opłat, procedury, kalkulator cła/akcyzy/VAT, trasa USA→DE/NL→PL i zabytek CN 9705 — z linkami do przepisów i datami: <Link href="/dla-wlasciciela/import" className="inline-flex min-h-11 items-center text-silver-300 underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver-500">Sprowadzenie i rejestracja z USA/UE</Link>.</p>
              <ul className="mt-3 text-sm text-neutral-300 space-y-2 list-disc pl-5 leading-6">
                <li>Akcyza 18,6% dotyczy samochodów osobowych (CN 8703) powyżej 2000 cm³, 3,1% do 2000 cm³; pickup N1 (CN 8704) akcyzy nie ma, ale „pickup” nie oznacza automatycznie takiej klasyfikacji.</li>
                <li>Opłata recyklingowa: zniesiona od 1.01.2016.</li>
                <li>Od 1.07.2026 cło 0% dla osobowych z pochodzeniem USA (z dowodem pochodzenia); bez dowodu 10%.</li>
                <li>Rejestracja w 30 dni; kara 500 zł (1000 zł po 180 dniach).</li>
                <li>Światła, LPG, żółte tablice: <Link href="/dla-wlasciciela/swiatla-eu" className="text-silver-300 underline">światła</Link>, <Link href="/dla-wlasciciela/lpg" className="text-silver-300 underline">LPG</Link>, <Link href="/dla-wlasciciela/zolte-tablice" className="text-silver-300 underline">żółte tablice</Link>. Przepisy się zmieniają — sprawdź w urzędzie.</li>
              </ul>
            </div>
          </div>
        )}

        {tab === 'tips' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>TIPS & TRICKS</h2>
            <AdditionalTips />
            
            <div className="bg-neutral-950 border border-white/10 overflow-hidden mb-4">
              <button type="button" aria-label="Powiększ ilustrację" className="block w-full rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver-500" onClick={() => setLightbox('/tip-obd.jpg')}><img loading="lazy" src="/tip-obd.jpg" alt="OBD1" className="w-full h-48 object-cover cursor-pointer"  /></button>
              <div className="p-4">
                <h3 className="font-semibold text-silver-400 mb-2">1. KODY OBD-I BEZ SKANERA (1988-1995)</h3>
                <p className="text-sm text-neutral-300 mb-2">Odczytaj kody błędów spinaczem — bez skanera!</p>
                <ol className="text-sm text-neutral-300 space-y-1 list-decimal list-inside">
                  <li>Znajdź złącze ALDL pod deską (12-pin)</li>
                  <li>Zewrzyj piny A i B spinaczem</li>
                  <li>Włącz zapłon (nie uruchamiaj silnika)</li>
                  <li>Licz mignięcia kontrolki Check Engine</li>
                </ol>
                <p className="text-xs text-neutral-500 mt-2">Kod 12 = system OK. 1 mignięcie + pauza + 2 = kod 12</p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-white/10 overflow-hidden mb-4">
              <button type="button" aria-label="Powiększ ilustrację" className="block w-full rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver-500" onClick={() => setLightbox('/tip-torsion.jpg')}><img loading="lazy" src="/tip-torsion.jpg" alt="Torsion" className="w-full h-48 object-cover cursor-pointer"  /></button>
              <div className="p-4">
                <h3 className="font-semibold text-silver-400 mb-2">2. POZIOMOWANIE 4x4 (TORSION CRANK)</h3>
                <p className="text-sm text-neutral-300 mb-2">Podnieś przód o 1-2" bez kitów — fabryczne torsion bars.</p>
                <ol className="text-sm text-neutral-300 space-y-1 list-decimal list-inside">
                  <li>Znajdź śruby regulacyjne przy krzyżownicy (18mm)</li>
                  <li>Kręć zgodnie z ruchem wskazówek = wyżej</li>
                  <li>2-3 obroty = ~1" wysokości</li>
                  <li>Kręć równo po obu stronach</li>
                  <li>Zrób geometrię po regulacji</li>
                </ol>
                <p className="text-xs text-neutral-500 mt-2">Max 2" — więcej = zużycie części i twarda jazda</p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-white/10 p-4 mb-4">
              <h3 className="font-semibold text-silver-400 mb-2">3. SPRAWDŹ PRZEŁOŻENIE OSI BEZ ROZBIERANIA</h3>
              <button type="button" onClick={() => setLightbox('/tip-axle-ratio-guide.svg')} aria-label="Powiększ schemat testu przełożenia" className="block w-full my-4"><img src="/tip-axle-ratio-guide.svg" alt="Otwarty mechanizm: jedno koło nieruchome, drugie dwa obroty; liczymy obroty wału" className="w-full h-auto" /></button>
              <p className="text-sm text-neutral-300 mb-2">Najpierw odczytaj RPO. Jeśli most był zmieniany, kod może nie odpowiadać obecnemu przełożeniu.</p>
              <p className="text-sm text-silver-200 mb-2">Próba wymaga rozpoznania mechanizmu i bezpiecznego podparcia auta. Równe, twarde podłoże, kliny pod kołami pozostającymi na ziemi i podpory o odpowiedniej nośności w punktach zalecanych przez producenta. Nie pracuj pod autem opartym wyłącznie na podnośniku. Silnik wyłączony; koła obracaj tylko ręcznie. Zabezpiecz auto przed przetoczeniem przed ustawieniem skrzyni w N i zwolnieniem hamulca postojowego. Jeśli nie potrafisz bezpiecznie przygotować auta, zleć próbę warsztatowi.</p>
              <ul className="text-sm text-neutral-300 space-y-2 list-disc list-inside">
                <li>Otwarty mechanizm, drugie koło nieruchome: oznacz oponę i wał, obróć swobodne koło o dwa pełne obroty i policz obroty wału.</li>
                <li>Gdy oba koła rzeczywiście obracają się razem w tę samą stronę: jeden pełny obrót obu kół odpowiada liczbie obrotów wału równej przełożeniu. Nie zakładaj automatycznie takiego zachowania przy każdym mechanizmie z blokadą.</li>
                <li>Przykładowo około 3,73 obrotu wału oznacza około 3,73:1. To oszacowanie, nie dokładny pomiar liczby zębów.</li>
              </ul>
              <p className="text-xs text-neutral-400 mt-3">Schemat poglądowy, bez wskazania punktów podparcia. <a href="https://differentials.com/technical-help-2/differential-faqs/" target="_blank" rel="noopener noreferrer" className="underline">Źródło: West Coast Differentials — What gear ratio do I have?</a></p>
            </div>

            <div className="bg-neutral-950 border border-white/10 p-4 mb-4">
              <h3 className="font-semibold text-silver-400 mb-2">4. UKRYTY KLUCZ POD ZDERZAKIEM</h3>
              <p className="text-sm text-neutral-300 mb-2">Niektóre GMT400 mają schowek na klucz awaryjny.</p>
              <ul className="text-sm text-neutral-300 space-y-1">
                <li>• Sprawdź pod przednim zderzakiem przy ramie</li>
                <li>• Często przywiązany drutem do wspornika</li>
                <li>• Otwiera tylko drzwi, nie zapłon</li>
              </ul>
            </div>

            <div className="bg-neutral-950 border border-white/10 p-4 mb-4">
              <h3 className="font-semibold text-silver-400 mb-2">5. KODY RPO W SCHOWKU</h3>
              <button type="button" onClick={() => setLightbox('/tip-rpo-guide.svg')} aria-label="Powiększ schemat naklejki RPO" className="block w-full my-4"><img src="/tip-rpo-guide.svg" alt="Schemat schowka pasażera i przykładowej naklejki: GT4 oznacza przełożenie 3,73" className="w-full h-auto" /></button>
              <p className="text-xs text-neutral-400 mb-3">Schemat lokalizacji jest poglądowy. Kody na ilustracji są przykładem, nie danymi Twojego auta. RPO opisuje wyposażenie fabryczne, nie późniejsze przeróbki. <a href="https://differentials.com/gm-axle-ratio-identification-codes/" target="_blank" rel="noopener noreferrer" className="underline">Źródło kodów przełożeń</a></p>
              <p className="text-sm text-neutral-300 mb-2">Naklejka w schowku zawiera wszystkie opcje fabryczne.</p>
              <div className="text-sm text-neutral-300">
                <p className="mb-1"><strong>Przełożenia:</strong></p>
                <p>GU6 = 3.42 | GT4 = 3.73 | GT5 = 4.10 | HC4 = 4.56</p>
                <p className="mt-2 mb-1"><strong>Silniki:</strong></p>
                <p>L35 = 4.3L | L30 = 5.0L | L31 = 5.7L Vortec</p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-white/10 overflow-hidden mb-4">
              <button type="button" aria-label="Powiększ ilustrację" className="block w-full rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver-500" onClick={() => setLightbox('/tip-fuse.jpg')}><img loading="lazy" src="/tip-fuse.jpg" alt="Fuse box" className="w-full h-48 object-cover cursor-pointer"  /></button>
              <div className="p-4">
                <h3 className="font-semibold text-silver-400 mb-2">7. SKRZYNKA BEZPIECZNIKÓW POD MASKĄ</h3>
                <p className="text-sm text-neutral-300 mb-2">Lokalizacja: tył komory silnika, przy zbiorniku hamulcowym.</p>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li>• <strong>ECM-B</strong> — pompa paliwa, PCM</li>
                  <li>• <strong>HORN</strong> — klakson, lampy pod maską</li>
                  <li>• <strong>GLOW PLUG</strong> — świece żarowe (diesel)</li>
                  <li>• <strong>FUEL SOL</strong> — solenoid paliwa (diesel)</li>
                </ul>
                <p className="text-xs text-neutral-500 mt-2">Schemat na wewnętrznej stronie pokrywy</p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-white/10 overflow-hidden mb-4">
              <button type="button" aria-label="Powiększ ilustrację" className="block w-full rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver-500" onClick={() => setLightbox('/tip-tailgate.jpg')}><img loading="lazy" src="/tip-tailgate.jpg" alt="Tailgate" className="w-full h-48 object-cover cursor-pointer"  /></button>
              <div className="p-4">
                <h3 className="font-semibold text-silver-400 mb-2">8. KLAPA NIE OTWIERA SIĘ — TRIK</h3>
                <p className="text-sm text-neutral-300 mb-2">Typowy problem: zacięty mechanizm lub zerwane klipsy.</p>
                <ol className="text-sm text-neutral-300 space-y-1 list-decimal list-inside">
                  <li>Zdejmij osłonę klamki (3 śruby Torx)</li>
                  <li>Sprawdź klipsy łączące drążki</li>
                  <li>Nasmaruj mechanizm WD-40</li>
                  <li>Jeśli zerwane — wymień klipsy lub klamkę (GM 15991785 to klamka klapy z mocowaniami, nie same klipsy — sprawdź po VIN / w katalogu GM)</li>
                </ol>
                <p className="text-xs text-neutral-500 mt-2">Trik awaryjny: wciśnij zatrzaski z boków jednocześnie</p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-white/10 p-4 mb-4">
              <h3 className="font-semibold text-silver-400 mb-2">9. UKRYTY BEZPIECZNIK POMPY PALIWA</h3>
              <p className="text-sm text-neutral-300 mb-2">Jeśli silnik nie odpala — sprawdź ten bezpiecznik.</p>
              <ul className="text-sm text-neutral-300 space-y-1">
                <li>• Lokalizacja: skrzynka pod deską, bezpiecznik ECM-B</li>
                <li>• Wartość: 20A</li>
                <li>• Zasila: pompę paliwa i PCM</li>
              </ul>
              <p className="text-xs text-neutral-500 mt-2">Częsta przyczyna "nie odpala" — prosty test</p>
            </div>

            <div className="bg-neutral-950 border border-white/10 p-4 mb-4">
              <h3 className="font-semibold text-silver-400 mb-2">10. TEST KOMPRESJI BEZ NARZĘDZI</h3>
              <p className="text-sm text-neutral-300 mb-2">Szybki test stanu silnika.</p>
              <ol className="text-sm text-neutral-300 space-y-1 list-decimal list-inside">
                <li>Wykręć wszystkie świece</li>
                <li>Zakryj otwór świecy kciukiem</li>
                <li>Kręć rozrusznikiem 2-3 sekundy</li>
                <li>Porównaj ciśnienie na każdym cylindrze</li>
              </ol>
              <p className="text-xs text-neutral-500 mt-2">Słabe ciśnienie = zużyte pierścienie lub zawory</p>
            </div>

            <div className="bg-neutral-950 border border-white/10 p-4 mb-4">
              <h3 className="font-semibold text-silver-400 mb-2">11. TEST POMPY PALIWA</h3>
              <p className="text-sm text-neutral-300 mb-2">Szybki test czy pompa dziala.</p>
              <ol className="text-sm text-neutral-300 space-y-1 list-decimal list-inside">
                <li>Znajdz przekaznik pompy (skrzynka pod maska)</li>
                <li>Wyjmij przekaznik</li>
                <li>Zewrzyj piny 30 i 87 drutem</li>
                <li>Sluchaj buczenia pompy</li>
              </ol>
            </div>
            <div className="bg-neutral-950 border border-white/10 p-4 mb-4">
              <h3 className="font-semibold text-silver-400 mb-2">12. TEMPOMAT — JAK UZYWAC</h3>
              <ul className="text-sm text-neutral-300 space-y-1">
                <li>ON — przesun przelacznik w strone kolumny</li>
                <li>SET — przycisk na koncu dzwigni</li>
                <li>RESUME — przesun ponownie</li>
                <li>Działa od 40 km/h (25 mph)</li>
              </ul>
            </div>
            <div className="bg-neutral-950 border border-white/10 p-4 mb-4">
              <h3 className="font-semibold text-silver-400 mb-2">13. 4x4 — PRAWIDLOWE PRZELACZANIE</h3>
              <ul className="text-sm text-neutral-300 space-y-1">
                <li>4HI — mozna w trakcie jazdy (do 80 km/h)</li>
                <li>4LO — tylko na postoju, skrzynia w N</li>
                <li>Przesun dzwignie jednym plynny ruchem</li>
              </ul>
            </div>
            <div className="bg-neutral-950 border border-white/10 p-4">
              <h3 className="font-semibold text-silver-400 mb-2">6. RESET ADAPTACJI SKRZYNI 4L60E</h3>
              <p className="text-sm text-neutral-300 mb-2">Po wymianie ATF skrzynia "uczy się" od nowa.</p>
              <ol className="text-sm text-neutral-300 space-y-1 list-decimal list-inside">
                <li>Odłącz akumulator na 30 minut</li>
                <li>Podłącz i uruchom silnik</li>
                <li>Przełącz wszystkie biegi po 5 sekund</li>
                <li>Przejedź 50 km w różnych warunkach</li>
              </ol>
              <p className="text-xs text-neutral-500 mt-2">Poprawia jakość zmiany biegów</p>
            </div>
          </div>
        )}

        {tab === 'kalkulator' && (<div><button onClick={() => shareSection('kalkulator')} className="text-sm text-neutral-400 mb-4">Udostępnij</button><RepairCostCalculator /></div>)}

        {tab === 'porownaj' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>PORÓWNYWARKA MODELI</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-silver-600/30">
                    <th className="text-left p-2">Parametr</th>
                    <th className="text-center p-2 text-silver-400">C1500</th>
                    <th className="text-center p-2 text-silver-400">K1500</th>
                    <th className="text-center p-2 text-silver-400">Tahoe</th>
                    <th className="text-center p-2 text-silver-400">Suburban</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  <tr className="border-b border-white/5"><td className="p-2">Napęd</td><td className="text-center">2WD</td><td className="text-center">4WD</td><td className="text-center">2WD/4WD</td><td className="text-center">2WD/4WD</td></tr>
                  <tr className="border-b border-white/5"><td className="p-2">Długość</td><td className="text-center">4.9-5.5m</td><td className="text-center">4.9-5.5m</td><td className="text-center">4.8m</td><td className="text-center">5.6m</td></tr>
                  <tr className="border-b border-white/5"><td className="p-2">Ładowność</td><td className="text-center">700-900 kg</td><td className="text-center">650-850 kg</td><td className="text-center">600 kg</td><td className="text-center">700 kg</td></tr>
                  <tr className="border-b border-white/5"><td className="p-2">Miejsca</td><td className="text-center">3-6</td><td className="text-center">3-6</td><td className="text-center">5-6</td><td className="text-center">6-9</td></tr>
                  <tr className="border-b border-white/5"><td className="p-2">Silniki</td><td className="text-center">4.3-5.7L</td><td className="text-center">4.3-5.7L</td><td className="text-center">5.7L</td><td className="text-center">5.7-7.4L</td></tr>
                  <tr className="border-b border-white/5"><td className="p-2">Spalanie</td><td className="text-center">12-15 L</td><td className="text-center">14-17 L</td><td className="text-center">14-16 L</td><td className="text-center">15-18 L</td></tr>
                  <tr className="border-b border-white/5"><td className="p-2">Cena części</td><td className="text-center font-semibold text-silver-100">Niska</td><td className="text-center text-silver-400">Średnia</td><td className="text-center text-silver-400">Średnia</td><td className="text-center text-silver-400">Wyższa</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'paliwo' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>KALKULATOR ZUŻYCIA PALIWA</h2>
            <div className="bg-neutral-950 border border-white/10 p-4 mb-4 space-y-4">
              <div>
                <label className="text-sm text-neutral-400 block mb-1">Przejechane km:</label>
                <input aria-label="Przejechany dystans (km)" type="number" value={fuelKm} onChange={e => setFuelKm(Number(e.target.value))} className="w-full bg-neutral-900 border border-white/10 p-2 text-sm" />
              </div>
              <div>
                <label className="text-sm text-neutral-400 block mb-1">Zatankowane litry:</label>
                <input aria-label="Zużyte paliwo (litry)" type="number" value={fuelLiters} onChange={e => setFuelLiters(Number(e.target.value))} className="w-full bg-neutral-900 border border-white/10 p-2 text-sm" />
              </div>
              <div>
                <label className="text-sm text-neutral-400 block mb-1">Cena za litr (PLN):</label>
                <input aria-label="Cena paliwa (PLN za litr)" type="number" step="0.1" value={fuelPrice} onChange={e => setFuelPrice(Number(e.target.value))} className="w-full bg-neutral-900 border border-white/10 p-2 text-sm" />
              </div>
            </div>
            <div className="bg-neutral-950 border border-silver-600/30 p-4">
              <h3 className="font-semibold text-silver-400 mb-4">WYNIKI</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Średnie spalanie:</span><span className="text-silver-400 font-bold">{((fuelLiters / fuelKm) * 100).toFixed(1)} L/100km</span></div>
                <div className="flex justify-between"><span>Koszt na 100 km:</span><span className="text-silver-400 font-bold">{(((fuelLiters / fuelKm) * 100) * fuelPrice).toFixed(0)} PLN</span></div>
                <div className="flex justify-between"><span>Koszt na km:</span><span>{((fuelLiters / fuelKm) * fuelPrice).toFixed(2)} PLN</span></div>
                <div className="flex justify-between border-t border-white/10 pt-2"><span>Koszt tankowania:</span><span>{(fuelLiters * fuelPrice).toFixed(0)} PLN</span></div>
              </div>
              <div className="mt-4 text-xs text-neutral-500">
                <p>Porównanie GMT400: 4.3L ~13L | 5.7L ~15L | 7.4L ~18L | 6.5D ~12L</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'mojeauto' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>MOJE AUTO</h2>
            <div className="bg-neutral-950 border border-silver-600/30 p-4">
              <p className="text-sm text-neutral-300">Zapisz VIN albo model i rocznik na stronie „Mój samochód”. Zobaczysz tam bezpieczniki dla Twojego rocznika, usterki, DIY, porady, części i kody RPO dopasowane do auta. Dane zostają tylko w tej przeglądarce.</p>
              <Link href="/moj-samochod" className="mt-3 inline-flex min-h-11 items-center bg-silver-600 px-4 font-semibold text-neutral-950 hover:bg-silver-500">Przejdź do „Mój samochód”</Link>
            </div>
          </div>
        )}

        {tab === 'dziennik' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>DZIENNIK SERWISOWY</h2>
            <div className="bg-neutral-950 border border-white/10 p-4 mb-4">
              <h3 className="font-semibold text-silver-400 mb-3">HARMONOGRAM WYMIAN</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div>
                    <p className="text-sm font-medium">Olej silnikowy</p>
                    <p className="text-xs text-neutral-500">Co 5-8 tys. km lub 6 miesięcy</p>
                  </div>
                  <span className="text-silver-400 text-sm">PF1218</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div>
                    <p className="text-sm font-medium">Filtr powietrza</p>
                    <p className="text-xs text-neutral-500">Co 30 tys. km</p>
                  </div>
                  <span className="text-silver-400 text-sm">A1300C</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div>
                    <p className="text-sm font-medium">Filtr paliwa</p>
                    <p className="text-xs text-neutral-500">Co 50 tys. km</p>
                  </div>
                  <span className="text-silver-400 text-sm">GF626</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div>
                    <p className="text-sm font-medium">Świece zapłonowe</p>
                    <p className="text-xs text-neutral-500">Co 50 tys. km</p>
                  </div>
                  <span className="text-silver-400 text-sm">41-932</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div>
                    <p className="text-sm font-medium">ATF 4L60E</p>
                    <p className="text-xs text-neutral-500">Co 50 tys. km</p>
                  </div>
                  <span className="text-silver-400 text-sm">TF289</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div>
                    <p className="text-sm font-medium">Płyn chłodzący</p>
                    <p className="text-xs text-neutral-500">Co 5 lat lub 100 tys. km</p>
                  </div>
                  <span className="text-silver-400 text-sm">Dex-Cool</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div>
                    <p className="text-sm font-medium">Płyn hamulcowy</p>
                    <p className="text-xs text-neutral-500">Co 2 lata</p>
                  </div>
                  <span className="text-silver-400 text-sm">DOT 3</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Rozrząd</p>
                    <p className="text-xs text-neutral-500">Co 100 tys. km</p>
                  </div>
                  <span className="text-silver-400 text-sm">Gates</span>
                </div>
              </div>
            </div>
            <div className="bg-neutral-950 border border-silver-600/30 p-4">
              <h3 className="font-semibold text-silver-400 mb-3">KOSZTY ROCZNE (szacunek)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Olej + filtr (2x)</span><span>400 PLN</span></div>
                <div className="flex justify-between"><span>Filtry (powietrze, paliwo)</span><span>150 PLN</span></div>
                <div className="flex justify-between"><span>Drobne naprawy</span><span>500 PLN</span></div>
                <div className="flex justify-between font-bold border-t border-silver-600/30 pt-2"><span>RAZEM / ROK</span><span className="text-silver-400">~1050 PLN</span></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'historia' && (
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>HISTORIA GMT400</h2>
            <div className="bg-neutral-950 border border-white/10 p-6">
              <p className="text-neutral-300 mb-4">Platforma GMT400 była produkowana w latach 1988–2002 (pickupy C/K w większości do 1998–1999, Tahoe/Yukon do 2000, C3500HD do 2002).</p>
              <div className="space-y-2 text-sm text-neutral-400">
                <p><span className="text-silver-400">1988:</span> Debiut C/K 1500/2500/3500</p>
                <p><span className="text-silver-400">1992:</span> Suburban, Blazer (1992–1994) i GMC Yukon (2-drzwi) na platformie GMT400</p>
                <p><span className="text-silver-400">1993:</span> 4L60-E zastępuje 700R4/4L60</p>
                <p><span className="text-silver-400">1995:</span> Blazer przemianowany na Tahoe; wersje 4-drzwiowe Tahoe i Yukon; lifting wnętrza (nowa deska, poduszka kierowcy)</p>
                <p><span className="text-silver-400">1996:</span> Silniki Vortec, OBD-II, trzecie drzwi w Extended Cab</p>
                <p><span className="text-silver-400">1998–1999:</span> NV246 AutoTrac (1998); Yukon Denali (1999)</p>
                <p><span className="text-silver-400">1999–2000:</span> Pickupy i Suburban przechodzą na GMT800 (1999/2000); Tahoe/Yukon 4-drzwi do 2000, C3500HD do 2002</p>
                <p className="pt-2 text-xs text-neutral-500">Źródła: Wikipedia — Chevrolet C/K (4. generacja), Chevrolet Tahoe, GMT400. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).</p>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
