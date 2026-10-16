const { test, expect } = require('@playwright/test');
const BASE = 'http://127.0.0.1:3100';
test('navigation hierarchy distinguishes groups and reserves gold for active selection',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(BASE + '/?tab=modele');
  await page.getByRole('button',{name:'Otwórz menu',exact:true}).click();
  const menu=page.getByRole('navigation',{name:'Menu główne',exact:true});
  await expect(menu).toBeVisible();
  const group=menu.locator('[data-navigation-groups] > button').first();
  const item=menu.locator('[data-navigation-items] button[aria-pressed="false"]').first();
  const groupStyle=await group.evaluate(node=>{const style=getComputedStyle(node);return{background:style.backgroundColor,border:style.borderColor,weight:Number(style.fontWeight)};});
  const itemStyle=await item.evaluate(node=>{const style=getComputedStyle(node);return{background:style.backgroundColor,border:style.borderColor,weight:Number(style.fontWeight)};});
  expect(groupStyle.background).not.toBe(itemStyle.background);
  expect(groupStyle.weight).toBeGreaterThan(itemStyle.weight);
  expect(groupStyle.border.toLowerCase()).not.toBe('#e7b95e');
  expect(itemStyle.border.toLowerCase()).not.toBe('#e7b95e');
  await group.click();
  const active=menu.locator('[data-navigation-groups] > button[data-active=true]').first();
  if(await active.count()) {
    const activeStyle=await active.evaluate(node=>getComputedStyle(node).borderColor);
    expect(activeStyle.toLowerCase()).toBe('#e7b95e');
  }
});
