# Zdjęcia modeli i karuzeli — źródła i licencje

**Pochodzenie i licencja zdjęć używanych na kartach i stronach modeli NIE są potwierdzone.**

Dotyczy to wszystkich kart, w tym SUV-ów przywróconych 27.10.2026 po wycofaniu zdjęć z Wikimedia Commons:

| Karta | Plik w `public/` |
|---|---|
| Tahoe 4-drzwi | `carousel-tahoe-gold.jpg` |
| Tahoe / Blazer 2-drzwi | `tahoe-2d-red.jpg` |
| Suburban | `carousel-suburban-navy.jpg` |
| GMC Yukon | `yukon-white.jpg` |
| C/K Regular Cab, C/K Extended Cab, K1500 4x4, GMC Sierra, C/K 3500 Dually | `ck-reg.jpg`, `ck-ext.jpg`, `k1500-black.jpg`, `sierra-burgundy.jpg`, `ck-3500-dually.jpg` |

Autor, źródło i licencja tych plików nie są udokumentowane. Zanim strona zostanie promowana szerzej, należy je zastąpić zdjęciami o potwierdzonej wolnej licencji (np. Wikimedia Commons, z atrybucją) lub własnymi.

## Historia

- Commit 195fa40 (27.10.2026) zamienił zdjęcia kart SUV na wycięte zdjęcia z Wikimedia Commons (IFCAR — domena publiczna, Cutlass — CC0) wraz ze stopkami atrybucji.
- Na prośbę właściciela strony stare zdjęcia SUV zostały przywrócone, a pliki z Commons i stopki atrybucji usunięto. Pliki z Commons nadal są dostępne w historii git (commit 195fa40).

## Grafiki i zdjęcia wpisów encyklopedii (`/baza/…`, 27.10.2026)

Rejestr: `src/lib/entry-media.ts`. Atrybucja jest widoczna w podpisie przy zdjęciu (autor, licencja, link do źródła). Licencje sprawdzone przez API Wikimedia Commons 27.10.2026. Pliki w `public/baza/` to zmniejszone kopie w formacie WebP.

| Plik w `public/baza/` | Autor | Licencja | Źródło |
|---|---|---|---|
| `silnik-6-5-rysunek-army.webp` | US Army, TM 9-2320-280-24P-1 (2001) | domena publiczna (praca rządu USA) | https://commons.wikimedia.org/wiki/File:Chevrolet_6.2-6.5L_engine.jpg |
| `k2500-turbo-diesel-1998.webp` | Angilas89 | domena publiczna (autor zrzekł się praw) | https://commons.wikimedia.org/wiki/File:1998_K2500_Turbo_Diesel_with_NV_4500.jpg |
| `k2500-diesel-suburban.webp` | Angilas89 | domena publiczna (autor zrzekł się praw) | https://commons.wikimedia.org/wiki/File:GMT400_K2500_Diesel_Suburban.jpg |
| `skrzynia-4l80-przekroj.webp` | Michael Barera (Ypsilanti Automotive Heritage Museum, maj 2015) | CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Ypsilanti_Automotive_Heritage_Museum_May_2015_064_(Hydra-Matic_4L80_transmission).jpg |

Pliki `*.svg` w `public/baza/` to własne rysunki gmt400.pl wykonane od nowa (bez grafik AI, bez kopiowania ilustracji Haynes/GM) z danych tekstowych i tabel podanych w źródłach; źródło danych jest wypisane w stopce każdego rysunku.

Brak legalnego zdjęcia (kafelek ma srebrną ikonę): 4L60E, EVAP, bezpieczniki i przekaźniki, VIN/RPO, uszczelki kolektora, punkty masy, płyny i momenty, pompa Stanadyne, tylny most, skrzynia rozdzielcza.
