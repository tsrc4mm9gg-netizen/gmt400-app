// OCR naklejki SPID — wyłącznie w przeglądarce. Biblioteka (tesseract.js), worker, rdzeń WASM i dane języka
// są własne (/public/ocr) i ładowane dopiero po wybraniu zdjęcia; zdjęcie nie opuszcza urządzenia.
export type OcrProgress = (percent: number, label: string) => void;

const MAX_SIDE = 2400;
const PASSES = [1400, 2000];

function loadImage(file: Blob): Promise<{ img: HTMLImageElement; revoke: () => void }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, revoke: () => URL.revokeObjectURL(url) });
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image')); };
    img.src = url;
  });
}

/** Tło (oświetlenie) szacowane na małej kopii: filtr maksimum (usuwa pismo) + rozmycie; zwraca funkcję próbkującą z interpolacją. */
function estimateBackground(gray: Uint8ClampedArray, w: number, h: number): Float32Array {
  const long = Math.max(w, h);
  const sw = Math.max(8, Math.round((w * 240) / long)), sh = Math.max(8, Math.round((h * 240) / long));
  const small = new Float32Array(sw * sh);
  // uśrednianie blokowe do małej siatki
  for (let y = 0; y < sh; y++) {
    const y0 = Math.floor((y * h) / sh), y1 = Math.max(y0 + 1, Math.floor(((y + 1) * h) / sh));
    for (let x = 0; x < sw; x++) {
      const x0 = Math.floor((x * w) / sw), x1 = Math.max(x0 + 1, Math.floor(((x + 1) * w) / sw));
      let sum = 0, n = 0;
      for (let yy = y0; yy < y1; yy += 2) for (let xx = x0; xx < x1; xx += 2) { sum += gray[yy * w + xx]; n++; }
      small[y * sw + x] = sum / Math.max(1, n);
    }
  }
  const radius = 2; // okno maksimum 5×5 komórek ≈ 1/48 dłuższego boku
  const maxed = new Float32Array(sw * sh);
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
    let m = 0;
    for (let yy = Math.max(0, y - radius); yy <= Math.min(sh - 1, y + radius); yy++) for (let xx = Math.max(0, x - radius); xx <= Math.min(sw - 1, x + radius); xx++) m = Math.max(m, small[yy * sw + xx]);
    maxed[y * sw + x] = m;
  }
  const blurR = Math.max(4, Math.round(Math.max(sw, sh) / 12));
  const box = (src: Float32Array, horizontal: boolean) => {
    const out = new Float32Array(sw * sh);
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
      let sum = 0, n = 0;
      for (let k = -blurR; k <= blurR; k++) {
        const xx = horizontal ? x + k : x, yy = horizontal ? y : y + k;
        if (xx < 0 || yy < 0 || xx >= sw || yy >= sh) continue;
        sum += src[yy * sw + xx]; n++;
      }
      out[y * sw + x] = sum / n;
    }
    return out;
  };
  const bgSmall = box(box(maxed, true), false);
  const bg = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const fy = Math.min(sh - 1, Math.max(0, (y * sh) / h - 0.5)), y0 = Math.floor(fy), y1 = Math.min(sh - 1, y0 + 1), ty = fy - y0;
    for (let x = 0; x < w; x++) {
      const fx = Math.min(sw - 1, Math.max(0, (x * sw) / w - 0.5)), x0 = Math.floor(fx), x1 = Math.min(sw - 1, x0 + 1), tx = fx - x0;
      const top = bgSmall[y0 * sw + x0] * (1 - tx) + bgSmall[y0 * sw + x1] * tx;
      const bottom = bgSmall[y1 * sw + x0] * (1 - tx) + bgSmall[y1 * sw + x1] * tx;
      bg[y * w + x] = top * (1 - ty) + bottom * ty;
    }
  }
  return bg;
}

