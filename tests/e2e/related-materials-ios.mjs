import { mkdir } from 'node:fs/promises';
import { chromium, devices } from 'playwright';

const baseUrl = process.env.E2E_BASE_URL || 'https://www.gmt400.pl';
const targetUrl = `${baseUrl}/baza/rozrusznik-klika-i-nie-kreci-kreci-wolno-albo-nie-wylacza-sie-diagnostyka-spadko`;
const profileKey = 'gmt400_vehicle_profile_v2';
const profile = {
  version: 2,
  profile: {
    brand: 'Chevrolet',
    platform: 'Suburban',
    model: 'Suburban 1500',
    year: '1996',
    engine: '',
    drive: '4WD',
    transmission: '',
    rpoCodes: []
  }
};

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices['iPhone 13'] });
const page = await context.newPage();
const notionRequests = [];

page.on('request', request => {
  if (new URL(request.url()).pathname === '/api/notion') notionRequests.push(request.url());
});

await mkdir('artifacts', { recursive: true });

// 1. Brak profilu: SSR powinien pokazać bazowe linki bez pobrania /api/notion.
await page.route('**/api/notion*', route => route.abort());
await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);

const related = page.locator('section[aria-labelledby="related-materials-title"]');
await related.waitFor({ state: 'visible', timeout: 15000 });

const relatedLinks = related.locator('a[href^="/baza/"]');
const linkCount = await relatedLinks.count();
if (linkCount < 1) throw new Error(`Brak bazowych linków SSR. Znaleziono: ${linkCount}`);

if (notionRequests.length !== 0) {
  throw new Error(`Przy braku profilu pobrano /api/notion: ${notionRequests.join(', ')}`);
}

await page.screenshot({ path: 'artifacts/iphone-no-profile.png', fullPage: true });
console.log(`OK bez profilu: ${linkCount} bazowych linków SSR, żądań /api/notion: 0.`);

// 2. Profil auta: po zapisaniu localStorage aplikacja powinna pobrać /api/notion.
await page.evaluate(([key, value]) => window.localStorage.setItem(key, value), [profileKey, JSON.stringify(profile)]);
await page.unroute('**/api/notion*');

const notionResponse = page.waitForResponse(
  response => new URL(response.url()).pathname === '/api/notion',
  { timeout: 30000 }
);

await page.reload({ waitUntil: 'domcontentloaded' });
const response = await notionResponse;

if (!response.ok()) throw new Error(`/api/notion zwróciło ${response.status()}`);
if (notionRequests.length < 1) throw new Error('Po ustawieniu profilu nie wykonano żądania /api/notion.');

await related.waitFor({ state: 'visible', timeout: 15000 });
const profileLinkCount = await relatedLinks.count();
if (profileLinkCount < 1) throw new Error('Po ustawieniu profilu nie ma linków powiązanych materiałów.');

const errorText = await page.getByText('Nie udało się pobrać propozycji').count();
if (errorText > 0) throw new Error('Po ustawieniu profilu pojawił się komunikat błędu.');

await page.screenshot({ path: 'artifacts/iphone-with-profile.png', fullPage: true });
console.log(`OK z profilem: ${profileLinkCount} linków, żądań /api/notion: ${notionRequests.length}, HTTP ${response.status()}.`);

await browser.close();
