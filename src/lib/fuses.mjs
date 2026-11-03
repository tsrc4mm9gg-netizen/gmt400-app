// WYGENEROWANE z /workspace/gmt400/svg/fuses_data.py (gen_fuses.py) — nie edytuj ręcznie.
// Dane: instrukcje obsługi GM (Owner's Manual) 1994–1999 + (gen_fuses_8893.py) EDD GM 1988–1993. Model + lata przy każdej tabeli.
export const FUSE_COLORS = [{"amps": "5 A", "color": "jasnobrązowy (tan)"}, {"amps": "7,5 A", "color": "brązowy"}, {"amps": "10 A", "color": "czerwony"}, {"amps": "15 A", "color": "niebieski"}, {"amps": "20 A", "color": "żółty"}, {"amps": "25 A", "color": "bezbarwny"}, {"amps": "30 A", "color": "zielony"}];
export const FUSE_COLORS_SOURCE = 'Legenda kolorów: OM 1994 s. 6-95 i OM 1995 s. 6-86 (Fuse Legend).';
export const FUSE_YEARS = ['1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999'];
export const FUSE_TABLES = [
 {
  "id": "ip-1994",
  "box": "Kabina — skrzynka w desce (strona kierowcy)",
  "models": "Chevrolet C/K Pickup 1994",
  "years": [
   "1994"
  ],
  "ampsNote": "Amperaż wg rysunku i tabeli OM94.",
  "note": "W tabeli OM94 opisy obwodów są w druku przesunięte między wierszami CTSY, PARK LP, P. LPS i STOP/HAZ — podział podany tak, jak wynika z druku. Sprawdź na pokrywie skrzynki. Linia oświetlenia pod maską ma osobny bezpiecznik w przewodzie (OM94).",
  "posNote": "R = rząd, K = kolumna gniazda, liczone od lewego górnego rogu rysunku OM94 (OM94 nie numeruje gniazd).",
  "sources": [
   {
    "title": "OM 1994 Chevrolet C/K Pickup, s. 6-95–6-96 (skan GM, kopia dezosmanuals.com)",
    "url": "https://dezosmanuals.com/wp-content/uploads/2021/07/1994-Chevrolet-1500.pdf"
   }
  ],
  "rows": [
   {
    "pos": "R1·K1",
    "name": "GAGES",
    "amps": "20 A",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "Tempomat, podświetlenie wyświetlacza 4WD, timer ogrzewania tylnej szyby, zasilanie przekaźnika dodatkowego akumulatora, timer brzęczyka pasów, zasilanie zestawu wskaźników z zapłonu"
     }
    ]
   },
   {
    "pos": "R1·K4",
    "name": "HTR A/C",
    "amps": "25 A",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "H.V.A.C. 4WD, Aux. Batt. Relay — tak w druku OM (ogrzewanie/klimatyzacja)"
     }
    ]
   },
   {
    "pos": "R1·K7",
    "name": "WIPER",
    "amps": "25 A",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "Wycieraczki przedniej szyby, spryskiwacz"
     }
    ]
   },
   {
    "pos": "R2·K1",
    "name": "TURN/BU",
    "amps": "15 A",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "Światła cofania, kierunkowskazy"
     }
    ]
   },
   {
    "pos": "R2·K2",
    "name": "4WD",
    "amps": "25 A",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "Napęd 4×4 (Four Wheel Drive)"
     }
    ]
   },
   {
    "pos": "R2·K3",
    "name": "CTSY",
    "amps": "20 A",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "Lampka sufitowa, lampa skrzyni, oświetlenie wnętrza i schowka, radio (pamięć/zegar) — wg druku OM (patrz uwaga)"
     }
    ]
   },
   {
    "pos": "R2·K7",
    "name": "RADIO",
    "amps": "10 A",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "Zasilanie radia"
     }
    ]
   },
   {
    "pos": "R3·K1",
    "name": "PCM/IGN",
    "amps": "10 A",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "TCC, zawór powietrza (air diverter), ESC, EGR, zapłon ECM, włącznik hamulca RWAL (w tabeli: „EMC/Ign”)"
     }
    ]
   },
   {
    "pos": "R3·K2",
    "name": "BRAKE",
    "amps": "15 A",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "RWAL, prędkościomierz w zestawie wskaźników"
     }
    ]
   },
   {
    "pos": "R3·K3",
    "name": "PARK LP",
    "amps": "20 A",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "Przekaźnik i zasilanie klaksonu, zapalniczka, światła postojowe, podświetlenie włącznika C49, ostrzeżenie „światła włączone” — wg druku OM (patrz uwaga)"
     }
    ]
   },
   {
    "pos": "R3·K7",
    "name": "ACC/IGN",
    "amps": "30 A (wyłącznik)",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "Wyłącznik termiczny (circuit breaker): szyby elektryczne"
     }
    ]
   },
   {
    "pos": "R4·K1",
    "name": "INJ A",
    "amps": "10 A",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "Wtryskiwacze TBI (w tabeli: „Ign. A”)"
     }
    ]
   },
   {
    "pos": "R4·K4",
    "name": "PANEL LPS",
    "amps": "5 A",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "Podświetlenie radia i HVAC — wg druku OM (patrz uwaga)"
     }
    ]
   },
   {
    "pos": "R4·K5",
    "name": "DRL",
    "amps": "15 A",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "Światła do jazdy dziennej (DRL)"
     }
    ]
   },
   {
    "pos": "R4·K7",
    "name": "ACC/BATT",
    "amps": "30 A (wyłącznik)",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "Wyłącznik termiczny (circuit breaker): zamki drzwi, ogrzewanie tylnej szyby"
     }
    ]
   },
   {
    "pos": "R5·K1",
    "name": "TRANS",
    "amps": "— (OM94 nie podaje)",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "Skrzynia biegów — gniazdo opisane na rysunku, brak w tabeli OM94"
     }
    ]
   },
   {
    "pos": "R5·K5",
    "name": "STOP/HAZ",
    "amps": "15 A",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "Przerywacz świateł awaryjnych, brzęczyk pasów, światła stop, pamięć RWAL — wg druku OM (patrz uwaga)"
     }
    ]
   },
   {
    "pos": "R5·K7",
    "name": "CRANK",
    "amps": "5 A",
    "variants": [
     {
      "years": [
       "1994"
      ],
      "text": "Rozruch (Crank), „Discreet” — tak w druku OM"
     }
    ]
   }
  ]
 },
 {
  "id": "ip-1995-1999",
  "box": "Kabina — skrzynka w desce (strona kierowcy)",
  "models": "Chevrolet C/K Pickup 1995–1998; Chevrolet Suburban 1999",
  "years": [
   "1995",
   "1996",
   "1997",
   "1998",
   "1999"
  ],
  "ampsNote": "OM 1995–1999 nie podają amperażu poszczególnych gniazd — odczytaj nadruk na bezpieczniku lub pokrywie (kolory wg legendy OM95).",
  "note": "A i B to wyłączniki termiczne (circuit breakers), nie bezpieczniki. Nazwy gniazd wg rysunku OM95; od 1996 OM podaje tylko numery.",
  "posNote": "Numery 1–24 oraz A, B wg rysunku OM (A i B po lewej stronie skrzynki).",
  "sources": [
   {
    "title": "OM 1995 Chevrolet C/K Pickup, s. 6-86–6-87 (assets.gm.com)",
    "url": "https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf"
   },
   {
    "title": "OM 1996 Chevrolet C/K Pickup, s. 6-69–6-72 (assets.gm.com)",
    "url": "https://assets.gm.com/manuals/chevrolet/1996_chevrolet_1500_owners.pdf"
   },
   {
    "title": "OM 1997 Chevrolet C/K Pickup, s. 6-71–6-74 (assets.gm.com)",
    "url": "https://assets.gm.com/manuals/chevrolet/1997_chevrolet_1500_owners.pdf"
   },
   {
    "title": "OM 1998 Chevrolet C/K Pickup, s. 6-72–6-75 (assets.gm.com)",
    "url": "https://assets.gm.com/manuals/chevrolet/1998_chevrolet_1500_owners.pdf"
   },
   {
    "title": "OM 1999 Chevrolet Suburban, s. 6-60–6-64 (chevrolet.com)",
    "url": "https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf"
   }
  ],
  "rows": [
   {
    "pos": "1",
    "name": "STOP/HAZ",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995",
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Włącznik świateł stop/TCC, brzęczyk, trzecie światło stop (CHMSL), światła awaryjne, światła stop"
     }
    ]
   },
   {
    "pos": "2",
    "name": "T CASE",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995",
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Skrzynia rozdzielcza"
     }
    ]
   },
   {
    "pos": "3",
    "name": "CTSY",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995",
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Oświetlenie wnętrza (courtesy), lampa skrzyni ładunkowej, lampka schowka, lampki sufitowe i do czytania, lusterka w osłonach, lusterka elektryczne"
     }
    ]
   },
   {
    "pos": "4",
    "name": "GAGES",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995"
      ],
      "text": "Zestaw wskaźników, przekaźnik DRL, włącznik świateł, zdalny zamek (keyless), moduł niskiego poziomu płynu chłodniczego"
     },
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Zestaw wskaźników, przekaźnik DRL, włącznik świateł, zdalny zamek (keyless), moduł niskiego poziomu płynu chłodniczego, moduł podświetlenia wejścia, DRAC (diesel)"
     }
    ]
   },
   {
    "pos": "5",
    "name": "RR HVAC",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995"
      ],
      "text": "Sterowanie tylnego ogrzewania/klimatyzacji (RR HVAC)"
     },
     {
      "years": [
       "1996",
       "1997",
       "1998"
      ],
      "text": "Nieużywany (Not Used)"
     },
     {
      "years": [
       "1999"
      ],
      "text": "Tylne sterowanie komfortu (Rear Comfort Controls)"
     }
    ]
   },
   {
    "pos": "6",
    "name": "CRUISE",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995",
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Tempomat"
     }
    ]
   },
   {
    "pos": "7",
    "name": "AUX PWR",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995",
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Gniazdo zasilania dodatkowego"
     }
    ]
   },
   {
    "pos": "8",
    "name": "CRANK",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995"
      ],
      "text": "Pompa paliwa diesla, DERM, ECM"
     },
     {
      "years": [
       "1996",
       "1997"
      ],
      "text": "Poduszka powietrzna (Air Bag System) — tak w druku OM"
     },
     {
      "years": [
       "1998",
       "1999"
      ],
      "text": "Rozruch (Crank)"
     }
    ]
   },
   {
    "pos": "9",
    "name": "PARK LPS",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995"
      ],
      "text": "Lampa tablicy, światła postojowe i tylne, obrysówki dachowe, lampy klapy, boczne światła przednie, przekaźnik przeciwmgielnych, podświetlenie włączników w drzwiach, lampy błotników"
     },
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Lampa tablicy, światła postojowe i tylne, obrysówki dachowe, lampy klapy, boczne światła przednie, przekaźnik przeciwmgielnych, podświetlenie włączników w drzwiach, lampy błotników, podświetlenie włącznika świateł"
     }
    ]
   },
   {
    "pos": "10",
    "name": "AIR BAG",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995"
      ],
      "text": "Poduszka powietrzna (DERM)"
     },
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Poduszka powietrzna (Air Bag System)"
     }
    ]
   },
   {
    "pos": "11",
    "name": "WIPER",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995",
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Silnik wycieraczek, pompa spryskiwacza"
     }
    ]
   },
   {
    "pos": "12",
    "name": "HTR-A/C",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995",
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Klimatyzacja, dmuchawa A/C, przekaźnik wysokiego biegu dmuchawy"
     }
    ]
   },
   {
    "pos": "13",
    "name": "CIG LTR",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995"
      ],
      "text": "Wzmacniacz audio, tylna podnoszona szyba, zapalniczka, przekaźnik zamków, elektryczne podparcie lędźwiowe"
     },
     {
      "years": [
       "1996",
       "1997",
       "1998"
      ],
      "text": "Wzmacniacz audio, zapalniczka, przekaźnik zamków, elektryczne podparcie lędźwiowe"
     },
     {
      "years": [
       "1999"
      ],
      "text": "Wzmacniacz audio, tylna podnoszona szyba, zapalniczka, przekaźnik zamków, elektryczne podparcie lędźwiowe"
     }
    ]
   },
   {
    "pos": "14",
    "name": "ILLUM",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995"
      ],
      "text": "Wskaźnik 4WD, zestaw wskaźników, sterowanie HVAC i tylnego HVAC, włączniki deski, podświetlenie radia"
     },
     {
      "years": [
       "1996",
       "1997",
       "1998"
      ],
      "text": "Wskaźnik 4WD, zestaw wskaźników, sterowanie komfortu, włączniki deski, podświetlenie radia, moduł gongu"
     },
     {
      "years": [
       "1999"
      ],
      "text": "Wskaźnik 4WD, zestaw wskaźników, sterowanie komfortu przód i tył (jeśli są), włączniki deski, podświetlenie radia, moduł gongu"
     }
    ]
   },
   {
    "pos": "15",
    "name": "DRL-FOG",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995",
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Przekaźnik świateł dziennych (DRL), przekaźnik świateł przeciwmgielnych"
     }
    ]
   },
   {
    "pos": "16",
    "name": "TURN-B/U",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995"
      ],
      "text": "Kierunkowskazy przód i tył, światła cofania"
     },
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Kierunkowskazy przód i tył, światła cofania, elektromagnes BTSI (blokada dźwigni skrzyni)"
     }
    ]
   },
   {
    "pos": "17",
    "name": "RADIO",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995",
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Radio (zasilanie z zapłonu)"
     }
    ]
   },
   {
    "pos": "18",
    "name": "BRAKE",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995"
      ],
      "text": "DRAC, 4WAL PCM, ABS, tempomat"
     },
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "4WAL/VCM, ABS, tempomat"
     }
    ]
   },
   {
    "pos": "19",
    "name": "RADIO BATT",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995",
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Radio (zasilanie z akumulatora)"
     }
    ]
   },
   {
    "pos": "20",
    "name": "TRANS",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995",
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "PRNDL, automatyczna skrzynia, prędkościomierz, kontrolka Check Gages"
     }
    ]
   },
   {
    "pos": "21",
    "name": "—",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995",
       "1996"
      ],
      "text": "Nieużywany (Not Used)"
     },
     {
      "years": [
       "1997"
      ],
      "text": "Wspomaganie o zmiennej sile (Variable Effort Steering)"
     },
     {
      "years": [
       "1998",
       "1999"
      ],
      "text": "Zabezpieczenie/układ kierowniczy (Security/Steering)"
     }
    ]
   },
   {
    "pos": "22",
    "name": "—",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995",
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Nieużywany (Not Used)"
     }
    ]
   },
   {
    "pos": "23",
    "name": "RR WIPER",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995"
      ],
      "text": "Tylna wycieraczka, pompa tylnego spryskiwacza"
     },
     {
      "years": [
       "1996",
       "1997",
       "1998"
      ],
      "text": "Nieużywany (Not Used)"
     },
     {
      "years": [
       "1999"
      ],
      "text": "Tylna wycieraczka, pompa tylnego spryskiwacza"
     }
    ]
   },
   {
    "pos": "24",
    "name": "4WD",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995"
      ],
      "text": "Przedni most, kontrolka 4WD"
     },
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Przedni most, kontrolka 4WD, przekaźnik TP2 (silnik benzynowy)"
     }
    ]
   },
   {
    "pos": "A",
    "name": "PWR ACCY",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995",
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Wyłącznik termiczny (circuit breaker): centralny zamek, fotel elektryczny 6-kierunkowy, moduł keyless"
     }
    ]
   },
   {
    "pos": "B",
    "name": "PWR WDOS",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1995",
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Wyłącznik termiczny (circuit breaker): szyby elektryczne"
     }
    ]
   }
  ]
 },
 {
  "id": "uh-1996-1999",
  "box": "Pod maską — Underhood Fuse/Relay Center (tył komory, przy zbiorniczku płynu hamulcowego)",
  "models": "Chevrolet C/K Pickup 1996–1998; Chevrolet Suburban 1999",
  "years": [
   "1996",
   "1997",
   "1998",
   "1999"
  ],
  "ampsNote": "OM nie podają amperażu — odczytaj nadruk na bezpieczniku lub pokrywie.",
  "note": "Na rysunku OM99 (Suburban 1999) w skrzynce są też przekaźniki: rozrusznika, świateł stop, A/C, A.I.R. (silniki z oznaczeniem), pompy paliwa, klaksonu; gniazda AUX A i AUX B; diody DIODE-I i DIODE-II; 3 zapasowe (SPARE) i szczypce (FUSE PULLER). OM94 i OM95 nie opisują skrzynki pod maską (OM95 wspomina tylko bezpiecznik w przewodzie zasilania przyczepy przy bloku przyłączeniowym).",
  "posNote": "Gniazda pod maską są opisane nazwą (bez numerów).",
  "sources": [
   {
    "title": "OM 1996 Chevrolet C/K Pickup, s. 6-69–6-72 (assets.gm.com)",
    "url": "https://assets.gm.com/manuals/chevrolet/1996_chevrolet_1500_owners.pdf"
   },
   {
    "title": "OM 1997 Chevrolet C/K Pickup, s. 6-71–6-74 (assets.gm.com)",
    "url": "https://assets.gm.com/manuals/chevrolet/1997_chevrolet_1500_owners.pdf"
   },
   {
    "title": "OM 1998 Chevrolet C/K Pickup, s. 6-72–6-75 (assets.gm.com)",
    "url": "https://assets.gm.com/manuals/chevrolet/1998_chevrolet_1500_owners.pdf"
   },
   {
    "title": "OM 1999 Chevrolet Suburban, s. 6-60–6-64 (chevrolet.com)",
    "url": "https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf"
   }
  ],
  "rows": [
   {
    "pos": "ECM-B",
    "name": "ECM-B",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Pompa paliwa, PCM/VCM"
     }
    ]
   },
   {
    "pos": "RR DEFOG",
    "name": "RR DEFOG",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Ogrzewanie tylnej szyby (jeśli jest)"
     }
    ]
   },
   {
    "pos": "IGN-E",
    "name": "IGN-E",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998"
      ],
      "text": "Cewka przekaźnika dodatkowego wentylatora, przekaźnik sprężarki A/C, moduł Hot Fuel, dwa zbiorniki paliwa (Dual Tanks)"
     },
     {
      "years": [
       "1999"
      ],
      "text": "Cewka przekaźnika dodatkowego wentylatora, przekaźnik sprężarki A/C, moduł Hot Fuel"
     }
    ]
   },
   {
    "pos": "FUEL SOL",
    "name": "FUEL SOL",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Elektrozawór paliwa (diesel)"
     }
    ]
   },
   {
    "pos": "GLOW PLUG",
    "name": "GLOW PLUG",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Świece żarowe (diesel)"
     }
    ]
   },
   {
    "pos": "HORN",
    "name": "HORN",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Klakson, lampy pod maską"
     }
    ]
   },
   {
    "pos": "AUX FAN",
    "name": "AUX FAN",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Dodatkowy wentylator"
     }
    ]
   },
   {
    "pos": "ECM-1",
    "name": "ECM-1",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Wtryskiwacze, PCM/VCM"
     }
    ]
   },
   {
    "pos": "A/C",
    "name": "A/C",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Klimatyzacja"
     }
    ]
   },
   {
    "pos": "ENG-1",
    "name": "ENG-1",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Stacyjka, EGR, odpowietrzenie kanistra (canister purge), elektrozawór EVRV Idle Coast, podgrzewane sondy O2, podgrzewacz paliwa (diesel), czujnik wody (diesel)"
     }
    ]
   },
   {
    "pos": "LIGHTING",
    "name": "LIGHTING",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Włącznik świateł i ściemniacz deski, bezpieczniki przeciwmgielnych i oświetlenia wnętrza"
     }
    ]
   },
   {
    "pos": "BATT",
    "name": "BATT",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Akumulator, szyna zasilająca skrzynki w kabinie"
     }
    ]
   },
   {
    "pos": "IGN-A",
    "name": "IGN-A",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Stacyjka"
     }
    ]
   },
   {
    "pos": "IGN-B",
    "name": "IGN-B",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Stacyjka"
     }
    ]
   },
   {
    "pos": "ABS",
    "name": "ABS",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Moduł ABS"
     }
    ]
   },
   {
    "pos": "BLOWER",
    "name": "BLOWER",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998"
      ],
      "text": "Przekaźnik wysokiego biegu dmuchawy"
     },
     {
      "years": [
       "1999"
      ],
      "text": "Przekaźniki wysokiego biegu dmuchawy i tylnej dmuchawy"
     }
    ]
   },
   {
    "pos": "STOP/HAZ",
    "name": "STOP/HAZ",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1996",
       "1997",
       "1998",
       "1999"
      ],
      "text": "Światła stop"
     }
    ]
   },
   {
    "pos": "HTD ST-FR",
    "name": "HTD ST-FR",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1998"
      ],
      "text": "Nieużywany (Not Used)"
     },
     {
      "years": [
       "1999"
      ],
      "text": "Podgrzewane przednie fotele"
     }
    ]
   },
   {
    "pos": "HTD MIR",
    "name": "HTD MIR",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1998"
      ],
      "text": "Nieużywany (Not Used)"
     },
     {
      "years": [
       "1999"
      ],
      "text": "Podgrzewane lusterka zewnętrzne (jeśli są)"
     }
    ]
   },
   {
    "pos": "HTD ST-RR",
    "name": "HTD ST-RR",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1998",
       "1999"
      ],
      "text": "Nieużywany (Not Used)"
     }
    ]
   },
   {
    "pos": "HEATED SEATS",
    "name": "HEATED SEATS",
    "amps": "—",
    "variants": [
     {
      "years": [
       "1998"
      ],
      "text": "Nieużywany (Not Used)"
     },
     {
      "years": [
       "1999"
      ],
      "text": "Podgrzewane fotele (jeśli są)"
     }
    ]
   }
  ]
 },
