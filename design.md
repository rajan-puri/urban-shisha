# Urban Shisha — design and development handoff

Last updated: 8 October 2026. This document describes the current approved local project. Read it before modifying the UI.

## 1. Start here

**Continue the existing design. Do not redesign the project or restore an earlier version.** The current direction is a cool, premium, product-led adult hookah store: ivory surfaces, electric violet, acid lime, bold typography, large transparent product photography, rounded cards and crisp offset shadows. The original emerald/gold concept was superseded; it is not the current brief.

The user values large product images, readable names/prices, generous spacing, strong mobile execution and smooth purposeful GSAP animation. Preserve these priorities on new pages. Explicit future user instructions take precedence over this handoff.

| Item | Current state |
| --- | --- |
| Working project | `/Users/rajan/Downloads/urban-shisha-homepage-v2` |
| Older original | `/Users/rajan/Downloads/urban-shisha-homepage` — separate; do not edit it for this project |
| Portfolio project | `/Users/rajan/Downloads/main portfolio` — unrelated; not the store's working folder |
| Stack | Semantic HTML, custom CSS, vanilla JavaScript, local GSAP + ScrollTrigger |
| Current pages | Home, Shop, Product, Cart, Checkout, Account, Contact, Bulk Orders, About and five policy pages (14 HTML pages) |
| Future platform | Custom WordPress + WooCommerce theme, no Elementor/page builder |
| Commerce today | Working browser preview, not connected to WooCommerce or payments |

Open the current browser pages to understand the actual composition. Some screenshots in `review/` predate recent hero/nav/section changes; the latest source and rendered page take priority over old screenshots.

## 2. Run and build

From the working project folder:

```sh
npm start
```

- Home: http://127.0.0.1:8091/index.html
- Shop: http://127.0.0.1:8091/shop.html
- Brando product: http://127.0.0.1:8091/product.html
- Cart: http://127.0.0.1:8091/cart.html
- Checkout: http://127.0.0.1:8091/checkout.html
- Account: http://127.0.0.1:8091/account.html
- Contact: http://127.0.0.1:8091/contact.html
- Bulk Orders: http://127.0.0.1:8091/wholesale.html
- About: http://127.0.0.1:8091/about.html
- Policies: `shipping.html`, `returns.html`, `privacy.html`, `terms.html`, `age-policy.html`

The server is `scripts/serve.py`, uses port **8091**, and serves compressed HTML/CSS/JS/SVG. It must remain running for local URLs to work. If a URL refuses connection, check the server first; that is not evidence of a design bug. Do not terminate unrelated services to free a port.

```sh
npm run lint
npm run build
```

`build` generates `assets/site.css` and recreates `dist/` with all static pages and local assets. **Edit source files, not `dist/` or `assets/site.css`.** Rebuild after CSS edits so previews reflect the source. Use a browser hard refresh when needed.

## 3. Source map and CSS cascade

| Source | Responsibility |
| --- | --- |
| `index.html` | Homepage markup, header/mega menu/footer, homepage dialogs |
| `shop.html` | Shop, filter form/dialog, results, shared-looking header/footer |
| `product.html` | Brando gallery, buying panel, specs, related items, zoom dialog |
| `cart.html` | Dedicated Bag/Cart page, product rows, sticky order summary, empty state |
| `checkout.html` | Single-page checkout preview, contact & delivery forms, honest notices, order summary |
| `account.html` | My Account page, Login/Register preview, Demo dashboard, in-memory addresses, wishlist sync |
| `contact.html` | Contact page, direct channel cards, enquiry form, conditional order ref, FAQ accordion |
| `assets/style.css` | Base/reset, original component structure and responsive foundations |
| `assets/refinements.css` | Product sizing/readability refinements |
| `assets/drop.css` | Current brand tokens, visual language, header/nav and shared styling |
| `assets/next-edit.css` | V2 homepage composition, hero, spotlight and motion-related styles |
| `assets/shop.css` | Shop layout/filters/cards and homepage brand section |
| `assets/product.css` | Full product page and mobile buying bar |
| `assets/cart.css` | Dedicated Cart page, responsive product rows, summary and empty state |
| `assets/checkout.css` | Checkout page layout, form inputs, sticky summary card, notices and modal |
| `assets/account.css` | Account layout, auth hero panel, form cards, dashboard navigation, in-memory address cards, wishlist grid, modals |
| `assets/contact.css` | Contact layout, compact hero, channel cards, enquiry form inputs, inline validation, FAQ accordion |
| `assets/fonts.css`, `assets/fonts/` | Local WOFF2 font definitions and files |
| `assets/js/catalog.js` | Shared products, brand metadata and photographic SVG frames |
| `assets/js/app.js` | Homepage catalog rendering, filters, builder, dialogs, bag/wishlist |
| `assets/js/next-motion.js` | Homepage GSAP, intro, parallax, looping ribbon, rail drag cursor |
| `assets/js/shop.js` | Shop filtering/sorting/search, URL state, preview commerce and page UI |
| `assets/js/product.js` | Brando gallery/zoom/quantity, buying UI, preview commerce and motion |
| `assets/js/cart.js` | Cart quantity controls (1-99), line totals, subtotal, wishlist and empty state |
| `assets/js/checkout.js` | Checkout cart calculation, inline validation, address toggle, preview modal |
| `assets/js/account.js` | Account password toggle, auth tabs, validation, dashboard navigation, in-memory address CRUD, wishlist sync, exit demo |
| `assets/js/config.js` | Actual store WhatsApp and Instagram configuration; currently blank |
| `assets/js/gsap.min.js`, `ScrollTrigger.min.js` | Local animation libraries |
| `scripts/build.mjs`, `scripts/verify.mjs` | CSS bundle/static build and structural validation |
| `review/` | Browser scripts, result JSON, screenshots and asset/source manifests |
| `ASSET-NOTES.md` | Photo provenance, existing AI cutouts and source originals |
| `CHANGES.md` | Change history and file summary |

