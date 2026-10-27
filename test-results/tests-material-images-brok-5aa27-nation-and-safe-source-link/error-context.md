# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/material-images.spec.cjs >> broken image shows explanation and safe source link
- Location: tests/material-images.spec.cjs:7:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('[data-material-image]').getByRole('status')
Expected substring: "Nie udało się wczytać ilustracji"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" locator('[data-material-image]').getByRole('status') with timeout 5000ms
  - waiting for locator('[data-material-image]').getByRole('status')

```

```yaml
- link "Przejdź do treści":
  - /url: "#main-content"
- banner:
  - link "GMT400":
    - /url: /
  - link "Szukaj":
    - /url: /szukaj
  - navigation "Nawigacja główna":
    - list:
      - listitem:
        - link "Strona główna":
          - /url: /
      - listitem:
        - link "Sprawdź VIN":
          - /url: /vin
      - listitem:
        - link "Modele":
          - /url: /modele
      - listitem:
        - link "Dla właściciela":
          - /url: /dla-wlasciciela
      - listitem:
        - link "Baza wiedzy":
          - /url: /baza
      - listitem:
        - link "Kody OBD":
          - /url: /kody-obd
      - listitem:
        - link "Schematy":
          - /url: /schematy
      - listitem:
        - link "Mój samochód":
          - /url: /moj-samochod
- main:
  - paragraph: Błąd 404
  - heading "Nie znaleziono strony" [level=1]
  - paragraph: Adres może być nieaktualny, błędnie wpisany albo materiał mógł zostać przeniesiony. Skorzystaj z wyszukiwania lub przejdź do jednej z głównych sekcji.
  - link "Wróć na stronę główną":
    - /url: /
  - link "Szukaj materiałów":
    - /url: /szukaj
  - navigation "Nawigacja pomocnicza":
    - list:
      - listitem:
        - link "Baza wiedzy":
          - /url: /baza
      - listitem:
        - link "Kody OBD":
          - /url: /kody-obd
  - button "Ustaw profil auta"
  - status
- contentinfo:
  - navigation "Nawigacja w stopce":
    - list:
      - listitem:
        - link "Strona główna":
          - /url: /
      - listitem:
        - link "Modele":
          - /url: /modele
      - listitem:
        - link "Baza wiedzy":
          - /url: /baza
      - listitem:
        - link "Kody OBD":
          - /url: /kody-obd
      - listitem:
        - link "Schematy":
          - /url: /schematy
      - listitem:
        - link "Szukaj":
          - /url: /szukaj
  - paragraph: Materiały w serwisie mają charakter pomocniczy i nie zastępują dokumentacji serwisowej, instrukcji producenta ani diagnozy wykwalifikowanego mechanika.
- link "Narzędzia":
  - /url: /narzedzia
- alert
```

# Test source

```ts
  1 | const {test,expect}=require('@playwright/test');
  2 | const BASE='http://127.0.0.1:3100/material-image-fixture';
  3 | test('image retains caption and position between text blocks',async({page})=>{await page.goto(BASE);const figure=page.locator('[data-material-image]');await expect(figure.locator('figcaption')).toHaveText('Podpis próbny');await expect(figure.getByRole('button',{name:'Powiększ ilustrację',exact:true})).toBeVisible();const text=await page.locator('article').innerText();expect(text.indexOf('Przed ilustracją')).toBeLessThan(text.indexOf('Podpis próbny'));expect(text.indexOf('Podpis próbny')).toBeLessThan(text.indexOf('Po ilustracji'));expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);});
  4 | test('keyboard opens preview and Escape restores opener focus',async({page})=>{await page.goto(BASE);const opener=page.getByRole('button',{name:'Powiększ ilustrację',exact:true});await opener.focus();await page.keyboard.press('Enter');const dialog=page.getByRole('dialog',{name:'Powiększona ilustracja',exact:true});await expect(dialog).toBeVisible();await page.keyboard.press('Escape');await expect(dialog).toBeHidden();await expect(opener).toBeFocused();});
  5 | test('preview zooms and closes without leaving material',async({page})=>{await page.goto(BASE);await page.getByRole('button',{name:'Powiększ ilustrację',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Powiększona ilustracja',exact:true});await expect(dialog).toBeVisible();const before=await dialog.locator('img').evaluate(element=>element.getBoundingClientRect().width);await dialog.getByRole('button',{name:'Zwiększ powiększenie',exact:true}).click();await dialog.getByRole('button',{name:'Zwiększ powiększenie',exact:true}).click();await expect(dialog.getByText('Powiększenie: 200%',{exact:true})).toBeVisible();expect(await dialog.locator('img').evaluate(element=>element.getBoundingClientRect().width)).toBeGreaterThan(before*1.5);await page.screenshot({path:test.info().outputPath('image-preview.png'),fullPage:true});await dialog.getByRole('button',{name:'Zamknij podgląd',exact:true}).click();await expect(dialog).toBeHidden();await expect(page).toHaveURL(BASE);});
  6 | test('unsafe image URL does not create an image or executable link',async({page})=>{await page.goto(BASE+'?unsafe=1');await expect(page.getByText('Ilustracja ma niedostępny adres.',{exact:true})).toBeVisible();await expect(page.locator('[data-material-image]')).toHaveCount(0);await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);});
> 7 | test('broken image shows explanation and safe source link',async({page})=>{await page.goto(BASE+'?broken=1');const figure=page.locator('[data-material-image]');await expect(figure.getByRole('status')).toContainText('Nie udało się wczytać ilustracji');const source=figure.getByRole('link',{name:'Otwórz plik źródłowy',exact:true});await expect(source).toHaveAttribute('target','_blank');await expect(source).toHaveAttribute('rel','noopener noreferrer');await expect(figure.getByRole('button',{name:'Powiększ ilustrację',exact:true})).toHaveCount(0);});
    |                                                                                                                                                                                                          ^ Error: expect(locator).toContainText(expected) failed
  8 | 
```