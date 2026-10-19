# Testy dostępności bez automatycznej publikacji

Wyniki na iPhonie: https://github.com/tsrc4mm9gg-netizen/gmt400-app/actions/workflows/viewport-accessibility.yml

Otwórz najnowszy przebieg i Summary. Zobaczysz wynik PASS/FAIL, commit, etapy wykonania, pokrycie Chromium/WebKit i nazwy niezaliczonych testów. Artefakty z pełnym raportem, logami i zrzutami są przechowywane przez 7 dni.

## Zmiana bezpieczeństwa

Workflow ma contents: read i checkout z persist-credentials: false. Usunięto modyfikowanie viewportu w src/app/page.tsx, konfigurowanie tożsamości bota, git add, git commit, rebase i push na main. Wynik dotyczy kodu pobranego z konkretnego commitu, a nie poprawionego na czas testów kandydata. Raport pozostaje w Actions, nie jest commitowany do repozytorium.

## Zachowane wymagania

Nie zmieniono testów ani konfiguracji przeglądarek. Dla każdej przeglądarki wymagane jest 5 testów viewport i co najmniej 12 testów narzędzi, wszystkie etapy muszą się udać, a testy nie mogą być pominięte, niestabilne ani niezaliczone. continue-on-error na kroku tests służy wyłącznie zapisaniu raportu; końcowy krok nadal wymaga passed=true.

Jeżeli test wcześniej przechodził tylko dzięki tymczasowej edycji page.tsx, teraz ujawni problem w zapisanym kodzie. Poprawkę aplikacji należy przygotować i zatwierdzić osobno. Nie rozluźniamy testu, by zamaskować taki wynik.

## Zakres i ograniczenia

Kontrola lokalnego produkcyjnego buildu: metadane viewport, szerokość dokumentu, istniejące testy kontrastu i funkcji narzędzi. Chromium i Linux WebKit nie zastępują fizycznego iPhone’a, pełnego audytu WCAG ani ręcznej kontroli powiększenia. Workflow nie zmienia ochrony gałęzi ani ustawień wdrożenia Vercel.

Nie dodajemy nowej usługi ani abonamentu. Nadal obowiązują limity czasu i przestrzeni GitHub Actions. Pozostałe workflowy repozytorium nie są zmieniane tą paczką.