The generated stylesheet order is:

```text
fonts.css → style.css → refinements.css → drop.css
          → next-edit.css → shop.css → product.css → cart.css → checkout.css → account.css
          → contact.css → wholesale.css → pages.css → navigation.css
```

Later sheets and responsive rules can override earlier declarations. Inspect the cascade before adding a rule. Scope Shop/Product changes to their components so they do not accidentally alter Home. Avoid a growing pile of contradictory overrides; modify the applicable source declaration when practical. Do not remove old sheets wholesale: current components still depend on them.

All pages load local scripts using `defer`; `catalog.js` must load before page logic. Home additionally loads `next-motion.js` before `app.js`. There is no React framework or runtime CDN dependency.

## 4. Visual system

### Colours

These six tokens live in `assets/drop.css`. Use them rather than inventing slightly different substitutes.

| Token | Value | Intended use |
| --- | --- | --- |
| `--bg` | `#FAF7F2` | Main ivory canvas and light surfaces |
| `--primary` | `#6C2BFF` | Electric violet, campaign fields, selected controls, emphasis |
| `--accent` | `#C6FF3D` | Acid lime, main CTAs, ribbon and product backdrop accents |
| `--pop` | `#FF5C39` | Restrained coral: Date Night/selected stickers/limited badges |
| `--soft` | `#E9E0FF` | Lilac support surfaces and decorative backdrops |
| `--ink` | `#14121F` | Text, outlines and offset shadows |

Supporting values: `--muted: #625A73`; `--line: #C9C0D8`. Legacy variables such as `--emerald` and `--gold` are aliases in the existing CSS. Their names do **not** mean the store should revert to emerald/gold.

Keep most catalog content on ivory; give key campaign moments violet/lime. Coral is a limited accent, not a background for every card. Preserve contrast and full-opacity text. Do not apply multiply/tint effects to product photography.

### Typography

- Current display/headline family: **Space Grotesk**, bold, usually 700. Headings are compact, tightly tracked and often uppercase.
- Body, labels and controls: **Manrope**.
- Barlow Condensed font files remain in the base project, but the current hero/display tokens use Space Grotesk. Do not introduce a new font or serif theme without a new user brief.
- Shared section heading baseline: `clamp(34px, 3.6vw, 54px)`, line-height about `1.04`, tracking about `-.055em`, with page-specific exceptions.
- Product names and prices must remain prominent. Do not compress the cards by shrinking their typography.
- Keep labels legible, particularly filters and buying controls. Mobile inputs should retain comfortable sizes and touch targets.

### Geometry and spacing

- Shared desktop gutter: `clamp(22px, 4.7vw, 80px)`; section rhythm: `clamp(72px, 7.3vw, 112px)` before local adjustments.
- Card radii generally 24–34px. Capsules for navigation, buttons and filters.
- Thin dark outlines, usually 1.5–2px. Hard offset shadows, typically 3–6px, rather than soft coloured glows on every component.
- Section headings, description text and grids need intentional breathing room. Do not make Home shorter by collapsing sections.
- Reuse existing SVG symbols (`#i-arrow`, `#i-bag`, `#i-heart`, etc.). No new icon pack is needed.
- Product backdrop shapes stay **behind** the photograph. Decorative effects must not cover names/prices or tint the product.

## 5. Explicit user-approved rules

### Hero position — latest desktop base values

This exact rule is in `assets/next-edit.css`:

```css
.hero-visual {
  width: 55%;
  height: 800px;
  right: -8%;
  top: 50px;
  z-index: 3;
}
```

Do not restore older `1010px`/`880px` heights or `top: -15px`. Existing large-screen/tablet/mobile media queries intentionally override the base for their layouts. Preserve those responsive overrides rather than forcing desktop values onto phones.

Hero layer order: back headline at z-index 2, product at 3, front headline at 4, with other controls/stickers positioned intentionally. The `.campaign-shell` includes the hero and ribbon so deliberate product/ribbon overflow is not chopped at the section seam.

### Navigation — latest desktop base values

These are in `assets/drop.css` and apply to shared page headers:

```css
.desktop-nav {
  font-weight: 700;
  gap: 23px;
  font-size: 16px;
}

.mega-label {
  font-size: 16px;
}
```

Responsive tablet rules can reduce spacing/type; navigation switches to the mobile version at the existing breakpoint. If touching these, verify header fit at 1024px as well as 1440px. Do not reduce the wide-desktop values silently.

### Cursor

**The small global dot cursor was rejected and removed.** Normal browsing uses the native arrow/link/input cursors. Keep the larger lime **DRAG** indicator only over draggable hookah-rail imagery on a fine desktop pointer. Rail action buttons use normal pointers. Do not reintroduce cursor hiding site-wide. Product gallery uses a native zoom cursor and supports image swipes.

### Footer credit

Home, Shop and Product use:

```html
<a class="footer-preview"
   href="https://matescreation.com/"
   target="_blank"
   rel="noopener noreferrer">Made by Mates Creation</a>
```

Do not restore “HOMEPAGE DESIGN PREVIEW” / “SHOP DESIGN PREVIEW” in this credit position. The footer stays large with multiple useful columns and mobile accordions.

### Replaced section

The old **FORM MEETS FUNCTION / EVERY DETAIL. DELIBERATE.** sticky story was rejected and replaced. Do not bring it back because unused `.detail-story` CSS or old screenshots still exist. The active replacement is `#product-spotlight`: **one large product on the left and four selectable products in a 2×2 grid on the right**. Previous/next loops through them, and clicking a small card also updates the large product. Keep photo, name, price and buying action in sync.

