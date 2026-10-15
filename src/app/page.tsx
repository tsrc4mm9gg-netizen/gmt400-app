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

const modelImages: Record<string, string> = {
  'Tahoe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/1997_Chevrolet_Tahoe.jpg/800px-1997_Chevrolet_Tahoe.jpg',
  'Suburban': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/1999_Chevrolet_Suburban.jpg/800px-1999_Chevrolet_Suburban.jpg',
  'C/K': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/1995_Chevrolet_C1500.jpg/800px-1995_Chevrolet_C1500.jpg',
  'Yukon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/1998_GMC_Yukon.jpg/800px-1998_GMC_Yukon.jpg',
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('modele');
  const [category, setCategory] = useState('Wszystkie');

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

  const filteredModels = useMemo(() =>
    models.filter(m =>
      m.Nazwa.toLowerCase().includes(query.toLowerCase()) ||
      (m.Opis || '').toLowerCase().includes(query.toLowerCase())
    ), [models, query]);

  const filteredIssues = useMemo(() => {
    let result = issues;
    if (category !== 'Wszystkie') result = result.filter(i => i.Model === category);
    return result.filter(i =>
      i.Nazwa.toLowerCase().includes(query.toLowerCase()) ||
      (i.Objawy || '').toLowerCase().includes(query.toLowerCase()) ||
      (i.Rozwiązanie || '').toLowerCase().includes(query.toLowerCase())
    );
  }, [issues, query, category]);

  const filteredCodes = useMemo(() =>
    codes.filter(c =>
      c.Nazwa.toLowerCase().includes(query.toLowerCase()) ||
      (c.Opis || '').toLowerCase().includes(query.toLowerCase()) ||
      (c.Rozwiązanie || '').toLowerCase().includes(query.toLowerCase())
    ), [codes, query]);

  const filteredTips = useMemo(() =>
    tips.filter(t =>
      t.Nazwa.toLowerCase().includes(query.toLowerCase()) ||
      (t.Rozwiązanie || '').toLowerCase().includes(query.toLowerCase())
    ), [tips, query]);

  const categories = ['Wszystkie', ...Array.from(new Set(issues.map(i => i.Model).filter(Boolean)))];

  if (loading) {
    return <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">Ładowanie bazy...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">GMT<span className="text-amber-400">400</span></h1>
          <input
            type="search"
            placeholder="Szukaj modelu, usterki, kodu, porady..."
            className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm w-full sm:w-80 focus:outline-none focus:border-amber-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <section className="bg-gradient-to-b from-neutral-900 to-neutral-950 py-16 px-4 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">Encyklopedia GMT400</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
          Dane z bazy Notion • Chevrolet C/K, Tahoe, Suburban, Yukon (1988–2000)
        </p>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map((m, idx) => (
              <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-amber-400 transition">
                {modelImages[m.Model] && (
                  <img src={modelImages[m.Model]} alt={m.Nazwa} className="w-full h-40 object-cover" />
                )}
                <div className="p-5">
                  <h3 className="text-amber-400 font-semibold text-lg">{m.Nazwa}</h3>
                  <p className="text-sm text-neutral-500 mb-1">{m.Lata} • {m.Model}</p>
                  <p className="text-neutral-300 text-sm">{m.Opis}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'usterki' && (
          <div>
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    category === cat ? 'bg-amber-400 text-black' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
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
          </div>
        )}

        {tab === 'kody' && (
          <div>
            <div className="mb-6 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-amber-400 font-semibold mb-3">Schemat cewek 4L60E</h3>
              <img src="https://www.sonnax.com/tech_resources/images/614/4L60E-Valve-Body.jpg" alt="4L60E solenoids" className="w-full max-w-2xl mx-auto rounded" />
              <p className="text-sm text-neutral-400 mt-2">Lokalizacja cewek w skrzyni 4L60E (pomocne przy kodach P07xx)</p>
            </div>
            <div className="space-y-4">
              {filteredCodes.map((c, idx) => (
                <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                  <h3 className="font-semibold text-amber-400 mb-1">{c.Nazwa}</h3>
                  {c.Opis && <p className="text-sm text-neutral-400 mb-2">{c.Opis}</p>}
                  {c.Rozwiązanie && <p className="text-neutral-300 text-sm whitespace-pre-line">{c.Rozwiązanie}</p>}
                  {c.Lata && <p className="text-xs text-neutral-500 mt-2">Lata: {c.Lata}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'porady' && (
          <div>
            <div className="mb-6 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <h3 className="text-amber-400 font-semibold mb-3">Schemat filtra i miski 4L60E</h3>
              <img src="https://www.wittrans.com/images/4L60E_filter_diagram.jpg" alt="4L60E filter" className="w-full max-w-xl mx-auto rounded bg-white p-2" />
              <p className="text-sm text-neutral-400 mt-2">Pomocne przy wymianie ATF i filtra</p>
            </div>
            <div className="space-y-4">
              {filteredTips.map((t, idx) => (
                <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                  <h3 className="font-semibold text-amber-400 mb-2">{t.Nazwa}</h3>
                  <p className="text-neutral-300 text-sm whitespace-pre-line">{t.Rozwiązanie}</p>
                  {t.Lata && <p className="text-xs text-neutral-500 mt-2">Lata: {t.Lata}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-neutral-800 py-8 text-center text-neutral-500 text-sm">
        GMT400.pl • Dane z Notion • info@gmt400.pl
      </footer>
    </div>
  );
}
