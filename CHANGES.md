# V2 change list

Original: `/Users/rajan/Downloads/urban-shisha-homepage`  
Duplicate: `/Users/rajan/Downloads/urban-shisha-homepage-v2`

## Changed / added files

| File | Purpose |
| --- | --- |
| `index.html` | Enhanced hero, mood scenes, rail controls, product spotlight, builder and footer markup; loader/cursor/mobile bar |
| `assets/next-edit.css` | New visual layer, responsive layouts, contrast and reduced-motion styles |
| `assets/js/next-motion.js` | GSAP entrance, parallax, card motion, section reveals, ribbon loop, cursor and drag |
| `assets/js/app.js` | Quick-add confirmation, bag feedback, builder images, total count-up and personalisation meter |
| `assets/fonts.css` | WOFF2 font declarations |
| `assets/fonts/urban-font-1.woff2` through `urban-font-10.woff2` | WOFF2 encoding of existing font files |
| `assets/images/product-cutout-0.webp` through `product-cutout-11.webp` | Compressed existing product cutouts with unchanged alpha transparency |
| `assets/site.css` | Generated combined CSS; rebuild after source CSS edits |
| `scripts/build.mjs` | CSS bundle generation and distributable output |
| `scripts/serve.py` | Separate port 8091 and compressed preview responses |
| `package.json` | Separate project name, version and syntax checks |
| `README.md`, `ASSET-NOTES.md`, `CHANGES.md` | Preview, validation and asset documentation |
| `review/` | Browser verification scripts, screenshots and Lighthouse / accessibility reports |
| `dist/` | Generated deployable static preview |

## Assets needed

No additional assets are needed to preview V2. It reuses the existing transparent product cutouts, fonts and local GSAP. Scene decorations and smoke are native CSS/SVG.

Before a live shop launch, provide approved merchant product photographs and verified catalog details, pricing/stock, compatibility rules, contact channels and real policy copy. Replace the labelled demo weekly count with a verified value or remove it.

## Validation

- Interaction checks: passed at 1440 / 1024 / 768 / 390.
- Accessibility: zero automated WCAG A/AA violations at all four widths.
- Reduced motion and blocked GSAP fallback: passed.
- Cold mobile homepage Lighthouse: performance 89, accessibility 100, CLS 0.
- Cold mobile first visit / age gate: performance 88, accessibility 100, CLS 0.
- Original key source hashes: unchanged; recorded in `review/original-hashes.json`.

## Product spotlight revision

Replaced FORM MEETS FUNCTION with a large featured hookah on the left and four selectable hookah cards in a 2×2 grid on the right. Next/previous loops through all four; selection updates the photo, name, price, product dialog and add-to-bag action together. Mobile stacks the featured panel above the two-column selector. GSAP swaps honour reduced motion.

## Shop + brand revision

- `shop.html`: complete matching Shop page, shared header/footer, responsive filter dialog and commerce dialogs.
- `assets/shop.css`: desktop sidebar, responsive product grid, Shop banner, mobile filters and homepage brand section.
- `assets/js/shop.js`: combined filters, query persistence, sorting/search, active chips, preview bag/wishlist, age gate and GSAP feedback.
- `assets/js/catalog.js`: catalog and photo framing shared by both pages; hardware brand fields added without changing products/prices.
- `index.html`, `assets/js/app.js`, `assets/js/next-motion.js`: local brand section and shared catalog integration.
- `assets/images/brands/`: six user-supplied logo files downloaded locally.
- `scripts/build.mjs`, `scripts/verify.mjs`, `package.json`: both pages verified and included in static build.
- `review/shop-check.mjs`, `review/shop-results.json`, `review/brand-image-sources.json`, Shop screenshots: verification and provenance.

No new product inventory is assumed for the supplied flavour-brand logos. Add verified merchant catalog data during WooCommerce conversion.

## Single-product revision

- `product.html`, `assets/product.css`, `assets/js/product.js`: responsive Brando product page and functional gallery / zoom / buying controls.
- `assets/js/catalog.js`: Brando, 250g coconut coal and VG hose reference prices updated consistently across the three pages.
- `assets/js/app.js`, `assets/js/shop.js`: Brando opens its full product page.
- `scripts/build.mjs`, `scripts/verify.mjs`, `package.json`: all three pages included and verified.
- `assets/images/brando/`: three original reference photos, saved locally unchanged.
- `assets/images/coconut-charcoal/`, `silicone-hose/`, `sultan-base/`: additional supplied reference photos saved for catalog work.
- `review/product-check.mjs`, `product-results.json`, screenshots and source JSON / image manifests: product-page verification and provenance.