## 6. Homepage composition and behaviour

Keep this section sequence unless the user asks to change it:

1. Announcement + rounded sticky header and image-led mega menu.
2. Violet layered hero: large hookah, headline, CTAs, restrained smoke, floating stickers.
3. Tilted lime text ribbon, seamlessly looping without clipping at the top/bottom.
4. Six product categories (`#categories`).
5. Shop by Brand (`#brands`) — six supplied local logos linking into Shop.
6. Shop by Mood (`#moods`) — three large scenes with actual hookah cutouts.
7. Hookah collection (`#collection`) — budget filters and draggable snapping rail.
8. One-large/four-small product spotlight (`#product-spotlight`).
9. Complete Your Kit (`#details`). This is a different section from the removed story.
10. Accessories (`#accessories`) — category filters and product cards.
11. Budget collections.
12. New arrivals (`#arrivals`).
13. Four-part setup builder (`#builder`).
14. Editorial accessory collections.
15. Journal (`#guides`).
16. Closing CTA band and large footer (`#footer`).

Important interactions:

- Image category mega menu works with pointer, keyboard and mobile navigation.
- Rail supports arrows, mouse drag, native touch scrolling and snap. Dragging must not accidentally open a product.
- Wishlist has comfortable inset positioning; it must not stick to a rounded card corner.
- Quick add gives confirmation, bag-count feedback and a toast. Mobile keeps a visible add action rather than relying on hover.
- Spotlight swaps the complete featured product, including its `data-add`/detail action, and supports reduced motion.
- Builder selects hookah, bowl, HMD and charcoal. All four previews and the calculated total update.
- Vibe meter counts how many of the four choices have been personalised; it is not a compatibility or quality score.
- “237 setups built this week” is visibly marked **DEMO COUNTER**. Do not turn it into a claimed real statistic.

## 7. Shop page

Desktop: compact violet campaign banner, category capsules, scrollable sticky filter sidebar, product results/search/sort to the right. Product grid is three columns on wide desktop and two at intermediate widths.

Filters combine rather than overwrite one another:

- Category, brand, minimum/maximum price, new arrivals and text search.
- Sorting: Featured, low-to-high price, high-to-low price, name A–Z.
- Active chips remove individual filters; Clear/Reset restores the edit.
- Query parameters: `category`, `brand`, `min`, `max`, `q`, `sort`, `new`.
- URL state survives reload. `category=accessories` expands to accessory types.
- Mobile uses a native `<dialog>` filter sheet with a live result count and Show Products action.
- The **same** filter form is moved between sidebar and sheet on breakpoint changes. Do not duplicate its inputs or IDs.
- Empty results are explained and offer a reset; never fill them with made-up products.

Brand logos: Al Fakher, Nakhla, Serbetli, Revoshi, Jibiar, MustHave. Their supplied local logos are in `assets/images/brands/`. Current sample products are hardware; those flavour-brand filters intentionally show a clear pending-catalog state. Existing hardware brand filters remain functional.

## 8. Product page

Currently **Brando only**, not a dynamic full product-page template for every SKU. Brando buttons on Home/Shop route to `product.html`; other products retain quick-view dialogs. Do not claim that every product already has a full detail page.

Desktop: a large gallery on the left, sticky buying panel on the right. Mobile stacks gallery and buying panel and uses a fixed price/Add to Bag bar instead of the ordinary bottom shopping bar.

Preserve:

- One existing transparent Brando studio cutout plus **three actual original reference photos**, not fake repeated angles.
- Thumbnail selection, previous/next looping, swipe navigation, zoom dialog and zoom keyboard arrows.
- One documented finish: Bronze Stem / Green Line Base. Do not invent variants just to populate swatches.
- Quantity 1–99, wishlist, main/sticky Add to Bag and shared preview cart.
- Readable product name, price, finish and CTA.
- Specifications, reference included items, care and shipping/returns accordions.
- Extras and related hookahs; accessory suggestions are not blanket claims of compatibility.
- No fake reviews, ratings, discounts, free gifts, scarcity or delivery promises.

### Reference data

Current reference-price snapshots are preview values, not confirmed Urban Shisha inventory or a live price feed:

| Item | Reference snapshot | Notes |
| --- | --- | --- |
| COCOYAYA Brando | ₹9,499 | Bronze stem / green line glass base; source lists 32 inches including bowl/HMD, approx. 7kg |
| COCOYAYA Coconut Coal | ₹135 | 250g / 18 pieces; source cube size 2.5cm per side |
| VG Big Handle Hose | ₹799 | Gold metal handle, black silicone pipe; source says 5+ feet |
| VG Sultan replacement base | ₹3,499 | Reference/photos saved; not added as Brando-compatible or as a catalog SKU |

Sultan source says “9 inches / 20cm” for width; this is inconsistent. Verify dimensions before creating its product record. Reference-store stock and promotional freebies must not become Urban Shisha promises.

Source snapshots and exact image URLs live in `review/*-source.json`, `brando-image-sources.json` and `accessory-image-sources.json`.

## 8b. Cart page

Dedicated full Cart page (`cart.html`) matching the V2 aesthetic:

