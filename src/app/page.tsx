'use client';

import { useState, useMemo } from 'react';

const models = [
  { id: 'tahoe2', name: 'Tahoe 2-drzwi', years: '1995–1999', engine: '5.7L TBI / Vortec', desc: 'Krótki rozstaw osi, głównie 4x4. Bardzo poszukiwany. Silnik 5.7L TBI (1995) lub Vortec L31. Popularny wśród off-roadowców.' },
  { id: 'tahoe4', name: 'Tahoe 4-drzwi', years: '1995–2000', engine: '5.7L Vortec', desc: 'Rodzinny SUV. Od 1996 silnik Vortec 255 KM. 4L60E, opcjonalnie AutoTrac NP246. Najczęściej spotykany wariant.' },
  { id: 'suburban1500', name: 'Suburban 1500', years: '1992–1999', engine: '5.7L / 6.5L', desc: '1500. Król holowania. 5.7L lub 6.5L diesel. Duża przestrzeń ładunkowa.' },
  { id: 'suburban2500', name: 'Suburban 2500', years: '1992–1999', engine: '7.4L / 6.5L', desc: 'Heavy Duty. 8-lug. Idealny do ciężkiego holowania. 7.4L Big Block lub diesel.' },
  { id: 'ck1500', name: 'C/K 1500', years: '1988–2000', engine: '5.0L / 5.7L', desc: 'Pickup ½ ton. 2WD (C) lub 4WD (K). Najpopularniejszy model platformy. Wiele konfiguracji kabiny.' },
  { id: 'ck2500', name: 'C/K 2500', years: '1988–2000', engine: '5.7L / 7.4L / 6.5L', desc: '¾ ton. 8-lug. Do pracy i holowania. Solidna rama.' },
  { id: 'ck3500', name: 'C/K 3500', years: '1988–2000+', engine: '7.4L / 6.5L', desc: '1 ton. Najmocniejsza wersja. Często z dually. Idealny do ciężkich zadań.' },
  { id: 'yukon', name: 'Yukon', years: '1992–2000', engine: '5.7L', desc: 'Wersja GMC odpowiednik Tahoe. Często lepiej wyposażona.' },
  { id: 'yukonxl', name: 'Yukon XL', years: '1992–1999', engine: '5.7L / 7.4L', desc: 'Odpowiednik Suburban. Duży SUV GMC.' },
];

const issues = [
  { category: 'Silnik', title: 'Uszczelki kolektora dolotowego (Vortec)', symptoms: 'Ubytek płynu, przegrzewanie, biały dym', fix: 'Wymiana zestawu uszczelek + śrub. Nie zwlekaj – może dojść do przegrzania.' },
  { category: 'Silnik', title: 'CSFI Spider (wtryskiwacze poppet)', symptoms: 'Długi kręcenie, nierówna praca, zapach paliwa', fix: 'Czyszczenie lub konwersja na MFI (multiport). Częsta usterka w Vortec.' },
  { category: 'Skrzynia', title: '4L60E – sprzęgło 3-4 / sun shell', symptoms: 'Ślizganie 3-4, szarpanie', fix: 'Regularna wymiana ATF + filtr co 30-40 tys. km. W razie awarii rebuild.' },
  { category: 'Skrzynia', title: '4L80E problemy', symptoms: 'Ślizganie, przegrzewanie', fix: 'Wymiana oleju, chłodnica skrzyni. Mocniejsza niż 4L60E.' },
  { category: 'Napęd', title: 'NP246 AutoTrac pump rub', symptoms: 'Ukryty wyciek oleju, awaria trybów', fix: 'Case saver + kontrola poziomu oleju. Częsta usterka w 4x4.' },
  { category: 'Karoseria', title: 'Rdza ramy i kabiny', symptoms: 'Rdza w rogach kabiny, progach', fix: 'Sprawdzaj magnesem i młotkiem. Naprawa paneli lub wymiana.' },
  { category: 'Paliwo', title: 'Pompa paliwa', symptoms: 'Brak startu, gwizd, brak mocy', fix: 'Wymiana wymaga opuszczenia baku. Często padają w starszych egzemplarzach.' },
  { category: 'Chłodzenie', title: 'Termostat / pompa wody', symptoms: 'Przegrzewanie, ubytek płynu', fix: 'Wymiana termostatu i pompy wody przy serwisie.' },
  { category: 'Elektryka', title: 'Czujnik MAP / TPS', symptoms: 'Nierówna praca, check engine', fix: 'Czyszczenie lub wymiana. Częste w OBD-I i OBD-II.' },
];

