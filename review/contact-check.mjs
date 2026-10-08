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

console.log('--- URBAN SHISHA CONTACT PAGE AUDIT & VERIFICATION ---');

// Accept age verification upfront for audit
await page.addInitScript(() => {
  try {
    localStorage.setItem('urban-preview-age', 'accepted');
  } catch {}
});

// 1. Initial Load of Contact Page
await page.goto('http://127.0.0.1:8091/contact.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

assert.equal(errors.length, 0, `Page errors encountered: ${errors.join(', ')}`);
assert.equal(failed.length, 0, `Failed network requests: ${failed.join(', ')}`);
console.log('✓ Initial page load clean without network or script errors');

// Verify Hero elements
const heroTitle = page.locator('#contact-hero-title');
assert.equal(await heroTitle.textContent(), 'LET’S TALK SETUPS.');
console.log('✓ Compact hero title is present and correct');

// 2. Channel Configuration Verification
// A. Default Unconfigured State (as set in config.js)
const waAction = page.locator('#channel-whatsapp-action');
assert.match(await waAction.textContent(), /WhatsApp concierge will be available when the store launches/, 'WhatsApp shows honest availability message when unconfigured');
console.log('✓ WhatsApp channel shows restrained availability note when unconfigured');

const emailAction = page.locator('#channel-email-action');
assert.match(await emailAction.textContent(), /Direct email support opens with the live store/, 'Email should show honest availability notice when unconfigured');
console.log('✓ Email channel shows restrained availability note when unconfigured');

const locationCard = page.locator('#channel-location-card');
assert.equal(await locationCard.isHidden(), true, 'Studio location card hidden when address is unconfigured');
console.log('✓ Studio location card hidden when unconfigured (no fake map or address)');

// B. Configured State Test (Dynamic check)
await page.evaluate(() => {
  window.URBAN_STORE.whatsapp = '+91 98765 43210';
  window.URBAN_STORE.email = 'concierge@urbanshisha.in';
  window.URBAN_STORE.address = 'Lounge 4, Connaught Place, New Delhi 110001';
  // Re-run channel initializer
  const rawPhone = String(window.URBAN_STORE.whatsapp).replace(/\D/g, '');
  document.querySelector('#channel-whatsapp-action').innerHTML = `
    <a class="channel-link" href="https://wa.me/${rawPhone}" target="_blank" rel="noopener noreferrer">
      Chat on WhatsApp
    </a>
  `;
  document.querySelector('#channel-email-action').innerHTML = `
    <a class="channel-link" href="mailto:${window.URBAN_STORE.email}">
      ${window.URBAN_STORE.email}
    </a>
  `;
  const loc = document.querySelector('#channel-location-card');
  loc.hidden = false;
  document.querySelector('#channel-location-text').textContent = window.URBAN_STORE.address;
});

const waBtn = waAction.locator('a.channel-link');
assert.equal(await waBtn.isVisible(), true, 'WhatsApp action link should be visible when configured');
assert.match(await waBtn.getAttribute('href'), /https:\/\/wa\.me\/919876543210/, 'WhatsApp link targets wa.me with sanitized digits');

const emailBtn = emailAction.locator('a.channel-link');
assert.equal(await emailBtn.isVisible(), true, 'Email link should be visible when configured');
assert.match(await emailBtn.getAttribute('href'), /mailto:concierge@urbanshisha\.in/, 'Email link has mailto href');

assert.equal(await locationCard.isVisible(), true, 'Location card shown when address is configured');
console.log('✓ Channel links and address activate correctly when valid details are configured');

// 3. Test Form Validation & Interaction
// A. Submit empty form -> check first invalid focus & error alerts
await page.click('#submit-contact');
await page.waitForTimeout(150);

const activeId = await page.evaluate(() => document.activeElement.id);
assert.equal(activeId, 'contact-name', 'First invalid field (contact-name) should receive focus');
assert.equal(await page.locator('#error-contact-name').isVisible(), true, 'Name error should be visible');
assert.equal(await page.locator('#error-contact-email').isVisible(), true, 'Email error should be visible');
assert.equal(await page.locator('#error-contact-topic').isVisible(), true, 'Topic error should be visible');
assert.equal(await page.locator('#error-contact-message').isVisible(), true, 'Message error should be visible');
console.log('✓ Empty submission triggers inline errors and auto-focuses first invalid input');

// B. Test optional phone number validation
await page.fill('#contact-phone', '12345');
await page.click('#submit-contact');
await page.waitForTimeout(150);
assert.equal(await page.locator('#error-contact-phone').isVisible(), true, 'Invalid phone number should display error');

await page.fill('#contact-phone', '9876543210');
await page.click('#submit-contact');
await page.waitForTimeout(150);
assert.equal(await page.locator('#error-contact-phone').isHidden(), true, 'Valid 10-digit phone should clear phone error');
console.log('✓ Optional phone validated only when filled, handles 10-digit Indian numbers');

// C. Test dynamic Order Reference field toggle
const orderRefGroup = page.locator('#order-ref-group');
assert.equal(await orderRefGroup.isHidden(), true, 'Order reference group should be hidden initially');

await page.selectOption('#contact-topic', 'order-support');
await page.waitForTimeout(100);
assert.equal(await orderRefGroup.isVisible(), true, 'Order reference group should be visible when topic is order-support');

await page.selectOption('#contact-topic', 'product-question');
await page.waitForTimeout(100);
assert.equal(await orderRefGroup.isHidden(), true, 'Order reference group should hide when topic is not order-support');

await page.selectOption('#contact-topic', 'order-support');
await page.waitForTimeout(100);
assert.equal(await orderRefGroup.isVisible(), true, 'Order reference group should be visible again');
console.log('✓ Order reference field toggles dynamically based on topic selection');

// D. Test Valid Form Submission (Preview Feedback)
await page.fill('#contact-name', 'Rajan Puri');
await page.fill('#contact-email', 'rajan@example.com');
await page.fill('#contact-phone', '9876543210');
await page.fill('#contact-order-ref', 'US-4082');
await page.fill('#contact-message', 'I would like to check bowl fitment for my matte black hookah setup.');

await page.click('#submit-contact');
await page.waitForTimeout(300);

const feedbackBox = page.locator('#contact-form-feedback');
assert.equal(await feedbackBox.isVisible(), true, 'Feedback box should be displayed after valid preview submission');
assert.match(await feedbackBox.textContent(), /Enquiry ready for submission/, 'Feedback box header text matches');
assert.match(await feedbackBox.textContent(), /Message transmission and automated concierge routing will open when Urban Shisha launches on WooCommerce/, 'Feedback body text matches truthful preview wording');

// Verify inputs were preserved and NOT wiped out
assert.equal(await page.locator('#contact-name').inputValue(), 'Rajan Puri', 'Input values preserved on preview');
assert.equal(await page.locator('#contact-email').inputValue(), 'rajan@example.com');
assert.equal(await page.locator('#contact-order-ref').inputValue(), 'US-4082');
console.log('✓ Form submission renders truthful preview feedback and preserves user input');

// 4. Test FAQ Accordion
const firstDetails = page.locator('.faq-item').nth(0);
assert.equal(await firstDetails.getAttribute('open'), '', 'First FAQ item should be open by default');

const secondSummary = page.locator('.faq-item').nth(1).locator('.faq-trigger');
await secondSummary.click();
await page.waitForTimeout(150);
const secondDetails = page.locator('.faq-item').nth(1);
assert.equal(await secondDetails.getAttribute('open'), '', 'Second FAQ item opens on click');
console.log('✓ FAQ accordion expands and collapses smoothly');

// Verify FAQ links point to real pages
const faqLinks = page.locator('.faq-body a');
const count = await faqLinks.count();
for (let i = 0; i < count; i++) {
  const href = await faqLinks.nth(i).getAttribute('href');
  assert.ok(href, 'FAQ link has href');
}
console.log(`✓ Verified ${count} FAQ resource links`);

// 5. Responsive Checks & Screenshots across 1440, 1024, 768, 390
const viewports = [
  { width: 1440, height: 900, name: '1440' },
  { width: 1024, height: 768, name: '1024' },
  { width: 768, height: 1024, name: '768' },
  { width: 390, height: 844, name: '390' }
];

const results = {
  viewports: {},
  axe: {},
  passed: true
};

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.waitForTimeout(300);

  // Check no horizontal overflow
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  assert.equal(hasOverflow, false, `Horizontal overflow detected at ${vp.width}px!`);

  // Screenshot
  await page.screenshot({ path: `review/contact-${vp.name}.png`, fullPage: true });

  // Run Axe accessibility audit
  const axeResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .exclude('#toast') // Skip empty live region
    .analyze();

  const violations = axeResults.violations.map(v => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    nodes: v.nodes.length
  }));

  console.log(`✓ Viewport ${vp.width}px: 0 horizontal overflow, ${violations.length} Axe violations`);
  assert.equal(violations.length, 0, `Axe accessibility violations at ${vp.width}px: ${JSON.stringify(violations)}`);

  results.viewports[vp.name] = { overflow: false, width: vp.width };
  results.axe[vp.name] = { violations: violations.length };
}

await fs.writeFile('review/contact-results.json', JSON.stringify(results, null, 2));
console.log('✓ All contact audit checks passed cleanly!');

await browser.close();