- **Breadcrumb**: `Home / Your Bag`.
- **Header**: “YOUR BAG. YOUR NEXT SETUP.” with a live item count badge.
- **Desktop 2-column layout**: spacious product row list on the left, sticky order summary on the right.
- **Product rows**: large transparent product cutout, brand name, product title (linking to PDP), honest finish/variant specification, unit price in INR, accessible quantity controls (clamped 1–99), line total, “Save to wishlist” (persisting to `urban-preview-wishlist` without removing from cart), and “Remove” action.
- **Order summary**: calculated subtotal, shipping labeled “Calculated at checkout”, total explicitly labeled as subtotal before shipping, acid lime “Proceed to checkout” CTA triggering an honest checkout preview modal, and secondary “Continue shopping” link.
- **Empty state**: polished centered card with bag icon, “YOUR NEXT FAVOURITE IS WAITING.”, and links to explore shop or builder.
- **Mobile layout**: stacked rows, responsive touch controls, and a fixed bottom bar with subtotal and Checkout button.
- **Quick bag drawer integration**: Home, Shop, and Product bag drawers feature a prominent “View full bag” link opening `cart.html`.

## 8c. Checkout page

Dedicated single-page Checkout preview (`checkout.html`) continuing the V2 visual language, ready for WooCommerce conversion:

- **Simplified checkout header**: Urban Shisha logo linking to `index.html`, “Back to bag” link returning to `cart.html`, 18+ age requirement badge, and compact footer with Made by Mates Creation credit.
- **Desktop 2-column layout**: ~60% customer and delivery details form on the left, ~40% sticky order breakdown card on the right.
- **Form Sections**:
  1. `01 / Contact`: email input with invoice guidance, 10-digit Indian mobile number input with `+91` prefix badge, and guest checkout status indicator (no fake login).
  2. `02 / Delivery address`: full name, street address line 1, optional line 2 (apartment/landmark), city, Indian State/UT dropdown, 6-digit PIN code, and readonly country set to India. Autocomplete attributes configured for browser autofill.
  3. `03 / Billing address`: “Billing address is same as delivery address” checked by default. Unchecking reveals full billing fields dynamically; re-checking hides and resets validation without preventing submission.
  4. `04 / Delivery details`: honest preview disclaimer explaining delivery availability and courier charges will be confirmed upon live WooCommerce checkout.
  5. `05 / Payment method`: honest preview disclaimer explaining payment options (UPI, cards, net banking) will open with the live store. Does not collect card numbers or show misleading fake payment logos.
  6. `06 / Required confirmations`: unchecked 18+ adult age confirmation checkbox, unchecked terms and conditions acceptance linking to policy modal, and separate unchecked optional marketing consent.
- **Validation**:
  - Native constraints paired with accessible inline error messages (`role="alert"`).
  - Preserves entered user values upon submission attempts.
  - Automatically focuses the first invalid field.
  - Strict pattern enforcement for 10-digit Indian mobile numbers (`/^[6-9]\d{9}$/`) and 6-digit Indian PIN codes (`/^\d{6}$/`).
- **Order summary**:
  - Live item breakdown reading `urban-preview-cart` and `UrbanCatalog`.
  - Product thumbnails with transparency framing, names, variant specifications, quantities, and line totals.
  - Subtotal calculation, shipping labeled “Confirmed at live checkout”, payable total explicitly noted as “Pending shipping and any applicable taxes.”
- **Primary CTA & Preview Modal**:
  - Acid lime “Preview checkout” button triggers full form validation.
  - Passing submission opens `#checkout-complete-dialog`: *“Your checkout details are complete. Orders and payments are not enabled in this preview.”*
  - Does NOT create fake order numbers, clear the cart, or save personal data to `localStorage` or remote servers.
- **Empty state**:
  - When cart is empty, `#checkout-empty` displays “YOUR BAG IS EMPTY.” with a button linking to `shop.html`. The form and summary are hidden.
- **Mobile responsiveness**:
  - Single column with an expandable `<details class="mobile-summary-accordion">` near the top showing subtotal and item count.
  - Input font size minimum 16px to prevent iOS Safari auto-zoom.
  - Submit button kept in natural document flow; no fixed elements blocking form fields.

## 8d. Account page

Dedicated My Account page (`account.html`) providing a client preview of user authentication and a fully functional Demo Account Dashboard:

- **Login / Register View (`#auth-view`)**:
  - Spacious 2-column desktop layout:
    - **Left column**: Branded editorial panel with *“YOUR SPACE. YOUR SETUP.”*, value propositions (synced wishlist, address management, live dispatch tracking), and a prominent *“Explore demo account”* callout button that opens the dashboard immediately without credentials. Honest disclaimer clarifying that authentication is currently in design preview mode.
    - **Right column**: Accessible tabbed forms for *Log In* and *Create Account* (`role="tablist"` / `role="tab"` / `role="tabpanel"`).
  - **Password show/hide toggles**: Accessible buttons (`.password-toggle-btn`) with `aria-pressed`, `aria-label`, and icon toggling between `#i-eye` and `#i-eye-off`.
  - **Form validation**:
    - Email format verification and required password.
    - Registration requires full name, valid email, minimum 8-character password, unchecked required 18+ adult confirmation checkbox, and unchecked required terms/privacy acceptance. Optional newsletter consent is never preselected.
    - Accessible inline error alerts (`role="alert"`). Automatically focuses the first invalid input on submission.
    - Passing validation displays an honest preview notice explaining that backend authentication will connect when Urban Shisha launches on WooCommerce. Passwords and credentials are never stored, logged, or uploaded.
  - **Forgot password**: Trigger opens `#forgot-password-dialog` with an honest preview notice; does not claim an email was dispatched.