function renderPass(img: HTMLImageElement, targetLong: number): HTMLCanvasElement {
  const w0 = img.naturalWidth, h0 = img.naturalHeight;
  const scale = Math.min(MAX_SIDE, targetLong) / Math.max(w0, h0);
  const w = Math.round(w0 * scale), h = Math.round(h0 * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('canvas');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;
  const total = w * h;
  const gray = new Uint8ClampedArray(total);
  let dark = 0;
  for (let i = 0, p = 0; i < px.length; i += 4, p++) {
    const g = (px[i] * 299 + px[i + 1] * 587 + px[i + 2] * 114) / 1000;
    gray[p] = g; if (g < 128) dark++;
  }
  // Jasny tekst na ciemnym tle (rzadkie): odwracamy, bo Tesseract oczekuje ciemnego pisma na jasnym tle.
  if (dark > total * 0.6) for (let p = 0; p < total; p++) gray[p] = 255 - gray[p];
  // Wyrównanie nierównego oświetlenia (cień, odblask): dzielimy przez tło.
  const bg = estimateBackground(gray, w, h);
  const hist = new Uint32Array(256);
  const flat = new Uint8ClampedArray(total);
  for (let p = 0; p < total; p++) { const v = Math.min(255, (gray[p] * 255) / Math.max(40, bg[p])); flat[p] = v; hist[flat[p]]++; }
  // Rozciągnięcie kontrastu (percentyle 2–98%).
  let acc = 0, lo = 0, hi = 255;
  for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= total * 0.02) { lo = v; break; } }
  acc = 0;
  for (let v = 255; v >= 0; v--) { acc += hist[v]; if (acc >= total * 0.02) { hi = v; break; } }
  const range = Math.max(40, hi - lo);
  for (let p = 0, i = 0; p < total; p++, i += 4) { const out = ((flat[p] - lo) * 255) / range; px[i] = px[i + 1] = px[i + 2] = out; px[i + 3] = 255; }
  ctx.putImageData(data, 0, 0);
  return canvas;
}

/**
 * Dwa przebiegi przygotowania zdjęcia (skalowanie do odcieni szarości z wyrównaniem oświetlenia i kontrastem):
 * ~1400 px i ~2000 px dłuższego boku. Suma odczytów z obu daje lepszy wynik niż pojedynczy przebieg.
 */
export async function preprocessImage(file: Blob): Promise<HTMLCanvasElement[]> {
  const { img, revoke } = await loadImage(file);
  try {
    if (!img.naturalWidth || !img.naturalHeight) throw new Error('image');
    return PASSES.map(target => renderPass(img, target));
  } finally { revoke(); }
}

const WHITELIST = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -/';

/** Odczyt tekstu z obrazu. Zwraca surowy tekst; terminuje worker po zakończeniu. */
export async function recognizeSticker(canvases: HTMLCanvasElement[], onProgress: OcrProgress): Promise<string> {
  onProgress(2, 'Ładuję moduł odczytu…');
  let pass = 0;
  const { createWorker, OEM, PSM } = await import('tesseract.js');
  const worker = await createWorker('eng', OEM.LSTM_ONLY, {
    workerPath: '/ocr/worker.min.js',
    corePath: '/ocr',
    langPath: '/ocr/lang',
    gzip: false,
    logger: m => {
      if (m.status === 'recognizing text') onProgress(20 + Math.round(((pass + m.progress) / canvases.length) * 78), 'Odczytuję tekst…');
      else if (/loading|initializ/.test(m.status)) onProgress(Math.min(19, 5 + Math.round(m.progress * 14)), 'Przygotowuję odczyt…');
    },
  });
  try {
    await worker.setParameters({ tessedit_char_whitelist: WHITELIST, preserve_interword_spaces: '1', tessedit_pageseg_mode: PSM.SPARSE_TEXT });
    const texts: string[] = [];
    for (; pass < canvases.length; pass++) texts.push((await worker.recognize(canvases[pass])).data.text);
    return texts.join('\n');
  } finally {
    await worker.terminate().catch(() => undefined);
  }
}
