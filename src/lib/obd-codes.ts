export type ObdSeverity = 'info' | 'warning' | 'critical';

export interface ObdCode {
  code: string;
  title: string;
  severity: ObdSeverity;
  systems: string[];
  description: string;
  commonCauses: string[];
  diagnosticSteps: string[];
  relatedSearch: string;
  compatibility?: {
    engines?: string[];
    drivetrains?: string[];
    years?: [number, number];
  };
}

export const OBD_CODES: ObdCode[] = [
  {
    code: 'P0101',
    title: 'Zakres lub wydajność obwodu czujnika MAF/MAP',
    severity: 'warning',
    systems: ['Paliwo', 'Powietrze'],
    description: 'PCM otrzymuje wartość przepływomierza powietrza lub czujnika ciśnienia w kolektorze poza oczekiwanym zakresem względem innych czujników.',
    commonCauses: ['Zabrudzony lub uszkodzony czujnik MAF', 'Nieszczelność dolotu po MAF', 'Uszkodzone przewody lub złącze czujnika', 'Zapchany filtr powietrza'],
    diagnosticSteps: ['Odczytaj dane live MAF na biegu jałowym i pod obciążeniem', 'Sprawdź filtr powietrza oraz szczelność dolotu', 'Obejrzyj złącze i wiązkę czujnika', 'Porównaj odczyt MAF z wartością oczekiwaną dla silnika'],
    relatedSearch: 'MAF GMT400'
  },
  {
    code: 'P0113',
    title: 'Wysoki sygnał obwodu czujnika temperatury powietrza dolotowego',
    severity: 'warning',
    systems: ['Paliwo', 'Czujniki'],
    description: 'PCM widzi nienaturalnie wysoką rezystancję lub napięcie w obwodzie IAT.',
    commonCauses: ['Przerwany przewód sygnałowy', 'Uszkodzony czujnik IAT', 'Skorodowane złącze', 'Przerwany masa obwodu'],
    diagnosticSteps: ['Sprawdź napięcie 5 V na złączu czujnika', 'Zmierz rezystancję czujnika IAT', 'Obejrzyj przewody pod kątem przetarć', 'Porównaj odczyt IAT z ECT po zimnym rozruchu'],
    relatedSearch: 'IAT GMT400'
  },
  {
    code: 'P0117',
    title: 'Niski sygnał obwodu czujnika temperatury płynu chłodzącego',
    severity: 'warning',
    systems: ['Chłodzenie', 'Czujniki'],
    description: 'PCM otrzymuje sygnał sugerujący bardzo wysoką temperaturę płynu chłodzącego.',
    commonCauses: ['Zwarcie sygnału do masy', 'Uszkodzony czujnik ECT', 'Niski poziom płynu chłodzącego', 'Problem z przewodami czujnika'],
    diagnosticSteps: ['Sprawdź poziom i stan płynu chłodzącego', 'Odczytaj ECT na zimnym silniku', 'Zmierz rezystancję czujnika ECT', 'Sprawdź zwarcie przewodu sygnałowego do masy'],
    relatedSearch: 'ECT GMT400'
  },
  {
    code: 'P0121',
    title: 'Zakres lub wydajność obwodu czujnika położenia przepustnicy',
    severity: 'warning',
    systems: ['Silnik', 'Czujniki'],
    description: 'Sygnał TPS nie odpowiada oczekiwanej zależności względem położenia pedału i obrotów silnika.',
    commonCauses: ['Zużyty czujnik TPS', 'Luźne złącze TPS', 'Nieprawidłowa regulacja cięgna przepustnicy', 'Uszkodzona wiązka'],
    diagnosticSteps: ['Odczytaj TPS przy zamkniętej i otwartej przepustnicy', 'Sprawdź płynność zmiany wartości bez skoków', 'Zmierz napięcie referencyjne 5 V', 'Sprawdź masę i złącze czujnika'],
    relatedSearch: 'TPS GMT400'
  },
  {
    code: 'P0131',
    title: 'Niskie napięcie obwodu czujnika O2 B1S1',
    severity: 'warning',
    systems: ['Paliwo', 'Emisje'],
    description: 'Przedni czujnik tlenu zgłasza stale ubogą mieszankę lub zbyt niskie napięcie.',
    commonCauses: ['Zużyty czujnik O2', 'Nieszczelność wydechu przed czujnikiem', 'Uboga mieszanka', 'Uszkodzone okablowanie'],
    diagnosticSteps: ['Odczytaj napięcie O2 na biegu jałowym', 'Sprawdź reakcję sygnału po dodaniu gazu', 'Obejrzyj kolektor i połączenia wydechu', 'Sprawdź ciśnienie paliwa i dopływ powietrza'],
    relatedSearch: 'O2 sensor GMT400'
  },
  {
    code: 'P0171',
    title: 'Układ paliwowy zbyt ubogi — bank 1',
    severity: 'warning',
    systems: ['Paliwo', 'Powietrze'],
    description: 'PCM długo koryguje mieszankę w kierunku wzbogacenia, co wskazuje na nadmiar powietrza lub niedobór paliwa.',
    commonCauses: ['Nieszczelność podciśnienia', 'Zabrudzony MAF', 'Niskie ciśnienie paliwa', 'Zużyta pompa paliwa lub filtr paliwa'],
    diagnosticSteps: ['Sprawdź szczelność dolotu i przewodów podciśnienia', 'Odczytaj długoterminową korektę paliwową', 'Zmierz ciśnienie paliwa', 'Sprawdź stan MAF i filtru powietrza'],
    relatedSearch: 'fuel trim GMT400'
  },
  {
    code: 'P0300',
    title: 'Wykryto losowe wypadanie zapłonów',
    severity: 'critical',
    systems: ['Zapłon', 'Silnik'],
    description: 'PCM wykrywa wypadanie zapłonów bez wskazania jednego konkretnego cylindra.',
    commonCauses: ['Zużyte świece lub przewody zapłonowe', 'Nieszczelność podciśnienia', 'Niskie ciśnienie paliwa', 'Problem z rozdzielaczem, kopułką lub palcem', 'Niski stan mechaniczny silnika'],
    diagnosticSteps: ['Odczytaj liczniki misfire per cylinder', 'Sprawdź świece, przewody, kopułkę i palec', 'Sprawdź nieszczelności podciśnienia', 'Zmierz ciśnienie paliwa', 'Wykonaj test kompresji, jeśli wypadanie zapłonów persists'],
    relatedSearch: 'misfire GMT400'
  },
  {
    code: 'P0301',
    title: 'Wypadanie zapłonów — cylinder 1',
    severity: 'critical',
    systems: ['Zapłon', 'Silnik'],
    description: 'PCM wykrywa wypadanie zapłonów w pierwszym cylindrze.',
    commonCauses: ['Świeca lub przewód cylindra 1', 'Uszkodzona cewka w układach z osobnymi cewkami', 'Nieszczelność dolotu przy cylindrze', 'Niski kompresja cylindra 1'],
    diagnosticSteps: ['Zamień świecę lub cewkę z innym cylindrem', 'Sprawdź przewód zapłonowy i styki', 'Sprawdź dolot pod kątem nieszczelności', 'Wykonaj test kompresji cylindra 1'],
    relatedSearch: 'misfire cylinder 1 GMT400'
  },
  {
    code: 'P0327',
    title: 'Niski sygnał obwodu czujnika spalania stukowego',
    severity: 'warning',
    systems: ['Zapłon', 'Czujniki'],
    description: 'PCM nie otrzymuje oczekiwanego sygnału z czujnika spalania stukowego.',
    commonCauses: ['Poluzowany czujnik knock', 'Uszkodzony czujnik', 'Przerwana wiązka', 'Nieprawidłowa masa'],
    diagnosticSteps: ['Sprawdź moment dokręcenia czujnika', 'Obejrzyj złącze i przewód', 'Zmierz rezystancję i sygnał czujnika', 'Sprawdź obecność zakłóceń elektrycznych'],
    relatedSearch: 'knock sensor GMT400'
  },
  {
    code: 'P0335',
    title: 'Obwód czujnika położenia wału korbowego',
    severity: 'critical',
    systems: ['Zapłon', 'Czujniki'],
    description: 'PCM nie otrzymuje poprawnego sygnału pozycji wału korbowego.',
    commonCauses: ['Uszkodzony czujnik CKP', 'Przerwa w wiązce', 'Zanieczyszczenie lub uszkodzenie koła sygnałowego', 'Problem ze złączem'],
    diagnosticSteps: ['Sprawdź zasilanie, masę i sygnał czujnika', 'Obejrzyj koło sygnałowe', 'Zmierz rezystancję czujnika zgodnie ze specyfikacją', 'Sprawdź przewody przy silniku'],
    relatedSearch: 'CKP sensor GMT400'
  },
  {
    code: 'P0340',
    title: 'Obwód czujnika położenia wałka rozrządu',
    severity: 'warning',
    systems: ['Zapłon', 'Czujniki'],
    description: 'PCM nie otrzymuje poprawnego sygnału z czujnika CMP.',
    commonCauses: ['Uszkodzony czujnik CMP', 'Przerwany przewód sygnałowy', 'Brak zasilania lub masy', 'Problem z rozdzielaczem lub kołem sygnałowym'],
    diagnosticSteps: ['Sprawdź zasilanie, masę i sygnał CMP', 'Obejrzyj złącze i wiązkę', 'Sprawdź elementy rozdzielacza', 'Porównaj synchronizację CMP z CKP'],
    relatedSearch: 'CMP sensor GMT400'
  },
  {
    code: 'P0401',
    title: 'Niewystarczający przepływ EGR',
    severity: 'warning',
    systems: ['Emisje'],
    description: 'PCM nie wykrywa oczekiwanego przepływu spalin przez układ EGR.',
    commonCauses: ['Zapchany zawór EGR', 'Zapchane kanały EGR', 'Uszkodzony solenoid EGR', 'Nieszczelność podciśnienia'],
    diagnosticSteps: ['Sprawdź ruch zaworu EGR', 'Oczyść kanały i zawór EGR', 'Sprawdź podciśnienie i solenoid', 'Odczytaj parametry EGR podczas jazdy'],
    relatedSearch: 'EGR GMT400'
  },
  {
    code: 'P0420',
    title: 'Niska wydajność katalizatora — bank 1',
    severity: 'warning',
    systems: ['Emisje'],
    description: 'PCM porównuje sygnały czujników O2 przed i za katalizatorem i nie widzi oczekiwanej redukcji emisji.',
    commonCauses: ['Zużyty katalizator', 'Nieszczelność wydechu', 'Zużyte czujniki O2', 'Nierozwiązane wypadanie zapłonów lub bogata mieszanka'],
    diagnosticSteps: ['Usuń najpierw kody misfire i korekty paliwowe', 'Sprawdź szczelność wydechu', 'Porównaj przebiegi O2 przed i za katalizatorem', 'Sprawdź stan katalizatora'],
    relatedSearch: 'catalytic converter GMT400'
  },
  {
    code: 'P0440',
    title: 'Układ EVAP — wykryto usterkę',
    severity: 'info',
    systems: ['Emisje', 'Paliwo'],
    description: 'PCM wykrył nieprawidłowość w układzie odpowietrzania zbiornika paliwa.',
    commonCauses: ['Luźna lub uszkodzona korek paliwa', 'Pęknięty przewód EVAP', 'Uszkodzony zawór purge', 'Uszkodzony zawór vent'],
    diagnosticSteps: ['Dokręć lub wymień korek paliwa', 'Obejrzyj przewody EVAP', 'Sprawdź działanie zaworu purge', 'Wykonaj test szczelności układu EVAP'],
    relatedSearch: 'EVAP GMT400'
  },
  {
    code: 'P0455',
    title: 'Układ EVAP — wykryto dużą nieszczelność',
    severity: 'info',
    systems: ['Emisje', 'Paliwo'],
    description: 'Układ EVAP nie utrzymuje podciśnienia; nieszczelność jest na tyle duża, że PCM ją wykrywa.',
    commonCauses: ['Brak lub źle dokręcona korek paliwa', 'Pęknięty przewód EVAP', 'Uszkodzona pompa diagnostyczna EVAP', 'Uszkodzony zawór vent'],
    diagnosticSteps: ['Sprawdź korek paliwa', 'Obejrzyj wszystkie przewody EVAP', 'Sprawdź zawór vent i purge', 'Wykonaj test dymem układu EVAP'],
    relatedSearch: 'EVAP leak GMT400'
  },
  {
    code: 'P0507',
    title: 'Obroty biegu jałowego powyżej wartości zadanej',
    severity: 'warning',
    systems: ['Silnik', 'Paliwo'],
    description: 'Rzeczywiste obroty biegu jałowego są trwale wyższe niż wartość sterowana przez PCM.',
    commonCauses: ['Zabrudzona przepustnica', 'Nieszczelność podciśnienia', 'Nieszczelny zawór IAC', 'Nieprawidłowa regulacja linki przepustnicy'],
    diagnosticSteps: ['Sprawdź obroty na ciepłym silniku', 'Oczyść przepustnicę i kanał IAC', 'Sprawdź nieszczelności podciśnienia', 'Sprawdź regulację linki i czujnik TPS'],
    relatedSearch: 'idle air control GMT400'
  },
  {
    code: 'P0700',
    title: 'Układ sterowania skrzynią biegów — zgłoszona usterka',
    severity: 'warning',
    systems: ['Skrzynia biegów'],
    description: 'Moduł skrzyni zgłosił własny kod usterki; P0700 jest informacją ogólną, a właściwa przyczyna znajduje się w dodatkowych kodach.',
    commonCauses: ['Kod wewnętrzny modułu TCM', 'Problem z solenoidami zmiany biegów', 'Niski lub zużyty płyn ATF', 'Uszkodzone czujniki skrzyni'],
    diagnosticSteps: ['Odczytaj kody modułu skrzyni, nie tylko P0700', 'Sprawdź poziom, stan i zapach płynu ATF', 'Odczytaj dane live solenoidów i temperatury ATF', 'Sprawdź złącza i masę skrzyni'],
    relatedSearch: '4L60E transmission codes GMT400',
    compatibility: { drivetrains: ['2WD', '4WD'] }
  },
  {
    code: 'P0740',
    title: 'Układ sprzęgła hydrokinetycznego',
    severity: 'warning',
    systems: ['Skrzynia biegów'],
    description: 'PCM nie potwierdza oczekiwanego zaangażowania lub poślizgu sprzęgła hydrokinetycznego TCC.',
    commonCauses: ['Zużyte sprzęgło TCC', 'Problem z solenoidem TCC', 'Zanieczyszczony płyn ATF', 'Niskie ciśnienie w układzie skrzyni'],
    diagnosticSteps: ['Sprawdź stan płynu ATF', 'Odczytaj poślizg TCC podczas jazdy', 'Sprawdź działanie solenoidu TCC', 'Wykonaj test ciśnienia skrzyni'],
    relatedSearch: 'TCC solenoid 4L60E',
    compatibility: { drivetrains: ['2WD', '4WD'] }
  },
  {
    code: 'P0751',
    title: 'Solenoid zmiany biegów A — wydajność lub zablokowanie',
    severity: 'warning',
    systems: ['Skrzynia biegów'],
    description: 'Skrzynia nie uzyskuje oczekiwanej reakcji po zadziałaniu solenoidu zmiany biegów A.',
    commonCauses: ['Zużyty solenoid 1-2', 'Zanieczyszczony płyn ATF', 'Uszkodzona wiązka skrzyni', 'Niskie ciśnienie układu'],
    diagnosticSteps: ['Odczytaj kody towarzyszące', 'Sprawdź rezystancję solenoidu', 'Sprawdź stan płynu ATF', 'Sprawdź wiązkę i złącze skrzyni'],
    relatedSearch: '1-2 shift solenoid 4L60E',
    compatibility: { drivetrains: ['2WD', '4WD'] }
  }
];

export function findObdCode(code: string): ObdCode | undefined {
  return OBD_CODES.find(item => item.code.toLowerCase() === code.toLowerCase());
}

export function searchObdCodes(query: string): ObdCode[] {
  const normalized = query.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (!normalized) return OBD_CODES;
  return OBD_CODES.filter(item => [item.code, item.title, item.description, ...item.systems, ...item.commonCauses].join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalized));
}
