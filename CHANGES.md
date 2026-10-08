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

## My Account page revision

- `account.html`, `assets/account.css`, `assets/js/account.js`: dedicated My Account page featuring a client preview of user authentication and a fully functional Demo Account Dashboard.
- **Login / Register View (`#auth-view`)**:
  - Spacious 2-column layout (Left: branded editorial panel *“YOUR SPACE. YOUR SETUP.”*, *“ONE PLACE FOR YOUR RIG.”*, value proposition feature list, and prominent *“Explore demo account”* callout; Right: accessible tabbed forms for *Log In* and *Create Account*).
  - Password inputs equipped with accessible show/hide toggle buttons (`aria-label`, `aria-pressed`, dynamic eye/eye-off SVG icons).
  - Login form: email and password inputs with inline validation, first invalid field auto-focus, and *“Forgot password?”* modal showing an honest WooCommerce launch preview notice.
  - Register form: full name, email, 8+ character password, required unchecked 18+ confirmation checkbox, required unchecked terms/privacy acceptance, and separate unselected marketing consent.
  - Honest preview disclaimers: Authentication is not connected; passwords and credentials are never stored, logged, or uploaded; no fake customer records created.
- **Demo Account Dashboard (`#dashboard-view`)**:
  - Desktop: Left navigation sidebar with Overview, Orders, Addresses, Wishlist (with live item count badge), Account Details, and an Exit Demo button.
  - Mobile: Horizontally scrollable segmented nav pills with icons, comfortable touch targets, and zero cramped layout issues.
  - Overview: *“YOUR ACCOUNT. YOUR KIND OF SETUP.”*, direct navigation cards to Orders, Addresses (showing in-memory count), and Wishlist (displaying actual saved product count from `urban-preview-wishlist`). No fake spending totals, artificial VIP levels, or fabricated orders.
  - Orders: Default honest empty state (*“No orders yet.”*) with a direct shop CTA.
  - Addresses: In-memory Add, Edit, and Delete address interactions with `#address-dialog` and `#delete-address-dialog`. Validates required name, street address, city, Indian State/UT dropdown, 6-digit PIN code, and 10-digit mobile number. **Data boundary**: Address records are kept strictly in browser memory for the session and are **never saved to localStorage or sent to a server**.
  - Wishlist: Integrates with shared `urban-preview-wishlist` and `UrbanCatalog.products`. Renders items with transparent SVG cutouts, title, formatted INR price, View link, *“Add to bag”* (updates `urban-preview-cart` and header counts immediately), and *“Remove”* actions. Empty state displays *“YOUR NEXT FAVOURITE IS WAITING.”* when no items are saved.
  - Account details: Local validation for personal profile and password modification (checks matching passwords, resets inputs upon valid submission). Never stores passwords.
  - Exit demo: Returns to Login/Register view while preserving shared cart and wishlist intact.
  - Deep linking: Supports URL query/hash parameters (`?tab=orders`, `?tab=wishlist`, `?tab=addresses`, `?tab=details`, `?demo=1`) to navigate directly to the requested dashboard section.
- **Header & Footer Navigation Integration**:
  - Added user account icon link `<a class="icon-button account-nav" href="account.html">` to header actions.
  - Updated footer Account & policies links across `index.html`, `shop.html`, `product.html`, `cart.html`, and `account.html` to direct `<a href="account.html">` and `<a href="account.html?tab=orders">`.
  - Updated `showInfo` in `assets/js/app.js` to navigate directly to `account.html` and `account.html?tab=orders`.
- **Build & Verification**:
  - `scripts/build.mjs`: added `account.css` to stylesheet bundle order and `account.html` to static distribution copy.
  - `package.json`: added `account.js` to `npm run lint`.
  - `scripts/verify.mjs`: added duplicate ID, relative anchor, and component checks for `account.html`.
  - `review/account-check.mjs`, `review/account-results.json`: automated Playwright and Axe test suite verifying 1440px, 1024px, 768px, and 390px viewports with zero horizontal overflow, 0 Axe violations, 0 console errors, and 0 network failures.

## Contact page revision

- `contact.html`, `assets/contact.css`, `assets/js/contact.js`: dedicated responsive Contact page matching the approved V2 design system, ready for custom WordPress theme conversion.
- **Compact violet hero (`.contact-hero`)**:
  - Heading: *“LET’S TALK SETUPS.”*
  - Supporting copy: *“Product questions, order help or finding the right pieces—we’re here to help.”*
  - Restrained SVG geometric brand elements.
