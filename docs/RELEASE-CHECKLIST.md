# GMT400: wznowienie publikacji po blokadzie Vercela

## Potwierdzony punkt wyjscia

- Komponent propozycji: 8b135bba9cf9170e347d7f90778322ecf493ced5.
- Podlaczenie propozycji pod artykulem: 54ea1dddace1061fd5c6018e405b62722598954f.
- Poprawka testow podpisu i tresci: 13ef78e18a97b796d1774d8d33be3520b2ec2cd2.
- Testy produkcyjne artykulu 4L60E: 6/6 PASS na wdrozeniu d09f5e515b1539841ec9522ede08248d48f697dc. Nie jest to certyfikacja wszystkich materialow ani fizycznego iPhone'a.
- Nie utozsamiac powodzenia buildu z opublikowaniem wersji na domenie.

## W czasie blokady

- [ ] Zalicz Release preflight without deployment dla wybranego commita.
- [ ] Zalicz dedykowane testy widoku propozycji: sukces, brak wynikow, niekompletne API, blad i ponowienie, ladowanie bez blokowania artykulu. Paczka tych testow wymaga osobnego zapisu; preflight ich nie zastepuje.
- [ ] Sprawdz wplyw profilu auta i wykluczanie wpisow poza zakresem.
- [ ] Ustal jeden dokladny SHA do publikacji. Jezeli kod zmienil sie po testach, przetestuj nowy SHA.
- [ ] Zachowaj ostatnie dzialajace wdrozenie i dane potrzebne do rollbacku.
- [ ] Nie ponawiaj produkcyjnych deploymentow w petli podczas limitu.

## Po odblokowaniu limitu

- [ ] Potwierdz zgode na jedno wdrozenie wybranego SHA, bez zmiany planu i DNS.
- [ ] Uruchom deployment i sprawdz READY albo odczytaj blad buildu.
- [ ] Odczytaj /api/status na www.gmt400.pl; porownaj deployment.commitSha z oczekiwanym SHA.
- [ ] Dopuszczaj potomka tylko zgodnie z assessDeployment w scripts/check-tools-production.cjs: roznice wylacznie w .diagnostics.
- [ ] Dopiero po zgodnosci wersji uruchom audyt narzedzi oraz produkcyjne testy artykulu.
- [ ] Sprawdz propozycje na prawdziwym artykule, linki, blad pobierania i ponowienie.
- [ ] Rozdziel wynik funkcji aplikacji od ostrzezen katalogow zewnetrznych.
- [ ] Zamknij zadanie dopiero po osobnym potwierdzeniu kodu, testow i domeny.

## Ograniczenie kosztow i szumu CI

- Raporty i artefakty testow przechowuj w GitHub Actions zamiast generowac kolejne commity raportow, jezeli nie sa potrzebne aplikacji.
- Nie wdrazaj produkcji po kazdej zmianie dokumentacji lub testow. Wdrozenia produkcyjne grupuj w zatwierdzone paczki.
- Nie zakladaj, ze [skip ci] blokuje Vercel: jest to osobna integracja wymagajaca wlasnej konfiguracji.
- Kontrola oparta na ignored build step wymaga sprawdzenia zasad naliczania limitu; nie obiecuj, ze zawsze eliminuje zuzycie limitu tworzenia deploymentow.
- Nie przenos DNS ani nie kupuj nowego hostingu bez osobnej zgody.

## Zakres preflight

Workflow release-preflight ma tylko contents: read. Nie publikuje aplikacji, nie zapisuje raportow do repozytorium, nie odczytuje sekretow Notion i nie zmienia rozliczen. Jego PASS dotyczy instalacji zaleznosci, 8 testow regul i buildu, a nie pelnej gotowosci produkcyjnej.
