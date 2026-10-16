const { test, expect } = require('@playwright/test');
const BASE = 'http://127.0.0.1:3100';
const PHOTO_GROUPS = ['tahoe','suburban','pickups','yukon'];
test('model family images share proportions and are clearly labelled as illustrations',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.addInitScript(()=>localStorage.setItem('gmt400_tab','modele'));
  await page.route('**/api/notion',route=>route.fulfill({json:{results:[{id:'1',Nazwa:'Tahoe',Model:'Tahoe',Lata:'1995–2000',Opis:'Rodzina Tahoe'},{id:'2',Nazwa:'Suburban',Model:'Suburban',Lata:'1992–1999',Opis:'Rodzina Suburban'},{id:'3',Nazwa:'Pickup',Model:'C/K',Lata:'1988–2000',Opis:'Rodzina pickup'},{id:'4',Nazwa:'Yukon',Model:'Yukon',Lata:'1992–2000',Opis:'Rodzina Yukon'}],count:4,complete:true}}));
  await page.goto(BASE);
  const cards=page.getByRole('button',{name:/Tahoe|Suburban|Pickup|Yukon/});
  await expect(cards).toHaveCount(4);
  for(const group of PHOTO_GROUPS){
    const card=cards.filter({hasText:group==='pickups'?'Pickup':group.charAt(0).toUpperCase()+group.slice(1)}).first();
    const media=card.locator('.relative.aspect-video');
    await expect(media).toHaveCount(1);
    const box=await media.boundingBox();
    expect(box.width/box.height).toBeCloseTo(16/9,.01);
    await expect(media.getByText('Ilustracja rodziny',{exact:true})).toBeVisible();
    await expect(card.locator('img')).toHaveAttribute('alt','Ilustracja rodziny pojazdów, nie konkretnej odmiany');
  }
});