const codes = [
  { code: '12', system: 'OBD-I', desc: 'Tryb diagnostyczny (normalny przy teście CEL)' },
  { code: '13', system: 'OBD-I', desc: 'Sonda lambda – brak aktywności' },
  { code: '14', system: 'OBD-I', desc: 'ECT – temperatura płynu za niska' },
  { code: '15', system: 'OBD-I', desc: 'ECT – temperatura płynu za wysoka' },
  { code: '21', system: 'OBD-I', desc: 'TPS – napięcie za wysokie' },
  { code: '22', system: 'OBD-I', desc: 'TPS – napięcie za niskie' },
  { code: '32', system: 'OBD-I', desc: 'EGR – problem z zaworem' },
  { code: '33', system: 'OBD-I', desc: 'MAP – sygnał za wysoki' },
  { code: '34', system: 'OBD-I', desc: 'MAP – sygnał za niski' },
  { code: '35', system: 'OBD-I', desc: 'IAC – problem z biegiem jałowym' },
  { code: '44', system: 'OBD-I', desc: 'Mieszanka uboga' },
  { code: '45', system: 'OBD-I', desc: 'Mieszanka bogata' },
  { code: 'P0171', system: 'OBD-II', desc: 'System zbyt ubogi (Bank 1)' },
  { code: 'P0172', system: 'OBD-II', desc: 'System zbyt bogaty (Bank 1)' },
  { code: 'P0300', system: 'OBD-II', desc: 'Losowe wypadanie zapłonu' },
  { code: 'P0420', system: 'OBD-II', desc: 'Sprawność katalizatora poniżej progu' },
  { code: 'P0442', system: 'OBD-II', desc: 'Mały wyciek w systemie EVAP' },
];

const tips = [
  { title: 'Wymiana ATF w 4L60E', content: 'Co 30-40 tys. km. Używaj Dexron III lub odpowiednika. Filtr + uszczelka miski.' },
  { title: 'Kontrola ramy', content: 'Sprawdzaj co roku rogi kabiny, progi i mocowania zawieszenia. Rdza jest najczęstszym problemem.' },
  { title: 'Olej w skrzyni rozdzielczej', content: 'Sprawdzaj poziom co 20 tys. km. NP241/NP243/NP246 – odpowiedni olej.' },
  { title: 'Filtr paliwa', content: 'Wymieniaj co 15-20 tys. km. Tani element, duży wpływ na żywotność pompy.' },
  { title: 'Vortec – uszczelki kolektora', content: 'Przy pierwszych objawach ubytku płynu wymieniaj od razu. Nie czekaj na przegrzanie.' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('modele');
  const [category, setCategory] = useState('Wszystkie');

  const filteredModels = useMemo(() => 
    models.filter(m => 
      m.name.toLowerCase().includes(query.toLowerCase()) || 
      m.desc.toLowerCase().includes(query.toLowerCase()) ||
      m.engine.toLowerCase().includes(query.toLowerCase())
    ), [query]);

  const filteredIssues = useMemo(() => {
    let result = issues;
    if (category !== 'Wszystkie') result = result.filter(i => i.category === category);
    return result.filter(i => 
      i.title.toLowerCase().includes(query.toLowerCase()) || 
      i.fix.toLowerCase().includes(query.toLowerCase()) ||
      i.symptoms.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, category]);

  const filteredCodes = useMemo(() => 
    codes.filter(c => 
      c.code.toLowerCase().includes(query.toLowerCase()) || 
      c.desc.toLowerCase().includes(query.toLowerCase())
    ), [query]);

  const categories = ['Wszystkie', ...Array.from(new Set(issues.map(i => i.category)))];

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
          Kompletna baza wiedzy dla właścicieli Chevrolet C/K, Tahoe, Suburban i GMC (1988–2000).
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
            {filteredModels.map((m) => (
              <div key={m.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-amber-400 transition">
                <h3 className="text-amber-400 font-semibold text-lg">{m.name}</h3>
                <p className="text-sm text-neutral-500 mb-1">{m.years} • {m.engine}</p>
                <p className="text-neutral-300 text-sm">{m.desc}</p>
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
                    <h3 className="font-semibold text-amber-400">{i.title}</h3>
                    <span className="text-xs bg-neutral-800 px-2 py-1 rounded">{i.category}</span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-1"><strong>Objawy:</strong> {i.symptoms}</p>
                  <p className="text-neutral-300 text-sm">{i.fix}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'kody' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-800">
                <tr>
                  <th className="text-left p-3 text-amber-400">Kod</th>
                  <th className="text-left p-3 text-amber-400">System</th>
                  <th className="text-left p-3 text-amber-400">Opis</th>
                </tr>
              </thead>
              <tbody>
                {filteredCodes.map((c) => (
                  <tr key={c.code} className="border-t border-neutral-800">
                    <td className="p-3 font-mono">{c.code}</td>
                    <td className="p-3 text-neutral-400">{c.system}</td>
                    <td className="p-3 text-neutral-300">{c.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'porady' && (
          <div className="space-y-4">
            {tips.map((t, idx) => (
              <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <h3 className="font-semibold text-amber-400 mb-2">{t.title}</h3>
                <p className="text-neutral-300 text-sm">{t.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-neutral-800 py-8 text-center text-neutral-500 text-sm">
        GMT400.pl • Encyklopedia właścicieli • info@gmt400.pl
      </footer>
    </div>
  );
}
