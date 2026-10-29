import { lotUrl, type AuctionData, type Usd } from '@/lib/apibara.mjs';

/**
 * Dane aukcyjne Copart/IAAI z Apibara.tech — widoczne wyłącznie po zatwierdzeniu prośby (serwer nie zwraca ich wcześniej).
 * Zdjęć nie wyświetlamy: warunki Apibara nie dają prawa do ich publikacji. Pokazujemy liczbę zdjęć i link do aukcji.
 */
const fmtDate = (iso: string | null) => { if (!iso) return null; const t = Date.parse(iso); return Number.isFinite(t) ? new Date(t).toLocaleDateString('pl-PL', { timeZone: 'Europe/Warsaw' }) : iso; };
const fmtDateTime = (iso: string) => { const t = Date.parse(iso); return Number.isFinite(t) ? new Date(t).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Warsaw' }) : iso; };
const usd = (n: number | null) => (n === null ? null : `${n.toLocaleString('pl-PL')} USD`);
const km = (n: number | null) => (n === null ? null : `${Math.round(n).toLocaleString('pl-PL')} km`);
const plat = (p: string | null) => (p === 'copart' ? 'Copart' : p === 'iaai' ? 'IAAI' : 'aukcja');
function LotLink({ platform, lot }: { platform: string | null; lot: string | null }) {
  const url = lotUrl(platform, lot);
  const label = `${plat(platform)}${lot ? ` · lot ${lot}` : ''}`;
  return url ? <a href={url} target="_blank" rel="noopener noreferrer nofollow" className="text-silver-400 underline">{label}</a> : <span>{label}</span>;
}
function Prices({ p }: { p: Usd }) {
  const rows: [string, number | null][] = [['Cena sprzedaży', p.sale], ['Ostatnia cena sprzedaży', p.lastSold], ['Aktualna oferta', p.currentBid], ['Kup teraz', p.buyNow ?? null], ['Szac. wartość rynkowa', p.estimatedRetail ?? null]];
  const shown = rows.filter(([, v]) => v !== null);
  if (!shown.length) return <p className="text-neutral-400">Ceny: źródło ich nie podaje.</p>;
  return <ul className="space-y-0.5">{shown.map(([k, v]) => <li key={k}><span className="text-neutral-400">{k}:</span> <span className="font-semibold text-white">{usd(v)}</span></li>)}</ul>;
}

export default function AuctionDataView({ data }: { data: AuctionData | undefined }) {
  const frame = 'border border-white/10 bg-neutral-950 p-4';
  const head = <h3 className="text-lg font-semibold text-white">Aukcje Copart i IAAI <span className="text-sm font-normal text-neutral-400">· dane z Apibara.tech</span></h3>;
  const foot = (
    <p className="mt-3 text-xs text-neutral-400" data-testid="history-vin-auction-attribution">
      Auction data: <a href="https://apibara.tech" target="_blank" rel="noopener noreferrer" className="text-silver-400 underline">Apibara.tech</a> (niezależny dostawca; to nie jest oficjalne API Copart ani IAAI). Dane mogą być niepełne lub nieaktualne
      i nie są pełną historią wypadków, właścicieli ani raportem tytułu własności. Zakres: ok. roku zapisów aukcyjnych.{data ? ` Pobrano: ${fmtDateTime(data.fetchedAt)}.` : ''}
    </p>
  );
  if (!data) return <section className={frame} data-testid="history-vin-auction" data-state="missing">{head}<p className="mt-2 text-neutral-300">Dane aukcyjne nie zostały jeszcze pobrane. Odśwież stronę za chwilę.</p>{foot}</section>;
  if (data.state === 'unconfigured') return <section className={frame} data-testid="history-vin-auction" data-state="unconfigured">{head}<p className="mt-2 text-neutral-300">Źródło danych aukcyjnych nie jest jeszcze podłączone na serwerze — poniżej tylko linki i liczniki NHTSA.</p>{foot}</section>;
  if (data.state === 'quota') return <section className={frame} data-testid="history-vin-auction" data-state="quota">{head}<p className="mt-2 text-neutral-300">Wyczerpano limit zapytań do źródła danych aukcyjnych. Spróbuj odświeżyć stronę za kilkanaście minut — to nie znaczy, że auto nie było na aukcji.</p>{foot}</section>;
  if (data.state === 'error') return <section className={frame} data-testid="history-vin-auction" data-state="error">{head}<p className="mt-2 text-neutral-300">Nie udało się pobrać danych aukcyjnych (źródło nie odpowiedziało poprawnie). Spróbuj ponownie za kilkanaście minut — to nie znaczy, że auto nie było na aukcji.</p>{foot}</section>;
  if (data.state === 'empty') return <section className={frame} data-testid="history-vin-auction" data-state="empty">{head}<p className="mt-2 text-base font-semibold text-white" data-testid="history-vin-auction-zero">Znaleziono 0 rekordów aukcyjnych dla tego VIN.</p><p className="mt-1 text-neutral-300">To nie dowodzi, że auto nigdy nie było na aukcji — baza obejmuje tylko część lotów Copart i IAAI z ostatniego roku. Sprawdź też linki poniżej.</p>{foot}</section>;

  if (data.state !== 'ok') return null;
  const { vehicle: v, history, otherLots } = data;
  const total = (v ? 1 : 0) + history.length + otherLots.length;
  return (
    <section className={frame} data-testid="history-vin-auction" data-state="ok">
      {head}
      <p className="mt-2 text-base font-semibold text-white" data-testid="history-vin-auction-count">
        Znaleziono {total} {total === 1 ? 'rekord' : 'rekordów'}: {v ? 'rekord pojazdu, ' : 'brak rekordu pojazdu, '}wpisy historii sprzedaży: {history.length}, inne loty tego VIN: {otherLots.length}.
      </p>
      {v && (
        <div className="mt-3 border border-white/10 p-3 text-sm text-neutral-200" data-testid="history-vin-auction-vehicle">
          <p className="font-semibold text-white">{v.title || [v.year, v.make, v.model].filter(Boolean).join(' ') || 'Pojazd'}</p>
          <p className="mt-1"><LotLink platform={v.platform} lot={v.lot} />{v.auctionAt ? <> · aukcja {fmtDate(v.auctionAt)}</> : null}{v.outcome ? <> · wynik: {v.outcome}</> : null}</p>
          <p className="mt-1"><span className="text-neutral-400">Uszkodzenia:</span> {v.damage ?? 'źródło nie podaje'}{v.lossType ? <> · rodzaj szkody: {v.lossType}</> : null}{v.run ? <> · {v.run}</> : null}</p>
          <p className="mt-1"><span className="text-neutral-400">Przebieg:</span> {km(v.odometerKm) ?? (v.odometerMi !== null ? `${Math.round(v.odometerMi * 1.609344).toLocaleString('pl-PL')} km` : 'źródło nie podaje')}</p>
          <div className="mt-1"><Prices p={v.priceUsd} /></div>
          <p className="mt-1 text-neutral-400" data-testid="history-vin-auction-photos">
            {v.photoCount !== null && v.photoCount > 0 ? `Źródło ma ${v.photoCount} zdjęć tego lotu. ` : 'Źródło nie podaje zdjęć. '}Zdjęć aukcyjnych nie wyświetlamy (brak licencji na ich publikację){lotUrl(v.platform, v.lot) ? ' — obejrzysz je na stronie aukcji (link wyżej).' : '.'}
          </p>
        </div>
      )}
      {history.length > 0 && (
        <div className="mt-3" data-testid="history-vin-auction-history">
          <p className="text-sm font-semibold text-white">Historia sprzedaży</p>
          <ul className="mt-1 space-y-1 text-sm text-neutral-200">
            {history.map((h, i) => <li key={i} className="border-t border-white/10 pt-1"><LotLink platform={h.platform} lot={h.lot} /> · {fmtDate(h.date) ?? 'data nieznana'} · {h.status ?? 'status nieznany'} · {usd(h.priceUsd) ?? 'cena nieznana'}</li>)}
          </ul>
        </div>
      )}
      {otherLots.length > 0 && (
        <div className="mt-3" data-testid="history-vin-auction-lots">
          <p className="text-sm font-semibold text-white">Inne loty tego VIN</p>
          <ul className="mt-1 space-y-1 text-sm text-neutral-200">
            {otherLots.map((l, i) => <li key={i} className="border-t border-white/10 pt-1"><LotLink platform={l.platform} lot={l.lot} />{l.title ? ` · ${l.title}` : ''}{l.auctionAt ? ` · ${fmtDate(l.auctionAt)}` : ''}{l.outcome ? ` · ${l.outcome}` : ''} · {usd(l.priceUsd.sale ?? l.priceUsd.lastSold ?? l.priceUsd.currentBid) ?? 'cena nieznana'}</li>)}
          </ul>
        </div>
      )}
      {foot}
    </section>
  );
}
