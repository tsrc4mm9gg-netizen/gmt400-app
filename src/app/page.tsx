'use client';

import { useState } from 'react';

const models = [
  { id: 'tahoe2', name: 'Tahoe 2-drzwi', years: '1995–1999', desc: 'Krótki rozstaw osi, głównie 4x4. Bardzo poszukiwany. Silnik 5.7L TBI (1995) lub Vortec L31.' },
  { id: 'tahoe4', name: 'Tahoe 4-drzwi', years: '1995–2000', desc: 'Rodzinny SUV. Od 1996 silnik Vortec 255 KM. 4L60E, opcjonalnie AutoTrac NP246.' },
  { id: 'suburban', name: 'Suburban', years: '1992–1999', desc: '1500/2500. Król holowania. 5.7L, 7.4L lub 6.5L diesel.' },
  { id: 'ck1500', name: 'C/K 1500', years: '1988–2000', desc: 'Pickup ½ ton. 2WD (C) lub 4WD (K). Najpopularniejszy model platformy.' },
  { id: 'ckhd', name: 'C/K 2500 / 3500', years: '1988–2000+', desc: 'Heavy Duty. 8-lug. Silniki 7.4L i 6.5L diesel. 4L80E.' },
  { id: 'yukon', name: 'Yukon / Yukon XL', years: '1992–2000', desc: 'Wersje GMC. Yukon = Tahoe, Yukon XL = Suburban.' },
];

const issues = [
  { title: 'Uszczelki kolektora dolotowego (Vortec)', fix: 'Ubytek płynu chłodzącego, przegrzewanie. Wymiana zestawu uszczelek + śrub.' },
  { title: 'CSFI Spider (wtryskiwacze poppet)', fix: 'Długi kręcenie, nierówna praca, zapach paliwa. Czyszczenie lub konwersja na MFI.' },
  { title: '4L60E – sprzęgło 3-4 / sun shell', fix: 'Ślizganie, szarpanie. Regularna wymiana ATF + filtr co 30-40 tys. km.' },
  { title: 'Rdza ramy i kabiny', fix: 'Sprawdzaj rogi kabiny, progi, mocowania. Magnes + młotek. Naprawa lub wymiana paneli.' },
  { title: 'Pompa paliwa', fix: 'Brak startu, gwizd. Wymiana wymaga opuszczenia baku.' },
  { title: 'NP246 AutoTrac pump rub', fix: 'Ukryty wyciek oleju, awaria. Case saver + kontrola poziomu oleju.' },
];

const codes = [
  { code: '12', desc: 'Tryb diagnostyczny (normalny przy teście CEL)' },
  { code: '13', desc: 'Sonda lambda – brak aktywności' },
  { code: '14/15', desc: 'Czujnik temperatury płynu (ECT)' },
  { code: '21/22', desc: 'TPS – czujnik położenia przepustnicy' },
  { code: '32', desc: 'EGR' },
  { code: '33/34', desc: 'MAP sensor' },
  { code: '35', desc: 'IAC / bieg jałowy' },
  { code: '44/45', desc: 'Mieszanka uboga / bogata' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('modele');

  const filteredModels = models.filter(m => 
    m.name.toLowerCase().includes(query.toLowerCase()) || 
    m.desc.toLowerCase().includes(query.toLowerCase())
  );

  const filteredIssues = issues.filter(i => 
    i.title.toLowerCase().includes(query.toLowerCase()) || 
    i.fix.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">GMT<span className="text-amber-400">400</span></h1>
          <input
            type="search"
            placeholder="Szukaj modelu, usterki, kodu..."
            className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:border-amber-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <section className="bg-gradient-to-b from-neutral-900 to-neutral-950 py-20 px-4 text-center">
        <h2 className="text-5xl font-extrabold mb-4">Encyklopedia GMT400</h2>
        <p className="text-neutral-400 max-w-xl mx-auto text-lg">
          Kompletna baza wiedzy dla właścicieli Chevrolet C/K, Tahoe, Suburban i GMC (1988–2000).
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {['modele', 'usterki', 'kody'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                tab === t ? 'bg-amber-400 text-black' : 'bg-neutral-900 text-neutral-400'
              }`}
            >
              {t === 'modele' ? 'Modele' : t === 'usterki' ? 'Usterki' : 'Kody błędów'}
            </button>
          ))}
        </div>

        {tab === 'modele' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map((m) => (
              <div key={m.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-amber-400 transition">
                <h3 className="text-amber-400 font-semibold text-lg">{m.name}</h3>
                <p className="text-sm text-neutral-500 mb-2">{m.years}</p>
                <p className="text-neutral-300 text-sm">{m.desc}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'usterki' && (
          <div className="space-y-4">
            {filteredIssues.map((i, idx) => (
              <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <h3 className="font-semibold text-amber-400">{i.title}</h3>
                <p className="text-neutral-300 mt-1 text-sm">{i.fix}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'kody' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-800">
                <tr>
                  <th className="text-left p-3 text-amber-400">Kod</th>
                  <th className="text-left p-3 text-amber-400">Opis</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => (
                  <tr key={c.code} className="border-t border-neutral-800">
                    <td className="p-3 font-mono">{c.code}</td>
                    <td className="p-3 text-neutral-300">{c.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="border-t border-neutral-800 py-8 text-center text-neutral-500 text-sm">
        GMT400.pl • Encyklopedia właścicieli • info@gmt400.pl
      </footer>
    </div>
  );
}
