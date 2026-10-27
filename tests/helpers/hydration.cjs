// Czekanie na hydratację Reacta przed pierwszą interakcją.
// Przyczyna niestabilności testów VIN/RPO w WebKit na wolnym runnerze: strona z SSR jest widoczna i klikalna,
// zanim React podepnie obsługę zdarzeń do elementu. Wpisanie tekstu i kliknięcie „DEKODUJ VIN” / „Sprawdź kody”
// w tym oknie czasowym nic nie robi, a test czeka potem 10 s na wynik, który nigdy nie powstanie.
// React zapisuje na węźle DOM klucz __reactProps$… dopiero przy hydratacji (albo utworzeniu elementu po stronie klienta),
// więc jego obecność na przycisku/polu oznacza, że obsługa zdarzeń jest już podpięta.
const { expect } = require('@playwright/test');

async function hydrated(locator, timeout = 30000) {
  await expect.poll(
    () => locator.first().evaluate(element => Object.keys(element).some(key => key.startsWith('__reactProps$'))).catch(() => false),
    { timeout, message: 'React nie zhydratował elementu — interakcja przed hydratacją nic by nie zrobiła' },
  ).toBe(true);
}

module.exports = { hydrated };
