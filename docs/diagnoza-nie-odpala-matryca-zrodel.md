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

## Czego nie odczytano / pozostałe braki

- Procedury, do których odsyła źródło: Theft Deterrent, Enhanced Ignition System Diagnosis, Fuel Injector Circuit Diagnosis, Fuel Pump Relay Circuit Diagnosis, Driveability Symptoms, tabele DTC — nieodczytane; w drzewie oznaczone jako „ta ścieżka jeszcze nie zawiera”.
- Dobór części: brak potwierdzonego dopasowania; pole `parts` pozostaje puste.
- Pozostałe roczniki (1988–1998, 2000), silniki 4.3, 5.0, 7.4 i diesle — nieodczytane; indeksy to nie tabele.
- Treść dla GMC porównano skrótami w tej samej kopii CHARM; brak niezależnego źródła.
- Test `tests/diagnosis-flow.test.cjs`: nie został zaktualizowany w tym commicie (odnosi się do starych identyfikatorów kroków i zakresu Suburban 1500); wymaga osobnej aktualizacji.
