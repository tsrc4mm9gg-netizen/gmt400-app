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
| `silnik-4-3-v6-s10-blazer.webp` | Musashi hai | CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:4.3_V-6.JPG |

Pliki `*.svg` w `public/baza/` to własne rysunki gmt400.pl wykonane od nowa (bez grafik AI, bez kopiowania ilustracji Haynes/GM) z danych tekstowych i tabel podanych w źródłach; źródło danych jest wypisane w stopce każdego rysunku.

Brak legalnego zdjęcia (kafelek ma srebrną ikonę): 4L60E, EVAP, bezpieczniki i przekaźniki, VIN/RPO, uszczelki kolektora, punkty masy, płyny i momenty, pompa Stanadyne, tylny most, skrzynia rozdzielcza.

Własne rysunki dodane 27.10.2026 (dane z podanych źródeł, bez kopiowania ilustracji): `regulacja-zaworow-v6-v8.svg`, `glowice-kolejnosc-dokrecania.svg`, `uklad-chlodzenia-obieg.svg` (Haynes rozdz. 2A, 3), `uklad-chlodzenia-6-5-td.svg`, `turbosprezarka-6-5-td-schemat.svg` (GM Service Training 6.5L TD 1991), `4l60e-tabela-zaladzen.svg`, `4l80e-tabela-zaladzen.svg` (GM Technician's Guide), `tylny-most-wycieki-schemat.svg`, `hamulce-odpowietrzanie-kolejnosc.svg`, `reflektory-ustawienie-sciana.svg` (Haynes rozdz. 8, 9, 12).

Dodatkowo bez legalnego zdjęcia (srebrna ikona): oleje i wycieki, pokrywy zaworów, kolektory wydechowe, rozrząd, remont silnika, chłodnica/wentylator, klimatyzacja, 6.5 TD (turbo, wtryski, chłodzenie), skrzynie i most, hamulce, nadwozie i elektryka (reflektory, przełączniki, zestaw wskaźników, SIR). Zdjęcie 4.3 V6 pochodzi z S-10 Blazer — poglądowe.


## Zdjęcia poglądowe tematów — miniatury kafelków DIY / usterek (`/baza/foto/`, 31.10.2026)

Rejestr i reguły dopasowania: `src/lib/topic-photos.ts`. Zastępują wcześniejsze grafiki AI (`/diy-*.jpg`, `/issue-*.jpg`) na kafelkach i na stronach wpisów — te pliki nie są już używane przez kafelki ani strony `/baza/[id]`. Atrybucja jest widoczna na kafelku („Fot. autor · licencja”) i w podpisie zdjęcia na stronie wpisu (autor, licencja z linkiem, link do strony pliku na Commons). Licencje sprawdzone przez API Wikimedia Commons 31.10.2026. Pliki to zmniejszone kopie WebP (maks. 960 px, bez innych zmian). Temat bez pasującego zdjęcia ma srebrną ikonę kategorii. Pole Notion „Obraz” przyjmuje już tylko pliki z `/baza/`.

Dodatkowo jako zdjęcia tematów używane są wcześniejsze pliki `skrzynia-4l80-przekroj.webp` (automaty) i `silnik-6-5-rysunek-army.webp` (6.5 TD) z tabeli powyżej.

| Plik w `public/baza/` | Autor | Licencja | Źródło |
|---|---|---|---|
| `foto/nadwozie-tahoe-1997.webp` | Cutlass | CC0 | https://commons.wikimedia.org/wiki/File:1997_Chevrolet_Tahoe_2-door_in_Dark_Cherry_Metallic,_front_right,_2-19-2022.jpg |
| `foto/silnik-v8-c1500-1990.webp` | Michael Barera | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:2017_Bois_d%27Arc_Spring_Car_Show_50_(1990_Chevrolet_1500_engine).jpg |
| `foto/plyn-chlodniczy-chlodnica.webp` | EvelynGiggles | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Antifreeze_in_the_radiator.jpg |
| `foto/opona-wskazniki-zuzycia.webp` | Brianc333a | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:BLC_2636.jpg |
| `foto/hak-przyczepa.webp` | Tony Webster | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Camping_Trailer_on_Ball_Hitch_-_Towing_with_Safety_Chains_(52953247534).jpg |
| `foto/wnetrze-c1500.webp` | TKOIII | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Chevrolet_C1500_Sport_Interior.jpg |
| `foto/filtr-oleju.webp` | Dvortygirl | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Engine_oil_filter.JPG |
| `foto/zawieszenie-przod-ifs-suburban-1998.webp` | simonov | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:New_front_axles_assembly-_driver%27s_side.jpg |
| `foto/hamulce-przod-suburban-1998.webp` | simonov | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:New_front_brakes_-_49020391443.jpg |
| `foto/swiece-zaplonowe.webp` | Myke2020 | Public domain | https://commons.wikimedia.org/wiki/File:Spark_plugs_old_and_replacement_7058.JPG |
