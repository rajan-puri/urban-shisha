import {chromium} from '/Users/rajan/Downloads/main portfolio/cinematic/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8091/',{waitUntil:'networkidle'});await page.click('#age-accept');await page.waitForTimeout(2200);
await page.locator('#product-spotlight').scrollIntoViewIfNeeded();await page.waitForTimeout(600);
assert.equal(await page.locator('.detail-story').count(),0);assert.equal(await page.locator('.spotlight-choice').count(),4);
assert.equal(await page.locator('#spotlight-image').getAttribute('data-product'),'studio-black');
await page.click('#spotlight-next');await page.waitForTimeout(600);assert.equal(await page.locator('#spotlight-image').getAttribute('data-product'),'signature-chrome');
await page.click('#spotlight-prev');await page.click('#spotlight-prev');await page.waitForTimeout(600);assert.equal(await page.locator('#spotlight-image').getAttribute('data-product'),'carbon-edition');
await page.click('[data-spotlight-index="2"]');await page.waitForTimeout(600);assert.equal(await page.locator('#spotlight-image').getAttribute('data-product'),'compact-emerald');
await page.click('#spotlight-add');assert.equal(await page.locator('.bag-button .cart-count').textContent(),'1');
await page.click('#spotlight-image');assert.equal(await page.locator('#content-title').textContent(),'Dark Knight Slash');await page.keyboard.press('Escape');
for(const width of [1440,1024,768,390]){await page.setViewportSize({width,height:1100});await page.locator('#product-spotlight').scrollIntoViewIfNeeded();await page.waitForTimeout(600);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);await page.screenshot({path:`review/v2-spotlight-${width}.png`});}
await page.emulateMedia({reducedMotion:'reduce'});await page.click('#spotlight-next');assert.equal(await page.locator('#spotlight-image').getAttribute('data-product'),'carbon-edition');
assert.deepEqual(errors,[]);console.log('PASS: 4 choices, next/previous loop, click selection, matching cart/dialog, four responsive widths, reduced motion, no browser errors.');await browser.close();
