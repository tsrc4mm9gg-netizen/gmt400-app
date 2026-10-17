export type PartFitment = {
 part: string;
 category: string;
 fitsModels: string[];
 yearRange: [number, number];
 engine: string[];
 transmission: string[];
 confidence: 'factory' | 'likely' | 'verify';
 source: string;
 sourceTitle: string;
 notes: string;
};

export const PART_FITMENTS: PartFitment[] = [
 {
 part: '4L60E — automatyczna skrzynia 4-biegowa',
 category: 'Skrzynie',
 fitsModels: ['C/K 1500', 'GMC Sierra 1500', 'Tahoe', 'Yukon', 'Suburban 1500'],
 yearRange: [1996, 1998],
 engine: ['4.3L V6', '5.0L V8', '5.7L V8'],
 transmission: ['Automatyczna'],
 confidence: 'likely',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Zgodność zależy od rocznika, silnika, obudowy i złączy. Potwierdź RPO oraz numer identyfikacyjny skrzyni przed zakupem.'
 },
 {
 part: '4L80E — automatyczna skrzynia 4-biegowa HD',
 category: 'Skrzynie',
 fitsModels: ['C/K 2500', 'C/K 3500', 'Suburban 2500', 'Suburban 3500'],
 yearRange: [1991, 1998],
 engine: ['5.7L V8', '7.4L V8', '6.5L Diesel'],
 transmission: ['Automatyczna'],
 confidence: 'likely',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Wymaga weryfikacji obudowy, konwertera, czujników i połączeń elektrycznych. Nie jest automatycznie wymienna z 4L60E.'
 },
 {
 part: 'NV4500 — ręczna skrzynia 5-biegowa',
 category: 'Skrzynie',
 fitsModels: ['C/K 2500', 'C/K 3500', 'Suburban 2500'],
 yearRange: [1992, 1998],
 engine: ['5.7L V8', '7.4L V8', '6.5L Diesel'],
 transmission: ['Ręczna'],
 confidence: 'likely',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Sprawdź średnicę wału, długość, koło zębate sprzęgła i typ sprzęgła przed montażem.'
 },
 {
 part: 'G80 — mechanizm różnicowy o ograniczonym poślizgu',
 category: 'Osie',
 fitsModels: ['C/K 1500', 'C/K 2500', 'C/K 3500', 'Tahoe', 'Yukon', 'Suburban'],
 yearRange: [1988, 1998],
 engine: [],
 transmission: [],
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Kod G80 nie określa typu mostu ani przełożenia. Dobór części wymaga identyfikacji mostu, liczby śrub i przełożenia.'
 },
 {
 part: 'Z71 — elementy pakietu off-road',
 category: 'Zawieszenie',
 fitsModels: ['C/K 1500', 'Tahoe', 'Suburban 1500'],
 yearRange: [1988, 1998],
 engine: [],
 transmission: [],
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Zakres pakietu zmieniał się z rocznikiem. Nie zakładaj zamienności amortyzatorów, sprężyn ani osłon bez identyfikacji konkretnego auta.'
 }
];

export function findParts(parameters: {
 model?: string;
 year?: number;
 engine?: string;
 transmission?: string;
}) {
 const model = parameters.model?.toLowerCase().trim() ?? '';
 const engine = parameters.engine?.toLowerCase().trim() ?? '';
 const transmission = parameters.transmission?.toLowerCase().trim() ?? '';
 const year = parameters.year;

 return PART_FITMENTS.map(item => {
 const modelMatch = !model || item.fitsModels.some(candidate => candidate.toLowerCase().includes(model));
 const yearMatch = !year || (year >= item.yearRange[0] && year <= item.yearRange[1]);
 const engineMatch = !engine || item.engine.length === 0 || item.engine.some(candidate => candidate.toLowerCase().includes(engine));
 const transmissionMatch = !transmission || item.transmission.length === 0 || item.transmission.some(candidate => candidate.toLowerCase().includes(transmission));
 const matched = modelMatch && yearMatch && engineMatch && transmissionMatch;
 return { ...item, matched, checks: { modelMatch, yearMatch, engineMatch, transmissionMatch } };
 });
}