- **Demo Account Dashboard (`#dashboard-view`)**:
  - **Desktop navigation**: Sticky left navigation sidebar with Overview, Orders, Addresses, Wishlist (with live item count pill), Account Details, and an Exit Demo button.
  - **Mobile navigation**: Horizontally scrollable segmented nav pill bar (`.dashboard-mobile-nav`) with comfortable touch targets and no squeezed sidebar.
  - **Overview (`#section-overview`)**:
    - Heading: *“YOUR ACCOUNT. YOUR KIND OF SETUP.”*
    - Direct navigation metric cards to Orders, Addresses (with live in-memory address count), and Wishlist (displaying actual saved product count from `urban-preview-wishlist`).
    - Excludes fake spending totals, fabricated orders, or artificial VIP levels.
  - **Orders (`#section-orders`)**:
    - Default honest empty state: *“No orders yet.”* with descriptive guidance and an *“Explore the shop”* button linking to `shop.html`.
    - Does not fabricate order numbers or convert preview cart items into fake orders.
  - **Addresses (`#section-addresses`)**:
    - Default empty state with an *“Add your first address”* CTA.
    - Full in-memory Add, Edit, and Delete interactions via `#address-dialog` and `#delete-address-dialog`.
    - Collects Purpose (Delivery / Billing), Full Name, Street Address, Optional Landmark, City, Indian State/UT dropdown, 6-digit PIN code, Country (India, readonly), and 10-digit mobile number.
    - Validates required fields, highlights errors, and preserves user input on errors.
    - **Data boundary**: Address records are kept strictly in browser memory for the session and are **never saved to localStorage or sent to a server**.
  - **Wishlist (`#section-wishlist`)**:
    - Integrates directly with shared `urban-preview-wishlist` and `UrbanCatalog.products`.
    - Renders saved items with transparent SVG cutout photography (`viewBox` framed), brand, product title, formatted INR price, View link, *“Add to bag”* button, and *“Remove”* button.
    - Adding to bag updates `urban-preview-cart` and visible header counts (`.cart-count`) immediately with visual confirmation.
    - Removing items updates storage and counter badges. When 0 items remain, smoothly transitions to the empty state (*“YOUR NEXT FAVOURITE IS WAITING.”* + Shop CTA).
  - **Account details (`#section-details`)**:
    - Two clean cards: Personal profile form (name, email) and Password update form (current, new 8+ chars, confirm).
    - Local validation only; fields cleared on valid submission. Never persists or logs passwords.
  - **Exit demo**:
    - Action button in sidebar and mobile nav returns the user to the Login/Register view.
    - **Crucial**: Leaves `urban-preview-cart` and `urban-preview-wishlist` completely intact.

- **URL routing**: Supports deep linking via `?tab=orders`, `?tab=wishlist`, `?tab=addresses`, `?tab=details`, or `?demo=1` to open the demo dashboard directly with the requested tab active.

## 8e. Contact page

Dedicated Contact page (`contact.html`) continuing the approved V2 design system, ready for custom WordPress theme conversion:

- **Breadcrumb**: `Home / Contact`.
- **Compact violet hero (`.contact-hero`)**:
  - Heading: *“LET’S TALK SETUPS.”*
  - Supporting copy: *“Product questions, order help or finding the right pieces—we’re here to help.”*
  - Restrained brand geometry (SVG ring and curvature lines) matching the brand palette without overwhelming decorative images.
- **Main Contact Area (2-column desktop, stacked mobile)**:
  - **Left column: Direct Channels (`.contact-options-card`)**:
    - WhatsApp card: reads `window.URBAN_STORE.whatsapp` from `assets/js/config.js`. When configured, renders a working link to `wa.me/<sanitized_phone>` (`target="_blank"`). When unconfigured, displays an honest availability notice (*“WhatsApp concierge will be available when the store launches.”*).
    - Email support card: reads `window.URBAN_STORE.email` from `assets/js/config.js`. When configured, renders a `mailto:` link. When unconfigured, displays a restrained availability note (*“Direct email support opens with the live store. You can preview an enquiry below.”*).
    - Order support card: directs customers directly to `account.html?tab=orders` to review dispatches and order history.
    - Studio location card: strictly conditioned on `window.URBAN_STORE.address`. Hidden by default unless a real physical address is configured (no fake maps or placeholder store addresses).
    - Excludes fabricated phone numbers, emails, addresses, operating hours, or artificial response-time guarantees.
  - **Right column: Enquiry Form (`.contact-form-card`)**:
    - Fields: Full name (required), Email address (required), Mobile / WhatsApp number (optional, validated for 10-digit Indian numbers only when entered), Topic dropdown (required), Message textarea (required).
    - Dynamic conditional Order Reference: hidden by default; automatically appears when Topic is set to *“Order support”*; smoothly hides and resets when other topics are chosen.
    - Inline accessible error messages with `role="alert"` and auto-focus on the first invalid field upon submission.
    - Truthful preview CTA: labelled *“Preview enquiry”* while form backend transmission is not connected.
    - On valid submission, renders accessible feedback container `#contact-form-feedback` (`role="status"`, `aria-live="polite"`): *“Your enquiry details are validated. Message transmission and automated concierge routing will open when Urban Shisha launches on WooCommerce.”*
    - **Data integrity**: Customer messages and personal contact details are validated locally and are **never stored in localStorage, logged to console, or transmitted**. The form is not wiped out automatically, preserving entered customer details.
- **Helpful answers: FAQ Accordion (`.contact-faq-section`)**:
  - Semantic `<details>` and `<summary>` components for native accessibility.
  - Practical setup topics: Choosing a hookah, Checking accessory compatibility, Shipping information, and Order support.
  - Direct links to real project destinations: `shop.html?category=hookahs`, `index.html#guides`, `index.html#builder`, and `account.html?tab=orders`.
  - Truthful copy without speculative delivery promises or universal accessory fitment claims.
- **Closing CTA band (`.contact-cta-band`)**:
  - Heading: *“Find your kind of setup.”*
  - Primary button linking to `shop.html` and cream secondary button linking to `index.html#builder`.