- **Main Contact Area (2-column desktop / stacked mobile)**:
  - **Left column: Direct channels (`.contact-options-card`)**:
    - WhatsApp concierge card reading `window.URBAN_STORE.whatsapp` from `assets/js/config.js`; displays working direct link when configured or honest availability note (*“WhatsApp concierge will be available when the store launches.”*) when unconfigured.
    - Email support card reading `window.URBAN_STORE.email` from `assets/js/config.js`; displays working `mailto:` link when configured or honest availability note (*“Direct email support opens with the live store. You can preview an enquiry below.”*) when unconfigured.
    - Order support card linking directly to `account.html?tab=orders`.
    - Studio location card conditioned strictly on `window.URBAN_STORE.address`; hidden when unconfigured (no fake maps or fabricated physical addresses).
    - No fabricated telephone numbers, email addresses, operating hours, or response-time guarantees.
  - **Right column: Drop us a note form (`.contact-form-card`)**:
    - Required fields: Full name, Email address, Topic dropdown, Message textarea.
    - Optional fields: Mobile / WhatsApp number (validated strictly for 10-digit Indian numbers only when filled).
    - Dynamic conditional Order Reference input: automatically shown when Topic is *“Order support”*, hidden for other topics.
    - Accessible inline validation (`role="alert"`, auto-focus first invalid input).
    - Truthful preview submission button labelled *“Preview enquiry”*.
    - Accessible status alert container (`#contact-form-feedback`, `role="status"`): *“Your enquiry details are validated. Message transmission and automated concierge routing will open when Urban Shisha launches on WooCommerce.”*
    - **Data integrity**: Form data is validated locally in memory; never stored, logged, or transmitted. Inputs remain preserved upon submission.
- **Helpful answers: FAQ Accordion (`.contact-faq-section`)**:
  - Native accessible `<details>` and `<summary>` components.
  - Practical setup topics (choosing a hookah, accessory sizing, delivery overview, order tracking).
  - Direct links to real pages (`shop.html?category=hookahs`, `index.html#guides`, `index.html#builder`, `account.html?tab=orders`).
- **Closing CTA band (`.contact-cta-band`)**:
  - *“Find your kind of setup.”* with direct buttons to `shop.html` and `index.html#builder`.
- **Navigation Integration**:
  - Customer Care *“Contact us”* links across `index.html`, `shop.html`, `product.html`, `cart.html`, and `account.html` updated from placeholder buttons to `<a href="contact.html">Contact us</a>`.
- **Build & Verification**:
  - `assets/js/config.js`: added explicit `email`, `address`, and `hours` configuration keys while preserving existing store keys.
  - `scripts/build.mjs`: added `contact.css` to stylesheet bundle and `contact.html` to static distribution copy.
  - `package.json`: added `contact.js` to `npm run lint`.
  - `scripts/verify.mjs`: added ID uniqueness, relative link, and component assertions for `contact.html`.
  - `review/contact-check.mjs`, `review/contact-results.json`: Playwright and Axe test suite verifying 1440px, 1024px, 768px, and 390px viewports with zero horizontal overflow, 0 Axe violations, 0 console errors, and 0 network failures.




## Wholesale page (3D deferred)

- New `wholesale.html`, `assets/wholesale.css`, `assets/js/wholesale.js`: premium product hero, category/search catalogue, independent bulk list and quantities, business form, review/copy and configured contact links, process/FAQ sections.
- Existing HTML pages: main desktop/mobile Build Your Setup navigation replaced with Wholesale; mega menus and discovery footers link to the page. Retail builder/content CTAs retained.
- Build/lint/static verification now include Wholesale.
- `WHOLESALE-PLAN.md`, `design.md`, `README.md`: page status and separate enquiry storage documented; R3F scene explicitly remains deferred.
- `review/wholesale-check.mjs`, results/screenshots: functional, responsive and accessibility checks.

No new dependencies, fake wholesale prices/MOQs, automatic message sending or personal-data persistence were introduced.

Wholesale verification: lint and production build pass. Browser checks pass at 1440, 1024, 768 and 390px with no horizontal overflow, JavaScript errors, failed responses or automated WCAG A/AA violations on the page. Verified category filters, saved product quantities, form validation, enquiry review, clipboard copy, prepared contact links, reduced motion and GSAP fallback. Contact link tests used isolated preview configuration; no messages were sent. Reports/screenshots are in `review/wholesale-*`.


## About and standalone policies — 8 October 2026