// --- 1988–1993 (gen_fuses_8893.py) ---
 {
  "id": "ip-1988",
  "box": "Kabina — skrzynka w desce (strona kierowcy)",
  "models": "Chevrolet/GMC C/K 1988 (EDD C/K Truck Models)",
  "years": [
   "1988"
  ],
  "ampsNote": "Amperaż i kolor wg tabeli Fuse Data EDD 1988.",
  "note": "W 1988 nie ma osobnych gniazd 4WD, DRL ani TRANS — napęd 4×4 jest w obwodzie A/C-HTR, a zestaw wskaźników i ABS tylnych kół na SPEEDO (RWAL). Bezpiecznik INJ A&B tylko w silnikach benzynowych. Sprawdź na pokrywie skrzynki.",
  "posNote": "R = rząd, K = kolumna gniazda od lewego górnego rogu rysunku (jak w tabeli 1994; EDD nie numeruje gniazd). Opis „15 (RWAL)” stoi na rysunku nad gniazdem SPEEDO.",
  "sources": [
   {
    "title": "GM ST-375-88EDM — EDD 1988 C/K Truck Models (suplement), Fuse Block Details: Fuse Data, s. 11-0 (PDF 30)"
   }
  ],
  "rows": [
   {
    "pos": "R1·K1",
    "name": "GAGES",
    "amps": "20 A",
    "variants": [
     {
      "years": [
       "1988"
      ],
      "text": "Moduł alarmu dźwiękowego, przekaźnik wentylatora chłodnicy (VIN N), tempomat, sterowanie silnika diesla, zespół filtra paliwa (diesel), moduł „hot fuel” (benzyna), deska — włącznik ogrzewania tylnej szyby"
     }
    ]
   },
   {
    "pos": "R1·K4",
    "name": "A/C-HTR",
    "amps": "25 A",
    "variants": [
     {
      "years": [
       "1988"
      ],
      "text": "Ogrzewanie / klimatyzacja, przekaźnik dodatkowego akumulatora, napęd 4×4"
     }
    ]
   },
   {
    "pos": "R1·K7",
    "name": "WIPER",
    "amps": "25 A",
    "variants": [
     {
      "years": [
       "1988"
      ],
      "text": "Silnik wycieraczek, przełącznik wycieraczek/spryskiwacza"
     }
    ]
   },
   {
    "pos": "R2·K1",
    "name": "TURN B/U",
    "amps": "15 A",
    "variants": [
     {
      "years": [
       "1988"
      ],
      "text": "Światła cofania, przerywacz kierunkowskazów"
     }
    ]
   },
   {
    "pos": "R2·K3",
    "name": "CTSY",
    "amps": "20 A",
    "variants": [
     {
      "years": [
       "1988"
      ],
      "text": "Lampa skrzyni, oświetlenie przy drzwiach (courtesy), lampka sufitowa"
     }
    ]
   },
   {
    "pos": "R2·K7",
    "name": "RADIO",
    "amps": "10 A",
    "variants": [
     {
      "years": [
       "1988"
      ],
      "text": "Radio"
     }
    ]
   },
   {
    "pos": "R3·K1",
    "name": "ECM/IGN",
    "amps": "10 A",
    "variants": [
     {
      "years": [
       "1988"
      ],
      "text": "Sterowanie silnika diesla, sterowanie wtrysku TBI"
     }
    ]
   },
   {
    "pos": "R3·K2",
    "name": "SPEEDO (RWAL)",
    "amps": "15 A",
    "variants": [
     {
      "years": [
       "1988"
      ],
      "text": "Zestaw wskaźników, moduł ABS tylnych kół (RWAL)"
     }
    ]
   },
   {
    "pos": "R3·K3",
    "name": "PARK LP",
    "amps": "20 A",
    "variants": [
     {
      "years": [
       "1988"
      ],
      "text": "Oświetlenie wnętrza, światła postojowe, lampy obrysowe na dachu"
     }
    ]
   },
   {
    "pos": "R3·K7",
    "name": "PWR WDO",
    "amps": "30 A (wyłącznik)",
    "variants": [
     {
      "years": [
       "1988"
      ],
      "text": "Elektryczne szyby — automatyczny wyłącznik termiczny (circuit breaker)"
     }
    ]
   },
   {
    "pos": "R4·K1",
    "name": "INJ A&B",
    "amps": "10 A",
    "variants": [
     {
      "years": [
       "1988"
      ],
      "text": "Wtryskiwacze paliwa (tylko benzyna)"
     }
    ]
   },
   {
    "pos": "R4·K4",
    "name": "PANEL LPS",
    "amps": "5 A",
    "variants": [
     {
      "years": [
       "1988"
      ],
      "text": "Ściemniane podświetlenie deski rozdzielczej"
     }
    ]
   },
   {
    "pos": "R4·K7",
    "name": "PWR ACC",
    "amps": "30 A (wyłącznik)",
    "variants": [
     {
      "years": [
       "1988"
      ],
      "text": "Elektryczne zamki drzwi, włącznik ogrzewania tylnej szyby — wyłącznik termiczny"
     }
    ]
   },
   {
    "pos": "R5·K5",
    "name": "STOP/HAZ",
    "amps": "15 A",
    "variants": [
     {
      "years": [
       "1988"
      ],
      "text": "Moduł alarmu dźwiękowego, włącznik świateł stop, światła awaryjne, moduł ABS tylnych kół"
     }
    ]
   },
   {
    "pos": "R5·K7",
    "name": "CRANK",
    "amps": "5 A",
    "variants": [
     {
      "years": [
       "1988"
      ],
      "text": "Rozruch: moduł ECM (benzyna), przekaźnik pompy paliwa (diesel), sterownik świec żarowych"
     }
    ]
   }
  ]
 },
 {
  "id": "ip-1989-1993",
  "box": "Kabina — skrzynka w desce (strona kierowcy, nad osłoną progu)",
  "models": "Chevrolet/GMC C/K 1989–1993 (EDD C/K; 1992–1993 „C/K Models”)",
  "years": [
   "1989",
   "1990",
   "1991",
   "1992",
   "1993"
  ],
  "ampsNote": "Amperaż wg rysunków i tabel EDD; kolory: 5 A jasnobrązowy, 10 A czerwony, 15 A jasnoniebieski, 20 A żółty, 25 A biały (EDD 1989–1993).",
  "note": "EDD 1989 ma tylko rysunek skrzynki (nazwa i amperaż) — opisy 1989 podajemy wg obwodów opisanych na tym rysunku. STOP/HAZ: rysunki 1989–1993 i tabela 1993 podają 15 A, a tabele 1990–1992 „5 A, tan” — sprawdź na pokrywie skrzynki i wkładaj to, co przewiduje opis. Gorący (nieprzełączający) wyłącznik termiczny trzeba sprawdzić przed wyjęciem — EDD ostrzega przed oparzeniem. RR HVAC, RR WIPER i T/GREL występują tylko z tym wyposażeniem.",
  "posNote": "R = rząd, K = kolumna gniazda od lewego górnego rogu rysunku (jak w tabeli 1994; EDD nie numeruje gniazd).",
  "sources": [
   {
    "title": "GM ST-375-89 — EDD 1989 C/K Pick-Up, Fuse Block, s. 16 (PDF 20) — tylko rysunek"
   },
   {
    "title": "GM EDD 1990 C/K Truck Models, Fuse Block — Fuse and Circuit Breaker Identification, s. 13 (PDF 17)"
   },
   {
    "title": "GM ST-375-91 — EDD 1991 C/K Truck Models, Fuse Block, s. 15 (PDF 18)"
   },
   {
    "title": "GM ST-375-92 — EDD 1992 C/K Models, Fuse Block Details s. 20 (PDF 23) i Fuse and Circuit Breaker Data s. 22 (PDF 25)"
   },
   {
    "title": "GM ST-375-93 — EDD 1993 C/K Models, Fuse Information s. 19 (PDF 22) i Power Distribution s. 25 (PDF 28)"
   }
  ],
  "rows": [
   {
    "pos": "R1·K1",
    "name": "GAGES",
    "amps": "20 A",
    "variants": [
     {
      "years": [
       "1989"
      ],
      "text": "Zasilanie z zapłonu (obwód 39 — rozgałęzienie zapłonu)"
     },
     {
      "years": [
       "1990"
      ],
      "text": "Tempomat, timer ogrzewania tylnej szyby, zasilanie przekaźnika dodatkowego akumulatora, ostrzeżenie pasów, zasilanie zestawu wskaźników z zapłonu, przekaźnik DRL (Kanada)"
     },
     {
      "years": [
       "1991",
       "1992",
       "1993"
      ],
      "text": "Jak 1990; zasilanie w ACC lub RUN"
     }
    ]
   },
   {
    "pos": "R1·K2",
    "name": "RR HVAC",
    "amps": "5 A",
    "variants": [
     {
      "years": [
       "1992",
       "1993"
      ],
      "text": "Tylna klimatyzacja / tylne ogrzewanie (jeśli są); zasilanie w RUN"
     }
    ]
   },
   {
    "pos": "R1·K4",
    "name": "A/C HTR",
    "amps": "25 A",
    "variants": [
     {
      "years": [
       "1989"
      ],
      "text": "Ogrzewanie / klimatyzacja (obwód 50)"
     },
     {
      "years": [
       "1990"
      ],
      "text": "Ogrzewanie lub klimatyzacja, przekaźnik dodatkowego akumulatora, kontrolka napędu 4×4"
     },
     {
      "years": [
       "1991",
       "1992",
       "1993"
      ],
      "text": "Jak 1990; zasilanie w RUN"
     }
    ]
   },
   {
    "pos": "R1·K5",
    "name": "RR WIPER",
    "amps": "25 A",
    "variants": [
     {
      "years": [
       "1993"
      ],
      "text": "Silnik tylnej wycieraczki (jeśli jest); zasilanie w START lub RUN"
     }
    ]
   },
   {
    "pos": "R1·K7",
    "name": "WIPER / FRT WIPER",
    "amps": "25 A",
    "variants": [
     {
      "years": [
       "1989"
      ],
      "text": "Wycieraczki i spryskiwacz (obwód 93)"
     },
     {
      "years": [
       "1990"
      ],
      "text": "Wycieraczki przedniej szyby, spryskiwacz"
     },
     {
      "years": [
       "1991",
       "1992"
      ],
      "text": "Wycieraczki przedniej szyby, spryskiwacz; zasilanie w ACC lub RUN"
     },
     {
      "years": [
       "1993"
      ],
      "text": "FRT WIPER: wycieraczki przedniej szyby, spryskiwacz; zasilanie w ACC lub RUN"
     }
    ]
   },
   {
    "pos": "R2·K1",
    "name": "TURN/BU",
    "amps": "15 A",
    "variants": [
     {
      "years": [
       "1989"
      ],
      "text": "Przerywacz kierunkowskazów (obwód 38), włącznik świateł cofania (obwód 75)"
     },
     {
      "years": [
       "1990"
      ],
      "text": "Światła cofania, kierunkowskazy, tylne lampy podwozia (cab chassis), wiązka przyczepy/kampera"
     },
     {
      "years": [
       "1991",
       "1992",
       "1993"
      ],
      "text": "Jak 1990; zasilanie w START lub RUN"
     }
    ]
   },
   {
    "pos": "R2·K2",
    "name": "4WD",
    "amps": "25 A",
    "variants": [
     {
      "years": [
       "1989"
      ],
      "text": "Napęd 4×4 (obwód 350)"
     },
     {
      "years": [
       "1990"
      ],
      "text": "Napęd 4×4"
     },
     {
      "years": [
       "1991",
       "1992",
       "1993"
      ],
      "text": "Napęd 4×4; zasilanie w RUN"
     }
    ]
   },
   {
    "pos": "R2·K3",
    "name": "CTSY",
    "amps": "20 A",
    "variants": [
     {
      "years": [
       "1989"
      ],
      "text": "Oświetlenie wnętrza (obwód 40)"
     },
     {
      "years": [
       "1990"
      ],
      "text": "Lampka sufitowa, lampa skrzyni, oświetlenie przy drzwiach i schowka, pamięć radia i zegar, światła mijania"
     },
     {
      "years": [
       "1991",
       "1992",
       "1993"
      ],
      "text": "Lampka sufitowa, lampa skrzyni, oświetlenie przy drzwiach i schowka deski, pamięć radia i zegar, światła mijania; zasilanie stałe"
     }
    ]
   },
   {
    "pos": "R2·K7",
    "name": "RADIO",
    "amps": "10 A",
    "variants": [
     {
      "years": [
       "1989"
      ],
      "text": "Radio (obwód 43)"
     },
     {
      "years": [
       "1990"
      ],
      "text": "Zasilanie radia"
     },
     {
      "years": [
       "1991",
       "1992",
       "1993"
      ],
      "text": "Zasilanie radia; w ACC lub RUN"
     }
    ]
   },
   {
    "pos": "R3·K1",
    "name": "ECM/IGN",
    "amps": "10 A",
    "variants": [
     {
      "years": [
       "1989"
      ],
      "text": "ECM z zapłonu (obwód 439)"
     },
     {
      "years": [
       "1990"
      ],
      "text": "Sprzęgło blokujące przemiennika (TCC), zawór powietrza wtórnego, elektroniczne sterowanie zapłonem (ESC), EGR, ECM z zapłonu, włącznik ABS tylnych kół"
     },
     {
      "years": [
       "1991",
       "1992"
      ],
      "text": "Jak 1990; zasilanie w START lub RUN"
     },
     {
      "years": [
       "1993"
      ],
      "text": "Zawór powietrza wtórnego, sterowanie zapłonem, EGR, ECM z zapłonu, włącznik ABS tylnych kół; zasilanie w START lub RUN"
     }
    ]
   },
   {
    "pos": "R3·K2",
    "name": "BRAKE",
    "amps": "15 A",
    "variants": [
     {
      "years": [
       "1989"
      ],
      "text": "ABS tylnych kół (obwód 250)"
     },
     {
      "years": [
       "1990"
      ],
      "text": "Zestaw wskaźników — prędkościomierz, ABS tylnych kół"
     },
     {
      "years": [
       "1991",
       "1992",
       "1993"
      ],
      "text": "Jak 1990; zasilanie w RUN"
     }
    ]
   },
   {
    "pos": "R3·K3",
    "name": "PARK LP",
    "amps": "20 A",
    "variants": [
     {
      "years": [
       "1989"
      ],
      "text": "Włącznik świateł — tylne lampy zewnętrzne (obwód 240)"
     },
     {
      "years": [
       "1990"
      ],
      "text": "Przekaźnik i zasilanie klaksonu, oświetlenie tablicy, lampy obrysowe, lampka popielniczki, światła postojowe, lampy klapy (podwójne tylne koła), lampy na dachu, tylne lampy podwozia, lampy przyczepy/kampera, zapalniczka"
     },
     {
      "years": [
       "1991",
       "1992",
       "1993"
      ],
      "text": "Jak 1990; zasilanie stałe"
     }
    ]
   },
   {
    "pos": "R3·K5",
    "name": "T/GREL",
    "amps": "25 A",
    "variants": [
     {
      "years": [
       "1993"
      ],
      "text": "Zwalnianie tylnej klapy (jeśli jest); zasilanie stałe"
     }
    ]
   },
   {
    "pos": "R3·K7",
    "name": "ACC/IGN",
    "amps": "30 A (wyłącznik)",
    "variants": [
     {
      "years": [
       "1989"
      ],
      "text": "Elektryczne szyby (obwód 76) — wyłącznik termiczny"
     },
     {
      "years": [
       "1990"
      ],
      "text": "Elektryczne szyby — wyłącznik termiczny"
     },
     {
      "years": [
       "1991",
       "1992",
       "1993"
      ],
      "text": "Elektryczne szyby — wyłącznik termiczny; zasilanie w ACC lub RUN"
     }
    ]
   },
   {
    "pos": "R4·K1",
    "name": "INJ A / INJ A&B",
    "amps": "10 A",
    "variants": [
     {
      "years": [
       "1989",
       "1990"
      ],
      "text": "INJ A: wtryskiwacze TBI (tylko benzyna)"
     },
     {
      "years": [
       "1991"
      ],
      "text": "INJ A: wtryskiwacze TBI (tylko benzyna); zasilanie w START lub RUN"
     },
     {
      "years": [
       "1992",
       "1993"
      ],
      "text": "INJ A&B: wtryskiwacze TBI (tylko benzyna); zasilanie w START lub RUN"
     }
    ]
   },
   {
    "pos": "R4·K4",
    "name": "PANEL LPS",
    "amps": "5 A",
    "variants": [
     {
      "years": [
       "1989"
      ],
      "text": "Podświetlenie deski — potencjometr włącznika świateł (obwód 44)"
     },
     {
      "years": [
       "1990"
      ],
      "text": "Podświetlenie zestawu wskaźników, włącznika ogrzewania szyby, radia, panelu nawiewu, 4×4 i włącznika halogenów; ostrzeżenie „światła włączone”"
     },
     {
      "years": [
       "1991",
       "1992",
       "1993"
      ],
      "text": "Jak 1990; zasilanie przy włączonych światłach"
     }
    ]
   },
   {
    "pos": "R4·K5",
    "name": "DRL",
    "amps": "15 A",
    "variants": [
     {
      "years": [
       "1990"
      ],
      "text": "Światła do jazdy dziennej (Kanada)"
     },
     {
      "years": [
       "1991",
       "1992",
       "1993"
      ],
      "text": "Światła do jazdy dziennej (tylko Kanada); zasilanie stałe"
     }
    ]
   },
   {
    "pos": "R4·K7",
    "name": "ACC/BATT",
    "amps": "30 A (wyłącznik)",
    "variants": [
     {
      "years": [
       "1989"
      ],
      "text": "Zasilanie akcesoriów (obwód 60) — wyłącznik termiczny"
     },
     {
      "years": [
       "1990"
      ],
      "text": "Zamki drzwi, ogrzewanie tylnej szyby, halogeny i kontrolka ich włącznika — wyłącznik termiczny"
     },
     {
      "years": [
       "1991",
       "1992",
       "1993"
      ],
      "text": "Jak 1990; zasilanie stałe"
     }
    ]
   },
   {
    "pos": "R5·K1",
    "name": "TRANS",
    "amps": "10 A",
    "variants": [
     {
      "years": [
       "1991",
       "1992",
       "1993"
      ],
      "text": "Skrzynia biegów; zasilanie w START lub RUN"
     }
    ]
   },
   {
    "pos": "R5·K5",
    "name": "STOP/HAZ",
    "amps": "15 A",
    "variants": [
     {
      "years": [
       "1989"
      ],
      "text": "Przerywacz świateł awaryjnych (obwód 140)"
     },
     {
      "years": [
       "1990"
      ],
      "text": "Przerywacz awaryjnych, brzęczyk pasów, światła stop, pamięć ABS tylnych kół (tabela: 5 A, rysunek: 15 A)"
     },
     {
      "years": [
       "1991",
       "1992"
      ],
      "text": "Jak 1990; zasilanie stałe (tabela: 5 A, rysunek: 15 A)"
     },
     {
      "years": [
       "1993"
      ],
      "text": "Przerywacz awaryjnych, brzęczyk pasów, światła stop, pamięć ABS tylnych kół; zasilanie stałe"
     }
    ]
   },
   {
    "pos": "R5·K7",
    "name": "CRANK",
    "amps": "5 A",
    "variants": [
     {
      "years": [
       "1989"
      ],
      "text": "Rozruch (obwód 806)"
     },
     {
      "years": [
       "1990"
      ],
      "text": "Rozruch"
     },
     {
      "years": [
       "1991",
       "1992",
       "1993"
      ],
      "text": "Rozruch; zasilanie w START"
     }
    ]
   }
  ]
 }
];


