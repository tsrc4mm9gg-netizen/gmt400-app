# Roadmapa: przegląd dowodów zamiast automatycznego zamykania paczek

Wynik na iPhonie: https://github.com/tsrc4mm9gg-netizen/gmt400-app/actions/workflows/roadmap-orchestrator.yml

Workflow uruchamia się po zmianie własnej konfiguracji lub ręcznie przez Run workflow. Nie reaguje już na zakończenie navigation-context. W Summary zobaczysz badany commit, SHA zapisanego raportu i informację, czy są dokładnie zgodne. Raporty przeglądu pozostają w artefaktach przez 7 dni.

## Co wyłączono

Automatyczne wykonanie scripts/roadmap-orchestrator.cjs, odznaczanie docs/ROADMAP.md, commitowanie raportów i kolejki, git push na main oraz tworzenie kolejnych issues. Usunięto uprawnienia contents: write i issues: write. Checkout nie zachowuje poświadczeń.

Nie usuwamy ani nie odznaczamy istniejących pozycji roadmapy lub zgłoszeń. Nie zmieniamy innych workflowów; część może nadal mieć własne mechanizmy zapisu, które wymagają osobnego przeglądu. Stary skrypt pozostaje w repozytorium, ale ten workflow go nie uruchamia.

## Jak interpretować raport

Źródłem jest .diagnostics/navigation-context-report.json zapisany w badanym commicie, nie nowo pobrany artefakt Actions. Brak raportu, błędny JSON i niezgodne SHA oznaczają brak wystarczających dowodów, a nie awarię strony. Zgodność SHA i pole passed=true również nie zastępują sprawdzenia autentycznego przebiegu oraz testów.

Starszy raport dotyczący przodka nie jest uznawany za raport aktualnego kodu. Ten przegląd nie uruchamia testów, nie weryfikuje aktualnego wdrożenia i nigdy automatycznie nie uznaje paczki za ukończoną. Zielony workflow oznacza wyłącznie wygenerowanie przeglądu. Decyzja o zamknięciu paczki wymaga osobnej oceny i zatwierdzenia.

Bez nowych kont i abonamentów; obowiązują limity GitHub Actions. Nie jest to pełne zabezpieczenie repozytorium ani konfiguracja ochrony main.
