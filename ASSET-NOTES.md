# Generated imagery

Generated with the built-in imagegen tool for this design preview. These assets are concept imagery, not photographs or specifications of actual inventory. Replace them with real catalog photography when the store is connected. The original PNG files are preserved; WebP files are optimized format exports. The catalog is presented using CSS background positions; original raster assets have not been retouched.

## Hero

Saved: `assets/images/hero.png`, optimized: `assets/images/hero.webp`.

Prompt:

> Use case: product-mockup. A premium ecommerce campaign photograph for Urban Shisha homepage, landscape 3:2 composition. A single beautifully engineered modern hookah, dark forest emerald anodized stem with brushed polished stainless steel hardware, wide thin metal tray, ivory ceramic bowl at top, elegant clear heavy faceted glass base, one deep emerald silicone hose with slender silver mouthpiece resting naturally on the right. Entire product visible in frame from bowl to base with generous headroom. Hookah occupies right 60 percent with plenty of clean usable ivory negative space at left. Product stands on sculptural rough pale limestone slab, another pale limestone rock behind at right. Warm ivory studio background #F4F0E7; natural directional sunlight creates a subtle diagonal foliage shadow high on wall but no visible leaves. Editorial industrial design magazine product photography, exceptionally realistic reflective materials, thoughtful asymmetry, minimalist, high end, cool rather than ornate. No people, smoke, logos, text or watermark. No ornate gold ornamentation. Strong product silhouette and polished clear glass. This is a website photo asset, NOT a website mockup. Soft sophisticated shadow, neutral warm lighting, restrained contrast.

## Product sheet

Saved: `assets/images/catalog.png`, optimized: `assets/images/catalog.webp`.

Prompt (transparent background enabled):

> Use case: product-mockup. Create a precise ecommerce asset CONTACT SHEET on a genuinely TRANSPARENT background, twelve distinct photoreal product cutouts. Layout is EXACTLY 4 COLUMNS by 3 ROWS of equal cells, perfectly aligned. Every object isolated, centered within its cell with a full 15 percent clear margin; objects never cross cell boundaries. All photographs consistent warm neutral studio lighting, sophisticated industrial design quality, realistic metal/glass/ceramic reflections. Absolutely NO text, captions, frames, people, smoke, logos or watermarks.
> ROW 1 four premium modern hookahs complete with bowls, trays, metal stems, realistic glass water bases and a single elegant hose: column1 matteblack hookah with smoky glass base; column2 polished stainless chrome hookah with clear faceted glass base; column3 compact deep emerald green hookah with clear rounded glass base; column4 gunmetal carbon-textured slim hookah with dark glass base. Each entire hookah fitted inside cell from bowl to base, front three-quarter view, hose curves beside product with mouthpiece resting nearby.
> ROW 2 four accessories: column1 premium dark emerald and speckled ivory ceramic phunnel bowl; column2 brushed stainless steel circular heat management device with lid; column3 neatly coiled deep emerald silicone hose with brushed silver long mouthpiece; column4 slim brushed black aluminium standalone mouthpiece horizontal slightly diagonally angled.
> ROW 3 four everyday essentials: column1 polished steel hookah charcoal tongs elegantly angled; column2 black bristle cylindrical cleaning brush with slender metal handle slightly diagonal; column3 minimalist ivory and emerald charcoal cardboard box with several natural black coconut charcoal cubes beside it, blank unbranded box with no letters; column4 two small ceramic bowls one raw ivory speckled and one forest green glaze side by side.
> Canvas ratio 4:3 landscape. Transparent real alpha. Each equal cell has consistent slight grounding shadow, premium ecommerce cutout photos, no styled scenery. Need clear separations because website will display individual cells using CSS background positioning. Not a website mockup.

## Updated catalog photographs

The live homepage now uses twelve individual product photos downloaded from https://shishastore.in/ at the user's explicit request. The generated sheet remains as an unused original asset. Source image URLs, product page URLs and local filenames are recorded in `review/product-image-sources.json`. Images are kept unretouched and presented with individual vector viewports that remove surrounding whitespace while preserving the complete product and its proportions. Product names were changed to identify the pictured reference products; Urban Shisha prices remain illustrative rather than a copied or confirmed inventory feed. The campaign hero is still the generated concept photograph.

