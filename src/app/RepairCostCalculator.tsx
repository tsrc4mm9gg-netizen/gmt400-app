'use client';
import { useState } from 'react';

type Part = { name: string; quantity: string; budget: number; oem?: string; source?: string };
type Repair = { id: string; name: string; hours: number; parts: Part[]; note?: string };
const p = (name: string, quantity: string, budget: number): Part => ({ name, quantity, budget });
export const REPAIRS: Repair[] = [
  { id: 'oil', name: 'Olej silnikowy i filtr', hours: 1, parts: [p('Olej silnikowy — specyfikacja i ilość wg instrukcji', '1 porcja serwisowa', 220), p('Filtr oleju', '1 szt.', 60), p('Uszczelka korka spustowego', '1 szt.', 10)] },
  { id: 'air', name: 'Filtr powietrza', hours: 0.3, parts: [p('Filtr powietrza', '1 szt.', 100)] },
  { id: 'fuel', name: 'Filtr paliwa', hours: 0.7, parts: [p('Filtr paliwa', '1 szt.', 100), p('Uszczelnienia złączy — jeśli wymagane', '1 zestaw', 30)] },
  { id: 'plugs', name: 'Świece zapłonowe', hours: 1.5, parts: [p('Świece zapłonowe dobrane do silnika', '8 szt.', 320)] },
  { id: 'wires', name: 'Przewody zapłonowe', hours: 1.5, parts: [p('Przewody zapłonowe z przewodem cewki', '1 komplet', 350), p('Uchwyty przewodów — wg stanu', '1 zestaw', 40)] },
  { id: 'distributor', name: 'Kopułka i palec rozdzielacza', hours: 1.2, parts: [{ name: 'Kopułka rozdzielacza', quantity: '1 szt.', budget: 300, oem: '10452459', source: 'https://www.gmpartsgiant.com/parts/gm-cap-10452459.html' }, { name: 'Palec rozdzielacza', quantity: '1 szt.', budget: 90, oem: '10452457', source: 'https://www.gmpartsgiant.com/parts/gm-rotor-10452457.html' }], note: 'Numery GM potwierdzone w katalogu części; końcowe dopasowanie sprawdź po VIN i zamontowanym rozdzielaczu.' },
  { id: 'front-brakes', name: 'Klocki i tarcze — przód', hours: 2.5, parts: [p('Klocki hamulcowe przednie', '1 komplet na oś', 300), p('Tarcze hamulcowe przednie', '2 szt.', 900), p('Zestaw montażowy i materiały do czyszczenia', '1 zestaw', 100)], note: 'Wymagane potwierdzenie wersji 1500/2500 i układu hamulcowego przed doborem części.' },
  { id: 'rear-brakes', name: 'Serwis hamulców tylnych', hours: 3, parts: [p('Elementy cierne odpowiednie do zamontowanych hamulców', '1 komplet na oś', 350), p('Elementy montażowe i regulatory — wg stanu', '1 zestaw', 200), p('Cylinderki lub zestawy naprawcze — wg diagnozy', '2 strony', 250)], note: 'Zakres zależy od zamontowanego układu; bębny lub tarcze nie są wliczone.' },
  { id: 'brake-fluid', name: 'Wymiana płynu hamulcowego', hours: 1.2, parts: [p('Płyn hamulcowy zgodny ze specyfikacją auta', 'ilość do wymiany i odpowietrzenia', 100), p('Materiały do czyszczenia', '1 zestaw', 30)] },
  { id: 'front-shocks', name: 'Amortyzatory — przód', hours: 1.5, parts: [p('Amortyzatory przednie', '2 szt.', 700), p('Elementy mocujące — jeśli nie ma w komplecie', '1 zestaw', 100)] },
  { id: 'rear-shocks', name: 'Amortyzatory — tył', hours: 1.5, parts: [p('Amortyzatory tylne', '2 szt.', 700), p('Elementy mocujące — jeśli nie ma w komplecie', '1 zestaw', 100)] },
  { id: 'steering', name: 'Końcówki drążków kierowniczych', hours: 2.5, parts: [p('Końcówki drążków — wewnętrzne i zewnętrzne wg diagnozy', 'przykładowo 4 szt.', 800), p('Tuleje regulacyjne i elementy zabezpieczające', '1 zestaw', 150), p('Geometria — usługa dodatkowa', '1 usługa', 250)], note: 'Geometria jest kosztem zewnętrznej usługi również przy samodzielnej wymianie.' },
  { id: 'water-pump', name: 'Pompa wody', hours: 3, parts: [p('Pompa wody', '1 szt.', 450), p('Uszczelki pompy', '1 zestaw', 60), p('Płyn chłodniczy do uzupełnienia lub wymiany', 'wg zakresu', 220)] },
  { id: 'thermostat', name: 'Termostat', hours: 1, parts: [p('Termostat', '1 szt.', 120), p('Uszczelka lub uszczelnienie obudowy', '1 szt.', 30), p('Płyn chłodniczy do uzupełnienia', 'wg ubytku', 80)] },
  { id: 'belt', name: 'Pasek osprzętu i napinacz', hours: 1.2, parts: [p('Pasek osprzętu', '1 szt.', 150), p('Napinacz', '1 szt.', 250), p('Rolka prowadząca — wg stanu', '1 szt.', 120)] },
  { id: 'alternator', name: 'Alternator', hours: 1.5, parts: [p('Alternator dobrany do wyposażenia i mocowania', '1 szt.', 900)], note: 'Budżet przykładowy; ewentualna kaucja za zwrot rdzenia nie jest wliczona.' },
  { id: 'starter', name: 'Rozrusznik', hours: 2, parts: [p('Rozrusznik', '1 szt.', 650), p('Elementy mocujące — wg stanu', '1 zestaw', 50)] },
  { id: 'transmission', name: 'Serwis skrzyni: ATF i filtr', hours: 2.5, parts: [p('ATF zgodny z oznaczeniem skrzyni', 'ilość wg procedury serwisowej', 400), p('Filtr skrzyni', '1 szt.', 160), p('Uszczelka miski', '1 szt.', 100)], note: 'Najpierw potwierdź oznaczenie skrzyni i głębokość miski. To serwis, nie regeneracja ani pełna wymiana całej objętości ATF.' }
];
const money = (n: number) => n.toLocaleString('pl-PL', { maximumFractionDigits: 2 }) + ' PLN';
export default function RepairCostCalculator() {
  const [id, setId] = useState(REPAIRS[0].id);
  const [rate, setRate] = useState(200);
  const repair = REPAIRS.find(r => r.id === id) || REPAIRS[0];
  const materials = repair.parts.reduce((sum, part) => sum + part.budget, 0);
  const labor = Math.round(repair.hours * rate * 100) / 100;
  return <section aria-labelledby="repair-cost-title" className="space-y-4">
    <h2 id="repair-cost-title" className="text-2xl">KALKULATOR KOSZTÓW NAPRAWY</h2>
    <p className="text-sm text-neutral-300">Konfiguracja bazowa: Chevrolet Suburban 1999 · 5.7 Vortec V8 · 4WD. Wersja 1500/2500 i kody RPO wymagają potwierdzenia.</p>
    <p className="text-sm text-neutral-400">Przykładowy budżet obliczeniowy, nie aktualny cennik ani oferta. Ceny pozycji dotyczą całej podanej ilości. Nie obejmują dostawy, podatków importowych, dodatkowych usterek i narzędzi. Aktualizacja zestawienia: 2026-10-17.</p>
    <div className="bg-neutral-950 border border-white/10 p-4 space-y-4">
      <label htmlFor="repair-choice" className="block">Wybierz naprawę ({REPAIRS.length} możliwości):</label>
      <select id="repair-choice" value={id} onChange={e => setId(e.target.value)} className="w-full min-w-0 bg-neutral-900 border border-white/20 p-3">{REPAIRS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
      <label htmlFor="repair-rate" className="block">Stawka robocizny (PLN/h)</label>
      <input id="repair-rate" type="number" min="0" step="10" value={rate} onChange={e => { const n = Number(e.target.value); setRate(Number.isFinite(n) ? Math.min(10000, Math.max(0, n)) : 0); }} className="w-full bg-neutral-900 border border-white/20 p-3" />
    </div>
    <div aria-live="polite" className="bg-neutral-950 border border-amber-400/30 p-4 space-y-4">
      <h3 className="text-xl">{repair.name}</h3>
      <h4>Potrzebne części i materiały</h4>
      <ul className="space-y-4">{repair.parts.map(part => <li key={part.name} className="border-b border-white/10 pb-3 break-words">
        <div className="flex flex-wrap justify-between gap-2"><span>{part.name} — {part.quantity}</span><span>{money(part.budget)}</span></div>
        <p className="text-sm text-neutral-300 mt-1">{part.oem ? <>GM OEM: {part.oem}. <a href={part.source} target="_blank" rel="noopener noreferrer" className="underline">Źródło katalogowe</a> · dopasowanie do auta: sprawdź VIN.</> : 'GM OEM: niepotwierdzony lub nie dotyczy materiału/usługi. Nie zamawiaj części bez identyfikacji po VIN/RPO.'}</p>
      </li>)}</ul>
      {repair.note && <p className="text-sm text-amber-200">{repair.note}</p>}
      <dl className="space-y-2">
        <div className="flex justify-between gap-3"><dt>Części, materiały i usługi dodatkowe</dt><dd>{money(materials)}</dd></div>
        <div className="flex justify-between gap-3"><dt>Robocizna ({repair.hours} h × {rate} PLN)</dt><dd>{money(labor)}</dd></div>
        <div className="flex justify-between gap-3 text-amber-400 text-lg"><dt>RAZEM WARSZTAT</dt><dd data-testid="repair-total">{money(materials + labor)}</dd></div>
        <div className="flex justify-between gap-3"><dt>DIY — bez robocizny własnej</dt><dd>{money(materials)}</dd></div>
      </dl>
      <p className="text-sm text-neutral-400">Czas to założenie kalkulacji, nie norma warsztatowa. Zestawienie pomaga planować budżet; nie zastępuje diagnozy ani procedury naprawy.</p>
    </div>
  </section>;
}