- **Mobile responsiveness**:
  - Minimum 16px form input typography preventing iOS auto-zoom.
  - Natural flow submit buttons and zero floating buttons obstructing form inputs or error alerts.
  - Zero horizontal overflow across 1440px, 1024px, 768px, and 390px viewports.
- **Cross-page integration**:
  - Footer *“Contact us”* links across `index.html`, `shop.html`, `product.html`, `cart.html`, and `account.html` updated from placeholder buttons to `<a href="contact.html">Contact us</a>`.

## 9. Photography: preserve transparency and product identity

The user previously rejected white rectangles over transparent products and decorative colour blobs tinting the actual objects. Avoid both regressions.

- Runtime cutouts: `assets/images/product-cutout-0.webp` through `product-cutout-11.webp`. They contain actual alpha transparency.
- Original cutout PNGs and white-background source photographs are retained locally for provenance. Build excludes unused PNG cutout masters and older generated hero/catalog sheets.
- Cards use SVG `viewBox` framing from `UrbanCatalog.imageFrames` to reduce excess whitespace while preserving the complete object.
- `catalog.js` supplies common product data/framing. Home, Shop and Product must agree on product IDs and prices.
- Native compositing only: no `mix-blend-mode: multiply`, opaque backing rectangle on cutouts, or foreground colour overlay.
- Keep the full bowl, stem, base, hose and handle visible. Use contain-style sizing and preserve aspect ratio.
- The three new Brando original photographs **actually have white backgrounds**. Their gallery views intentionally show white photography surfaces; do not confuse them with lost alpha in the studio cutout.
- Additional downloaded Sultan/coal/hose originals are local, not hotlinked.
- Brand logos retain their original colours/proportions; do not redraw them.
- Existing cutouts were AI-derived from supplied product references. Validate exact merchant-approved imagery before live catalog publication. See `ASSET-NOTES.md` for provenance.

## 10. Motion and accessibility contract

Use existing local GSAP rather than replacing the motion system or adding another animation framework.

- Home: short initial loader, staggered hero reveal, controlled smoke/sticker loops, subtle inverse pointer parallax, transform-based reveals, footer lettering and velocity/direction-aware ribbon.
- Loader follows the age-gate acceptance; it must not block content permanently. Keep fallback cleanup.
- Shop: short intro and filter/card-change feedback.
- Product: entrance, gallery transitions, bag feedback and below-fold reveals.
- Prefer transforms/opacity. Keep full-opacity readable text after motion completes. Never leave a whole grid/section faint because a scroll timeline did not finish.
- Pause offscreen perpetual loops and clean up contexts/listeners when motion/breakpoints change.
- Honour `prefers-reduced-motion`. Fine-pointer effects must not be attached to touch layouts.
- No unnecessary continuous scroll hijacking. Native page scrolling remains available.
- Initial content/shopping controls must stay usable when GSAP/ScrollTrigger cannot load.
- Keep focus outlines, meaningful labels, native dialog keyboard behaviour and focus restoration. Do not use `aria-label` on an otherwise generic span/div without an appropriate role.
- Prevent Escape/backdrop bypass of the 18+ gate; normal dialogs can close with Escape.
- Prevent modal background scroll and reliably unlock after close.

## 11. Responsive rules

This is an existing responsive cascade, not one generic breakpoint. Main thresholds:

| Width/rule | Expected behaviour |
| --- | --- |
| 1920px+ | Existing larger hero rules, separate from desktop base values |
| 1700px+ | Wider component/spacing adjustments |
| ≤1199px | Tighter header, layouts and Shop grid adjustments |
| ≤1100px | Local mega-menu/spotlight adjustments |
| ≤900px | Mobile header, Shop filter sheet, stacked Product layout; desktop parallax/cursor off |
| ≤800px | Spotlight stacks big panel above 2×2 selector |
| ≤600px | Phone spacing/type, two-column Shop cards, footer accordions, fixed buying/shopping bars |
| ≤359px | Small-phone sizing corrections |
| coarse pointer/no hover | No hover-only interaction dependency |
| reduced motion | Motion fallback and native cursor |

Test **1440, 1024, 768 and 390px**. Also spot-check 320px when introducing fixed-width controls. Avoid horizontal body overflow. Intentional gallery/rail/category-chip scrolling is allowed inside its own container.

Account for fixed headers, bottom bars, safe-area insets, toasts and WhatsApp positioning. Important buttons must not hide behind those surfaces. Decorative/ribbon overflow should remain visible vertically without causing horizontal page overflow.

## 12. Data and commerce boundaries

Shared catalog IDs are important hooks; changing them breaks saved/cart entries and cross-page actions. Add products through `catalog.js`, update photographic frames and keep every required preview asset available.

Current shared browser storage keys:

```text
urban-preview-cart
urban-preview-wishlist
urban-preview-age
```

Cart/wishlist are previews stored in this browser. Age acceptance persists here too. Checkout/account/shipping/policy/newsletter features are currently honest preview panels, not working backend integrations. Real WhatsApp/Instagram values belong in `config.js`; blank values intentionally show preview contact information rather than invented contacts.

Header/footer markup and some commerce behaviours are duplicated across the three HTML/page scripts. When changing shared navigation, credit, dialog wording or storage semantics, check **all three pages**. Shared CSS does not automatically update duplicated HTML/JS.

## 13. WordPress / WooCommerce next phase

Preserve the approved HTML structure, classes, tokens, asset composition and motion hooks while converting:

