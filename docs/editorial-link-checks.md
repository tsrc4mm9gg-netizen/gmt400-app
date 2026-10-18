# Kontrola źródeł czytelni — Lychee

## Gdzie sprawdzić wynik na iPhonie

Otwórz https://github.com/tsrc4mm9gg-netizen/gmt400-app/actions/workflows/editorial-links.yml w Safari. Wybierz najnowszy przebieg i jego podsumowanie (Summary). Raport Lychee pojawia się w podsumowaniu; nie trzeba pobierać plików ZIP.

Workflow można też uruchomić przez Run workflow. Harmonogram: wtorek 06:17 UTC; GitHub może opóźnić uruchomienie. Kontrola działa również po zmianie konfiguracji lub plików src/lib/gmt400-stories*.ts na main.

## Zakres

Sprawdzamy unikalne adresy zapisane dosłownie w polach sourceUrl plików src/lib/gmt400-stories*.ts. Nie wykonujemy aplikacji ani nie pobieramy całej bazy Notion. To nie jest kontrola wewnętrznych odnośników, ilustracji, licencji ani wszystkich linków na produkcji.

Każdy raport jest przypisany do commitu. Artefakt editorial-links zawiera report.md, source-urls.txt oraz source-locations.json wskazujący plik i linię każdego adresu.

## Jak interpretować wynik

Zielony workflow oznacza wykonanie audytu, nie gwarancję poprawności wszystkich linków. Błędy zewnętrznych stron są raportowane bez blokowania publikacji. Brak danych wejściowych lub raportu kończy zadanie błędem.

- 404/410: sprawdzić, czy publikację usunięto albo przeniesiono.
- 401/403: możliwe logowanie lub blokada automatycznych zapytań; sprawdzić ręcznie.
- 429: ograniczenie liczby zapytań; ponowić później.
- Timeout i błędy serwera: sprawdzić ponownie przed zmianą źródła.

Nie uznajemy 403/429 za sukces, nie wyłączamy kontroli certyfikatów TLS, nie usuwamy automatycznie źródeł i nie tworzymy automatycznych zgłoszeń. Mała współbieżność i ponowienia ograniczają obciążenie serwisów. Kontrola nie wymaga dodatkowych sekretów, kont ani abonamentów; zużywa limity GitHub Actions i przestrzeń na artefakty (retencja 14 dni).