The Sultan replacement base has not been treated as Brando-compatible or added as a made-up bundle. No retailer free gifts, reviews, delivery promises or stock claims were adopted.

## Cart page revision

- `cart.html`, `assets/cart.css`, `assets/js/cart.js`: dedicated full Cart page with matching desktop two-column and mobile stacked layouts, live quantity adjustments (1–99), line totals, subtotal/total calculations, wishlist synchronization, and honest checkout preview modal.
- `assets/js/app.js`, `shop.js`, `product.js`: added "View full bag" links inside the quick shopping bag drawer (`#shop-dialog`) linking directly to `cart.html` without replacing the convenient quick drawer.
- `scripts/build.mjs`, `scripts/verify.mjs`, `package.json`: added `cart.css` to stylesheet bundle order, `cart.html` to static distribution copy, `cart.js` to syntax linting, and structural integrity/anchor checks.
- `review/cart-check.mjs`, `cart-results.json`, screenshots (`cart-1440.png`, `cart-1024.png`, `cart-768.png`, `cart-390.png`, `cart-empty-1440.png`, `cart-empty-390.png`): automated Playwright and Axe testing confirming zero errors, zero accessibility violations, cross-page persistence, and no horizontal overflow across all breakpoints.

## Checkout page revision

- `checkout.html`, `assets/checkout.css`, `assets/js/checkout.js`: dedicated single-page checkout preview matching the approved V2 design system, ready for WooCommerce conversion.
- **Simplified checkout header**: logo home link, "Back to bag" link returning to `cart.html`, 18+ requirement badge, and compact footer with Made by Mates Creation credit.
- **Desktop 2-column layout (~60% form / ~40% sticky summary)**:
  - `01 / Contact`: email and 10-digit Indian mobile number (`+91` prefix) with guest checkout indicator.
  - `02 / Delivery address`: full name, street address line 1 & 2, city, Indian State/UT dropdown, 6-digit PIN code, country India (readonly).
  - `03 / Billing address`: "Same as delivery address" toggle; reveals separate billing inputs when unchecked, resets validation cleanly when checked.
  - `04 / Delivery details`: honest preview disclaimer explaining courier availability and shipping charges will be confirmed upon live launch.
  - `05 / Payment method`: honest preview disclaimer explaining payment options (UPI, cards, net banking) will open with the live store without fake card collection or deceptive logos.
  - `06 / Required confirmations`: unchecked 18+ age checkbox, unchecked terms acceptance linking to policy modal, and separate optional marketing consent.
- **Accessible form validation**: native constraints + inline error messages (`role="alert"`), preserves entered values on error, auto-focuses first invalid field, validates strict 10-digit Indian mobile and 6-digit PIN formats.
- **Order summary**: live breakdown of items, transparent product framing, selected variant metadata, quantity, line total, subtotal, shipping labeled "Confirmed at live checkout", payable total explicitly marked "Pending shipping and any applicable taxes."
- **Preview checkout action**: passing form submission opens `#checkout-complete-dialog` (*"Your checkout details are complete. Orders and payments are not enabled in this preview."*); leaves cart intact without generating fake order numbers, simulating payments, or persisting personal details in localStorage.
- **Mobile layout**: single-column layout with expandable `<details class="mobile-summary-accordion">` near the top, >=16px input font size preventing iOS auto-zoom, and natural document-flow submit CTA.
- **Navigation & Drawer integration**: `cart.html` checkout CTA connects directly to `checkout.html`; drawer drawers across `index.html`, `shop.html`, and `product.html` include direct Checkout links.
- **Build & Verification**:
  - `scripts/build.mjs`: added `checkout.css` to bundle order and `checkout.html` to `dist/` copy.
  - `scripts/verify.mjs`: added duplicate ID, local asset, and component checks for `checkout.html`.
  - `package.json`: added `checkout.js` to `npm run lint`.
  - `review/checkout-check.mjs`, `review/checkout-results.json`: automated test suite with Playwright and AxeBuilder verifying populated & empty carts, billing toggle, invalid & valid submissions, cross-page navigation, and zero accessibility violations across 1440px, 1024px, 768px, and 390px viewports.


