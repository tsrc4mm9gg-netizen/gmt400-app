const { test, expect } = require('@playwright/test');
const BASE = 'http://127.0.0.1:3100';
test('body uses Geist, common type scale and consistent control height',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(BASE + '/?tab=modele');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>getComputedStyle(document.body).fontFamily)).toContain('Geist');
  const metrics=await page.evaluate(()=>{
    const h1=getComputedStyle(document.querySelector('h1'));
    const h2=getComputedStyle(document.querySelector('h2'));
    const button=[...document.querySelectorAll('button')].find(node=>node.getBoundingClientRect().height>0);
    return { h1Size:parseFloat(h1.fontSize),h1Weight:Number(h1.fontWeight),h2Size:parseFloat(h2.fontSize),h2Weight:Number(h2.fontWeight),buttonHeight:button?button.getBoundingClientRect().height:0 };
  });
  expect(metrics.h1Size).toBe(28);
  expect(metrics.h1Weight).toBeGreaterThanOrEqual(700);
  expect(metrics.h2Size).toBe(22);
  expect(metrics.h2Weight).toBeGreaterThanOrEqual(650);
  expect(metrics.buttonHeight).toBeGreaterThanOrEqual(44);
});
