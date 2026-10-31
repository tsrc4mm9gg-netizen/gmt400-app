// Poradnik kupującego GMT400 — lista kontrolna. Treść WYŁĄCZNIE z instrukcji obsługi GM
// (Owner’s Manual 1999 Chevrolet Tahoe/Suburban; kopia w „Dokumenty GMT400”) oraz linki do istniejących
// stron serwisu (diagnoza, usterki, DIY, VIN, poradniki). Opłat i procedur w Polsce nie powtarzamy — linkujemy
// do poradnika importu ze źródłami.

export const BUYER_STORAGE_KEY = 'gmt400_poradnik_v1';
export const BUYER_SOURCE = { label: 'GM Owner’s Manual 1999 Chevrolet Tahoe/Suburban', url: 'https://assets.gm.com/manuals/chevrolet/1999_chevrolet_suburban_owners.pdf' };
export const BUYER_CHECK = 'Strony podajemy z instrukcji Tahoe/Suburban 1999 — w innych rocznikach i nadwoziach rozdziały są podobne, ale sprawdź w swoim aucie.';

const s = page => ({ page });

export const BUYER_SECTIONS = [
  {
    id: 'rdza', title: 'Rdza', image: { src: '/guide-rdza-schemat.svg', alt: 'Schemat: gdzie szukać rdzy w GMT400 — progi, nadkola, podłoga kabiny, rama przy resorach, klapa, narożniki kabiny' },
    items: [
      { id: 'rdza-podwozie', text: 'Obejrzyj od spodu przewody paliwowe, ramę, podłogę i wydech. GM ostrzega, że sól i chemia drogowa zbierające się na podwoziu przyspieszają korozję mimo zabezpieczenia fabrycznego.', ...s('s. 6-57 „Underbody Maintenance”') },
      { id: 'rdza-profile', text: 'Sprawdź miejsca, w których zbiera się błoto, i zamknięte profile ramy. GM zaleca co najmniej każdej wiosny wypłukiwać podwozie czystą wodą — zapytaj sprzedającego, czy było to robione.', ...s('s. 6-57 i 7-41 „Underbody Flushing Service”') },
      { id: 'rdza-lakier', text: 'Odpryski, pęknięcia i głębokie rysy lakieru: według GM goły metal szybko koroduje i może skończyć się dużą naprawą.', ...s('s. 6-57 „Finish Damage”') },
      { id: 'rdza-naprawy', text: 'Ślady napraw blacharskich: GM wymaga, by naprawiane lub wymieniane elementy dostały środek antykorozyjny. Zapytaj, czy go nałożono.', ...s('s. 6-57 „Sheet Metal Damage”') },
    ],
  },
  {
    id: 'rama', title: 'Rama, zawieszenie, hamulce', image: { src: '/guide-rama-schemat.svg', alt: 'Schemat: rama GMT400 — co sprawdzić: mocowania zawieszenia, rama za kabiną, mocowania resorów, spawy i otwory, przód ramy, numer ramy' },
    items: [
      { id: 'rama-zawieszenie', text: 'Zawieszenie przednie i tylne oraz układ kierowniczy: uszkodzone, luźne lub brakujące części, zużycie, brak smarowania. Przewody wspomagania: wycieki, pęknięcia, przetarcia.', ...s('s. 7-42 „Steering and Suspension Inspection”') },
      { id: 'rama-wydech', text: 'Cały układ wydechowy i nadwozie przy nim: pęknięte lub brakujące elementy, nieszczelne połączenia, otwarte szwy i dziury, przez które spaliny mogą dostać się do kabiny.', ...s('s. 7-42 „Exhaust System Inspection”') },
      { id: 'rama-hamulce', text: 'Hamulce: przewody i węże (wycieki, pęknięcia, przetarcia), klocki i stan tarcz, okładziny i bębny, cylinderki, zaciski, regulacja hamulca postojowego.', ...s('s. 7-43 „Brake System Inspection”') },
      { id: 'rama-postojowy', text: 'Na pochyłości, przodem w dół: hamulec postojowy musi sam utrzymać auto; w automacie także samo położenie P (silnik pracuje, hamulce zwolnione — bądź gotów hamować).', ...s('s. 7-41 „Parking Brake and Automatic Transmission PARK (P) Mechanism Check”') },
    ],
    links: [['/diagnoza?objaw=halasy', 'Diagnoza: hałasy i drgania'], ['/diagnoza?objaw=hamulce', 'Diagnoza: hamulce']],
  },
  {
    id: 'silnik', title: 'Silnik',
    items: [
      { id: 'silnik-olej', text: 'Poziom i wygląd oleju na bagnecie (wytrzyj, włóż do końca, odczytaj).', ...s('s. 6-13 „Checking Engine Oil”') },
      { id: 'silnik-wycieki', text: 'Po postoju obejrzyj podłoże pod autem: woda, olej, paliwo, inne płyny. Kapanie wody z klimatyzacji jest normalne; wyciek lub zapach paliwa trzeba usunąć od razu.', ...s('s. 6-34 „Fluid Leak Check”') },
      { id: 'silnik-mil', text: 'Kontrolka SERVICE ENGINE SOON musi zapalić się przy włączonym zapłonie, zanim uruchomisz silnik. Świeci stale po uruchomieniu — usterka układu emisji; miga — wypadanie zapłonów (instrukcja 1999, OBD II).', ...s('s. 2-76–2-77 „Malfunction Indicator Lamp”') },
      { id: 'silnik-chlodzenie', text: 'Układ chłodzenia: węże popękane, spuchnięte lub zużyte, rury, złączki i opaski. GM zaleca próbę ciśnieniową układu i korka chłodnicy.', ...s('s. 7-42 „Engine Cooling System Inspection”') },
    ],
    links: [['/diagnoza?objaw=wycieki', 'Diagnoza: wycieki'], ['/diagnoza?objaw=check-engine', 'Diagnoza: Check Engine'], ['/kody-obd', 'Kody OBD'], ['/diagnoza?objaw=przegrzewanie', 'Diagnoza: przegrzewanie']],
  },
  {
    id: 'skrzynia', title: 'Skrzynia biegów',
    items: [
      { id: 'skrzynia-atf', text: 'ATF sprawdza się na rozgrzanej skrzyni: auto na równym, hamulec postojowy, przejście przez wszystkie zakresy, P, co najmniej 3 minuty na biegu jałowym. Pomiar na zimno jest tylko orientacyjny.', ...s('s. 6-19–6-20 „Automatic Transmission Fluid”') },
      { id: 'skrzynia-rozrusznik', text: 'Rozrusznik może działać tylko w P albo N (hamulec postojowy i roboczy wciśnięte, bez gazu). Jeśli kręci na innym biegu — auto wymaga serwisu.', ...s('s. 7-40 „Starter Switch Check”') },
      { id: 'skrzynia-btsi', text: 'Automat (BTSI): zapłon w RUN, silnik wyłączony, bez wciśniętego hamulca dźwignia nie może wyjść z P.', ...s('s. 7-40 „Brake-Transmission Shift Interlock (BTSI) Check”') },
      { id: 'skrzynia-stacyjka', text: 'Kluczyk przekręca się do LOCK tylko w P i wyjmuje się tylko w LOCK.', ...s('s. 7-41 „Ignition Transmission Lock Check”') },
      { id: 'skrzynia-historia', text: 'Zapytaj o wymiany ATF i filtra — porównaj z harmonogramem GM dla rocznika.', link: ['/przeglady', 'Harmonogram przeglądów'] },
    ],
    links: [['/diagnoza?objaw=skrzynia&typ=automat&rodzaj=slizga', 'Diagnoza: 4L60-E ślizga']],
  },
  {
    id: '4wd', title: 'Napęd 4WD',
    items: [
      { id: '4wd-poziomy', text: 'Poziom oleju w przednim moście i w skrzyni rozdzielczej; wąż odpowietrzający skrzyni rozdzielczej bez załamań i poprawnie zamocowany.', ...s('s. 7-43 „Transfer Case (Four-Wheel Drive) Inspection”') },
      { id: '4wd-polosie', text: 'Przeguby homokinetyczne i uszczelniacze półosi — bez wycieków.', ...s('s. 7-43 „Drive Axle Service”') },
      { id: '4wd-kontrolki', text: 'Skrzynia rozdzielcza z przyciskami: kontrolki przełącznika zapalają się na chwilę po włączeniu zapłonu i jedna zostaje. Jeśli się nie zapalają — serwis.', ...s('s. 2-23 „Transfer Case”') },
      { id: '4wd-uzytkowanie', text: 'Zapytaj, jak auto jeździło: według GM długa jazda w 4H lub 4L po suchej lub mokrej nawierzchni skraca żywotność układu napędowego.', ...s('s. 2-19 „Transfer Case”') },
    ],
    links: [['/diagnoza?objaw=skrzynia', 'Diagnoza: skrzynia i napęd']],
  },
  {
    id: 'elektryka', title: 'Elektryka',
    items: [
      { id: 'elektryka-kontrolki', text: 'Po przekręceniu kluczyka część kontrolek zapala się na chwilę jako test. Kontrolka ABS, która się nie zapala, wymaga naprawy.', ...s('s. 2-72 i 2-75 „Warning Lights, Gages and Indicators”') },
      { id: 'elektryka-woltomierz', text: 'Woltomierz po uruchomieniu: wskazanie w strefie ostrzegawczej oznacza problem z ładowaniem — według GM można tak jechać tylko krótko.', ...s('s. 2-74 „Voltmeter”') },
    ],
    links: [['/diagnoza?objaw=elektryka', 'Diagnoza: elektryka'], ['/schematy', 'Bezpieczniki i schematy']],
  },
  {
    id: 'vin', title: 'VIN i dokumenty',
    items: [
      { id: 'vin-tabliczka', text: 'VIN na tabliczce w lewym przednim rogu deski (widoczny przez szybę) musi zgadzać się z naklejkami (Vehicle Certification, Service Parts) i dokumentami.', ...s('s. 6-59 „Vehicle Identification Number (VIN)”') },
      { id: 'vin-spid', text: 'Naklejka Service Parts Identification w schowku: VIN, model, lakier i lista opcji fabrycznych (kody RPO). GM: nie usuwaj jej z auta.', ...s('s. 6-59 „Service Parts Identification Label”') },
      { id: 'vin-silnik', text: '8. znak VIN to kod silnika — porównaj z silnikiem w ogłoszeniu.', ...s('s. 6-59 „Engine Identification”') },
    ],
    links: [['/vin', 'Sprawdź VIN'], ['/narzedzia/rpo', 'Kody RPO'], ['/moj-samochod', 'Zapisz auto']],
  },
];

export const BUYER_PL_LINKS = [
  ['/dla-wlasciciela/import', 'Import z USA — procedura i opłaty (poradnik ze źródłami)'],
  ['/baza?tab=import', 'Import — kalkulator i dokumenty'],
  ['/dla-wlasciciela/swiatla-eu', 'Światła EU'],
  ['/dla-wlasciciela/lpg', 'LPG'],
  ['/dla-wlasciciela/zolte-tablice', 'Żółte tablice'],
];

export const BUYER_ITEM_IDS = BUYER_SECTIONS.flatMap(sec => sec.items.map(i => i.id));
export function readChecked(raw) {
  try {
    const v = JSON.parse(raw || '{}');
    const c = v && typeof v === 'object' && v.checked && typeof v.checked === 'object' ? v.checked : {};
    return Object.fromEntries(BUYER_ITEM_IDS.filter(id => c[id] === true).map(id => [id, true]));
  } catch { return {}; }
}
