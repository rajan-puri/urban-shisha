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

console.log('--- URBAN SHISHA CHECKOUT VERIFICATION ---');

// 1. Initial Load & Seed preview cart
await page.goto('http://127.0.0.1:8091/checkout.html', { waitUntil: 'networkidle' });

// 2. Seed preview cart
await page.evaluate(() => {
  localStorage.setItem('urban-preview-cart', JSON.stringify([
    { id: 'studio-black', qty: 1 },
    { id: 'phunnel-bowl', qty: 1 },
    { id: 'coconut-charcoal', qty: 2 }
  ]));
  localStorage.setItem('urban-preview-wishlist', JSON.stringify([]));
});

await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);

// 3. Verify Order Summary (Desktop aside)
// 1*9499 + 1*1299 + 2*135 = 11,068, 4 items
assert.equal(await page.locator('#summary-products-list .summary-product-row').count(), 3, 'Desktop summary should render 3 products');
assert.match(await page.locator('#summary-qty').textContent(), /4 items/, 'Summary quantity should show 4 items');
assert.match(await page.locator('#summary-subtotal').textContent(), /11,068/, 'Subtotal should be 11,068');
assert.match(await page.locator('#summary-total').textContent(), /11,068/, 'Payable total should be 11,068');
console.log('✓ Order summary populated correctly (₹11,068 for 4 items)');

// 4. Form Validation - Attempt submit with empty fields
await page.click('#submit-checkout');
await page.waitForTimeout(200);

// Check that invalid fields show errors and first invalid is focused
const emailFocused = await page.evaluate(() => document.activeElement.id === 'contact-email');
assert.equal(emailFocused, true, 'First invalid field (contact-email) should be focused');
assert.equal(await page.locator('#error-email').isVisible(), true, 'Email error should be visible');
assert.equal(await page.locator('#error-phone').isVisible(), true, 'Phone error should be visible');
assert.equal(await page.locator('#error-name').isVisible(), true, 'Name error should be visible');
assert.equal(await page.locator('#error-address1').isVisible(), true, 'Address error should be visible');
assert.equal(await page.locator('#error-city').isVisible(), true, 'City error should be visible');
assert.equal(await page.locator('#error-state').isVisible(), true, 'State error should be visible');
assert.equal(await page.locator('#error-pincode').isVisible(), true, 'PIN error should be visible');
assert.equal(await page.locator('#error-confirm_age').isVisible(), true, 'Age confirmation error should be visible');
assert.equal(await page.locator('#error-confirm_terms').isVisible(), true, 'Terms confirmation error should be visible');
console.log('✓ Form validation catches missing required fields and focuses first invalid field');

// 5. Test Invalid phone and pincode formatting
await page.fill('#contact-phone', '12345');
await page.fill('#delivery-pincode', '999');
await page.click('#submit-checkout');
await page.waitForTimeout(200);
assert.match(await page.locator('#error-phone').textContent(), /10-digit Indian mobile number/, 'Phone error for invalid format');
assert.match(await page.locator('#error-pincode').textContent(), /6-digit PIN code/, 'PIN error for invalid format');
console.log('✓ Format validation for Indian mobile (10-digit) and PIN code (6-digit) passed');

// 6. Test Billing address toggle
assert.equal(await page.locator('#billing-fields').isVisible(), false, 'Billing fields initially hidden');
await page.click('#billing-same');
await page.waitForTimeout(200);
assert.equal(await page.locator('#billing-fields').isVisible(), true, 'Billing fields revealed when billing-same is unchecked');

// Submitting with revealed billing fields requires them
await page.click('#submit-checkout');
await page.waitForTimeout(200);
assert.equal(await page.locator('#error-billing_name').isVisible(), true, 'Billing name error shown when unchecked');

// Re-check billing-same hides fields and clears their errors
await page.click('#billing-same');
await page.waitForTimeout(200);
assert.equal(await page.locator('#billing-fields').isVisible(), false, 'Billing fields hidden again');
assert.equal(await page.locator('#error-billing_name').isVisible(), false, 'Billing errors cleared when re-checked');
console.log('✓ Billing address toggle handles visibility and error clearance correctly');

// 7. Complete valid form submission
await page.fill('#contact-email', 'alex.curator@example.com');
await page.fill('#contact-phone', '9876543210');
await page.fill('#delivery-name', 'Alex Mercer');
await page.fill('#delivery-address1', '42 Lodhi Estate, Near Khan Market');
await page.fill('#delivery-address2', 'Penthouse B');
await page.fill('#delivery-city', 'New Delhi');
await page.selectOption('#delivery-state', 'Delhi');
await page.fill('#delivery-pincode', '110003');
await page.check('#confirm-age');
await page.check('#confirm-terms');

await page.click('#submit-checkout');
await page.waitForTimeout(400);

