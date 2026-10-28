# Pliki OCR (odczyt naklejki SPID w przeglądarce)

Ładowane **wyłącznie na żądanie** (po wybraniu zdjęcia w narzędziu `/narzedzia/rpo`) przez dynamiczny import `tesseract.js`.
Zdjęcie jest przetwarzane tylko w przeglądarce użytkownika — nie jest wysyłane ani zapisywane.

| Plik | Źródło | Licencja |
| --- | --- | --- |
| `worker.min.js` | pakiet npm `tesseract.js` 7.x (`dist/worker.min.js`) | Apache-2.0 |
| `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js` | pakiet npm `tesseract.js-core` 7.0.0 (warianty tylko-LSTM) | Apache-2.0 (patrz `LICENSE-tesseract.js-core.txt`) |
| `lang/eng.traineddata` | projekt `tesseract-ocr/tessdata_best` (wersja całkowitoliczbowa, ok. 5 MB) | Apache-2.0 |

Uwaga: rdzenie WASM są osadzone w plikach `.wasm.js`. Aktualizacja: podmień pliki z nowszych wersji pakietów i uruchom `tests/rpo-scan.spec.cjs`.