Added `about.html` plus `shipping.html`, `returns.html`, `privacy.html`, `terms.html` and `age-policy.html`. About uses the approved product-led ivory/violet/lime identity and real transparent product assets, with an editorial introduction, shopping-category links, product-detail principles, adult-use note and CTA. Policies have an active page selector, section anchors, readable mobile body text and explicit review-draft status for unconfirmed business terms.

Added scoped `assets/pages.css` and shared `assets/js/pages.js`; no new runtime dependencies. Existing footers now link to About and the standalone policies. Checkout/account inline policy links open a new tab. Privacy saved-data clearing requires explicit confirmation, removes only four Urban Shisha preview keys and keeps unrelated browser data. Policy text remains readable without an age confirmation; About uses the existing age gate. Final-content requirements are documented in `POLICY-REVIEW.md`.

Verification: lint/static checks and build pass. Six-page browser checks passed at 1440, 1024, 768, 390 and 320px with no horizontal overflow or JavaScript errors. Automated WCAG A/AA checks on desktop/mobile returned no violations. Verified policy anchors, mobile menu/footer, age gate, saved-data clear/cancel and GSAP fallback. Additional checks cover active mobile policy visibility, the homepage About footer link and a checkout policy popup preserving form values. See `review/pages-check.mjs`, `review/pages-results.json` and page screenshots.

## "Let's talk" redirection to Contact page & Back to top button — 8 October 2026

- **"Let's talk" Redirection**:
  - Replaced `<button class="whatsapp-button" data-info="contact">` with semantic `<a class="whatsapp-button" href="contact.html" aria-label="Contact Urban Shisha">` across all pages (`index.html`, `shop.html`, `product.html`, `cart.html`, `account.html`, `wholesale.html`, and policy pages).
  - Updated `showInfo('contact')` in `assets/js/app.js`, `shop.js`, and `product.js` to redirect directly to `contact.html` (`window.location.href = 'contact.html'`).
  - Added `a.whatsapp-button { text-decoration: none; cursor: pointer; }` to `assets/drop.css`.
- **Floating "Back to top" Button**:
  - Implemented `#back-to-top` floating pill button (`width: 44px; height: 44px; border-radius: 50%`) with Urban Shisha brand tokens: Ivory background `#FAF7F2`, 2px solid Ink `#14121F` border, and 3px offset Ink box shadow. Hover activates Lime `#C6FF3D`.
  - Upward navigation uses `#i-arrow` SVG icon rotated `-90deg` (`transform: rotate(-90deg)`).
  - Controller in `assets/js/catalog.js`: uses passive scroll listener with `requestAnimationFrame` to reveal the button when `window.scrollY > 350`, smoothly scrolling to top on click with keyboard focus restored to `#top`. Honors `prefers-reduced-motion: reduce` with instant jump.
  - Positioned non-overlapping on both desktop and mobile: on mobile, sits cleanly above the Let's talk button at `bottom: 148px; right: 15px;`, keeping comfortable touch targets without interfering with `.mobile-shop-bar`. On Contact and checkout pages without Let's talk, anchors at `bottom: 22px; right: 22px;`.
- **Build & Verification**:
  - Updated `scripts/verify.mjs` with assertions ensuring `#back-to-top` exists across all pages and `.whatsapp-button` links to `contact.html`.
  - Added Playwright test suite `scripts/test-back-to-top.mjs` verifying navigation, scroll reveal, smooth scroll restoration, and zero mobile bounding box overlap (`review/mobile-buttons-scroll.png`, `review/desktop-home-scrolled-1440.png`, `review/desktop-contact-scrolled-1440.png`).



## Account icon and hover menu — 8 October 2026

Added a consistent account icon and shared account dropdown to all 14 pages, including Checkout. Mouse hover opens it; click/tap, keyboard arrows, Tab and Escape also work. The panel links to Sign in/Register, Orders, Addresses, Wishlist and Contact, using the existing account-preview routes without inventing a logged-in user. It coordinates with Shop/mobile menus and stays inside small viewport boundaries.

Implementation: `assets/navigation.css`, `assets/js/navigation.js`, header markup/icon symbols across the HTML pages, and build/lint/static checks. The compact mobile Checkout header hides its decorative age pill to make room for account access. The build now includes 14 CSS source files; HTML page count remains 14.

Account menu verification: lint/build/static checks pass. All 14 pages pass desktop hover/click/Escape checks and mobile touch/viewport checks at 390 and 320px, plus 1024px layout/hover-exit checks. Keyboard focus, Shop menu coordination and Wishlist routing pass; no JavaScript errors, failed asset responses or automated accessibility violations in the checked account menus. Reports/screenshots: `review/account-menu-*`.
