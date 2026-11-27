# Silnik kręci, ale nie odpala — matryca źródeł (etap 1, runda 2)

Stan roboczy; punkt odniesienia: `6975c74fde364ef08fbaf56ab74b9ba31cbafccf`. Runda 2 opiera się na dostarczonym materiale źródłowym: pełnych transkrypcjach obu tabel, adresach 24 stron i dowodach porównania (skróty SHA-256 tekstu i obrazów). Nie odczytano w tej rundzie dodatkowych stron poza tym materiałem; statusy wynikają z niego.

Kopie CHARM i LEMON to kopie osób trzecich, nie potwierdzenie GM. Porównanie dotyczy 12 wariantów 1999, 5.7 VIN R w jednej kopii CHARM; nie obejmuje innych silników, roczników, 7.4 ani diesli. Nie wolno pisać „zweryfikowano całą rodzinę GMT400”.

## Zakres i dopasowanie

Źródło wyboru: `src/lib/vehicle-profile.ts`, lata w formularzu 1988–2000. Zakres ścieżki rozszerzono o modele, dla których materiał źródłowy potwierdza tożsamość procedur: Suburban 1500 i 2500, Tahoe 2/4-drzwiowe (Chevrolet) oraz Yukon 2/4-drzwiowe (GMC), 2WD i 4WD, rok 1999, silnik L31 (VIN R).

Zakres nie ma pola marki, więc wpisy Chevrolet i GMC dla tego samego modelu i napędu są zapisane jednym zakresem, z odrębnymi adresami w tablicy źródeł. Dla Tahoe i Yukon zakres obejmuje oba nadwozia z wyboru auta; podstawa to dowód z materiału źródłowego: jedna strona CCNR i FSD w drzewie, bez wariantu nadwoziowego, ta sama treść co w Suburbanie. To wniosek z budowy podręcznika, nie deklaracja GM.

## Pokrycie i statusy

Wszystkie 12 wariantów poniżej ma status „odczytane, treść zgodna z referencją w kopii CHARM” (CCNR kroki 1–8, FSD kroki 1–30; typ układu: Central SFI wg opisu źródła). Referencją jest Chevrolet K 1500 Suburban 4WD. Adresy CCNR i FSD są zapisane w tablicach źródeł w `src/lib/flows/nie-odpala-kreci-5-7-1999.ts` (pełne adresy URL, jeden wpis na wariant i procedurę).

| Wariant 1999, 5.7 VIN R | Opis pojazdu w kopii | Porównanie z referencją | Status |
| --- | --- | --- | --- |
| Chevrolet K 1500 Suburban 4WD | 1999 K 1500 Suburban 4WD V8-5.7L VIN R | referencja | odczytane, treść zgodna z referencją w kopii CHARM |
| Chevrolet C 1500 Suburban 2WD | 1999 C 1500 Suburban 2WD V8-5.7L VIN R | identyczne (kopia CHARM i LEMON) | odczytane, treść zgodna z referencją w kopiach |
| Chevrolet C 2500 Suburban 2WD | 1999 C 2500 Suburban 2WD V8-5.7L VIN R | identyczne | odczytane, treść zgodna z referencją w kopii CHARM |
| Chevrolet K 2500 Suburban 4WD | 1999 K 2500 Suburban 4WD V8-5.7L VIN R | identyczne | odczytane, treść zgodna z referencją w kopii CHARM |
| Chevrolet C Tahoe 2WD | 1999 C Tahoe 2WD V8-5.7L VIN R | identyczne; jedna strona CCNR i FSD, bez wariantu nadwoziowego (wniosek z budowy podręcznika, nie deklaracja GM) | odczytane, treść zgodna z referencją w kopii CHARM |
| Chevrolet K Tahoe 4WD | 1999 K Tahoe 4WD V8-5.7L VIN R | identyczne; jak wyżej | odczytane, treść zgodna z referencją w kopii CHARM |
| GMC C Yukon 2WD | 1999 C Yukon 2WD V8-5.7L VIN R | identyczne; jak wyżej | odczytane, treść zgodna z referencją w kopii CHARM |
| GMC K Yukon/Denali 4WD | 1999 K Yukon/Denali 4WD V8-5.7L VIN R | identyczne; jak wyżej | odczytane, treść zgodna z referencją w kopii CHARM |
| GMC C 1500 Suburban 2WD | 1999 C 1500 Suburban 2WD V8-5.7L VIN R | identyczne | odczytane, treść zgodna z referencją w kopii CHARM |
| GMC K 1500 Suburban 4WD | 1999 K 1500 Suburban 4WD V8-5.7L VIN R | identyczne | odczytane, treść zgodna z referencją w kopii CHARM |
| GMC C 2500 Suburban 2WD | 1999 C 2500 Suburban 2WD V8-5.7L VIN R | identyczne | odczytane, treść zgodna z referencją w kopii CHARM |
| GMC K 2500 Suburban 4WD | 1999 K 2500 Suburban 4WD V8-5.7L VIN R | identyczne | odczytane, treść zgodna z referencją w kopii CHARM |

