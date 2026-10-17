const { test, expect } = require('@playwright/test');
const ORIGIN = 'https://www.gmt400.pl';
test('live official data forms return provider results in mobile WebKit', async ({ page }) => {
 const errors = []; page.on('pageerror', e => errors.push(e.message));
 const response = await page.goto(ORIGIN + '/narzedzia/dane-pojazdu'); expect(response.status()).toBe(200);
 await expect(page.getByRole('heading', { name: 'Oficjalne dane pojazdu', exact: true })).toBeVisible();
 await page.getByLabel('Rok modelowy', { exact: true }).selectOption('1999');
 for (const title of ['NHTSA — kampanie bezpieczeństwa', 'NHTSA — zgłoszenia właścicieli']) {
  const section = page.getByRole('heading', { name: title, exact: true }).locator('..');
  const menu = section.getByRole('combobox'); await expect(menu).toBeEnabled();
  await expect(menu.locator('option[value="SUBURBAN"]')).toHaveCount(1); await menu.selectOption('SUBURBAN');
  await expect(section.getByText(/Rekordy w odpowiedzi: [0-9]+/)).toBeVisible();
  await expect(section.getByRole('alert')).toHaveCount(0);
 }
 const fuel = page.getByRole('heading', { name: 'EPA / FuelEconomy.gov — spalanie i koszty', exact: true }).locator('..');
 const model = fuel.getByRole('combobox').nth(0); await expect(model).toBeEnabled();
 await model.selectOption('Suburban 1500 2WD');
 const variant = fuel.getByRole('combobox').nth(1); await expect(variant).toBeEnabled();
 const id = await variant.locator('option').evaluateAll(options => options.find(option => /^[0-9]+$/.test(option.value))?.value); expect(id).toBeTruthy(); await variant.selectOption(id);
 await expect(fuel.getByText(/Średnio: [0-9]+[.,][0-9]+ l\/100 km/)).toBeVisible();
 await fuel.getByLabel('Cena paliwa w Polsce, PLN/l').fill('6.5'); await fuel.getByLabel('Dystans, km').fill('100');
 await expect(fuel.getByText(/Szacowany koszt:/)).toBeVisible();
 await page.getByLabel('VIN do sprawdzenia w vPIC').fill('1GNEK13R9XJ123456');
 await page.getByRole('button', { name: 'Pobierz dane VIN z NHTSA', exact: true }).click();
 await expect(page.getByRole('heading', { name: 'Dane zwrócone przez NHTSA vPIC', exact: true })).toBeVisible();
 expect(errors).toEqual([]);
});
test('live repair converter supports manual calculation and NBP without changing repair total', async ({ page }) => {
 const errors = []; page.on('pageerror', e => errors.push(e.message));
 await page.goto(ORIGIN + '/?tab=kalkulator');
 await expect(page.getByRole('heading', { name: 'KALKULATOR KOSZTÓW NAPRAWY', exact: true })).toBeVisible();
 const before = await page.getByTestId('repair-total').innerText();
 const converter = page.getByRole('region', { name: 'Części z zagranicy — przelicznik USD/EUR → PLN', exact: true });
 await expect(converter).toBeVisible();
 await converter.getByLabel('Cena części (USD)', { exact: true }).fill('100'); await converter.getByLabel('Dostawa (USD)', { exact: true }).fill('20');
 await converter.getByLabel('Kurs PLN za 1 USD — NBP lub wpisany ręcznie', { exact: true }).fill('4,00');
 await converter.getByLabel('Opcjonalny narzut za przewalutowanie (%)', { exact: true }).fill('2');
 await expect(converter.getByText(/Łącznie orientacyjnie:.*489,60/)).toBeVisible();
 await expect(converter.getByText('Źródło kursu: wpis ręczny użytkownika, niezweryfikowany przez NBP.', { exact: true })).toBeVisible();
 await expect(page.getByTestId('repair-total')).toHaveText(before);
 await converter.getByRole('button', { name: 'Pobierz ostatni kurs NBP', exact: true }).click();
 await expect(converter.getByRole('link', { name: /^NBP, tabela / })).toBeVisible();
 await expect(converter.getByText(/Data kursu: [0-9]{4}-[0-9]{2}-[0-9]{2}/)).toBeVisible();
 await expect(converter.getByRole('alert')).toHaveCount(0);
 await converter.getByLabel('Waluta ceny i dostawy', { exact: true }).selectOption('EUR');
 await expect(converter.getByLabel('Kurs PLN za 1 EUR — NBP lub wpisany ręcznie', { exact: true })).toHaveValue('');
 await expect(converter.getByRole('link', { name: /^NBP, tabela / })).toHaveCount(0);
 await expect(page.getByTestId('repair-total')).toHaveText(before); expect(errors).toEqual([]);
});
