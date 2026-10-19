# Kontrola konfiguracji GitHub Actions

Wyniki na iPhonie: https://github.com/tsrc4mm9gg-netizen/gmt400-app/actions/workflows/workflow-lint.yml

Otwórz przebieg i Summary. Podsumowanie zawiera wynik oraz pierwsze 120 linii diagnostyki z nazwami plików i numerami linii. Pełny wynik znajduje się w logu kroku Validate all workflow files and Bash scripts. Artefakt workflow-lint jest przechowywany przez 7 dni.

## Co sprawdzamy

Wszystkie workflowy w .github/workflows: składnię GitHub Actions, wyrażenia, wybrane użycia akcji oraz skrypty Bash przez ShellCheck. Python nie jest analizowany (wyłączona integracja pyflakes). Narzędzie nie sprawdza działania strony ani istnienia nazw projektów Playwright. Nie zastępuje testów przeglądarkowych ani audytu bezpieczeństwa.

## Uruchomienia

Po zmianie workflowów lub konfiguracji actionlint na main, w pull requestach dotyczących tych plików i ręcznie przez Run workflow. Nie uruchamia npm ci, produkcyjnego buildu ani przeglądarki. Nie wymaga nowego konta, tokena ani płatnego abonamentu; zużywa czas i przestrzeń GitHub Actions.

## Zasady

Przypięta wersja actionlint 1.7.12. Przed rozpakowaniem sprawdzamy SHA-256 pobranego archiwum względem wartości zapisanej w workflow. Błąd kontroli lub instalacji kończy zadanie niepowodzeniem. Nie ukrywamy problemów przez continue-on-error ani globalne ignorowanie reguł.

Kontrola może ujawnić wcześniejsze błędy w istniejących workflowach. Naprawiamy je osobno. Nie zmieniamy ustawień ochrony gałęzi main ani zależności między workflowami; ta konfiguracja sama nie ustanawia bramki wdrożeniowej. Włączanie kontroli jako obowiązkowej wymaga osobnej decyzji.
