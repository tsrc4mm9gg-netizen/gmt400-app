'use client';
import { useEffect, useId, useRef, useState } from 'react';
type Quote = { currency: string; rate: number; effectiveDate: string; tableNumber: string; source: string };
const style = 'mt-1 block w-full rounded border border-white/20 bg-neutral-900 p-3';
const numeric = (value: string) => value.trim() ? Number(value.replace(',', '.')) : NaN;
const money = (n: number) => n.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' });
export default function PartsCurrencyConverter() {
 const id = useId(); const [currency, setCurrency] = useState('USD'); const [amount, setAmount] = useState(''); const [shipping, setShipping] = useState('0'); const [markup, setMarkup] = useState('0'); const [rate, setRate] = useState(''); const [quote, setQuote] = useState<Quote | null>(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
 const pending = useRef<AbortController | null>(null);
 useEffect(() => () => pending.current?.abort(), []);
 function changeCurrency(next: string) { pending.current?.abort(); pending.current = null; setCurrency(next); setRate(''); setQuote(null); setError(''); setLoading(false); }
 async function load() {
  pending.current?.abort(); const controller = new AbortController(); pending.current = controller; const selected = currency; setLoading(true); setError(''); setQuote(null); setRate('');
  try {
   const response = await fetch('/api/exchange-rate?currency=' + selected, { signal: controller.signal, cache: 'no-store' }); const data = await response.json();
   if (!response.ok) throw new Error(data.error || 'Błąd pobrania kursu.');
   if (data.currency !== selected || !Number.isFinite(data.rate) || data.rate <= 0) throw new Error('Nieprawidłowy kurs w odpowiedzi.');
   if (pending.current === controller && !controller.signal.aborted) { setQuote(data); setRate(String(data.rate)); }
  } catch (e) { if (pending.current === controller && !controller.signal.aborted) setError(e instanceof Error ? e.message : 'Nie udało się pobrać kursu.'); }
  finally { if (pending.current === controller) { setLoading(false); pending.current = null; } }
 }
 function manual(value: string) { pending.current?.abort(); pending.current = null; setLoading(false); setRate(value); setQuote(null); setError(''); }
 const a = numeric(amount), s = numeric(shipping), m = numeric(markup), r = numeric(rate);
 const valid = [a, s, m, r].every(Number.isFinite) && a >= 0 && s >= 0 && m >= 0 && m <= 100 && r > 0;
 const base = (a + s) * r; const total = base * (1 + m / 100); const ready = valid && Number.isFinite(total);
 return <section aria-labelledby={id + '-title'} className="rounded border border-white/15 bg-neutral-950 p-4 space-y-4"><h3 id={id + '-title'} className="text-xl text-amber-400">Części z zagranicy — przelicznik USD/EUR → PLN</h3><p className="text-sm text-neutral-400">Niezależna wycena pomocnicza. Nie zmienia kosztorysu naprawy powyżej i nie jest automatycznie dodawana do jego sumy.</p><label className="block">Waluta ceny i dostawy<select className={style} value={currency} onChange={e => changeCurrency(e.target.value)}><option>USD</option><option>EUR</option></select></label><div className="grid sm:grid-cols-2 gap-3"><label>Cena części ({currency})<input className={style} inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Np. 100"/></label><label>Dostawa ({currency})<input className={style} inputMode="decimal" value={shipping} onChange={e => setShipping(e.target.value)}/></label></div><button type="button" disabled={loading} onClick={load} className="rounded bg-amber-400 px-4 py-3 text-black disabled:opacity-50">{loading ? 'Pobieranie kursu…' : 'Pobierz ostatni kurs NBP'}</button>{error && <p role="alert" className="text-amber-300">{error}</p>}<label className="block">Kurs PLN za 1 {currency} — NBP lub wpisany ręcznie<input className={style} inputMode="decimal" value={rate} onChange={e => manual(e.target.value)} placeholder="Pobierz z NBP lub wpisz własny"/></label>{quote ? <p className="text-sm text-neutral-400">Źródło: <a className="underline" href={quote.source} target="_blank" rel="noopener noreferrer">NBP, tabela {quote.tableNumber}</a>. Data kursu: {quote.effectiveDate}. To ostatnia publikacja, nie kurs rynkowy na żywo.</p> : <p className="text-sm text-neutral-400">{rate ? 'Źródło kursu: wpis ręczny użytkownika, niezweryfikowany przez NBP.' : 'Nie pobrano ani nie wpisano kursu.'}</p>}<label className="block">Opcjonalny narzut za przewalutowanie (%)<input className={style} inputMode="decimal" value={markup} onChange={e => setMarkup(e.target.value)}/></label><p className="text-xs text-neutral-400">Narzut jest Twoim założeniem (0–100%), nie stawką banku ani kursem sprzedaży NBP.</p><div aria-live="polite">{ready ? <dl className="space-y-2"><div>Części: {money(a * r)}</div><div>Dostawa: {money(s * r)}</div><div>Narzut: {money(base * m / 100)}</div><div className="text-lg text-amber-400">Łącznie orientacyjnie: {money(total)}</div></dl> : <p>Wpisz poprawną cenę, dostawę i dodatni kurs, aby otrzymać wynik. Puste lub nieprawidłowe pola nie są traktowane jako zero.</p>}</div><p className="text-xs text-neutral-400">Nie obejmuje cła, VAT, akcyzy, odprawy, kaucji za rdzeń ani innych opłat. Kurs średni NBP nie jest kursem Twojej płatności ani automatycznie kursem właściwym do rozliczenia celnego.</p></section>;
}
