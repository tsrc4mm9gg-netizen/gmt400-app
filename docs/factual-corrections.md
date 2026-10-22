# Rejestr poprawek merytorycznych GMT400

Ten dokument zawiera zweryfikowane poprawki faktograficzne dla treści encyklopedii GMT400.
Każda pozycja zawiera źródło i notatkę weryfikacyjną. Treści w Notion należy zaktualizować
zgodnie z poniższymi punktami; niniejszy PR nie zmienia danych Notion ani grafik AI.

## 1. Skrzynie rozdzielcze

**Poprawka:** usunąć wszystkie wzmianki o NP231. GMT400 używał:

- NP241C — dźwignia mechaniczna.
- NP243C — sterowanie przyciskami, od 1996 w Tahoe/Yukon.
- NV246 (NP246) AutoTrac — od 1998.

**Źródło:** GMT400 forum — transfer case fluid: https://www.gmt400.com/threads/transfer-case-fluid.58006/  
**Źródło:** GMT Central — Tahoe 1995–1999: https://gmtcentral.com/gmt400-chevrolet-tahoe-2-door/  
**Notatka:** Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).

## 2. Momenty — jednostki

**Poprawka:** tam, gdzie podano wartość w Nm, a oryginał jest w lb-ft, zachować oryginalną wartość
w lb-ft i podać przeliczenie w Nm w nawiasie.

**Przykład:** L31 5.7 Vortec — 330 lb-ft (447 Nm).

**Źródło:** GMT Central — Tahoe 1995–1999: https://gmtcentral.com/gmt400-chevrolet-tahoe-2-door/  
**Notatka:** Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).

## 3. Lata modeli

**Poprawki:**

- Blazer GMT400 — 1992–1994 (wcześniej R/V).
- Yukon — 1992–2000.
- Brak 1500 Crew Cab w GMT400.
- Extended Cab z trzecimi drzwiami — od 1996.

**Źródło:** GMT Central — Sierra 3500: https://gmtcentral.com/gmt400-gmc-sierra-3500/  
**Źródło:** GMT Central — Tahoe 2-door: https://gmtcentral.com/gmt400-chevrolet-tahoe-2-door/  
**Notatka:** Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).

## 4. Silniki

**Poprawki:**

- 6.2 diesel — LH6/LL4, 1988–1993.
- 7.4 — L19 TBI 1988–1995 vs L29 Vortec 1996–2000.
- 4.3 — LB4 (TBI) vs L35 (Vortec).
- 5.7 — L05 (TBI) vs L31 (Vortec).

**Źródło:** GMT400 FSM hub: https://www.buildpriceoption.com/gmt400-factory-service-manual-resources/  
**Źródło:** GMT Central — Sierra 3500: https://gmtcentral.com/gmt400-gmc-sierra-3500/  
**Notatka:** Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).

## 5. OBD-I vs OBD-II

**Poprawka:** wyraźnie rozdzielić:

- OBD-I — 1988–1995, złącze ALDL, odczyt kodów przez MIL po zwarciu A–B.
- OBD-II — 1996+, złącze 16-pin DLC, diagnostyka przez PCM.

**Źródło:** FCAR Tech — odczyt kodów GM 1982–1995: https://www.fcarusa.com/TechSupport/FAQ/how-to-read-older-gm-codes-or-older-detroit  
**Źródło:** GMT400 FSM hub: https://www.buildpriceoption.com/gmt400-factory-service-manual-resources/  
**Notatka:** Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).

## Zastosowanie

1. Zweryfikuj każdy wpis w Notion pod kątem powyższych punktów.
2. Usuń NP231 i zastąp właściwym reduktorem (NP241C/NP243C/NV246).
3. Ujednolić jednostki momentów: lb-ft jako oryginał, Nm w nawiasie.
4. Popraw lata modeli i silniki według RPO/SPID.
5. Rozdziel OBD-I i OBD-II.
6. Każdy poprawiony wpis zakończ notatką: „Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).”