1. Create a proper custom theme: `style.css` theme header, `functions.php`, `header.php`, `footer.php`, `front-page.php`, template parts and required fallback templates.
2. Enqueue local CSS/JS in dependency order. Use theme-directory helpers for asset paths and include `wp_head()`, `wp_footer()` and `wp_body_open()`.
3. Convert Shop/Product views into WooCommerce-compatible archive/single-product templates with real product/category permalinks and images.
4. Replace local preview cart/quantity/price/variation logic with WooCommerce cart/session/stock APIs. Preserve visual feedback while avoiding duplicate cart additions.
5. Use verified catalog prices, package contents, stock, variants, dimensions and accessory compatibility. Dynamic data must not break card heights or overflow controls.
6. Build real Checkout, Account, About and Contact pages in the same design language (`cart.html` is now implemented as a full client preview page).
7. Replace preview contact/policy/newsletter/account behaviours with real configured services and copy. Keep the 18+ gate and checkout age handling.
8. Test the actual WooCommerce flows, server-rendered states and page performance after conversion.

Do not introduce Elementor, a page builder, a new visual framework or a generic WooCommerce skin that overrides this design. Do not remove existing motion or imagery just because the backend changes. Routine refactoring is allowed when it preserves behaviour and appearance; visual changes should follow the user's requested scope.

## 14. Verification and handoff checklist

For each change, validate the affected interactions and page layouts, then:

```sh
npm run lint
npm run build
```

Existing browser scripts:

| Script | Coverage |
| --- | --- |
| `review/functional-v2.mjs` | Home, rail drag, filters, builder totals, bag, menu, reduced-motion cleanup |
| `review/spotlight-check.mjs` | Four-card selector, next/previous, featured buying/detail action |
| `review/shop-check.mjs` | Combined filters/search/sort, URL reload, mobile sheet, shared cart, brands, accessibility |
| `review/product-check.mjs` | Gallery/zoom, quantities, wishlist, mobile buy, shared cart, Shop link, accessibility |
| `review/cart-check.mjs` | Cart rows, line totals, subtotal, quantity modification, wishlist toggle, empty state, accessibility |
| `review/checkout-check.mjs` | Single-page checkout, inline validation, phone/PIN formats, billing toggle, preview modal, multi-viewport layout, accessibility |
| `review/account-check.mjs` | Auth view, password show/hide, login/register validation, demo dashboard, in-memory address CRUD, wishlist sync, account details, exit demo, deep links, 4 viewports, 0 Axe violations |
| `review/contact-check.mjs` | Contact channels (WhatsApp/email/address), enquiry validation, conditional order ref, accessible preview feedback, FAQ accordion, 4 viewports, 0 Axe violations |
| `review/quality-v2.mjs` | Homepage automated accessibility at four widths |
| `review/fallback-v2.mjs` | Homepage controls/content with animation libraries blocked |

These scripts currently import Playwright from the separate local `main portfolio/cinematic/node_modules` installation and Axe from `/tmp/urban-shisha-audits`. They are machine-specific review tools, not runtime dependencies. On another machine, install/configure local audit tools and update their paths. Do not copy the portfolio project into the store or add runtime packages merely to satisfy audit imports.

Update assertions when deliberately changing catalog prices or routing, using the intended user behaviour as the test expectation. Do not weaken tests just to make them pass. Some older review artifacts reference superseded story layouts; update or disregard those instead of restoring the rejected section.

Recent functional/accessibility checks passed at the four listed sizes. Older Lighthouse **89 performance / 100 accessibility / CLS 0** belongs to an earlier V2 homepage audit, before Shop/brand/Product additions; it is not a fresh score for the entire current project or future hosting.

Before handing changes back, check:

- Product scale, names/prices, alpha edges and backdrop stacking match the design.
- Header/mega menu and footer credit remain consistent across pages.
- Hero values and removed global dot cursor are not accidentally reverted.
- Spotlight remains one big + four small products, with working selection.
- No clipped ribbon, accidental body overflow or fixed-bar obstruction.
- Filters, cart/wishlist, quantity, dialogs and reduced-motion behaviour still work.
- No console errors, missing assets or duplicate IDs.
- Source and regenerated CSS/dist agree.
- New reference data/assets and material limitations are documented.

## 15. Suggested prompt for Antigravity

> Read `design.md` before editing. Continue the existing Urban Shisha project in this folder; preserve its approved design and behaviour. Use current source files and browser views as the baseline, not older screenshots or the superseded emerald/gold concept. Follow the shared tokens, source stylesheet order, responsive rules, transparent photography treatment and GSAP/reduced-motion requirements. Implement only the requested next scope. Keep Home, Shop and Product consistent, rebuild generated CSS/dist, and verify the affected pages and interactions at 1440/1024/768/390px. Report changed files and any real integration work still pending.

## Wholesale page / deferred 3D concept

See [`WHOLESALE-PLAN.md`](WHOLESALE-PLAN.md) for the saved bulk-enquiry page and React Three Fiber miniature warehouse/truck/storefront animation concept. The Wholesale page has now been implemented at the user’s request. The 3D scene remains deferred; do not add React/R3F dependencies or animate workers/trucks until requested.

## Wholesale implementation handoff

`wholesale.html`, `assets/wholesale.css` and `assets/js/wholesale.js` implement the bulk enquiry page. Build/lint/static verification include these files. Header/mobile navigation now says Bulk Orders, and mega menus/footer discovery link to it across existing pages. The retail homepage `#builder` and its internal/content links remain intact.

Hero uses existing transparent product cutouts and a restrained GSAP entrance. `data-future-scene="wholesale-3d"` marks the visual area for future 3D work. No warehouse/truck/customer animation, React runtime, or placeholder 3D promise is included now.

Catalogue categories/search filter the shared products; cards say Wholesale quote on request rather than exposing invented bulk rates. Selected products and quantities (1–9999) are stored separately under `urban-wholesale-enquiry`. These are requested quantities, not a configured MOQ. Retail cart/wishlist storage is not modified by enquiry actions.

