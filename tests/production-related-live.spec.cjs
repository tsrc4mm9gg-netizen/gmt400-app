const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),ts=require('typescript');
const loaded={exports:{}};
new Function('exports','require','module',ts.transpileModule(fs.readFileSync('src/lib/related-materials.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(loaded.exports,require,loaded);
const ORIGIN='https://www.gmt400.pl',ID='3fad7bf1-c139-8194-b00a-cf6404bfe8f9';
const clean=value=>String(value||'').replace(/-/g,'').toLowerCase();
async function sha(request){const response=await request.get(ORIGIN+'/api/status',{timeout:20000});expect(response.ok()).toBe(true);const value=(await response.json()).deployment?.commitSha;expect(value).toMatch(/^[a-f0-9]{40}$/i);return value;}
test('live related suggestions match rules and open a real article',async({page,request},info)=>{
  const snapshot={scope:'Live 4L60E suggestions without saved vehicle profile; no API mocks, Notion writes or VIN. Not error/retry or vehicle-profile certification.',errors:[],auditorCodeSha:process.env.GITHUB_SHA};
  page.on('pageerror',error=>snapshot.errors.push(error.message));
  try{
    snapshot.before=await sha(request);
    const response=await request.get(ORIGIN+'/api/notion',{timeout:30000});expect(response.ok()).toBe(true);
    const body=await response.json();expect(body.complete).toBe(true);expect(Array.isArray(body.results)).toBe(true);
    const current=body.results.find(item=>clean(item.id)===clean(ID));expect(current).toBeTruthy();
    const expected=loaded.exports.getRelatedMaterials(current,body.results,new Map());
    if(!expected.length)throw new Error('UNVERIFIED: no eligible related-material sample for 4L60E; no success or broken-feature conclusion.');
    snapshot.expected=expected.map(item=>({id:item.id,title:item.Nazwa,reason:item.reason}));
    await page.addInitScript(()=>localStorage.removeItem('gmt400_vehicle_profile_v1'));
    const articleResponse=await page.goto(ORIGIN+'/baza/'+ID,{waitUntil:'domcontentloaded'});expect(articleResponse?.status()).toBe(200);
    await expect(page.locator('article').first().getByRole('heading',{level:1,name:current.Nazwa,exact:true})).toBeVisible();
    const region=page.getByRole('region',{name:'Powiązane materiały',exact:true});
    await expect(region).toBeVisible({timeout:30000});
    const links=region.getByRole('link');
    await expect(links).toHaveCount(expected.length,{timeout:30000});
    for(let i=0;i<expected.length;i++){
      expect(clean(expected[i].id)).not.toBe(clean(ID));
      await expect(links.nth(i)).toHaveText(expected[i].Nazwa);
      await expect(links.nth(i)).toHaveAttribute('href','/baza/'+encodeURIComponent(expected[i].id));
      await expect(region.locator('li').nth(i)).toContainText(expected[i].reason);
    }
    snapshot.links=await links.evaluateAll(elements=>elements.map(element=>element.getAttribute('href')));
    expect(new Set(snapshot.links).size).toBe(expected.length);
    await links.first().click();
    await expect(page).toHaveURL(ORIGIN+'/baza/'+encodeURIComponent(expected[0].id));
    await expect(page.locator('article').first().getByRole('heading',{level:1,name:expected[0].Nazwa,exact:true})).toBeVisible({timeout:30000});
    snapshot.after=await sha(request);expect(snapshot.after).toBe(snapshot.before);
    expect(snapshot.errors).toEqual([]);
  }finally{
    snapshot.finalUrl=page.url();
    await info.attach('related-live-diagnostics',{body:JSON.stringify(snapshot,null,2),contentType:'application/json'});
    await page.screenshot({path:info.outputPath('related-live.png'),fullPage:true}).catch(()=>{});
  }
});
