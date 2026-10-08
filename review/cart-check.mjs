import {chromium} from '/Users/rajan/Downloads/main portfolio/cinematic/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import AxeBuilder from '/tmp/urban-shisha-audits/node_modules/@axe-core/playwright/dist/index.mjs';

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true
});

const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [], failed = [], axe = [];

page.on('pageerror', e => errors.push(e.message));
page.on('response', r => {
  if (r.status() >= 400) failed.push(r.url());
});

// 1. Initial load & Age gate verification
await page.goto('http://127.0.0.1:8091/cart.html', { waitUntil: 'networkidle' });
await page.locator('#age-dialog').waitFor({ state: 'visible' });
await page.keyboard.press('Escape');
await page.waitForTimeout(100);
assert.equal(await page.locator('#age-dialog').evaluate(d => d.open), true, 'Age gate should prevent escape bypass');
await page.click('#age-accept');
await page.waitForTimeout(600);

// 2. Seed preview cart with 3 items
await page.evaluate(() => {
  localStorage.setItem('urban-preview-cart', JSON.stringify([
    { id: 'studio-black', qty: 2 },
    { id: 'phunnel-bowl', qty: 1 },
    { id: 'coconut-charcoal', qty: 3 }
  ]));
  localStorage.setItem('urban-preview-wishlist', JSON.stringify([]));
});

await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);

// 3. Verify totals and line items
// 2*9499 = 18998, 1*1299 = 1299, 3*135 = 405. Total = 20,702. Items count = 6
assert.equal(await page.locator('.cart-row').count(), 3, 'Should render 3 product rows');
assert.match(await page.locator('#cart-item-count').textContent(), /6 items/, 'Cart heading should show 6 items');
assert.match(await page.locator('#summary-subtotal').textContent(), /20,702/, 'Subtotal should be 20,702');
assert.match(await page.locator('#summary-total').textContent(), /20,702/, 'Total should be 20,702');

// 4. Quantity modification
// Increase phunnel bowl qty to 2 (+1299) -> Subtotal 22,001
const phunnelQtyPlus = page.locator('#cart-row-phunnel-bowl [data-delta="1"]');
await phunnelQtyPlus.click();
await page.waitForTimeout(300);
assert.match(await page.locator('#line-total-phunnel-bowl').textContent(), /2,598/, 'Phunnel bowl line total should be 2,598');
assert.match(await page.locator('#summary-subtotal').textContent(), /22,001/, 'New subtotal should be 22,001');

// Decrease studio-black qty to 1 (-9499) -> Subtotal 12,502
const brandoQtyMinus = page.locator('#cart-row-studio-black [data-delta="-1"]');
await brandoQtyMinus.click();
await page.waitForTimeout(300);
assert.match(await page.locator('#line-total-studio-black').textContent(), /9,499/, 'Brando line total should be 9,499');
assert.match(await page.locator('#summary-subtotal').textContent(), /12,502/, 'New subtotal should be 12,502');

// 5. Wishlist toggle
const wishlistBtn = page.locator('#cart-row-phunnel-bowl [data-cart-save]');
await wishlistBtn.click();
await page.waitForTimeout(300);
assert.equal(await wishlistBtn.getAttribute('aria-pressed'), 'true', 'Wishlist button should be active');
const savedItems = await page.evaluate(() => JSON.parse(localStorage.getItem('urban-preview-wishlist')));
assert.deepEqual(savedItems, ['phunnel-bowl'], 'Product should be saved in wishlist without removing from cart');
assert.equal(await page.locator('.cart-row').count(), 3, 'Cart row count should remain 3');

// 6. Checkout preview button
await page.click('#checkout-btn');
await page.waitForTimeout(300);
assert.equal(await page.locator('#checkout-preview-dialog').evaluate(d => d.open), true, 'Checkout dialog should open');
await page.click('#checkout-preview-dialog .close-dialog');
await page.waitForTimeout(200);

// 7. Responsive testing at 1440, 1024, 768, 390
for (const width of [1440, 1024, 768, 390]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(400);

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  assert.equal(scrollWidth, width, `Width ${width} should have no horizontal overflow`);
  await page.screenshot({ path: `review/cart-${width}.png` });

  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  axe.push({ width, violations: report.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })) });
}

// 8. Mobile checkout button test at 390
await page.setViewportSize({ width: 390, height: 844 });
const mobileCheckout = page.locator('#mobile-checkout-btn');
assert.equal(await mobileCheckout.isVisible(), true, 'Mobile checkout button should be visible');
await mobileCheckout.click();
await page.waitForTimeout(300);
assert.equal(await page.locator('#checkout-preview-dialog').evaluate(d => d.open), true, 'Mobile checkout should trigger preview dialog');
await page.click('#checkout-preview-dialog .close-dialog');
await page.waitForTimeout(200);

// 9. Remove item & Clear bag (Empty state)
await page.click('#cart-row-coconut-charcoal [data-cart-remove]');
await page.waitForTimeout(300);
assert.equal(await page.locator('.cart-row').count(), 2, 'Should have 2 items after removing charcoal');

await page.click('#cart-clear');
await page.waitForTimeout(400);
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(300);
assert.equal(await page.locator('#cart-empty').isVisible(), true, 'Empty state should be visible after clearing bag');
assert.equal(await page.locator('#cart-layout').isVisible(), false, 'Cart layout should be hidden');
assert.equal(await page.locator('#cart-mobile-bar').isVisible(), false, 'Mobile bar should be hidden');
await page.screenshot({ path: 'review/cart-empty-390.png' });

await page.setViewportSize({ width: 1440, height: 1000 });
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(300);
await page.screenshot({ path: 'review/cart-empty-1440.png' });

// 10. Drawer integration from Shop page
await page.goto('http://127.0.0.1:8091/shop.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
// Add a product from shop
await page.locator('[data-id="studio-black"] .add-product').click();
await page.waitForTimeout(400);
await page.click('.bag-button');
await page.waitForTimeout(300);
const viewCartLink = page.locator('#drawer-body .view-full-cart');
assert.equal(await viewCartLink.isVisible(), true, 'Drawer should contain View full bag link');
await viewCartLink.click();
await page.waitForURL('**/cart.html');
assert.equal(await page.locator('.cart-row').count(), 1, 'Cart page should reflect added item');

// Wrap up
const auditResult = { errors, failed, axe };
await fs.writeFile('review/cart-results.json', JSON.stringify(auditResult, null, 2));

console.log(JSON.stringify(auditResult, null, 2));
assert.deepEqual(errors, [], 'No page errors');
assert.deepEqual(failed, [], 'No failed asset requests');
const totalViolations = axe.reduce((n, r) => n + r.violations.length, 0);
assert.equal(totalViolations, 0, `Zero accessibility violations, got ${totalViolations}`);

await browser.close();
console.log('PASS: Cart page layout, live quantities, totals, wishlist sync, empty state, 4 viewports, accessibility and drawer integration.');
