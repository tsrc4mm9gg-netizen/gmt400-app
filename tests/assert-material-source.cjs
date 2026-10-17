const {expect}=require('@playwright/test');
const {parseMaterialText,plainInline}=require('../src/lib/material-text.ts');
async function assertMaterialSource(article,text){
 const field=article.locator('[data-source-field="Rozwiązanie"]');await expect(field).toBeVisible();
 const expected=parseMaterialText(text),actual=field.locator(':scope > [data-text-block]');await expect(actual).toHaveCount(expected.length);
 for(let i=0;i<expected.length;i++){const block=expected[i],node=actual.nth(i);if(block.kind==='list'){const items=node.locator(block.ordered?'ol > li':'ul > li');await expect(items).toHaveCount(block.items.length);for(let j=0;j<block.items.length;j++){await expect(items.nth(j)).toHaveText(plainInline(block.items[j].text));if(block.ordered)await expect(items.nth(j)).toHaveAttribute('value',String(block.items[j].value));}}else await expect(node).toHaveText(plainInline(block.text));}
}
module.exports={assertMaterialSource};
