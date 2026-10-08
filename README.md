# Urban Shisha — Homepage, Shop, Product, Cart & Checkout

A separate enhanced copy of `/Users/rajan/Downloads/urban-shisha-homepage`. The original homepage remains unchanged.

## Preview and build

Run `npm start`, then open http://127.0.0.1:8091/. Run `npm run lint` and `npm run build` to verify and generate `dist/`.

The preview server compresses HTML, CSS, JavaScript and SVG. The build combines the thirteen CSS source files into `assets/site.css`. Edit the source stylesheets, then rebuild to refresh the bundle.

## What's included

- Bigger transparent hookah hero, layered headline, rim light, ground shadow, floating stickers, smoke and staggered GSAP entrance after a short loader.
- Pointer parallax, large illustrated mood cards, draggable snapping hookah rail, interactive one-large/four-small product spotlight and scroll reveals.
- Four-part setup builder with image changes, animated total and a personalisation meter; quick add, confirmation, bag feedback and wishlist.
- Direction-aware looping ribbon, animated footer lettering, keyboard controls and mobile shopping bar.
- Existing categories, image mega menu, budget collections, accessories, new arrivals, guides, age gate and large footer.
- Reduced-motion support and working shopping controls when animation libraries are unavailable.

The weekly counter is visibly labelled demo data. The builder meter counts how many of the four selections you have personalised, not product quality or compatibility.

## Scope and conversion

This is a working HTML/CSS/vanilla JavaScript homepage, Shop and Product preview, ready to split into custom WordPress theme templates. It is not yet an installable theme or connected WooCommerce shop. Prices, stock and combinations remain preview data. Bag and wishlist use local browser storage. Payments, subscriptions and orders are not submitted.

For WordPress conversion, split header/front-page/footer template parts, enqueue local styles/scripts, replace catalog and bag logic with WooCommerce APIs and real permalinks, and connect real account, checkout, contact and policy pages. Configure contact channels in `assets/js/config.js`.

## Validation

Chrome interaction and layout checks passed at 1440, 1024, 768 and 390 pixels with no horizontal overflow, missing resources or JavaScript errors. Automated accessibility checks found zero WCAG A/AA violations at these widths. Reduced motion and blocked animation-library fallback passed.

Earlier V2 homepage cold-load mobile Lighthouse, before the Shop/brand addition: accepted homepage **89 performance / 100 accessibility / CLS 0**; first visit with age gate **88 / 100 / CLS 0**. Reports and browser previews are in `review/`. These are local simulated mobile results, not physical-device or future WordPress hosting guarantees.

Read [`design.md`](design.md) for the design rules and development handoff. See `CHANGES.md` for files and assets, and `ASSET-NOTES.md` for image provenance. Runtime fonts, imagery and GSAP are local; no CDN is required.

## Shop page and brand discovery

Open http://127.0.0.1:8091/shop.html. Category, brand, minimum/maximum price, new arrivals and text search combine. Sorting supports featured, price ascending/descending and name. Active filter chips are removable, Reset clears the edit, and URL parameters preserve selections on reload. Mobile filters use an accessible dialog with a live result count. The sidebar stays scrollable on desktop.

Homepage “Shop by brand” sits after categories. Six supplied logos are saved locally without alteration; their links open the corresponding Shop brand filter. These flavour brands currently have no items in the existing hardware-only preview catalog, so the page explains that the brand catalog is pending. No inventory or prices were invented for them. Existing hardware brands are filterable too.

Both pages share `assets/js/catalog.js` and the same bag, wishlist and age-choice storage. `shop.html`, `assets/shop.css` and `assets/js/shop.js` implement the new page. Build includes all fourteen HTML files and all local images. Source image URLs are in `review/brand-image-sources.json`. Shop interaction/accessibility results are in `review/shop-results.json`; screenshots are in `review/shop-*.png`.

## Brando product page

Open http://127.0.0.1:8091/product.html. Brando cards on Home/Shop now open this page. It includes a large transparent studio visual plus three unchanged local source photos, thumbnail/arrow navigation, keyboard-accessible zoom, quantity, wishlist, shared bag, mobile sticky buy action, source specifications, included-item list, care/shipping panels, accessories and related hookahs. Animations honour reduced motion; buying controls work without GSAP.

The live reference currently lists Brando at ₹9,499, coal (250g / 18 pcs) at ₹135, and the VG gold-handle / black hose at ₹799. These reference values are reflected in the preview catalog, without claiming Urban Shisha stock or adopting reference-store free gifts/reviews. Archived source JSON and exact image URLs are in `review/`.

The additional Sultan Base reference is a VG replacement base specifically for Sultan Hookah; it is not shown as a compatible Brando accessory. Its listed width “9 inches / 20cm” is inconsistent, so verify it before catalog entry. Its four photos are downloaded locally for later use.

## Saved future idea

[`WHOLESALE-PLAN.md`](WHOLESALE-PLAN.md) records the deferred Wholesale enquiry page and animated React Three Fiber miniature warehouse/store scene. The page and navigation are now implemented; React/3D animation remains deferred.

## Wholesale

Open http://127.0.0.1:8091/wholesale.html. Select products, adjust quantities, add business details and review/copy a bulk enquiry. Only product/quantity selections persist under `urban-wholesale-enquiry`; retail cart data remains separate. WhatsApp/email sending links appear only for configured channels, and no message or order is sent automatically. Main navigation now links to Wholesale; the homepage retail builder is retained. No React/3D scene is added in this phase.


## About and policies

Open `about.html` for the new brand page. Standalone policies are `shipping.html`, `returns.html`, `privacy.html`, `terms.html` and `age-policy.html`. Existing footer links point to these pages; About is under Discover. They use `assets/pages.css` / `assets/js/pages.js` and are included in lint/build/static verification. Policy business terms remain clearly marked review drafts; fill the real merchant and operational details in `POLICY-REVIEW.md` before live use.
