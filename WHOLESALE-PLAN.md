# Urban Shisha — Wholesale page and deferred 3D plan

Saved: 8 October 2026.
Status: **Wholesale page implemented; 3D animation still deferred.** The user resumed the page-only work. `wholesale.html` now exists and main navigation points to Wholesale. Do not add React/R3F dependencies or implement the warehouse/truck/store scene until requested.

## Intended change

The user wants the “Build your setup” navigation item to become a Wholesale/bulk-order destination. Current navigation label: **Bulk Orders**. Proposed heading: **BULK ORDERS. BUILT AROUND YOU.**

The homepage retail setup builder remains intact. The main desktop/mobile navigation and mega-menu bulk destination now point to Wholesale; the retail builder remains available through its content/footer links.

Read `design.md` and inspect the then-current project before implementation. Preserve its approved visual identity: ivory #FAF7F2, violet #6C2BFF, lime #C6FF3D, lilac #E9E0FF, ink #14121F; Space Grotesk/Manrope, readable content, large product imagery and strong mobile layouts.

## Wholesale flow

Use a quotation enquiry flow rather than pretending retail prices are wholesale rates.

1. Hero with Request a Quote and configured WhatsApp Enquiry actions.
2. Bulk categories: Hookahs, Bowls, Heat Management, Hoses, Charcoal, Tools.
3. Product/quantity enquiry builder supporting several products/categories. Maintain a separate enquiry list, not the retail cart.
4. Business details: contact name, business name/type, city/PIN, email, WhatsApp number; optional GSTIN, delivery preference and requirements.
5. Process: Send requirements → Receive quotation → Confirm order.

Show “Wholesale quote on request” until actual wholesale pricing exists. Do not invent MOQ, discount tiers, delivery promises, stock or shipping rates. Confirm these business terms with the user during implementation if they are still unavailable.

A useful initial integration: prepare a WhatsApp message containing the selected products, quantities and enquiry details. The customer reviews and sends it themselves to the configured business number. A future backend can store enquiries and notify the store. Do not claim successful submission without an actual connected channel. Avoid browser persistence of personal/business contact data without a defined requirement.

## Signature 3D hero scene

The user requested a miniature/isometric animated world with:

- Warehouse behind or beside the shop, shelves, cartons and open loading gate.
- Branded delivery truck near the loading area.
- Small workers taking goods from the warehouse and loading them into the truck.
- Urban Shisha storefront in front, with glass frontage, visible hookah displays and a counter.
- Adult customers entering, purchasing and leaving with branded shopping bags.
- Several activities staggered so the scene feels alive rather than resetting all characters together.

References supplied in the conversation:

1. Cutaway warehouse illustration with shelves, workers and forklifts.
2. Isometric warehouse exterior/interior with loading ramp and truck.
3. Warehouse loading bays with trucks and cartons.
4. Detailed miniature shop render, labelled “SHRIRAM CATERERS”, used for the miniature storefront feel only.

These are visual references, not Urban Shisha assets. Some supplied references contain watermarks or another business’s branding; do not reuse them as finished scene textures. Create original Urban Shisha buildings/signage. Images remain in the conversation; this note does not claim copies exist in the project.

The scene is conceptual. Do not present it as a photo or proof of an actual Urban Shisha warehouse/store.

## Preferred technical direction

The user asked specifically about **React Three Fiber**. Proposed approach: use R3F + Three.js for a dedicated React 3D hero component, mounted inside the existing HTML page. Keep surrounding page content, quotation form and navigation in the current site architecture. Do not migrate the whole site to React just to add this scene.

Build the scene component into local assets that can later be enqueued/mounted by the custom WordPress theme. Choose compatible React/R3F/Three.js versions when implementation starts; this note does not pin versions.

R3F renders/composes the scene but does not automatically create realistic models or character animation. Assets still need modelling/rigging/animation work:

- Buildings, shelves, truck and cartons can start as original stylised procedural geometry.
- Polished human motion requires articulated/rigged characters and suitable walk/carry/place animation, or a carefully built stylised equivalent.
- For a character carrying a carton, attach it coherently to the hands; transfer it into the truck at the placement moment. Do not slide a whole static character model and call it walking.
- Use GLTF/GLB for authored models and clips when appropriate. Track asset licences and provenance.

The intended aesthetic is **stylised miniature 3D** with premium lighting and the existing palette, rather than promising photorealism from basic primitive shapes.

## Animation choreography

Initial proposal: a seamless approximately 15–20 second activity loop, refined after preview.

- Worker: approach shelf → pick up carton → walk to truck → place carton → return.
- Another worker follows a separate offset route to avoid collisions and synchronised resets.
- Customer: arrive → enter store → interact at counter → leave carrying a bag.
- Other customers enter/leave at different times.
- Subtle door movement, bag swing and lighting details support the main action.
- Use intentional depth ordering, spatial routes and correct hand/box relationships.
- Camera: isometric/orthographic-style composition, subtle optional fine-pointer parallax. No uncontrolled orbit or scroll hijacking.

Keep Request a Quote and essential copy in accessible HTML outside the canvas. Animation must not obstruct the enquiry flow.

## Performance and accessibility

- Start with a simple blockout to validate composition, then improve assets and movement.
- Desktop gets the full scene; mobile gets reduced character/detail counts and lighter rendering.
- Lazy-load the scene appropriately, with a good static poster/loading fallback.
- Pause activity when offscreen or the tab is hidden.
- Honour reduced motion with a static or restrained view.
- Provide a fallback if WebGL cannot run or the scene fails to load; the page/form must remain usable.
- Limit expensive shadows, post-processing, textures and pixel density; reuse/instance repeated props.
- Do not claim 60fps universally. Measure on actual target devices.
- Test both the 3D hero and full page at 1440, 1024, 768 and 390px, including canvas fallback and keyboard access to all HTML controls.

## Suggested implementation sequence when resumed

1. Inspect the latest `design.md`, pages and build pipeline.
2. Confirm wholesale terms/contact integration and decide where the retail builder remains.
3. Build the wholesale page and working enquiry interactions.
4. Create a 3D scene blockout with warehouse, truck and storefront.
5. Preview composition on desktop/mobile before detailed character work.
6. Add character/box/customer choreography and refine the seamless loop.
7. Optimise performance and fallback behaviour, then verify accessibility and enquiry functionality.
8. Update design/build documentation and provide a reviewable preview.

## Official technical references

Verify current docs/version compatibility when work resumes:

- R3F introduction: https://r3f.docs.pmnd.rs/getting-started/introduction
- Model loading: https://r3f.docs.pmnd.rs/tutorials/loading-models
- Performance: https://r3f.docs.pmnd.rs/advanced/scaling-performance