## Niespójności źródła (zachowane)

- **Ciśnienie:** CCNR krok 7 podaje 379–413 kPa (55–60 psi) przy zapłonie ON i wyłączonym silniku, bez określenia stanu pompy; FSD krok 2 podaje 413–455 kPa (60–66 psi) przy pompie włączonej skanerem; FSD krok 3 podaje 379–413 kPa po zatrzymaniu pompy. Tekst opisu FSD podaje przy pracującej pompie 415–455 kPa (60–66 psi), tabela 413–455 kPa. Warunki i zakresy każdego kroku pozostają osobno; nie łączymy zakresów ani nie wnioskujemy o stanie pompy.
- **Krok 23:** źródło mówi o napięciu pompy (niskie, wysokie), nie o poborze prądu. W źródle nie ma opisu pomiaru napięcia ani metody; zachowujemy brzmienie „napięcie” i nie dopisujemy „pobór prądu”.
- **Krok 29:** to krok czynności z pytaniem „czy czynność zakończona”: Tak → krok 30, Nie → test balansu wtryskiwaczy Tech 2. Nie opisujemy „Nie” jako „naprawa nie pomogła”.
- **Krok 15:** opis tekstowy FSD podaje poniżej 379 kPa (55 psi) na biegu jałowym; tabela podaje poniżej 413 kPa (60 psi) przy pracującej pompie. Dwa różne warunki w tym samym źródle; zachowane osobno.

## Zmiany w kodzie

- Dodano węzeł `c1a` odzwierciedlający krok 1 CCNR (kontrola OBD, zapis danych ramki zamrożonej i rekordów usterek przed kasowaniem DTC) przed `c3`, z konwencją jak `f1`; dodano wynik `r_obd_ccnr`.
- Poprawiono `r_f29`: czynność kroku 29 to wymiana nieszczelnych lub uziemionych wtryskiwaczy; po zakończeniu krok 30; gdy czynności nie da się zakończyć, tabela odsyła do testu balansu wtryskiwaczy Tech 2.
- Poprawiono `r_f16`: gdy usunięcia zatkania powrotu nie da się zakończyć, tabela kieruje do kroku 17.
- W `c1` wskazano, że uwaga o drugim zbiorniku pochodzi z tabeli Fuel System Diagnosis, krok 10.
- Rozszerzono `VERSION` i tablice źródeł o 12 wariantów.

## Treści do ponownego użycia po sprawdzeniu stosowalności