// --- żarówki (gen_fuses_8893.py) ---
/** Żarówki 1990–1993 wg EDD GM (Lamp Bulb Data). Źródła tylko jako etykiety. */
export const BULB_TABLES = [{
 "id": "bulbs-1990-1993",
 "models": "Chevrolet/GMC C/K 1990–1993 (EDD C/K)",
 "years": [
  "1990",
  "1991",
  "1992",
  "1993"
 ],
 "note": "Reflektory: moc w W przy 12,8 V; pozostałe: świecość w świecach (candle power), jak w EDD. Lampki „bez wskaźników” / „ze wskaźnikami” zależą od zestawu zegarów; „Wait” i filtr paliwa — tylko diesel; tylne lampy błotników — tylko podwójne tylne koła. EDD 1988 i 1989 nie mają tabeli żarówek.",
 "sources": [
  {
   "title": "GM EDD 1990 C/K, Lamp Bulb Data s. 142 (PDF 146)"
  },
  {
   "title": "GM ST-375-91 EDD 1991 C/K, Bulb Data s. 16 (PDF 19)"
  },
  {
   "title": "GM ST-375-92 EDD 1992 C/K, Lamp Bulb Data s. 23 (PDF 26)"
  },
  {
   "title": "GM ST-375-93 EDD 1993 C/K, Lamp Bulb Data s. 20 (PDF 23)"
  }
 ],
 "rows": [
  {
   "name": "Reflektory — system 2 lamp",
   "qty": "2",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "6052; opcja H6054",
     "rating": "55/65 W; H6054 35/65 W"
    }
   ]
  },
  {
   "name": "Reflektory — system 4 lamp",
   "qty": "2 + 2",
   "variants": [
    {
     "years": [
      "1990"
     ],
     "trade": "H4701 + H4703",
     "rating": "65 W + 55 W"
    },
    {
     "years": [
      "1991",
      "1992",
      "1993"
     ],
     "trade": "9005 + 9006",
     "rating": "65 W + 55 W"
    }
   ]
  },
  {
   "name": "Tylne światło i stop",
   "qty": "2",
   "variants": [
    {
     "years": [
      "1990"
     ],
     "trade": "2057",
     "rating": "32-2 cp"
    },
    {
     "years": [
      "1991",
      "1992",
      "1993"
     ],
     "trade": "3057",
     "rating": "32-2 cp"
    }
   ]
  },
  {
   "name": "Światło cofania",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990"
     ],
     "trade": "1156",
     "rating": "32 cp"
    },
    {
     "years": [
      "1991",
      "1992",
      "1993"
     ],
     "trade": "3156",
     "rating": "32 cp"
    }
   ]
  },
  {
   "name": "Lampka sufitowa",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "211-2",
     "rating": "12 cp"
    }
   ]
  },
  {
   "name": "Lampka sufitowa z lampkami do czytania",
   "qty": "3",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "211-2",
     "rating": "12 cp"
    }
   ]
  },
  {
   "name": "Oświetlenie przy drzwiach (courtesy)",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "1003",
     "rating": "15 cp"
    }
   ]
  },
  {
   "name": "Lampa skrzyni (cargo)",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "570",
     "rating": "32 cp"
    }
   ]
  },
  {
   "name": "Przednie światło postojowe / kierunkowskaz",
   "qty": "4",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "2357NA",
     "rating": "28 cp"
    }
   ]
  },
  {
   "name": "Przednia lampa obrysowa boczna",
   "qty": "2",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Tylna lampa błotnika (podwójne tylne koła)",
   "qty": "4",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Lampy obrysowe na dachu",
   "qty": "5",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Oświetlenie tablicy rejestracyjnej",
   "qty": "2",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Lampka popielniczki",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Podświetlenie zestawu wskaźników",
   "qty": "5",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Kontrolka świateł drogowych",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "161",
     "rating": "1 cp"
    }
   ]
  },
  {
   "name": "Kontrolki kierunkowskazów",
   "qty": "2",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Kontrolka hamulców",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Kontrolka ciśnienia oleju (zegary bez wskaźników)",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Kontrolka temperatury (zegary bez wskaźników)",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Kontrolka ładowania",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Kontrolka „Check Gages” (zegary ze wskaźnikami)",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Kontrolka „Service Engine Soon”",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Kontrolka zmiany biegu (upshift)",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "161",
     "rating": "1 cp"
    }
   ]
  },
  {
   "name": "Kontrolka niskiego poziomu płynu chłodzącego",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Kontrolka pasów bezpieczeństwa",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Kontrolka „Wait” (diesel)",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Kontrolka filtra paliwa (diesel)",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Kontrolka napędu 4×4",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990"
     ],
     "trade": "194",
     "rating": "2 cp"
    },
    {
     "years": [
      "1991",
      "1992",
      "1993"
     ],
     "trade": "161",
     "rating": "2 cp"
    }
   ]
  },
  {
   "name": "Podświetlenie dźwigni reduktora 4×4",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "1 cp"
    }
   ]
  },
  {
   "name": "Podświetlenie panelu ogrzewania / klimatyzacji",
   "qty": "2",
   "variants": [
    {
     "years": [
      "1990"
     ],
     "trade": "37",
     "rating": "0,5 cp"
    },
    {
     "years": [
      "1991",
      "1992",
      "1993"
     ],
     "trade": "194",
     "rating": "0,5 cp"
    }
   ]
  },
  {
   "name": "Podświetlenie skali radia",
   "qty": "1",
   "variants": [
    {
     "years": [
      "1990",
      "1991",
      "1992",
      "1993"
     ],
     "trade": "1893",
     "rating": "2 cp"
    }
   ]
  }
 ]
}];
// --- koniec żarówek ---