## Poster hero cutout

Saved: `assets/images/hookah-cutout.png` (transparent RGBA PNG). The built-in imagegen tool used `assets/images/shisha-product-0.webp` as the edit target. The new poster hero uses this cutout; the old campaign photograph remains as an unused source artifact.

Prompt:

> Use case: background-extraction. Edit the supplied exact product photograph only by removing the white background and its faint floor reflection, producing a genuinely transparent PNG cutout for an ecommerce homepage hero. Preserve the exact hookah identity and every product detail: dark bronze metal stem, bowl and lid, tray, slim mouthpiece at left, black silicone hose looping at right, green faceted glass water base. Do not redesign, relight, recolor, rotate, add smoke, text, scenery or modify any hardware. Preserve full product from top bowl to bottom glass base and entire hose and mouthpiece. Clean precise alpha edges; transparent glass should keep its physical glass appearance. Center product with only a small clear margin. The output is a cutout asset, NOT a mockup.

## Transparent catalog cutouts

All catalog displays now use `assets/images/product-cutout-0.webp` through `product-cutout-11.webp`. Item 0 reuses the earlier Brando hero cutout. Items 1–11 were edited with the built-in Imagegen tool from the matching original `shisha-product-N.webp` files, with `transparent_background: true`. Generated PNG originals are retained locally as `product-cutout-N.png`; lossless WebP encoding preserves their alpha. Original reference photographs remain untouched. Generated output paths are recorded in `review/cutout-manifest.json`.

Prompt used for each item (N is its catalog index):

> Edit target: the attached original product photograph, catalog item N. Make a precise ecommerce transparent-background cutout of exactly ALL the product objects shown. Remove ONLY the white/grey studio background and floor/reflection outside the physical objects, including background visible inside loops, hoses, spaces between objects and tiny holes. Preserve the same exact objects, arrangement, proportions, orientation, natural original colors, photographic detail, materials, highlights, branding and visible text. Do not redesign or add anything. No colored tint, no background, no opaque white rectangle, no checkerboard pixels, no ground plane, no added shadow. Retain genuinely white and silver surfaces on the physical products. Product fills around 85–90% of the canvas with a little clear margin; no cropping of any object. Return actual alpha transparency.

These are AI-derived preview cutouts rather than unchanged source photographs. Validate exact specifications/branding against merchant-supplied imagery for the live catalog.

## V2 optimisation

V2 reuses the existing transparent cutouts; no new AI imagery was generated for this revision. Product WebPs are encoded at quality 88, retaining the identical alpha channel. The twelve runtime cutouts shrink from approximately 7.53 MB to 1.95 MB. Original PNGs and reference photos remain locally available. WOFF2 encoding reduces the existing font files from approximately 831 KB to 293 KB without changing the typefaces. Mood decorations, smoke and connectors use native SVG/CSS.

## Supplied brand logos

Six unique logo images from the user's pasted Olive Shisha markup were downloaded to `assets/images/brands/brand-1.webp` through `brand-6.webp` (`brand-3.png` retains its original PNG format). Logos: Al Fakher, Nakhla, Serbetli, Revoshi, Jibiar and MustHave. They are rendered from local files with their original colours and transparency, not generated or redrawn. Exact URLs, byte sizes and filenames are recorded in `review/brand-image-sources.json`. Brand inventory is not included in the current preview catalog.

## Product-page reference assets

Brando original images: `assets/images/brando/brando-1.png` through `brando-3.png`, downloaded unchanged from the supplied product page. The first studio gallery image reuses the already-created transparent product cutout; the three originals retain their original white photography backgrounds and are labelled separate photographs. No background removal or recolouring was performed on these new downloads.

Additional local reference images: `assets/images/coconut-charcoal/photo-1.jpg`, `assets/images/silicone-hose/photo-1.png`, and `assets/images/sultan-base/photo-1.jpg` through `photo-4.jpg`. Original downloads are retained without altering products. Source URLs are recorded in `review/brando-image-sources.json` and `review/accessory-image-sources.json`; current product data snapshots are stored alongside them.
