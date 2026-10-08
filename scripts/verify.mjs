import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const html=await fs.readFile(path.join(root,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'Duplicate HTML IDs');
for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){const url=m[1];if(url.startsWith('#'))assert(ids.includes(url.slice(1)),`Missing anchor ${url}`);else if(!/^(https?:|data:|mailto:)/.test(url))await fs.access(path.join(root,url.split(/[?#]/)[0]));}
const shop=await fs.readFile(path.join(root,'shop.html'),'utf8');
const shopIds=[...shop.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(shopIds).size,shopIds.length,'Duplicate Shop IDs');
for(const m of shop.matchAll(/(?:src|href)="([^"]+)"/g)){const url=m[1];if(url.startsWith('#'))assert(shopIds.includes(url.slice(1)),`Missing Shop anchor ${url}`);else if(!/^(https?:|data:|mailto:)/.test(url))await fs.access(path.join(root,url.split(/[?#]/)[0]));}
for(const id of ['shop-filters','shop-products','shop-sort','shop-search','filter-dialog','age-dialog','shop-dialog','content-dialog'])assert(shopIds.includes(id),`Missing Shop component ${id}`);
const css=await fs.readFile(path.join(root,'assets/drop.css'),'utf8');
for(const [name,color] of Object.entries({bg:'#FAF7F2',primary:'#6C2BFF',accent:'#C6FF3D',pop:'#FF5C39',soft:'#E9E0FF',ink:'#14121F'}))assert(css.includes(`--${name}:${color}`),`Missing design token ${name}`);
for(let i=0;i<12;i++){await fs.access(path.join(root,`assets/images/shisha-product-${i}.webp`));await fs.access(path.join(root,`assets/images/product-cutout-${i}.webp`));}
for(const id of ['collection','categories','moods','details','accessories','arrivals','builder','guides','footer','setup-form','shop-dialog','content-dialog','age-dialog'])assert(ids.includes(id),`Missing component ${id}`);
assert.equal((html.match(/data-mood=/g)||[]).length,3);
console.log('Static checks passed: assets, anchors, component IDs and six design tokens.');

const productHtml=await fs.readFile(path.join(root,'product.html'),'utf8');const productIds=[...productHtml.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(productIds).size,productIds.length,'Duplicate Product IDs');
for(const m of productHtml.matchAll(/(?:src|href)="([^"]+)"/g)){const url=m[1];if(url.startsWith('#'))assert(productIds.includes(url.slice(1)),`Missing Product anchor ${url}`);else if(!/^(https?:|data:|mailto:)/.test(url))await fs.access(path.join(root,url.split(/[?#]/)[0]));}
for(const id of ['product-title','gallery-zoom','gallery-dialog','product-quantity','pdp-add','pdp-mobile-add','age-dialog','shop-dialog'])assert(productIds.includes(id),`Missing Product component ${id}`);

const cartHtml=await fs.readFile(path.join(root,'cart.html'),'utf8');const cartIds=[...cartHtml.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(cartIds).size,cartIds.length,'Duplicate Cart IDs');
for(const m of cartHtml.matchAll(/(?:src|href)="([^"]+)"/g)){const url=m[1];if(url.startsWith('#'))assert(cartIds.includes(url.slice(1)),`Missing Cart anchor ${url}`);else if(!/^(https?:|data:|mailto:)/.test(url))await fs.access(path.join(root,url.split(/[?#]/)[0]));}
for(const id of ['cart-layout','cart-items-list','cart-summary-aside','cart-empty','cart-item-count','summary-subtotal','summary-total','checkout-btn','mobile-checkout-btn','age-dialog','shop-dialog'])assert(cartIds.includes(id),`Missing Cart component ${id}`);

const checkoutHtml=await fs.readFile(path.join(root,'checkout.html'),'utf8');const checkoutIds=[...checkoutHtml.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(checkoutIds).size,checkoutIds.length,'Duplicate Checkout IDs');
for(const m of checkoutHtml.matchAll(/(?:src|href)="([^"]+)"/g)){const url=m[1];if(url.startsWith('#'))assert(checkoutIds.includes(url.slice(1)),`Missing Checkout anchor ${url}`);else if(!/^(https?:|data:|mailto:)/.test(url))await fs.access(path.join(root,url.split(/[?#]/)[0]));}
for(const id of ['checkout-layout','checkout-form','checkout-summary-aside','checkout-empty','contact-email','contact-phone','delivery-name','delivery-address1','delivery-city','delivery-state','delivery-pincode','billing-same','confirm-age','confirm-terms','submit-checkout','checkout-complete-dialog'])assert(checkoutIds.includes(id),`Missing Checkout component ${id}`);

const accountHtml=await fs.readFile(path.join(root,'account.html'),'utf8');const accountIds=[...accountHtml.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(accountIds).size,accountIds.length,'Duplicate Account IDs');
for(const m of accountHtml.matchAll(/(?:src|href)="([^"]+)"/g)){const url=m[1];if(url.startsWith('#'))assert(accountIds.includes(url.slice(1)),`Missing Account anchor ${url}`);else if(!/^(https?:|data:|mailto:)/.test(url))await fs.access(path.join(root,url.split(/[?#]/)[0]));}
for(const id of ['auth-view','dashboard-view','login-form','register-form','login-email','login-password','register-name','register-email','register-password','register-age','register-terms','explore-demo-btn','section-overview','section-orders','section-addresses','section-wishlist','section-details','address-dialog','delete-address-dialog'])assert(accountIds.includes(id),`Missing Account component ${id}`);

const contactHtml=await fs.readFile(path.join(root,'contact.html'),'utf8');const contactIds=[...contactHtml.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(contactIds).size,contactIds.length,'Duplicate Contact IDs');
for(const m of contactHtml.matchAll(/(?:src|href)="([^"]+)"/g)){const url=m[1];if(url.startsWith('#'))assert(contactIds.includes(url.slice(1)),`Missing Contact anchor ${url}`);else if(!/^(https?:|data:|mailto:)/.test(url))await fs.access(path.join(root,url.split(/[?#]/)[0]));}
for(const id of ['contact-hero-title','contact-layout','contact-form','contact-name','contact-email','contact-phone','contact-topic','order-ref-group','contact-order-ref','contact-message','contact-form-feedback','submit-contact','faq-heading','age-dialog'])assert(contactIds.includes(id),`Missing Contact component ${id}`);


const wholesaleHtml=await fs.readFile(path.join(root,'wholesale.html'),'utf8');const wholesaleIds=[...wholesaleHtml.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(wholesaleIds).size,wholesaleIds.length,'Duplicate Wholesale IDs');
for(const m of wholesaleHtml.matchAll(/(?:src|href)="([^"]+)"/g)){const url=m[1];if(url.startsWith('#'))assert(wholesaleIds.includes(url.slice(1)),`Missing Wholesale anchor ${url}`);else if(!/^(https?:|data:|mailto:)/.test(url))await fs.access(path.join(root,url.split(/[?#]/)[0]));}
for(const id of ['ws-title','ws-products','enquiry-list','ws-quote-form','ws-review-dialog','ws-prepared-message','age-dialog'])assert(wholesaleIds.includes(id),`Missing Wholesale component ${id}`);

for(const filename of ['about.html','shipping.html','returns.html','privacy.html','terms.html','age-policy.html']){
 const content=await fs.readFile(path.join(root,filename),'utf8');
 const pageIds=[...content.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(pageIds).size,pageIds.length,`Duplicate IDs: ${filename}`);
 for(const m of content.matchAll(/(?:src|href)="([^"]+)"/g)){
  const url=m[1];if(url.startsWith('#'))assert(pageIds.includes(url.slice(1)),`Missing anchor ${url}: ${filename}`);
  else if(!/^(https?:|data:|mailto:)/.test(url))await fs.access(path.join(root,url.split(/[?#]/)[0]));
 }
 assert.equal((content.match(/<h1[ >]/g)||[]).length,1,`Expected one h1: ${filename}`);
 for(const id of ['main','footer','age-dialog','category-menu','mobile-nav','back-to-top'])assert(pageIds.includes(id),`Missing ${id}: ${filename}`);
}

for(const [pName, pHtml, pIds] of [
 ['index.html', html, ids],
 ['shop.html', shop, shopIds],
 ['product.html', productHtml, productIds],
 ['cart.html', cartHtml, cartIds],
 ['checkout.html', checkoutHtml, checkoutIds],
 ['account.html', accountHtml, accountIds],
 ['contact.html', contactHtml, contactIds],
 ['wholesale.html', wholesaleHtml, wholesaleIds]
]){
 assert(pIds.includes('back-to-top'), `Missing back-to-top button in ${pName}`);
 if(pHtml.includes('class="whatsapp-button"')){
  assert(pHtml.includes('class="whatsapp-button" href="contact.html"'), `whatsapp-button must link to contact.html in ${pName}`);
 }
}


for(const filename of ['index.html','shop.html','product.html','cart.html','checkout.html','account.html','contact.html','wholesale.html','about.html','shipping.html','returns.html','privacy.html','terms.html','age-policy.html']){
 const content=await fs.readFile(path.join(root,filename),'utf8');
 assert.equal((content.match(/id="account-trigger"/g)||[]).length,1,`One account trigger expected: ${filename}`);
 assert.equal((content.match(/id="account-shortcuts"/g)||[]).length,1,`One account dropdown expected: ${filename}`);
 assert(content.includes('assets/js/navigation.js'),`Missing shared navigation script: ${filename}`);
 assert(content.includes('id="i-user"'),`Missing account icon symbol: ${filename}`);
}
