const { test, expect } = require('@playwright/test');
const BASE = 'http://127.0.0.1:3100';
const ALL = Object.fromEntries(['brand','model','years','engine','drive','transmission'].map(key => [key,['Wszystkie']]));
const profile = { brand:'Chevrolet',model:'Suburban',year:'1999',engine:'5.7',drive:'4WD',transmission:'' };
const entries = [['MATCH',{...ALL,model:['Suburban']}],['OUTSIDE',{...ALL,model:['Yukon']}],['UNKNOWN',{}]].map(([Nazwa,applicability]) => ({Nazwa,Typ:'Kod błędu',Model:'Wszystkie',Opis:'Opis testowy',applicability}));
async function prepare(page, path, withProfile = false) {
  await page.setViewportSize({width:390,height:844});
  await page.addInitScript(({profile,withProfile}) => { localStorage.setItem('gmt400_tab','kody'); if(withProfile) localStorage.setItem('gmt400_vehicle_profile_v1',JSON.stringify({version:1,profile})); },{profile,withProfile});
  await page.route('**/api/notion',route => route.fulfill({json:{results:entries,count:entries.length,complete:true}}));
  await page.goto(BASE + path);
}
async function chooseInMenu(page, group, child) {
  await page.getByRole('button',{name:'Otwórz menu',exact:true}).click();
  const menu = page.getByRole('navigation',{name:'Menu główne',exact:true});
  await menu.getByRole('button',{name:group,exact:true}).click();
  await menu.getByRole('button',{name:child,exact:true}).click();
  await expect(menu).toHaveCount(0);
}
test('explicit section URL overrides saved tab and survives reload',async({page})=>{
  await prepare(page,'/?tab=import');
  await expect(page.getByRole('heading',{name:'IMPORT DO POLSKI',exact:true})).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>localStorage.getItem('gmt400_tab'))).toBe('import');
  await page.reload();
  await expect(page.getByRole('heading',{name:'IMPORT DO POLSKI',exact:true})).toBeVisible();
  await expect(page).toHaveURL(/tab=import/);
});
test('back and forward restore the actual selected section rather than just button state',async({page})=>{
  await prepare(page,'/?tab=import');
  await chooseInMenu(page,'Serwis i części','Usterki');
  await expect(page).toHaveURL(/tab=usterki/);
  await chooseInMenu(page,'Serwis i części','Kody OBD');
  await expect(page).toHaveURL(/tab=kody/);
  await page.goBack();
  await expect(page.getByRole('heading',{name:'USTERKI',exact:true})).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading',{name:'IMPORT DO POLSKI',exact:true})).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading',{name:'USTERKI',exact:true})).toBeVisible();
});
test('back restores saved reading position after section change through the header',async({page},info)=>{
  let before=null;
  try {
    await prepare(page,'/?tab=import');
    await expect(page.getByRole('heading',{name:'IMPORT DO POLSKI',exact:true})).toBeVisible();
    before=await page.evaluate(()=>{window.scrollTo({top:300,behavior:'instant'});return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(window.scrollY))));});
    expect(before).toBe(300);
    await chooseInMenu(page,'Serwis i części','Usterki');
    await expect(page).toHaveURL(/tab=usterki/);
    await page.goBack();
    await expect(page).toHaveURL(/tab=import/);
    await expect.poll(async()=>Math.abs(await page.evaluate(()=>window.scrollY)-before)).toBeLessThan(12);
  } catch(error) {
    let diagnostics={};
    try { diagnostics=await page.evaluate(()=>({actualY:window.scrollY,tab:new URL(window.location.href).searchParams.get('tab'),historySection:window.history.state?.gmt400Section,historyY:window.history.state?.gmt400ScrollY,restoration:window.history.scrollRestoration})); } catch {}
    await info.attach('history-restoration-diagnostics',{body:JSON.stringify({expectedY:before,...diagnostics},null,2),contentType:'application/json'});
    throw new Error(String(error.message||error)+'\nHISTORY_DIAGNOSTICS: '+JSON.stringify({expectedY:before,...diagnostics}));
  }
});
test('compact profile exposes two basic modes and preserves advanced matching controls',async({page})=>{
  await prepare(page,'/?tab=kody',true);
  const panel=page.getByRole('region',{name:'Filtrowanie według profilu auta'});
  await expect(panel.getByRole('button',{name:'Dla mojego auta (2)',exact:true})).toBeVisible();
  await expect(panel.getByRole('button',{name:'Wszystkie (3)',exact:true})).toBeVisible();
  await expect(panel.getByRole('button',{name:'Zgodne z zakresem (1)',exact:true})).toHaveCount(0);
  expect(await panel.evaluate(node=>node.getBoundingClientRect().height)).toBeLessThan(300);
  await expect(panel).toContainText('nie oznaczają potwierdzonego dopasowania');
  await panel.getByRole('button',{name:'Filtry zaawansowane',exact:true}).click();
  await panel.getByRole('button',{name:'Zgodne z zakresem (1)',exact:true}).click();
  await expect(page.getByRole('heading',{name:'MATCH',exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'UNKNOWN',exact:true})).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'OUTSIDE',exact:true})).toHaveCount(0);
});
