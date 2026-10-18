const {test,expect}=require('@playwright/test');
const BASE='http://127.0.0.1:3100',HOME=BASE+'/?tab=kody',KEY='gmt400_search_session_v1',ID='00000000-0000-0000-0000-000000000001',TITLE='P0300 — test sesji';
const fixture={id:ID,Nazwa:TITLE,Typ:'Kod błędu',Model:'Wszystkie',Opis:'Kontrolowany materiał testowy.',applicability:Object.fromEntries(['brand','model','years','engine','drive','transmission'].map(k=>[k,['Wszystkie']]))};
test.use({serviceWorkers:'block'});
async function home(page){await expect(page.getByRole('heading',{name:TITLE,exact:true})).toBeVisible();}
async function show(page){await page.locator('header button').first().click();const d=page.getByRole('dialog',{name:'Szukaj w bazie wiedzy'});await expect(d).toBeVisible();await expect(d.getByLabel('Szukaj w bazie',{exact:true})).toBeEnabled();return d;}
async function close(d){await d.getByRole('button',{name:'Zamknij wyszukiwarkę',exact:true}).click();await expect(d).toBeHidden();}
test.beforeEach(async({page,context})=>{
  await page.addInitScript(()=>localStorage.setItem('gmt400_tab','kody'));
  await context.route(url=>url.origin===BASE&&url.pathname==='/api/notion',route=>route.fulfill({json:{results:[fixture],count:1,complete:true}}));
});
test.afterEach(async({page},info)=>{
  if(info.status===info.expectedStatus)return;
  await info.attach('session-failure-location',{body:JSON.stringify({url:page.url(),project:info.project.name,scope:'Controlled-data session test, not live production.'}),contentType:'application/json'});
  await page.screenshot({path:info.outputPath('session-failure.png'),fullPage:true}).catch(()=>{});
  await info.attach('session-failure-html',{body:await page.content().catch(()=>''),contentType:'text/html'});
});
test('restores query after closing and after document reload',async({page})=>{
  await page.goto(HOME);await home(page);let d=await show(page);
  await d.getByLabel('Szukaj w bazie',{exact:true}).fill('P0300');await close(d);
  d=await show(page);await expect(d.getByLabel('Szukaj w bazie',{exact:true})).toHaveValue('P0300');await close(d);
  await page.reload();await home(page);d=await show(page);
  await expect(d.getByLabel('Szukaj w bazie',{exact:true})).toHaveValue('P0300');await expect(d.getByRole('status')).toContainText('Znaleziono: 1');
});
test('clear removes only query and remains cleared after reload',async({page})=>{
  await page.goto(HOME);await home(page);
  const profile=JSON.stringify({version:1,profile:{brand:'Chevrolet',model:'Suburban',year:'1999',engine:'',drive:'',transmission:''}});
  await page.evaluate(value=>{sessionStorage.setItem('unrelated-session','keep');localStorage.setItem('gmt400_vehicle_profile_v1',value);},profile);
  let d=await show(page);await d.getByLabel('Szukaj w bazie',{exact:true}).fill('P0300');
  await d.getByRole('button',{name:'Wyczyść frazę',exact:true}).click();await expect(d.getByLabel('Szukaj w bazie',{exact:true})).toBeFocused();
  expect(await page.evaluate(k=>sessionStorage.getItem(k),KEY)).toBeNull();
  expect(await page.evaluate(()=>sessionStorage.getItem('unrelated-session'))).toBe('keep');
  expect(await page.evaluate(()=>localStorage.getItem('gmt400_vehicle_profile_v1'))).toBe(profile);
  await close(d);await page.reload();await home(page);d=await show(page);
  await expect(d.getByLabel('Szukaj w bazie',{exact:true})).toHaveValue('');
  expect(await page.evaluate(()=>localStorage.getItem('gmt400_vehicle_profile_v1'))).toBe(profile);
});
test('restores query after following material permalink and returning',async({page,context})=>{
  await context.route(url=>url.origin===BASE&&url.pathname==='/baza/'+ID,route=>{
    if(!route.request().isNavigationRequest())return route.continue();
    return route.fulfill({contentType:'text/html; charset=utf-8',body:'<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>Controlled material fixture</title></head><body><main><h1>Test przejścia</h1><a href="/?tab=kody">Wróć do encyklopedii</a></main></body></html>'});
  });
  await page.goto(HOME);await home(page);let d=await show(page);
  await d.getByLabel('Szukaj w bazie',{exact:true}).fill('P0300');await d.getByRole('button',{name:TITLE,exact:true}).click();
  await d.getByRole('link',{name:'Otwórz stronę materiału — stały link',exact:true}).click();
  await expect(page).toHaveURL(BASE+'/baza/'+ID);
  await expect(page.getByRole('heading',{name:'Test przejścia',exact:true})).toBeVisible();
  const back=page.getByRole('link',{name:'Wróć do encyklopedii',exact:true});await expect(back).toBeVisible();await back.click();
  await home(page);d=await show(page);await expect(d.getByLabel('Szukaj w bazie',{exact:true})).toHaveValue('P0300');await expect(d.getByRole('status')).toContainText('Znaleziono: 1');
});
test('invalid and oversized records do not break search',async({page})=>{
  await page.goto(HOME);await home(page);
  for(const raw of ['{broken','null',JSON.stringify({version:2,query:'P0300'}),JSON.stringify({version:1,query:7}),JSON.stringify({version:1,query:'x'.repeat(121)})]){
    await page.evaluate(({key,raw})=>sessionStorage.setItem(key,raw),{key:KEY,raw});const d=await show(page);const input=d.getByLabel('Szukaj w bazie',{exact:true});
    await expect(input).toHaveValue('');await input.fill('P0300');await expect(d.getByRole('status')).toContainText('Znaleziono: 1');await close(d);
  }
});
test('blocked session storage leaves search usable',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>Object.defineProperty(window,'sessionStorage',{configurable:true,get(){throw new Error('Storage unavailable for test');}}));
  await page.goto(HOME);await home(page);let d=await show(page);
  await expect(d.locator('#global-search-memory')).toContainText('Pamięć sesji jest niedostępna.');
  await d.getByLabel('Szukaj w bazie',{exact:true}).fill('P0300');await expect(d.getByRole('status')).toContainText('Znaleziono: 1');
  await d.getByRole('button',{name:'Wyczyść frazę',exact:true}).click();await expect(d.getByLabel('Szukaj w bazie',{exact:true})).toHaveValue('');
  await close(d);d=await show(page);await expect(d.getByLabel('Szukaj w bazie',{exact:true})).toHaveValue('');expect(errors).toEqual([]);
});
