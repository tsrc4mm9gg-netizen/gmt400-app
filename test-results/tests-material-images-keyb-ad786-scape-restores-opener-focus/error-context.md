# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/material-images.spec.cjs >> keyboard opens preview and Escape restores opener focus
- Location: tests/material-images.spec.cjs:4:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.focus: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Powiększ ilustrację', exact: true })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Przejdź do treści" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - generic [ref=e4]:
      - link "GMT400" [ref=e5] [cursor=pointer]:
        - /url: /
      - link "Szukaj" [ref=e7] [cursor=pointer]:
        - /url: /szukaj
      - navigation "Nawigacja główna" [ref=e11]:
        - list [ref=e12]:
          - listitem [ref=e13]:
            - link "Strona główna" [ref=e14] [cursor=pointer]:
              - /url: /
          - listitem [ref=e15]:
            - link "Sprawdź VIN" [ref=e16] [cursor=pointer]:
              - /url: /vin
          - listitem [ref=e17]:
            - link "Modele" [ref=e18] [cursor=pointer]:
              - /url: /modele
          - listitem [ref=e19]:
            - link "Dla właściciela" [ref=e20] [cursor=pointer]:
              - /url: /dla-wlasciciela
          - listitem [ref=e21]:
            - link "Baza wiedzy" [ref=e22] [cursor=pointer]:
              - /url: /baza
          - listitem [ref=e23]:
            - link "Kody OBD" [ref=e24] [cursor=pointer]:
              - /url: /kody-obd
          - listitem [ref=e25]:
            - link "Schematy" [ref=e26] [cursor=pointer]:
              - /url: /schematy
          - listitem [ref=e27]:
            - link "Mój samochód" [ref=e28] [cursor=pointer]:
              - /url: /moj-samochod
  - main [ref=e30]:
    - generic [ref=e31]:
      - paragraph [ref=e32]: Błąd 404
      - heading "Nie znaleziono strony" [level=1] [ref=e33]
      - paragraph [ref=e34]: Adres może być nieaktualny, błędnie wpisany albo materiał mógł zostać przeniesiony. Skorzystaj z wyszukiwania lub przejdź do jednej z głównych sekcji.
      - generic [ref=e35]:
        - link "Wróć na stronę główną" [ref=e36] [cursor=pointer]:
          - /url: /
        - link "Szukaj materiałów" [ref=e37] [cursor=pointer]:
          - /url: /szukaj
      - navigation "Nawigacja pomocnicza" [ref=e38]:
        - list [ref=e39]:
          - listitem [ref=e40]:
            - link "Baza wiedzy" [ref=e41] [cursor=pointer]:
              - /url: /baza
          - listitem [ref=e42]:
            - link "Kody OBD" [ref=e43] [cursor=pointer]:
              - /url: /kody-obd
    - button "Ustaw profil auta" [ref=e45] [cursor=pointer]
    - status [ref=e46]
  - contentinfo [ref=e47]:
    - generic [ref=e48]:
      - navigation "Nawigacja w stopce" [ref=e49]:
        - list [ref=e50]:
          - listitem [ref=e51]:
            - link "Strona główna" [ref=e52] [cursor=pointer]:
              - /url: /
          - listitem [ref=e53]:
            - link "Modele" [ref=e54] [cursor=pointer]:
              - /url: /modele
          - listitem [ref=e55]:
            - link "Baza wiedzy" [ref=e56] [cursor=pointer]:
              - /url: /baza
          - listitem [ref=e57]:
            - link "Kody OBD" [ref=e58] [cursor=pointer]:
              - /url: /kody-obd
          - listitem [ref=e59]:
            - link "Schematy" [ref=e60] [cursor=pointer]:
              - /url: /schematy
          - listitem [ref=e61]:
            - link "Szukaj" [ref=e62] [cursor=pointer]:
              - /url: /szukaj
      - paragraph [ref=e63]: Materiały w serwisie mają charakter pomocniczy i nie zastępują dokumentacji serwisowej, instrukcji producenta ani diagnozy wykwalifikowanego mechanika.
  - link "Narzędzia" [ref=e64] [cursor=pointer]:
    - /url: /narzedzia
  - alert [ref=e70]
```

# Test source

```ts
  1 | const {test,expect}=require('@playwright/test');
  2 | const BASE='http://127.0.0.1:3100/material-image-fixture';
  3 | test('image retains caption and position between text blocks',async({page})=>{await page.goto(BASE);const figure=page.locator('[data-material-image]');await expect(figure.locator('figcaption')).toHaveText('Podpis próbny');await expect(figure.getByRole('button',{name:'Powiększ ilustrację',exact:true})).toBeVisible();const text=await page.locator('article').innerText();expect(text.indexOf('Przed ilustracją')).toBeLessThan(text.indexOf('Podpis próbny'));expect(text.indexOf('Podpis próbny')).toBeLessThan(text.indexOf('Po ilustracji'));expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);});
> 4 | test('keyboard opens preview and Escape restores opener focus',async({page})=>{await page.goto(BASE);const opener=page.getByRole('button',{name:'Powiększ ilustrację',exact:true});await opener.focus();await page.keyboard.press('Enter');const dialog=page.getByRole('dialog',{name:'Powiększona ilustracja',exact:true});await expect(dialog).toBeVisible();await page.keyboard.press('Escape');await expect(dialog).toBeHidden();await expect(opener).toBeFocused();});
    |                                                                                                                                                                                                 ^ Error: locator.focus: Test timeout of 30000ms exceeded.
  5 | test('preview zooms and closes without leaving material',async({page})=>{await page.goto(BASE);await page.getByRole('button',{name:'Powiększ ilustrację',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Powiększona ilustracja',exact:true});await expect(dialog).toBeVisible();const before=await dialog.locator('img').evaluate(element=>element.getBoundingClientRect().width);await dialog.getByRole('button',{name:'Zwiększ powiększenie',exact:true}).click();await dialog.getByRole('button',{name:'Zwiększ powiększenie',exact:true}).click();await expect(dialog.getByText('Powiększenie: 200%',{exact:true})).toBeVisible();expect(await dialog.locator('img').evaluate(element=>element.getBoundingClientRect().width)).toBeGreaterThan(before*1.5);await page.screenshot({path:test.info().outputPath('image-preview.png'),fullPage:true});await dialog.getByRole('button',{name:'Zamknij podgląd',exact:true}).click();await expect(dialog).toBeHidden();await expect(page).toHaveURL(BASE);});
  6 | test('unsafe image URL does not create an image or executable link',async({page})=>{await page.goto(BASE+'?unsafe=1');await expect(page.getByText('Ilustracja ma niedostępny adres.',{exact:true})).toBeVisible();await expect(page.locator('[data-material-image]')).toHaveCount(0);await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);});
  7 | test('broken image shows explanation and safe source link',async({page})=>{await page.goto(BASE+'?broken=1');const figure=page.locator('[data-material-image]');await expect(figure.getByRole('status')).toContainText('Nie udało się wczytać ilustracji');const source=figure.getByRole('link',{name:'Otwórz plik źródłowy',exact:true});await expect(source).toHaveAttribute('target','_blank');await expect(source).toHaveAttribute('rel','noopener noreferrer');await expect(figure.getByRole('button',{name:'Powiększ ilustrację',exact:true})).toHaveCount(0);});
  8 | 
```