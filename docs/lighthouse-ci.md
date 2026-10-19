# Lighthouse CI — odczyt na iPhonie

Wyniki: https://github.com/tsrc4mm9gg-netizen/gmt400-app/actions/workflows/lighthouse.yml

W Safari otwórz najnowszy przebieg i Summary. Tabela pokazuje oceny 0–100 oraz LCP, CLS i TBT; nie trzeba pobierać ZIP-a, żeby przeczytać podstawowe wyniki. Pełne pliki HTML/JSON i logi są w artefakcie lighthouse przechowywanym przez 14 dni.

## Zakres

Lokalny produkcyjny build Next.js w GitHub Actions. Trzy pomiary mobilnego Chromium dla strony głównej, czytelni i artykułu o designie. Podsumowanie oblicza medianę każdej metryki osobno. To nie jest fizyczny iPhone, Safari, certyfikat WCAG ani raport Core Web Vitals od rzeczywistych użytkowników.

Nie przekazujemy sekretów Notion, więc strona główna może zawierać pustą bazę. Pierwsze raporty są poziomem bazowym wyłącznie dla tych warunków. Nie służą do udowodnienia wydajności produkcji z pełną bazą.

## Uruchomienia i koszty

Po zmianach aplikacji i konfiguracji na main, ręcznie przez Run workflow i w środy o 06:37 UTC. GitHub może opóźnić harmonogram. Nie potrzeba konta Lighthouse, klucza PSI ani płatnego serwera. Przebiegi i artefakty zużywają limity GitHub Actions.

## Interpretacja

Progi ostrzegawcze: wydajność 85, dostępność 95, dobre praktyki 90, SEO 90. Niskie oceny nie blokują publikacji. Awaria buildu, serwera, Chrome, błąd audytu, niepoprawna odpowiedź strony albo brak 3 pomiarów na każdy adres powoduje błąd zadania. Zielony workflow oznacza kompletny raport, nie brak usterek.

Raporty zapisujemy jako pliki w GitHub Actions, bez publikacji w temporary-public-storage. Nie dodajemy zależności do aplikacji ani nie zmieniamy jej lockfile; przypięte narzędzie @lhci/cli@0.15.1 instalujemy w katalogu tymczasowym runnera. Biblioteki przechodnie tego narzędzia nie mają osobnego lockfile w repozytorium.
