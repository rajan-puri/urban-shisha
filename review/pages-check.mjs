import{chromium}from'/Users/rajan/Downloads/main portfolio/cinematic/node_modules/playwright/index.mjs';import assert from'node:assert/strict';import fs from'node:fs/promises';import AxeBuilder from'/tmp/urban-shisha-audits/node_modules/@axe-core/playwright/dist/index.mjs';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[],failed=[],axe=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
await page.goto('http://127.0.0.1:8091/about.html',{waitUntil:'networkidle'});
await page.locator('#age-dialog').waitFor({state:'visible'});await page.keyboard.press('Escape');assert.equal(await page.locator('#age-dialog').evaluate(d=>d.open),true);await page.click('#age-accept');
for(const width of[1440,1024,768,390,320]){
 await page.setViewportSize({width,height:1000});
 for(const name of['about','shipping','returns','privacy','terms','age-policy']){
  await page.goto(`http://127.0.0.1:8091/${name}.html`,{waitUntil:'networkidle'});await page.waitForTimeout(650);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,`${name} overflow at ${width}`);
  assert.equal(await page.locator('h1').count(),1);
  if(width===1440||width===390)await page.screenshot({path:`review/${name}-${width}.png`});
  if(width===1440||width===390){const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();axe.push({page:name,width,violations:report.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))});}
  if(name!=='about'){
   assert.equal(await page.locator('.policy-switcher [aria-current="page"]').count(),1);
   const target=await page.locator('.policy-contents a').first().getAttribute('href');await page.locator('.policy-contents a').first().click();assert.equal(new URL(page.url()).hash,target);
  }
 }
}
await page.setViewportSize({width:390,height:1000});await page.goto('http://127.0.0.1:8091/about.html',{waitUntil:'networkidle'});
await page.click('.mobile-toggle');assert.equal(await page.locator('#mobile-nav').isVisible(),true);assert.equal(await page.locator('.mobile-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('#mobile-nav').isVisible(),false);
await page.locator('[aria-controls="footer-care"]').click();await page.locator('#footer-care a[href="returns.html"]').click();await page.waitForURL('**/returns.html');
await page.goto('http://127.0.0.1:8091/privacy.html',{waitUntil:'networkidle'});
await page.evaluate(()=>{localStorage.setItem('unrelated-setting','keep');localStorage.setItem('urban-preview-cart',JSON.stringify([{id:'studio-black',qty:2}]));localStorage.setItem('urban-preview-wishlist','["studio-black"]');localStorage.setItem('urban-wholesale-enquiry','[{"id":"studio-black","qty":50}]');});
await page.click('#clear-preview-data');await page.click('#cancel-clear-data');assert.notEqual(await page.evaluate(()=>localStorage.getItem('urban-preview-cart')),null);
await page.click('#clear-preview-data');await page.click('#confirm-clear-data');assert.equal(await page.evaluate(()=>localStorage.getItem('urban-preview-cart')),null);assert.equal(await page.evaluate(()=>localStorage.getItem('urban-wholesale-enquiry')),null);assert.equal(await page.evaluate(()=>localStorage.getItem('urban-preview-age')),null);assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated-setting')),'keep');assert.match(await page.locator('#storage-feedback').textContent(),/cleared/);
await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('#age-dialog').evaluate(d=>d.open),false);
await page.setViewportSize({width:1440,height:1000});await page.locator('#mega-toggle').focus();await page.locator('#mega-toggle').press('ArrowDown');assert.equal(await page.locator('#category-menu').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#category-menu').isVisible(),false);
await page.route('**/gsap.min.js',r=>r.abort());await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:8091/shipping.html',{waitUntil:'networkidle'});assert.equal(await page.locator('h1').isVisible(),true);
const report={errors,failed,axe,checks:'6 pages; 1440/1024/768/390/320px; age gate; table of contents; active policy links; mobile menu/footer; privacy clear/cancel; unrelated data preserved; GSAP fallback'};await fs.writeFile('review/pages-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.equal(axe.reduce((n,r)=>n+r.violations.length,0),0);await browser.close();
