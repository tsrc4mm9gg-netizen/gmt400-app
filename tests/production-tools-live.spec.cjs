const {test,expect}=require('@playwright/test');
const ORIGIN='https://www.gmt400.pl';
const amount=text=>Number(text.replace(/PLN|zł/g,'').replace(/\s/g,'').replace(',','.'));
async function screenshot(page,name){await page.screenshot({path:test.info().outputPath(name+'.png'),fullPage:true});}
for (const tool of [{path:'rpo',placeholder:'Wpisz kod lub szukaną frazę',query:'G80',button:'Sprawdź kody'},{path:'diagnostyka',placeholder:'Wpisz kod błędu lub objaw',query:'P0300',button:'Sprawdź kod'},{path:'kalkulatory',button:'Porównaj opony'}]) {
 test('live hub opens readable working '+tool.path,async({page})=>{
  await page.goto(ORIGIN+'/narzedzia');
  const card=page.locator('a[data-tool-card][href="/narzedzia/'+tool.path+'"]');
  await expect(card).toBeVisible(); await card.getByText('Otwórz narzędzie',{exact:false}).click();
  await expect(page).toHaveURL(new RegExp('/narzedzia/'+tool.path+'/?$'));
  const surface=page.locator('[data-tool-theme="dark-v1"]'); await expect(surface).toBeVisible();
  const panel=surface.locator('main > section').first();
  await expect(panel).toHaveCSS('background-color','rgb(23, 29, 37)');
  await expect(panel.locator('h1')).toHaveCSS('color','rgb(250, 250, 250)');
  for (const field of await panel.locator('input,select').all()){await expect(field).toHaveCSS('background-color','rgb(16, 19, 23)');await expect(field).toHaveCSS('color','rgb(250, 250, 250)');}
  if(tool.placeholder) await page.getByPlaceholder(tool.placeholder,{exact:true}).fill(tool.query);
  const button=page.getByRole('button',{name:tool.button,exact:true});
  await expect(button).toHaveCSS('background-color','rgb(231, 185, 94)');await expect(button).toHaveCSS('color','rgb(17, 17, 17)');await button.click();
  const result=tool.path==='kalkulatory'?page.getByRole('heading',{name:'Wynik',exact:true}).locator('..'):surface.locator('article').first();
  await expect(result).toBeVisible();await expect(result).toHaveCSS('background-color','rgb(23, 29, 37)');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await screenshot(page,tool.path);
 });
}
test('live import calculator is integrated and recalculates',async({page})=>{
 await page.goto(ORIGIN+'/?tab=import');const form=page.getByTestId('import-budget');await expect(form).toBeVisible();
 for(const [label,value] of [['Cena auta (PLN)','10000'],['Łączny transport (PLN)','1000'],['Opłaty aukcyjne i pośrednika (PLN)','200'],['Cło — ustalona kwota (PLN)','300'],['VAT — ustalona kwota (PLN)','500'],['Inne koszty (PLN)','100'],['Ustalona podstawa akcyzy (PLN)','10000']]) await form.getByLabel(label,{exact:true}).fill(value);
 await form.getByRole('combobox',{name:'Wariant akcyzy',exact:true}).selectOption('personal-over-2000');
 await expect.poll(async()=>amount(await form.getByTestId('import-total').innerText())).toBe(13960);
 await form.getByLabel('Cena auta (PLN)',{exact:true}).fill('20000');await expect.poll(async()=>amount(await form.getByTestId('import-total').innerText())).toBe(23960);
 await form.getByLabel('Cena auta (PLN)',{exact:true}).fill('');await expect(form.getByTestId('import-total')).toHaveCount(0);await screenshot(page,'import');
});
test('live repair budget changes without saving user data',async({page})=>{
 await page.goto(ORIGIN+'/?tab=kalkulator');await expect(page.getByTestId('repair-total')).toBeVisible();
 await page.locator('#repair-choice').selectOption('air');await page.locator('#repair-rate').fill('100');await expect.poll(async()=>amount(await page.getByTestId('repair-total').innerText())).toBe(130);await screenshot(page,'repair');
});
async function currencySection(page){await page.goto(ORIGIN+'/?tab=kalkulator');const section=page.getByRole('heading',{name:'Części z zagranicy — przelicznik USD/EUR → PLN',exact:true}).locator('..');await expect(section).toBeVisible();return section;}
test('live manual currency estimate stays separate from repair budget',async({page})=>{
 const section=await currencySection(page);const before=await page.getByTestId('repair-total').innerText();
 await section.getByLabel('Cena części (USD)',{exact:true}).fill('100');await section.getByLabel('Dostawa (USD)',{exact:true}).fill('10');await section.getByLabel('Kurs PLN za 1 USD — NBP lub wpisany ręcznie',{exact:true}).fill('4');await section.getByLabel('Opcjonalny narzut za przewalutowanie (%)',{exact:true}).fill('5');
 await expect(section.getByText(/Łącznie orientacyjnie:/)).toContainText('462');await expect(page.getByTestId('repair-total')).toHaveText(before);
 await section.getByLabel('Cena części (USD)',{exact:true}).fill('');await expect(section.getByText(/Łącznie orientacyjnie:/)).toHaveCount(0);await screenshot(page,'currency-manual');
});
test('live NBP quote loads and changing currency clears old quote',async({page})=>{
 const section=await currencySection(page);const responsePromise=page.waitForResponse(response=>{const url=new URL(response.url());return url.origin===ORIGIN&&url.pathname==='/api/exchange-rate'&&url.searchParams.get('currency')==='USD';});
 await section.getByRole('button',{name:'Pobierz ostatni kurs NBP',exact:true}).click();const response=await responsePromise;expect(response.status()).toBe(200);const quote=await response.json();expect(quote.currency).toBe('USD');expect(Number.isFinite(quote.rate)&&quote.rate>0).toBe(true);
 await expect(section.getByLabel('Kurs PLN za 1 USD — NBP lub wpisany ręcznie',{exact:true})).toHaveValue(String(quote.rate));await expect(section.getByText(/Data kursu:/)).toBeVisible();
 await section.getByRole('combobox').selectOption('EUR');await expect(section.getByLabel('Kurs PLN za 1 EUR — NBP lub wpisany ręcznie',{exact:true})).toHaveValue('');await expect(section.getByText(/Data kursu:/)).toHaveCount(0);await screenshot(page,'currency-nbp');
});
