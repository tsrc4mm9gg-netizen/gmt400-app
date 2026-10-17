import { RPO_BATCH_2 } from './rpo-batch-2';
import { RPO_BATCH_3 } from './rpo-batch-3';
import { RPO_BATCH_4 } from './rpo-batch-4';
export type RpoCategory = 'Osie' | 'Silniki' | 'Skrzynie' | 'Wyposażenie' | 'Nadwozie' | 'Klimatyzacja' | 'Masy' | 'Lusterka i wnętrze' | 'Zawieszenie' | 'Osprzęt' | 'Napęd' | 'Emisja' | 'Koła' | 'Pakiety' | 'Kolory i tapicerki' | 'Hamulce';
export type RpoEntry = { code: string; category: RpoCategory; description: string; original: string; years: [number, number] | null; models: string[]; source: string; sourceTitle: string; status: 'reference'; notes: string; ratio?: string };
const AXLE = 'https://differentials.com/gm-axle-ratio-identification-codes/';
const REFERENCE = 'https://jameshalderman.com/wp-content/uploads/2019/04/RPO_Codes.pdf';
const ratio = (code: string, value: string): RpoEntry => ({ code, category: 'Osie', description: 'Przełożenie tylnej osi ' + value + ':1', original: 'Rear axle ratio ' + value, years: null, models: [], source: AXLE, sourceTitle: 'West Coast Differentials — GM RPO Codes', status: 'reference', notes: 'Nie identyfikuje typu mostu ani mechanizmu różnicowego. Zweryfikuj aktualną przekładnię po modyfikacjach.', ratio: value });
const reference = (code: string, category: RpoCategory, description: string, original: string, notes: string): RpoEntry => ({ code, category, description, original, years: null, models: [], source: REFERENCE, sourceTitle: 'James Halderman — General Motors RPO Codes', status: 'reference', notes });
export const RPO_CATALOG: RpoEntry[] = [
 ratio('GU4', '3.08'), ratio('GU5', '3.23'), ratio('GU6', '3.42'), ratio('GT4', '3.73'), ratio('GT5', '4.10'), ratio('HC4', '4.56'),
 reference('M30', 'Skrzynie', 'Automatyczna skrzynia 4-biegowa 4L60E, sterowana elektronicznie', 'TRANSMISSION, AUTO 4 SPD, HMD, 4L60E, ELECTRONIC', 'Nie ustala wariantu obudowy, miski, osprzętu ani zgodności zamiennika.'),
 reference('MT1', 'Skrzynie', 'Automatyczna skrzynia 4-biegowa Heavy Duty 4L80E', 'TRANSMISSION, 4 SPD, AUTO W/ELECT CONTROLS H.D. (HYDRA-MATIC 4L80-E)', 'Oznaczenie rodziny nie zastępuje numeru identyfikacyjnego konkretnej skrzyni.'),
 reference('L05', 'Silniki', 'Wariant ciężarowy: benzynowy V8 5.7 l, TBI', 'ENGINE, GAS, 8 CYL, 5.7L, 1 TBI, V8', 'Kod wieloznaczny: ogólny katalog GM zawiera również inne silniki L05. Ta pozycja opisuje wariant V8, nie dobór po samym kodzie.'),
 reference('L19', 'Silniki', 'Benzynowy V8 7.4 l, TBI', 'ENGINE, GAS, 8 CYL, 7.4L, 1 TBI, V8', 'Potwierdź rocznik, rodzinę silnika i obecny układ wtrysku.'),
 reference('L29', 'Silniki', 'Benzynowy V8 7.4 l, SFI', 'ENGINE, GAS, 8 CYL, 7.4L, SFI', 'Nie ustala mocy, kalibracji sterownika ani szczegółów osprzętu.'),
 reference('L31', 'Silniki', 'Wariant ciężarowy: benzynowy V8 5.7 l', 'ENGINE, GAS, 8 CYL, 5.7L; TRUCK', 'Kod ma także historyczne znaczenia w innych autach GM. Nie stosuj tego opisu poza właściwym kontekstem ciężarowym.'),
 ...RPO_BATCH_2,
 ...RPO_BATCH_3,
 ...RPO_BATCH_4,
];
export function decodeRpo(input: string) {
 const tokens = [...new Set(input.toUpperCase().trim().split(/[\s,;|]+/).filter(Boolean))];
 const valid = tokens.filter(code => /^[A-Z0-9]{3}$/.test(code));
 const invalid = tokens.filter(code => !/^[A-Z0-9]{3}$/.test(code));
 const matches = valid.map(code => ({ code, entries: RPO_CATALOG.filter(entry => entry.code === code) }));
 const ratios = new Set(matches.flatMap(match => match.entries.flatMap(entry => entry.ratio ? [entry.ratio] : [])));
 return { tokens, matches, invalid, ratioConflict: ratios.size > 1 };
}