- [Porady właściciela](https://www.gmt400.pl/porady-wlasciciela): ECM-B — istnieje opis sprawdzenia oraz reakcji na powtórne przepalenie, bez podnoszenia amperażu. Wpis deklaruje C/K 1996–1999 i Tahoe/Suburban 1999; przypisy wymieniają C/K 1996, 1997, 1998 oraz Tahoe/Suburban 1999. Nie przyjmować C/K 1999 ani GMC bez osobnej weryfikacji. Wynik warsztatowej kompresji oprzeć na przywołanym GM Service Manual C/K 1998 dla odpowiedniego 4.3/5.0/5.7; nie przenosić do 7.4 ani diesla. SECURITY tylko przy potwierdzonym wyposażeniu, bez obejść.
- [Benzyna — lista Haynes](https://www.gmt400.pl/baza/silnik-benzynowy-nie-odpala-gasnie-nierowny-bieg-jalowy-szarpie-brak-mocy-strzal): dla pickupów 1988–1998 wskazuje tematy zasilania paliwem, iskry i mechaniki. Nie potwierdza kolejności, parametrów ani naprawy dla konkretnego profilu; nie przenosić ogólnej rady o regulacji zapłonu na Tahoe 1999 VIN R.
- [Diesel 6.5 — usterki i kody](https://www.gmt400.pl/baza/6-5l-diesel-nie-odpala-gasnie-falujace-obroty-pompa-wtryskowa-czujnik-optyczny-s): jakość i dopływ paliwa, obecność powietrza, wiązka, czujnik optyczny i sterownik pompy. Rozdzielić wczesne kody 17/18/35/36 od P0251/P0370/P1214/P1216; sprawdzić diagram DTC dla dokładnej kalibracji. Kod sam nie uzasadnia wymiany pompy ani sterownika.
- [Dotychczasowa diagnoza](https://www.gmt400.pl/diagnoza): P0300/P0335 i katalogowe części to tropy, nie dowód przyczyny ani kompatybilności. Nie kopiować szeroko opisanego ciśnienia Vortec do drzewa bez określenia wersji i warunków pomiaru.
- `src/app/diy/wymiana-pompy-paliwa/page.tsx`: odczytano kod repozytorium; odczyt publicznego adresu nie powiódł się. Ogólny poradnik opisuje demontaż zbiornika i kontrolę szczelności, ale nie daje procedury wariantu ani bezpośredniego, potwierdzonego produktu. Nie przenosić metody udarowej przy zbiorniku. Prace przy paliwie zlecić warsztatowi, z uprzednim obniżeniem ciśnienia według procedury wariantu.

## Kryterium wejścia do drzewa

Dla każdej realnej kombinacji oddzielnie odnotować adres i opis źródła, zakres odczytanych tabel, wynik porównania tekstu i obrazów oraz dowód typu układu. Do czasu pełnego odczytu nie włączać nowej ścieżki; nieodczytana tabela to nie dowód braku źródła. Potwierdzony wynik ma w drzewie wyjaśniać przyczynę, warunkową naprawę i kontrolę po naprawie; link pozostaje dodatkiem. Bez potwierdzonej przyczyny — następne sprawdzenie lub jawne nierozstrzygnięcie. Bez potwierdzonego dopasowania — nie ustalono części.

## Pozostałe modele, roczniki i diesle

| Zakres | Dowód i stan odczytu | Brak / dalsza weryfikacja |
| --- | --- | --- |
| Chevrolet/GMC C/K, Sierra oraz Suburban 2500 poza 1999 5.7 VIN R | Indeksy 1999 pokazują m.in. pickupy oznaczone Truck oraz Suburban 2500 z różnymi VIN silnika. Pozostałe lata niezinwentaryzowane w tej rundzie. | Mapować nazwy katalogowe i roczniki na dokładne warianty serwisowe; odczytać CCNR oraz osobne tabele paliwa i zapłonu. Wpisy 4.8 VIN V, 5.3 VIN T i 6.0 VIN U w indeksach 1999 nie są podstawą do poszerzania wyboru ani stosowania procedur GMT400. |
| Pozostałe roczniki Tahoe/Yukon/Suburban (1988–1998, 2000) | Nieodczytane w tej rundzie; brak odczytu nie oznacza braku źródła. | Dla każdego rocznika i silnika osobno: wariant serwisowy, CCNR, FSD, porównanie treści i obrazów, typ układu. |
| Diesle, w tym 6.5 VIN F i VIN S | Indeksy 1999 rozróżniają warianty. Wpis GMT400.pl o pompie i kodach miesza materiał z różnych biuletynów i roczników, nie tworząc kompletnej tabeli dla każdego napędu/modelu. | Ustalić VIN/RPO, typ pompy i układ świec żarowych z dokumentu wariantu; zebrać oddzielnie procedurę braku rozruchu, zasilania i wtrysku; nie stosować kroków benzynowych. |

## Czego nie odczytano / pozostałe braki

- Procedury, do których odsyła źródło: Theft Deterrent, Enhanced Ignition System Diagnosis, Fuel Injector Circuit Diagnosis, Fuel Pump Relay Circuit Diagnosis, Driveability Symptoms, tabele DTC — nieodczytane; w drzewie oznaczone jako „ta ścieżka jeszcze nie zawiera”.
- Dobór części: brak potwierdzonego dopasowania; pole `parts` pozostaje puste.
- Treść dla GMC porównano skrótami w tej samej kopii CHARM; brak niezależnego źródła.
- Test `tests/diagnosis-flow.test.cjs`: zaktualizowany w tym commicie do nowego zakresu i węzła `c1a`; zakres i trasy zgodne z obecnym drzewem (przypadki Tahoe/Yukon 2-door i 4-door, obie opcje c1a).
