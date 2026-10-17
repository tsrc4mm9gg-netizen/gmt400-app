// Production verification for the 4L60E material, contents and service-kit illustration.
const {test,expect}=require('@playwright/test');
const ORIGIN='https://www.gmt400.pl',ID='3fad7bf1-c139-8194-b00a-cf6404bfe8f9';
const clean=value=>String(value||'').replace(/-/g,'').toLowerCase();
async function entries(request){const response=await request.get(ORIGIN+'/api/notion',{timeout:30000});expect(response.status()).toBe(200);const body=await response.json();expect(body.complete).toBe(true);expect(Array.isArray(body.results)).toBe(true);return body.results;}
async function attach(info,snapshot){await info.attach('live-material-diagnostics',{body:JSON.stringify(snapshot,null,2),contentType:'application/json'});}
async function open(page,id){const response=await page.goto(ORIGIN+'/baza/'+id,{waitUntil:'domcontentloaded',timeout:20000});expect(response?.status()).toBe(200);return page.locator('article').first();}
async function visibleHeadings(article){return article.locator('h2,h3').evaluateAll(elements=>elements.filter(element=>element.textContent.trim()&&element.getClientRects().length&&!element.closest('[hidden],[aria-hidden="true"]')).map(element=>element.textContent.trim()));}
test('live 4L60E preserves title and solution content',async({page,request},info)=>{
  const snapshot={articleId:ID,pageErrors:[]};
  page.on('pageerror',error=>snapshot.pageErrors.push(error.message));
  try{
    const list=await entries(request);
    const entry=list.find(item=>clean(item.id)===clean(ID));
    expect(entry).toBeTruthy();
    expect(typeof entry.Rozwiązanie).toBe('string');
    expect(entry.Rozwiązanie.trim().length).toBeGreaterThan(0);
    snapshot.title=entry.Nazwa;
    const article=await open(page,ID);
    await expect(article.getByRole('heading',{level:1,name:entry.Nazwa,exact:true})).toBeVisible();
    const solution=article.locator('[data-source-field="Rozwiązanie"]');
    await expect(solution).toBeVisible();
    snapshot.solutionText=await solution.innerText({timeout:10000});
    snapshot.sourceSolution=entry.Rozwiązanie;
    await expect(solution).toContainText('Rozgrzej skrzynię (jazda 10 min)');
    await expect(solution).toContainText('Magnes w misce zbiera opiłki — dużo opiłków = zużycie wewnętrzne.');
    await expect(article.getByRole('alert').filter({hasText:'Nie udało się pobrać dodatkowej zawartości strony Notion.'})).toHaveCount(0);
    expect(snapshot.pageErrors).toEqual([]);
  }finally{
    snapshot.finalUrl=page.url();
    await attach(info,snapshot);
    await page.screenshot({path:info.outputPath('instruction.png'),fullPage:true}).catch(()=>{});
  }
});
test('live 4L60E contents targets real unique sections',async({page},info)=>{const snapshot={articleId:ID,pageErrors:[]};page.on('pageerror',error=>snapshot.pageErrors.push(error.message));try{const article=await open(page,ID);await expect(article.getByRole('heading',{level:1})).toBeVisible();const headings=await visibleHeadings(article);snapshot.headingCount=headings.length;expect(headings.length).toBeGreaterThanOrEqual(2);const nav=article.getByRole('navigation',{name:'Spis treści materiału',exact:true});await expect(nav).toBeVisible({timeout:30000});await nav.locator('summary').click();const links=nav.getByRole('link');await expect(links).toHaveCount(headings.length);const targets=await links.evaluateAll(elements=>elements.map(element=>element.getAttribute('href')));snapshot.targets=targets;expect(new Set(targets).size).toBe(targets.length);for(const hash of targets){expect(hash.startsWith('#')).toBe(true);expect(await page.evaluate(id=>Array.from(document.querySelectorAll('[id]')).filter(element=>element.id===id).length,decodeURIComponent(hash.slice(1)))).toBe(1);}const target=decodeURIComponent(targets[0].slice(1));await links.first().click();await expect.poll(()=>page.evaluate(()=>decodeURIComponent(location.hash.slice(1)))).toBe(target);await expect.poll(()=>page.evaluate(()=>document.activeElement?.id)).toBe(target);expect(snapshot.pageErrors).toEqual([]);}finally{await attach(info,snapshot);await page.screenshot({path:info.outputPath('contents.png'),fullPage:true}).catch(()=>{});}});
test('live 4L60E illustration loads zooms and closes',async({page},info)=>{
  test.setTimeout(180000);
  const snapshot={articleId:ID,pageErrors:[],stage:'start'};
  page.on('pageerror',error=>snapshot.pageErrors.push(error.message));
  try{
    const article=await open(page,ID);
    snapshot.stage='page-open';
    await expect(article.getByRole('heading',{level:1})).toBeVisible();
    const section=article.locator('section[aria-label="Zawartość strony Notion"]');
    const figure=section.locator('[data-material-image]').first();
    snapshot.stage='figure-visible';
    await expect(figure).toBeVisible({timeout:30000});
    snapshot.previewCount=await section.locator('[data-material-image]').count();
    expect(snapshot.previewCount).toBeGreaterThan(0);
    const opener=figure.getByRole('button',{name:'Powiększ ilustrację',exact:true});
    snapshot.stage='opener-visible';
    await expect(opener).toBeVisible({timeout:30000});
    snapshot.stage='preview-image-loaded';
    await expect.poll(()=>opener.locator('img').evaluate(image=>image.complete&&image.naturalWidth>0),{timeout:60000}).toBe(true);
    snapshot.stage='caption-inspection';
    snapshot.caption=await figure.evaluate(element=>element.querySelector('figcaption')?.textContent??null);
    snapshot.stage='opener-click';
    await opener.click({timeout:10000});
    snapshot.stage='dialog-open';
    const dialog=page.getByRole('dialog',{name:'Powiększona ilustracja',exact:true});
    await expect(dialog).toBeVisible({timeout:30000});
    snapshot.stage='dialog-image-loaded';
    await expect.poll(()=>dialog.locator('img').evaluate(image=>image.complete&&image.naturalWidth>0),{timeout:60000}).toBe(true);
    snapshot.stage='zoom-clicked';
    await dialog.getByRole('button',{name:'Zwiększ powiększenie',exact:true}).click({timeout:10000});
    snapshot.stage='zoom-150';
    await expect(dialog.getByText('Powiększenie: 150%',{exact:true})).toBeVisible({timeout:30000});
    snapshot.stage='escape-pressed';
    await page.keyboard.press('Escape');
    snapshot.stage='dialog-closed';
    await expect(dialog).toBeHidden({timeout:30000});
    snapshot.stage='focus-restored';
    await expect(opener).toBeFocused({timeout:30000});
    snapshot.stage='complete';
    expect(snapshot.pageErrors).toEqual([]);
  }finally{
    snapshot.finalUrl=page.url();
    await attach(info,snapshot);
    await page.screenshot({path:info.outputPath('real-image.png'),fullPage:true}).catch(()=>{});
  }
});
