export type DiagnosticCode = {
 code: string;
 system: 'OBD-I' | 'OBD-II';
 title: string;
 description: string;
 commonCauses: string[];
 firstChecks: string[];
 severity: 'information' | 'moderate' | 'high';
 confidence: 'reference' | 'verify';
 source: string;
 sourceTitle: string;
 notes: string;
};

export const DIAGNOSTIC_CODES: DiagnosticCode[] = [
 {
 code: 'P0101',
 system: 'OBD-II',
 title: 'Zakres/wydajność obwodu czujnika MAF',
 description: 'Sterownik wykrywa wartości przepływomierza powietrza poza oczekiwanym zakresem lub niespójne z innymi czujnikami.',
 commonCauses: ['Zabrudzony lub uszkodzony MAF', 'Nieszczelność za MAF', 'Zatkany filtr powietrza', 'Problem z okablowaniem lub zasilaniem MAF'],
 firstChecks: ['Sprawdź filtr powietrza i drożność dolotu', 'Obejrzyj MAF, złącze i przewody', 'Sprawdź nieszczelności dolotu', 'Odczytaj parametry MAF podczas pracy silnika'],
 severity: 'moderate',
 confidence: 'reference',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Nie wymieniaj MAF wyłącznie na podstawie kodu. Potwierdź zasilanie, masę, sygnał i szczelność układu dolotowego.'
 },
 {
 code: 'P0113',
 system: 'OBD-II',
 title: 'Wysokie napięcie obwodu czujnika temperatury powietrza dolotowego',
 description: 'Sygnał IAT wskazuje wartość poza oczekiwanym zakresem, często odpowiadającą bardzo niskiej temperaturze.',
 commonCauses: ['Przerwany obwód sygnałowy', 'Uszkodzony czujnik IAT', 'Złe połączenie złącza', 'Problem zasilania lub masy'],
 firstChecks: ['Sprawdź złącze i przewody czujnika', 'Zmierz napięcie i rezystancję czujnika', 'Porównaj odczyt IAT z ECT na zimnym silniku'],
 severity: 'moderate',
 confidence: 'reference',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Nie zastępuje diagnostyki multimetrem ani skanerem. Sprawdź również ewentualne kody towarzyszące.'
 },
 {
 code: 'P0128',
 system: 'OBD-II',
 title: 'Temperatura płynu chłodniczego poniżej termostatu',
 description: 'Silnik nie osiąga oczekiwanej temperatury roboczej w oczekiwanym czasie.',
 commonCauses: ['Zablokowany otwarty termostat', 'Niski poziom płynu chłodniczego', 'Błędny odczyt ECT', 'Nieszczelność układu chłodzenia'],
 firstChecks: ['Sprawdź poziom płynu na zimnym silniku', 'Porównaj temperaturę ECT z rzeczywistą temperaturą silnika', 'Sprawdź działanie termostatu', 'Poszukaj wycieków i błędów wentylatora'],
 severity: 'moderate',
 confidence: 'reference',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Nie otwieraj układu chłodzenia pod ciśnieniem. Diagnozę wykonuj na zimnym silniku.'
 },
 {
 code: 'P0131',
 system: 'OBD-II',
 title: 'Niskie napięcie obwodu czujnika O2, bank 1, czujnik 1',
 description: 'Sterownik wykrywa stale niski sygnał przedniego czujnika tlenu.',
 commonCauses: ['Uszkodzony czujnik O2', 'Nieszczelność wydechu przed czujnikiem', 'Uboga mieszanka', 'Problem okablowania lub masy'],
 firstChecks: ['Sprawdź przewody i złącze czujnika', 'Poszukaj nieszczelności wydechu', 'Sprawdź dane trims i napięcie O2', 'Zweryfikuj ewentualne kody ubogiej mieszanki'],
 severity: 'moderate',
 confidence: 'reference',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Kod nie dowodzi uszkodzenia sondy. Najpierw sprawdź nieszczelności, okablowanie i parametry mieszanki.'
 },
 {
 code: 'P0171',
 system: 'OBD-II',
 title: 'Układ paliwowy zbyt ubogi, bank 1',
 description: 'Korekta paliwowa utrzymuje się w kierunku ubogiej mieszanki.',
 commonCauses: ['Nieszczelność podciśnienia', 'Zabrudzony MAF', 'Słaba dostawa paliwa', 'Nieszczelność wydechu przed sondą O2'],
 firstChecks: ['Sprawdź przewody podciśnienia', 'Obejrzyj dolot i MAF', 'Sprawdź ciśnienie paliwa', 'Zweryfikuj szczelność wydechu przed sondą'],
 severity: 'moderate',
 confidence: 'reference',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Nie wymieniaj sondy O2 przed sprawdzeniem nieszczelności, MAF i dostawy paliwa.'
 },
 {
 code: 'P0300',
 system: 'OBD-II',
 title: 'Wykryto losowe wypadanie zapłonów',
 description: 'Sterownik wykrywa wypadanie zapłonów w więcej niż jednym cylindrze.',
 commonCauses: ['Zużyte świece lub przewody zapłonowe', 'Nieszczelność podciśnienia', 'Problem z paliwem lub wtryskiem', 'Niska kompresja'],
 firstChecks: ['Sprawdź świece, przewody i cewki', 'Odczytaj liczniki misfire per cylinder', 'Sprawdź nieszczelności podciśnienia', 'Zweryfikuj stan paliwa, ciśnienie paliwa i kompresję'],
 severity: 'high',
 confidence: 'reference',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Nie jeźdź długo z aktywnym misfire — może uszkodzić katalizator. Zatrzymaj diagnostykę, jeśli występują wyraźne objawy mechaniczne.'
 },
 {
 code: 'P0440',
 system: 'OBD-II',
 title: 'Usterka układu EVAP',
 description: 'Sterownik wykrywa problem z kontrolą par paliwa.',
 commonCauses: ['Luźna lub uszkodzona korek wlewu', 'Nieszczelność przewodów EVAP', 'Uszkodzony zawór purge lub vent', 'Problem z kanistrem węglowym'],
 firstChecks: ['Dokręć lub wymień korek wlewu', 'Obejrzyj przewody EVAP i złącza', 'Sprawdź działanie zaworu purge', 'Wykonaj test szczelności układu'],
 severity: 'moderate',
 confidence: 'reference',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Nie zastępuj zaworów ani kanistra bez testu szczelności i diagnostyki sterowania.'
 },
 {
 code: 'P0442',
 system: 'OBD-II',
 title: 'Mała nieszczelność układu EVAP',
 description: 'Układ kontroli par paliwa nie utrzymuje wymaganej szczelności.',
 commonCauses: ['Nieszczelna korek wlewu', 'Pęknięty przewód EVAP', 'Uszkodzona uszczelka', 'Nieszczelny zawór lub kanister'],
 firstChecks: ['Sprawdź korek i uszczelkę', 'Obejrzyj przewody EVAP', 'Wykonaj test dymem', 'Zweryfikuj zawory EVAP'],
 severity: 'moderate',
 confidence: 'reference',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Test dymem jest najpraktyczniejszym sposobem znalezienia małej nieszczelności.'
 },
 {
 code: 'P0455',
 system: 'OBD-II',
 title: 'Duża nieszczelność układu EVAP',
 description: 'Układ kontroli par paliwa wykrywa dużą nieszczelność.',
 commonCauses: ['Brak lub źle dokręcona korek wlewu', 'Odpadnięty przewód EVAP', 'Uszkodzony zawór vent lub purge', 'Nieszczelny kanister'],
 firstChecks: ['Sprawdź korek wlewu', 'Obejrzyj wszystkie przewody EVAP', 'Sprawdź zawory i złącza', 'Wykonaj test szczelności'],
 severity: 'moderate',
 confidence: 'reference',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Zacznij od najprostszych przyczyn: korek i przewody, zanim wymienisz elementy elektroniczne.'
 },
 {
 code: 'P0700',
 system: 'OBD-II',
 title: 'Usterka układu sterowania skrzynią biegów',
 description: 'Moduł silnika otrzymał informację o usterce z modułu sterującego skrzynią.',
 commonCauses: ['Kod w sterowniku skrzyni', 'Problem elektryczny', 'Niski lub zużyty płyn ATF', 'Usterka mechaniczna lub solenoidu'],
 firstChecks: ['Odczytaj kody w sterowniku skrzyni', 'Sprawdź poziom i stan płynu zgodnie z procedurą', 'Obejrzyj złącza i przewody', 'Nie wymieniaj skrzyni przed pełną diagnostyką'],
 severity: 'high',
 confidence: 'reference',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'P0700 jest kodem nadrzędnym. Trzeba odczytać kody właściwego modułu skrzyni.'
 }
];

export function findDiagnosticCodes(query: string) {
 const normalized = query.trim().toUpperCase();
 if (!normalized) return [];
 return DIAGNOSTIC_CODES.filter(item =>
 item.code.includes(normalized) ||
 item.title.toLowerCase().includes(query.toLowerCase()) ||
 item.description.toLowerCase().includes(query.toLowerCase())
 );
}
