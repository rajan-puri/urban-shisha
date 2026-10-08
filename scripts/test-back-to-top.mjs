import { chromium } from '/Users/rajan/Downloads/main portfolio/cinematic/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true
});

try {
  // Test 1: Desktop checks
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Accept age gate in localStorage to skip popup
  await page.addInitScript(() => {
    localStorage.setItem('urban-preview-age', 'accepted');
  });

  console.log('Testing Home page (1440x900)...');
  await page.goto('http://127.0.0.1:8091/', { waitUntil: 'networkidle' });

  // 1. Verify "Let's talk" button
  const letsTalk = page.locator('a.whatsapp-button');
  await assert.equal(await letsTalk.count(), 1, 'whatsapp-button anchor should exist');
  const href = await letsTalk.getAttribute('href');
  assert.equal(href, 'contact.html', 'whatsapp-button should link to contact.html');

  // Click "Let's talk" button and verify navigation to contact.html
  await letsTalk.click();
  await page.waitForURL('**/contact.html');
  console.log('✓ "Let\'s talk" redirects to contact.html successfully');

  // 2. Test Back to Top button on Home page
  await page.goto('http://127.0.0.1:8091/', { waitUntil: 'networkidle' });
  const btt = page.locator('#back-to-top');
  await assert.equal(await btt.count(), 1, '#back-to-top should exist');

  // Initially at top (scrollY = 0), should not have is-visible
  let isVisibleClass = await btt.evaluate(el => el.classList.contains('is-visible'));
  assert.equal(isVisibleClass, false, '#back-to-top should not be visible at scrollY = 0');

  // Scroll down 600px
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(100);

  isVisibleClass = await btt.evaluate(el => el.classList.contains('is-visible'));
  assert.equal(isVisibleClass, true, '#back-to-top should have is-visible after scrolling down');

  // Click #back-to-top and verify scroll returns to top
  await btt.click();
  await page.waitForTimeout(500);
  const scrollYAfterClick = await page.evaluate(() => window.scrollY);
  assert.equal(scrollYAfterClick, 0, 'Clicking #back-to-top should scroll page to 0');
  console.log('✓ #back-to-top scrolls to top smoothly on Home page');

  // 3. Test on Contact page
  console.log('Testing Contact page (1440x900)...');
  await page.goto('http://127.0.0.1:8091/contact.html', { waitUntil: 'networkidle' });
  const contactBtt = page.locator('#back-to-top');
  await assert.equal(await contactBtt.count(), 1, '#back-to-top should exist on contact page');

  // Scroll down on contact page
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(100);
  assert.equal(await contactBtt.evaluate(el => el.classList.contains('is-visible')), true, 'Contact btt visible on scroll');

  await contactBtt.click();
  await page.waitForTimeout(500);
  assert.equal(await page.evaluate(() => window.scrollY), 0, 'Contact btt scrolls to 0');
  console.log('✓ #back-to-top works on Contact page');

  // 4. Test on Shop page
  console.log('Testing Shop page (1440x900)...');
  await page.goto('http://127.0.0.1:8091/shop.html', { waitUntil: 'networkidle' });
  const shopLetsTalk = page.locator('a.whatsapp-button');
  assert.equal(await shopLetsTalk.getAttribute('href'), 'contact.html', 'Shop whatsapp-button links to contact.html');
  const shopBtt = page.locator('#back-to-top');
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(100);
  assert.equal(await shopBtt.evaluate(el => el.classList.contains('is-visible')), true, 'Shop btt visible on scroll');
  await shopBtt.click();
  await page.waitForTimeout(500);
  assert.equal(await page.evaluate(() => window.scrollY), 0, 'Shop btt scrolls to 0');
  console.log('✓ #back-to-top works on Shop page');

  // 5. Test Mobile View (390x844)
  console.log('Testing Mobile view (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.addInitScript(() => {
    localStorage.setItem('urban-preview-age', 'accepted');
  });
  await mobilePage.goto('http://127.0.0.1:8091/', { waitUntil: 'networkidle' });

  // Scroll down on mobile
  await mobilePage.evaluate(() => window.scrollTo(0, 800));
  await mobilePage.waitForTimeout(100);

  const mobileBtt = mobilePage.locator('#back-to-top');
  const mobileTalk = mobilePage.locator('a.whatsapp-button');
  const mobileShopBar = mobilePage.locator('.mobile-shop-bar');

  assert.equal(await mobileBtt.evaluate(el => el.classList.contains('is-visible')), true, 'Mobile btt visible');

  // Get bounding boxes to check no overlap
  const bttBox = await mobileBtt.boundingBox();
  const talkBox = await mobileTalk.boundingBox();
  const barBox = await mobileShopBar.boundingBox();

  console.log('Mobile positions:', {
    bttBottom: bttBox.y + bttBox.height,
    bttTop: bttBox.y,
    talkBottom: talkBox.y + talkBox.height,
    talkTop: talkBox.y,
    barTop: barBox.y
  });

  // Verify stacking: btt is strictly above talk, talk is strictly above bar
  assert(bttBox.y + bttBox.height < talkBox.y, 'Back to top should be above Let\'s talk button');
  assert(talkBox.y + talkBox.height < barBox.y, 'Let\'s talk should be above mobile shop bar');

  // Take screenshot for visual confirmation
  await mobilePage.screenshot({ path: 'review/mobile-buttons-scroll.png' });
  console.log('✓ Mobile positions verified with zero overlap; saved review/mobile-buttons-scroll.png');

  // Click btt on mobile
  await mobileBtt.click();
  await mobilePage.waitForFunction(() => window.scrollY === 0, null, { timeout: 2000 });
  assert.equal(await mobilePage.evaluate(() => window.scrollY), 0, 'Mobile btt scrolls to top');
  console.log('✓ Mobile btt scrolls to top cleanly');

  // 6. Test Reduced Motion behavior
  console.log('Testing Reduced Motion behavior...');
  const rmContext = await browser.newContext({
    reducedMotion: 'reduce'
  });
  const rmPage = await rmContext.newPage();
  await rmPage.addInitScript(() => {
    localStorage.setItem('urban-preview-age', 'accepted');
  });
  await rmPage.goto('http://127.0.0.1:8091/', { waitUntil: 'networkidle' });
  await rmPage.evaluate(() => window.scrollTo(0, 600));
  await rmPage.waitForTimeout(50);
  await rmPage.locator('#back-to-top').click();
  await rmPage.waitForTimeout(100);
  assert.equal(await rmPage.evaluate(() => window.scrollY), 0, 'Instant scroll on reduced motion');
  console.log('✓ Instant scroll on reduced motion verified');

  console.log('\nALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
} finally {
  await browser.close();
}