/** Normalizacja do wyszukiwania: małe litery, bez polskich znaków i znaków diakrytycznych. */
export function normalizeFuseText(value) {
  return String(value ?? '').toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Filtruje tabele bezpieczników po roczniku ('' = wszystkie) i tekście (każde słowo musi wystąpić
 * w pozycji, nazwie, amperażu lub opisie). Przy wybranym roczniku zostawia tylko opis z tego rocznika.
 */
export function filterFuseTables(tables, { year = '', query = '' } = {}) {
  const words = normalizeFuseText(query).split(' ').filter(Boolean);
  return tables
    .filter(table => !year || table.years.includes(year))
    .map(table => {
      const rows = table.rows
        .map(row => ({ ...row, variants: year ? row.variants.filter(v => v.years.includes(year)) : row.variants }))
        .filter(row => row.variants.length > 0)
        .filter(row => {
          if (!words.length) return true;
          const hay = normalizeFuseText([row.pos, row.name, row.amps, ...row.variants.map(v => v.text)].join(' '));
          return words.every(w => hay.includes(w));
        });
      return { ...table, rows };
    })
    .filter(table => table.rows.length > 0);
}

/** Etykieta lat wariantu, np. ['1996','1997'] → '1996–1997'. */
export function yearsLabel(years) {
  return years.length === 1 ? years[0] : `${years[0]}–${years[years.length - 1]}`;
}
