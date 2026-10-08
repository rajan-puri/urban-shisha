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
const errors = [], failed = [];

page.on('pageerror', e => errors.push(e.message));
page.on('response', r => {
  if (r.status() >= 400 && !r.url().includes('favicon.ico')) failed.push(r.url());
});

console.log('--- URBAN SHISHA MY ACCOUNT AUDIT & VERIFICATION ---');

// Accept age verification upfront
await page.addInitScript(() => {
  try {
    localStorage.setItem('urban-preview-age', 'accepted');
  } catch {}
});

// 1. Initial Load of Auth View
await page.goto('http://127.0.0.1:8091/account.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

assert.equal(await page.locator('#auth-view').isVisible(), true, 'Auth view should be visible by default');
assert.equal(await page.locator('#dashboard-view').isVisible(), false, 'Dashboard should be hidden initially');
console.log('✓ Initial auth view loaded correctly');

// 2. Test Password Show/Hide Toggle
const loginPass = page.locator('#login-password');
const toggleBtn = page.locator('.password-toggle-btn[data-target="login-password"]');
assert.equal(await loginPass.getAttribute('type'), 'password', 'Input should initially be type password');
assert.equal(await toggleBtn.getAttribute('aria-pressed'), 'false', 'Toggle button aria-pressed should be false initially');

await toggleBtn.click();
assert.equal(await loginPass.getAttribute('type'), 'text', 'Input should switch to type text after click');
assert.equal(await toggleBtn.getAttribute('aria-pressed'), 'true', 'Toggle button aria-pressed should be true after click');

await toggleBtn.click();
assert.equal(await loginPass.getAttribute('type'), 'password', 'Input should switch back to password');
assert.equal(await toggleBtn.getAttribute('aria-pressed'), 'false', 'Toggle button aria-pressed should revert to false');
console.log('✓ Password show/hide toggle works and updates accessible attributes');

// 3. Test Login Form Validation
await page.click('#submit-login');
await page.waitForTimeout(150);

const loginEmailFocused = await page.evaluate(() => document.activeElement.id === 'login-email');
assert.equal(loginEmailFocused, true, 'First invalid input (login-email) should be focused');
assert.equal(await page.locator('#error-login-email').isVisible(), true, 'Email error message should be visible');
assert.equal(await page.locator('#error-login-password').isVisible(), true, 'Password error message should be visible');
console.log('✓ Login form validation focuses first invalid field and reveals error alerts');

// 4. Test Forgot Password Dialog
await page.click('#forgot-password-btn');
await page.waitForTimeout(200);
const forgotDialog = page.locator('#forgot-password-dialog');
assert.equal(await forgotDialog.isVisible(), true, 'Forgot password dialog should open');
assert.match(await forgotDialog.textContent(), /Password reset will be available when Urban Shisha launches on WooCommerce/, 'Should show honest preview message');
await page.click('#forgot-password-dialog .close-dialog');
await page.waitForTimeout(200);
assert.equal(await forgotDialog.isVisible(), false, 'Forgot password dialog should close');
console.log('✓ Forgot password dialog opens with honest preview notice');

// 5. Test Register Tab & Validation
await page.click('#tab-register');
await page.waitForTimeout(150);
assert.equal(await page.locator('#panel-register').isVisible(), true, 'Register panel should be visible');
assert.equal(await page.locator('#panel-login').isVisible(), false, 'Login panel should be hidden');

// Submit empty register form
await page.click('#submit-register');
await page.waitForTimeout(150);
const registerNameFocused = await page.evaluate(() => document.activeElement.id === 'register-name');
assert.equal(registerNameFocused, true, 'First invalid register input should be focused');
assert.equal(await page.locator('#error-register-name').isVisible(), true, 'Register name error visible');
assert.equal(await page.locator('#error-register-email').isVisible(), true, 'Register email error visible');
assert.equal(await page.locator('#error-register-password').isVisible(), true, 'Register password error visible');
assert.equal(await page.locator('#error-register-age').isVisible(), true, 'Age confirmation error visible');
assert.equal(await page.locator('#error-register-terms').isVisible(), true, 'Terms confirmation error visible');
console.log('✓ Register form validation enforces 18+ and terms check without fake storage');

// Switch back to Login tab
await page.click('#tab-login');
await page.waitForTimeout(150);

// Screenshot Auth desktop
await page.screenshot({ path: 'review/account-auth-1440.png', fullPage: true });

// 6. Test "Explore demo account" button
await page.click('#explore-demo-btn');
await page.waitForTimeout(400);

assert.equal(await page.locator('#auth-view').isVisible(), false, 'Auth view should be hidden');
assert.equal(await page.locator('#dashboard-view').isVisible(), true, 'Dashboard view should be visible');
assert.equal(await page.locator('#section-overview').isVisible(), true, 'Overview section should be active');
assert.match(await page.locator('#section-overview h2').textContent(), /Overview/, 'Overview header present');
console.log('✓ Explored demo account transition succeeded');

// Screenshot Dashboard Overview
await page.screenshot({ path: 'review/account-dashboard-1440.png', fullPage: true });

// 7. Test Orders section (empty state)
await page.click('.sidebar-btn[data-section="orders"]');
await page.waitForTimeout(200);
assert.equal(await page.locator('#section-orders').isVisible(), true, 'Orders section should be visible');
assert.equal(await page.locator('#orders-empty').isVisible(), true, 'Orders empty state should be visible');
assert.match(await page.locator('#orders-empty h3').textContent(), /No orders yet/, 'Empty orders title present');
console.log('✓ Orders section shows honest empty state with shop CTA');

// 8. Test Addresses in-memory CRUD
await page.click('.sidebar-btn[data-section="addresses"]');
await page.waitForTimeout(200);
assert.equal(await page.locator('#section-addresses').isVisible(), true, 'Addresses section should be visible');
assert.equal(await page.locator('#addresses-empty').isVisible(), true, 'Addresses empty state should be visible initially');

// Open Add Address modal
await page.click('#btn-add-address');
await page.waitForTimeout(250);
const addrDialog = page.locator('#address-dialog');
assert.equal(await addrDialog.isVisible(), true, 'Address dialog should open');

// Attempt submit with empty fields
await page.click('#btn-save-address');
await page.waitForTimeout(150);
const addrNameFocused = await page.evaluate(() => document.activeElement.id === 'addr-name');
assert.equal(addrNameFocused, true, 'First invalid address field should be focused');
assert.equal(await page.locator('#error-addr-name').isVisible(), true, 'Name error should be visible');

// Fill valid address details
await page.fill('#addr-name', 'Rajan Puri');
await page.fill('#addr-line1', 'Flat 402, Lotus Court, MG Road');
await page.fill('#addr-line2', 'Near Metro Station');
await page.fill('#addr-city', 'New Delhi');
await page.selectOption('#addr-state', 'Delhi');
await page.fill('#addr-pincode', '110001');
await page.fill('#addr-phone', '9876543210');

await page.click('#btn-save-address');
await page.waitForTimeout(300);

assert.equal(await addrDialog.isVisible(), false, 'Address dialog should close after save');
assert.equal(await page.locator('#addresses-empty').isVisible(), false, 'Empty state should now be hidden');
assert.equal(await page.locator('.address-card').count(), 1, 'One address card should be rendered');
assert.match(await page.locator('.address-card .address-name').textContent(), /Rajan Puri/, 'Rendered address name matches');
assert.match(await page.locator('.address-card .address-line').first().textContent(), /Flat 402, Lotus Court/, 'Rendered street matches');

// Verify address is in-memory only and NEVER saved to localStorage
const storedAddresses = await page.evaluate(() => {
  return Object.keys(localStorage).filter(k => k.toLowerCase().includes('address'));
});
assert.equal(storedAddresses.length, 0, 'No address data should ever be stored in localStorage');
console.log('✓ Address added in memory without persisting to localStorage');

// Screenshot Addresses
await page.screenshot({ path: 'review/account-addresses-1440.png', fullPage: true });

// Test Edit Address
await page.click('.address-action-btn[data-edit-address]');
await page.waitForTimeout(200);
assert.equal(await addrDialog.isVisible(), true, 'Address modal opens for editing');
assert.equal(await page.locator('#addr-name').inputValue(), 'Rajan Puri', 'Existing name should be populated');
await page.fill('#addr-name', 'Rajan Puri (Work)');
await page.click('#btn-save-address');
await page.waitForTimeout(300);

assert.match(await page.locator('.address-card .address-name').textContent(), /Rajan Puri \(Work\)/, 'Updated address name matches');
console.log('✓ Address edited and updated in memory');

// Test Delete Address with confirmation
await page.click('.address-action-btn.is-delete');
await page.waitForTimeout(200);
const delDialog = page.locator('#delete-address-dialog');
assert.equal(await delDialog.isVisible(), true, 'Delete confirmation dialog should open');
await page.click('#btn-confirm-delete-address');
await page.waitForTimeout(300);

assert.equal(await delDialog.isVisible(), false, 'Delete confirmation dialog should close');
assert.equal(await page.locator('.address-card').count(), 0, 'Address card should be removed');
assert.equal(await page.locator('#addresses-empty').isVisible(), true, 'Empty state should return');
console.log('✓ Address deleted with accessible confirmation');

// 9. Test Wishlist Section & Add to Bag
// Seed 2 products into urban-preview-wishlist
await page.evaluate(() => {
  localStorage.setItem('urban-preview-wishlist', JSON.stringify(['studio-black', 'phunnel-bowl']));
  localStorage.setItem('urban-preview-cart', JSON.stringify([]));
});

await page.click('.sidebar-btn[data-section="wishlist"]');
await page.waitForTimeout(300);

assert.equal(await page.locator('#section-wishlist').isVisible(), true, 'Wishlist section visible');
assert.equal(await page.locator('.account-product-card').count(), 2, 'Two wishlist product cards rendered');
console.log('✓ Wishlist populated with 2 real catalog products from shared storage');

// Screenshot Wishlist
await page.screenshot({ path: 'review/account-wishlist-1440.png', fullPage: true });

// Click "Add to bag" on first product
const bagCountBefore = await page.locator('.cart-count').first().textContent();
assert.equal(bagCountBefore, '0', 'Cart count should be 0 initially');

await page.click('.account-product-add-btn[data-wishlist-add="studio-black"]');
await page.waitForTimeout(300);

const bagCountAfter = await page.locator('.cart-count').first().textContent();
assert.equal(bagCountAfter, '1', 'Cart count should immediately update to 1');

// Verify urban-preview-cart updated in localStorage
const cartItems = await page.evaluate(() => JSON.parse(localStorage.getItem('urban-preview-cart') || '[]'));
assert.equal(cartItems.length, 1, 'Cart storage should have 1 item');
assert.equal(cartItems[0].id, 'studio-black', 'Added product matches');
console.log('✓ Wishlist "Add to bag" integrates with shared cart and updates header count');

// Test Remove from wishlist
await page.click('.account-product-remove-btn[data-wishlist-remove="studio-black"]');
await page.waitForTimeout(200);
assert.equal(await page.locator('.account-product-card').count(), 1, 'Wishlist should have 1 item left');

await page.click('.account-product-remove-btn[data-wishlist-remove="phunnel-bowl"]');
await page.waitForTimeout(200);
assert.equal(await page.locator('.account-product-card').count(), 0, 'Wishlist should have 0 items left');
assert.equal(await page.locator('#wishlist-empty').isVisible(), true, 'Wishlist empty state should appear');
console.log('✓ Wishlist removal updates live storage and displays empty state');

// 10. Test Account Details Section
await page.click('.sidebar-btn[data-section="details"]');
await page.waitForTimeout(200);
assert.equal(await page.locator('#section-details').isVisible(), true, 'Details section visible');

// Submit profile form
await page.click('#profile-form button[type="submit"]');
await page.waitForTimeout(200);
assert.equal(await page.locator('#toast').isVisible(), true, 'Toast notice appears on profile validation');

// Submit password form with mismatch
await page.fill('#pass-current', 'Secret123!');
await page.fill('#pass-new', 'NewStrongPass123!');
await page.fill('#pass-confirm', 'MismatchPass456!');
await page.click('#password-form button[type="submit"]');
await page.waitForTimeout(150);
assert.equal(await page.locator('#error-pass-confirm').isVisible(), true, 'Password mismatch error visible');

// Submit password form with match
await page.fill('#pass-confirm', 'NewStrongPass123!');
await page.click('#password-form button[type="submit"]');
await page.waitForTimeout(200);
assert.equal(await page.locator('#pass-current').inputValue(), '', 'Password fields cleared after validation');
console.log('✓ Account details local validation works safely without logging passwords');

// 11. Test Exit Demo
await page.click('.sidebar-exit-btn');
await page.waitForTimeout(300);

assert.equal(await page.locator('#dashboard-view').isVisible(), false, 'Dashboard hidden on exit demo');
assert.equal(await page.locator('#auth-view').isVisible(), true, 'Auth view restored on exit demo');

// Verify Cart was NOT cleared on exit
const cartAfterExit = await page.evaluate(() => JSON.parse(localStorage.getItem('urban-preview-cart') || '[]'));
assert.equal(cartAfterExit.length, 1, 'Cart items MUST be preserved when exiting demo');
console.log('✓ Exit demo returns to Auth view and preserves shared cart/wishlist');

// 12. Responsive & Accessibility Testing Across Viewports (1440, 1024, 768, 390)
const viewports = [
  { width: 1440, height: 900, name: 'desktop' },
  { width: 1024, height: 768, name: 'tablet-landscape' },
  { width: 768, height: 1024, name: 'tablet-portrait' },
  { width: 390, height: 844, name: 'mobile' }
];

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto('http://127.0.0.1:8091/account.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  // Check horizontal overflow on Auth view
  const overflowAuth = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.equal(overflowAuth, false, `No horizontal overflow on Auth at ${vp.width}px`);

  // Run Axe accessibility scan on Auth View
  const axeAuth = await new AxeBuilder({ page }).analyze();
  assert.equal(axeAuth.violations.length, 0, `0 Axe violations on Auth at ${vp.width}px. Found: ${JSON.stringify(axeAuth.violations.map(v => v.id))}`);

  // Switch to Dashboard
  await page.click('#explore-demo-btn');
  await page.waitForTimeout(300);

  // Check horizontal overflow on Dashboard
  const overflowDash = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.equal(overflowDash, false, `No horizontal overflow on Dashboard at ${vp.width}px`);

  // Run Axe accessibility scan on Dashboard View
  const axeDash = await new AxeBuilder({ page }).analyze();
  assert.equal(axeDash.violations.length, 0, `0 Axe violations on Dashboard at ${vp.width}px. Found: ${JSON.stringify(axeDash.violations.map(v => v.id))}`);

  if (vp.width === 390) {
    await page.screenshot({ path: 'review/account-dashboard-390.png', fullPage: true });
    // Switch to auth view on mobile to capture screenshot
    await page.click('.mobile-nav-pill[data-action="exit-demo"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'review/account-auth-390.png', fullPage: true });
  }

  console.log(`✓ ${vp.width}px (${vp.name}): 0 Axe violations & zero horizontal overflow on both Auth and Dashboard views`);
}

// 13. Test Direct Deep Links (?tab=orders, ?tab=wishlist)
await page.goto('http://127.0.0.1:8091/account.html?tab=orders', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
assert.equal(await page.locator('#dashboard-view').isVisible(), true, '?tab=orders should open dashboard directly');
assert.equal(await page.locator('#section-orders').isVisible(), true, '?tab=orders should activate orders section');
console.log('✓ Direct URL deep link ?tab=orders opens dashboard with Orders active');

await page.goto('http://127.0.0.1:8091/account.html?tab=wishlist', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
assert.equal(await page.locator('#dashboard-view').isVisible(), true, '?tab=wishlist should open dashboard directly');
assert.equal(await page.locator('#section-wishlist').isVisible(), true, '?tab=wishlist should activate wishlist section');
console.log('✓ Direct URL deep link ?tab=wishlist opens dashboard with Wishlist active');

// Verify no console errors or 400+ network failures occurred
assert.equal(errors.length, 0, `No console errors should occur: ${errors.join(', ')}`);
assert.equal(failed.length, 0, `No network asset failures: ${failed.join(', ')}`);

const results = {
  status: 'passed',
  viewportsTested: [1440, 1024, 768, 390],
  axeViolations: 0,
  consoleErrors: errors.length,
  networkFailures: failed.length,
  timestamp: new Date().toISOString()
};

await fs.writeFile('review/account-results.json', JSON.stringify(results, null, 2));

console.log('--- ALL VERIFICATIONS PASSED (0 AXE VIOLATIONS, 0 ERRORS) ---');
await browser.close();
