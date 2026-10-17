const {test,expect}=require('@playwright/test');
const BASE='http://127.0.0.1:3100';
for(const path of ['/','/narzedzia/rpo','/narzedzia/diagnostyka','/narzedzia/kalkulatory','/narzedzia/czesci']){
 test('one viewport without zoom restrictions at '+path,async({page})=>{
  await page.route('**/api/notion',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({results:[]})}));
  await page.goto(BASE+path);await expect(page.getByRole('heading',{level:1}).first()).toBeVisible();
  const metas=page.locator('meta[name="viewport"]');await expect(metas).toHaveCount(1);
  const content=(await metas.getAttribute('content')).toLowerCase();
  const values=Object.fromEntries(content.split(',').map(part=>part.trim().split('=').map(value=>value.trim())));
  expect(values.width).toBe('device-width');
  expect(['no','0']).not.toContain(values['user-scalable']);
  if(values['maximum-scale']!==undefined) expect(Number(values['maximum-scale'])).toBeGreaterThanOrEqual(2);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}