// Verify confirmation dialog
const completeDialog = page.locator('#checkout-complete-dialog');
assert.equal(await completeDialog.evaluate(d => d.open), true, 'Confirmation dialog should open on valid submit');
assert.match(await page.locator('#complete-dialog-title').textContent(), /complete/, 'Dialog title confirmation');

// Check that cart is NOT cleared and NO personal data persisted
const cartAfter = await page.evaluate(() => JSON.parse(localStorage.getItem('urban-preview-cart')));
assert.equal(cartAfter.length, 3, 'Cart must remain intact after preview checkout');
const storageKeys = await page.evaluate(() => Object.keys(localStorage));
assert.equal(storageKeys.some(k => k.includes('user') || k.includes('order') || k.includes('address')), false, 'No personal/order data saved in localStorage');

await page.screenshot({ path: 'review/checkout-complete-dialog.png' });
await page.click('#checkout-complete-dialog .close-dialog');
await page.waitForTimeout(200);
console.log('✓ Valid submission triggers confirmation dialog without data storage or cart destruction');

// 8. Test policy dialog
await page.click('[data-open-policy="terms"]');
await page.waitForTimeout(200);
assert.equal(await page.locator('#policy-dialog').evaluate(d => d.open), true, 'Policy dialog opens');
await page.click('#policy-dialog .close-dialog');
await page.waitForTimeout(200);
console.log('✓ Policy modal opens and closes correctly');

// 9. Viewport checks & Screenshots
for (const width of [1440, 1024, 768, 390]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(300);

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  assert.equal(scrollWidth, width, `Width ${width} should have no horizontal overflow`);
  await page.screenshot({ path: `review/checkout-${width}.png` });

  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  axe.push({ width, violations: report.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })) });
}
console.log('✓ Multi-viewport layout verified without horizontal overflow');

// 10. Mobile summary accordion test at 390px
await page.setViewportSize({ width: 390, height: 844 });
const mobileAccordion = page.locator('.mobile-summary-accordion');
assert.equal(await mobileAccordion.isVisible(), true, 'Mobile order summary accordion should be visible at 390px');
assert.match(await page.locator('#mobile-summary-total').textContent(), /11,068/, 'Mobile accordion header displays subtotal');
await page.click('.mobile-summary-trigger');
await page.waitForTimeout(200);
assert.equal(await mobileAccordion.evaluate(el => el.open), true, 'Mobile summary accordion expands');
assert.equal(await page.locator('#mobile-summary-products-list .summary-product-row').count(), 3, 'Mobile summary list renders 3 products');

// Verify input font size >= 16px to prevent iOS auto-zoom
const inputFontSize = await page.evaluate(() => {
  const el = document.getElementById('contact-email');
  return window.getComputedStyle(el).fontSize;
});
assert(parseFloat(inputFontSize) >= 16, `Input font size must be >= 16px, got ${inputFontSize}`);
console.log(`✓ Mobile layout verified: expandable accordion works, input font size is ${inputFontSize}`);

// 11. Empty Cart State
await page.evaluate(() => {
  localStorage.setItem('urban-preview-cart', JSON.stringify([]));
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(400);

assert.equal(await page.locator('#checkout-empty').isVisible(), true, 'Empty state should be visible');
assert.equal(await page.locator('#checkout-layout').isVisible(), false, 'Checkout form layout should be hidden');
await page.screenshot({ path: 'review/checkout-empty-1440.png' });
console.log('✓ Empty cart state verified: form hidden, empty state shown');

// 12. Cart to Checkout navigation verification
await page.evaluate(() => {
  localStorage.setItem('urban-preview-cart', JSON.stringify([{ id: 'studio-black', qty: 1 }]));
  localStorage.setItem('urban-preview-age', 'accepted');
});
await page.goto('http://127.0.0.1:8091/cart.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await page.click('#checkout-btn');
await page.waitForTimeout(400);
assert.match(page.url(), /checkout\.html/, 'Cart checkout button navigates to checkout.html');

// From checkout, back to bag
await page.click('.checkout-back-link');
await page.waitForTimeout(400);
assert.match(page.url(), /cart\.html/, 'Checkout back-to-bag button navigates to cart.html');
console.log('✓ Seamless navigation between Cart and Checkout confirmed');

// Output summary
const totalViolations = axe.reduce((sum, a) => sum + a.violations.length, 0);
await fs.writeFile('review/checkout-results.json', JSON.stringify({
  errors,
  failed,
  totalViolations,
  axe
}, null, 2));

console.log('--- TEST RUN COMPLETE ---');
console.log(`Console Errors: ${errors.length}`);
console.log(`Failed Network Requests: ${failed.length}`);
console.log(`Axe Violations: ${totalViolations}`);

await browser.close();
assert.equal(errors.length, 0, 'Should have zero console errors');
assert.equal(failed.length, 0, 'Should have zero failed requests');
assert.equal(totalViolations, 0, 'Should have zero Axe violations');