Business details form validates name, business, city, six-digit PIN, email, Indian mobile, business type and optional GSTIN format. Contact/business data is kept in the form and prepared message only; it is not persisted or submitted automatically. Submission opens a review dialog with a copyable request. WhatsApp/email links are shown only when configured in `config.js`; the customer chooses whether to open/share. No order is placed, no stock reserved, and no enquiry is falsely claimed sent.

Use `review/wholesale-check.mjs` and its `wholesale-results.json`/screenshots for enquiry, responsive and accessibility verification. Future backend conversion should replace preview preparation with a real quotation workflow while preserving the independent enquiry list and retail cart.


## About and policy page handoff

`about.html` is the product-led brand page: a typographic/lilac hero with a violet product poster, editorial introduction, three shop-category panels, product-information principles, adult-use note and Shop CTA. No founder names, founding dates, sales statistics, certifications or merchant history were invented.

`shipping.html`, `returns.html`, `privacy.html`, `terms.html` and `age-policy.html` share a readable policy layout with active page links, section anchors and a review-draft notice. They intentionally do not invent delivery regions/rates, return windows, refund timelines, merchant identity or contact details. See `POLICY-REVIEW.md` before publishing as final business policies.

Shared styling is `assets/pages.css`; shared navigation, photographic SVG hydration, footer accordion, conditional configured WhatsApp link, age-gate logic and a small reduced-motion-aware GSAP entrance are in `assets/js/pages.js`. Product backdrops stay behind transparent photos. Fonts, tokens and icon symbols are the existing ones. Desktop/mobile header labels remain Bulk Orders.

Policy pages remain readable without age confirmation; About retains the age gate. Shopping-page gates remain in their existing page logic. Privacy offers an explicit confirmation dialog to clear only `urban-preview-cart`, `urban-preview-wishlist`, `urban-wholesale-enquiry` and `urban-preview-age`; it leaves unrelated storage intact. Form/business details are not collected on these pages.

About and policy destinations are linked in existing footers. Checkout/account consent links open the standalone policy pages in a new tab to preserve the current form. Existing preview policy-dialog code is retained for other page functions, but those new links use native navigation.

The build now bundles 14 CSS sources and ships 14 HTML pages. Edit source CSS/HTML and rebuild; do not edit generated `assets/site.css` or `dist/` directly.

Verification for the About/policy addition: `review/pages-check.mjs` and `review/pages-results.json` cover six pages at five widths, policy anchors/menu/footer, age gate, privacy clear/cancel and animation fallback. Screenshots are in `review/about-*` and `review/{shipping,returns,privacy,terms,age-policy}-*`.

## Let's talk redirection & Back to top button handoff

- **Let's talk button**:
  - Replaced `<button class="whatsapp-button" data-info="contact">` with `<a class="whatsapp-button" href="contact.html" aria-label="Contact Urban Shisha">` across all pages.
  - In `assets/js/app.js`, `shop.js`, and `product.js`, `showInfo('contact')` redirects to `contact.html` (`window.location.href = 'contact.html'`).
  - Styled with `a.whatsapp-button { text-decoration: none; cursor: pointer; }`.
- **Back to top floating button**:
  - HTML markup: `<button class="back-to-top" id="back-to-top" aria-label="Back to top" title="Back to top"><svg aria-hidden="true"><use href="#i-arrow"/></svg></button>`.
  - Upward arrow SVG icon using `#i-arrow` rotated `-90deg`.
  - Design tokens: 44px × 44px circular pill, `--bg: #FAF7F2` (Ivory), 2px solid `--ink: #14121F` border, `3px 3px 0 var(--ink)` offset brutalist shadow. On hover: `--accent: #C6FF3D` (Lime), `3px 5px 0 var(--ink)`.
  - Behavior: controller in `assets/js/catalog.js` tracks `window.scrollY > 350`, toggling `.is-visible` via passive scroll and `requestAnimationFrame`. Click triggers `window.scrollTo({ top: 0, behavior: 'smooth' })` (or instant jump when `prefers-reduced-motion` is active) and restores focus to `#top`.
  - Stacking and mobile layout: stacks cleanly above `.whatsapp-button` (Desktop: `bottom: 80px; right: 22px;`, Mobile: `bottom: 148px; right: 15px;`, Wholesale: `bottom: 155px`). On pages without the Let's talk button (`contact.html`, `checkout.html`), anchors at `bottom: 22px; right: 22px;` (mobile `bottom: 20px; right: 15px;`). Zero collision or overlap with `.mobile-shop-bar`.



## Shared account header menu

Every page, including the compact Checkout header, has one `account-entry` with an `i-user` icon, `#account-trigger` disclosure button and `#account-shortcuts` panel. `assets/navigation.css` and `assets/js/navigation.js` own this shared component. All HTML pages load the script; it is included in lint/build/static verification. Do not add account-dropdown behaviour separately to individual page scripts.

Mouse hover opens the panel; click can keep it open. Touch uses tap to open/close. ArrowDown/ArrowUp on the trigger moves focus into the panel, Escape closes and restores trigger focus, and Tab/outside click closes naturally. Links use native navigation to Account, Orders, Addresses, Wishlist and Contact. The menu does not infer authentication, create a session or mutate account/cart data. The existing Account page still provides its clearly identified preview/demo flows.

Account and Shop/mobile menus coordinate opening. The account panel is repositioned inside the viewport with an available-height scroll limit; it is not a fullscreen overlay and does not lock page scrolling. Mobile keeps the account icon visible while the existing separate wishlist icon remains hidden. The Checkout header retains its compact layout with an added account icon; the decorative 18+ pill is hidden at small widths to preserve room for the logo and Back to bag link.
