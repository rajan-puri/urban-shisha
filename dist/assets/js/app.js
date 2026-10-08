/* Urban Shisha homepage preview. Replace catalog/commerce adapters with WooCommerce during conversion. */
(() => {
'use strict';
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const icon=(name)=>`<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const money=(n)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const products=window.UrbanCatalog.products;
const find=id=>products.find(p=>p.id===id);
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
let cart=read('urban-preview-cart',[]).filter(v=>find(v.id)&&Number.isInteger(v.qty)&&v.qty>0).map(v=>({...v,qty:Math.min(v.qty,99)}));
let saved=read('urban-preview-wishlist',[]).filter(id=>find(id));
function persist(){try{localStorage.setItem('urban-preview-cart',JSON.stringify(cart));localStorage.setItem('urban-preview-wishlist',JSON.stringify(saved));}catch{}updateCount();}
function updateCount(){const count=cart.reduce((n,v)=>n+v.qty,0);$$('.cart-count').forEach(el=>el.textContent=count);$('.bag-button').setAttribute('aria-label',`Open shopping bag, ${count} items`);}
// Load framed catalog photography near the viewport, including dynamically inserted cards.
const photoObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;$$('image[data-photo-src]',entry.target).forEach(img=>{img.setAttribute('href',img.dataset.photoSrc);img.removeAttribute('data-photo-src');});photoObserver.unobserve(entry.target);}),{rootMargin:'800px 0px'}):null;
function hydratePhotos(){ $$('image[data-photo-src]').forEach(img=>{if(photoObserver)photoObserver.observe(img.closest('.product-art'));else{img.setAttribute('href',img.dataset.photoSrc);img.removeAttribute('data-photo-src');}}); }
let photoFrameQueued=false;
new MutationObserver(()=>{if(photoFrameQueued)return;photoFrameQueued=true;requestAnimationFrame(()=>{photoFrameQueued=false;hydratePhotos();});}).observe(document.body,{childList:true,subtree:true});
// Vector viewports trim surrounding photo whitespace without altering the original files.
const imageFrames=window.UrbanCatalog.imageFrames;
function photo(index){const [x,y,w,h,sw,sh]=imageFrames[index];return `<svg class="catalog-photo" viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image data-photo-src="assets/images/product-cutout-${index}.webp" width="${sw}" height="${sh}"/></svg>`;}
function frameArt(el,index){el.classList.toggle('has-cutout',el.id==='builder-hookah');el.innerHTML=photo(index);}
function art(p,extra=''){return `<span class="product-art art-${p.art} ${extra}" role="img" aria-label="${p.name}">${photo(p.art)}</span>`;}
function card(p,overrideBadge){const rawBadge=overrideBadge||p.badge;const badge=({'The edit':'Bestseller','Signature':'Limited','Compact':'New','New':'New'})[rawBadge]||rawBadge;return `<article class="product-card" data-id="${p.id}"><div class="product-image"><button class="product-picture" data-product="${p.id}" aria-label="View ${p.name}">${art(p)}</button><button class="quick-add" data-add="${p.id}" aria-label="Quick add ${p.name} to bag">Quick add ${icon('plus')}</button>${badge?`<span class="product-badge badge-${badge.toLowerCase()}">${badge}</span>`:''}<button class="save-product ${saved.includes(p.id)?'is-saved':''}" data-save="${p.id}" aria-label="Save ${p.name}" aria-pressed="${saved.includes(p.id)}">${icon('heart')}</button></div><div class="product-info"><div><p class="product-type">${p.label}</p><button class="product-name" data-product="${p.id}">${p.name}</button><p class="price">${money(p.price)}</p></div><button class="add-product" data-add="${p.id}" aria-label="Add ${p.name} to bag">${icon('plus')}</button></div></article>`;}
const ribbonTemplate=$('.ticker-copy').innerHTML;
let motionStarted=false,gsapContext;
let budget='all',accessory='all';
function renderHookahs(){const result=products.filter(p=>p.type==='hookahs'&&(budget==='all'||budget==='under'&&p.price<5000||budget==='mid'&&p.price>=5000&&p.price<=10000||budget==='premium'&&p.price>10000));$('#hookah-products').innerHTML=result.map(p=>card(p)).join('');$('#hookah-products').setAttribute('aria-label',`${result.length} hookahs`);refreshMotion();}
function renderAccessories(){const result=products.filter(p=>p.type!=='hookahs'&&(accessory==='all'?['phunnel-bowl','heat-management','silicone-hose','mouthpiece','tongs','cleaning-brush'].includes(p.id):p.type===accessory));$('#accessory-products').innerHTML=result.map(p=>card(p)).join('');refreshMotion();}
function setBudget(value){budget=value;$$('[data-budget]').forEach(b=>{const active=b.dataset.budget===value;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',active);});renderHookahs();animateSwap($('#hookah-products'));}
function setAccessory(value,jump=false){accessory=value;$$('[data-accessory]').forEach(b=>{const active=b.dataset.accessory===value;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',active);});renderAccessories();animateSwap($('#accessory-products'));if(jump){closeAll();$('#accessories').scrollIntoView({behavior:reduceMotion()?'instant':'smooth'});}}
$$('.product-art').forEach(el=>{const match=el.className.match(/art-(\d+)/);if(match)frameArt(el,Number(match[1]));});
renderHookahs();renderAccessories();$('#arrival-products').innerHTML=['signature-chrome','ceramic-duo','heat-management','silicone-hose'].map(id=>card(find(id),'New')).join('');updateCount();$('#year').textContent=new Date().getFullYear();
// Product edit: four choices with a shared featured panel and looping navigation.
const spotlightProducts=products.filter(p=>p.type==='hookahs');let spotlightIndex=0;
const spotlightChoices=$('#spotlight-choices');
spotlightChoices.innerHTML=spotlightProducts.map((p,i)=>`<button class="spotlight-choice" data-spotlight-index="${i}" aria-pressed="false" aria-label="Feature ${p.name}"><span class="spotlight-choice-number">0${i+1}</span><span class="spotlight-choice-tag">${p.label}</span><span class="spotlight-choice-image">${art(p)}</span><span class="spotlight-choice-copy"><strong>${p.name}</strong><span>${money(p.price)}</span></span><span class="spotlight-choice-arrow" aria-hidden="true">${icon('arrow')}</span></button>`).join('');
function showSpotlight(index,animate=false){
 spotlightIndex=(index+spotlightProducts.length)%spotlightProducts.length;const p=spotlightProducts[spotlightIndex];
 const image=$('#spotlight-image'),copy=$('#spotlight-copy'),button=$('#spotlight-add');
 if(window.gsap)gsap.killTweensOf([image,copy]);
 image.innerHTML=art(p);image.dataset.product=p.id;image.setAttribute('aria-label',`View ${p.name}`);
 copy.innerHTML=`<p>${p.label}</p><h3>${p.name}</h3><strong>${money(p.price)}</strong>`;
 if(animate)clearTimeout(addFeedbackTimers.get(button));
 button.dataset.add=p.id;button.setAttribute('aria-label',`Add ${p.name} to bag`);button.classList.remove('is-added');button.innerHTML=`Add to bag ${icon('plus')}`;delete button.dataset.restHtml;
 $('#spotlight-position').textContent=`0${spotlightIndex+1} / 0${spotlightProducts.length}`;
 $$('[data-spotlight-index]').forEach((el,i)=>el.setAttribute('aria-pressed',i===spotlightIndex));
 if(animate){$('#spotlight-status').textContent=`${p.name}, ${money(p.price)}, product ${spotlightIndex+1} of ${spotlightProducts.length}`;if(window.gsap&&!reduceMotion()){const run=()=>gsap.fromTo([image,copy],{x:18,opacity:.25},{x:0,opacity:1,duration:.45,stagger:.06,ease:'power3.out',clearProps:'transform,opacity'});if(gsapContext)gsapContext.add(run);else run();}}
 hydratePhotos();
}
spotlightChoices.addEventListener('click',e=>{const choice=e.target.closest('[data-spotlight-index]');if(choice)showSpotlight(Number(choice.dataset.spotlightIndex),true);});
$('#spotlight-prev').addEventListener('click',()=>showSpotlight(spotlightIndex-1,true));
$('#spotlight-next').addEventListener('click',()=>showSpotlight(spotlightIndex+1,true));
showSpotlight(0);
const toast=$('#toast');let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),3500);}
function add(id,qty=1,quiet=false){if(!find(id))return;const row=cart.find(p=>p.id===id);if(row)row.qty=Math.min(99,row.qty+qty);else cart.push({id,qty});persist();if(!quiet)notify('Added to your setup 💨');}
function toggleSaved(id){saved=saved.includes(id)?saved.filter(p=>p!==id):[...saved,id];persist();$$(`[data-save="${id}"]`).forEach(b=>{const on=saved.includes(id);b.classList.toggle('is-saved',on);b.setAttribute('aria-pressed',on);});notify(saved.includes(id)?'Saved to your wishlist.':'Removed from your wishlist.');}
const drawer=$('#shop-dialog'),content=$('#content-dialog');let panel='';
function lock(){document.body.classList.toggle('is-locked',!!$('dialog[open]'));}
function openDialog(dialog){if(dialog.open)return;closeAll();dialog.showModal();lock();}
function closeAll(){[drawer,content].forEach(d=>{if(d.open)d.close();});lock();}
[drawer,content].forEach(d=>{d.addEventListener('close',lock);d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
function openPanel(mode){panel=mode;$('#drawer-title').textContent=mode==='cart'?'Your bag.':mode==='wishlist'?'Your saved edit.':'Find your next piece.';$('#drawer-eyebrow').textContent=mode==='search'?'EXPLORE THE COLLECTION.':'MAKE IT YOURS.';renderPanel();openDialog(drawer);if(mode==='search')setTimeout(()=>$('#catalog-search')?.focus(),50);}
function renderPanel(){const body=$('#drawer-body');if(panel==='cart'){
 if(!cart.length){body.innerHTML=`<div class="empty-state"><h3>A little room for character.</h3><p>Your bag is empty. Start with a hookah or find the finishing touches.</p><button class="button" data-browse>Explore the collection ${icon('arrow')}</button></div>`;return;}
 body.innerHTML=cart.map(row=>{const p=find(row.id);return `<div class="cart-item"><button class="cart-thumb" data-product="${p.id}" aria-label="View ${p.name}">${art(p)}</button><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="quantity-control"><button data-quantity="${p.id}" data-delta="-1" aria-label="Decrease ${p.name} quantity">−</button><span aria-label="Quantity ${row.qty}">${row.qty}</span><button data-quantity="${p.id}" data-delta="1" aria-label="Increase ${p.name} quantity">+</button></div></div><button class="remove-item" data-remove="${p.id}">Remove</button></div>`;}).join('')+`<div class="cart-summary"><span>Subtotal</span><strong>${money(cart.reduce((sum,row)=>sum+find(row.id).price*row.qty,0))}</strong></div><a class="view-full-cart" href="cart.html">View full bag ${icon('arrow')}</a><a class="button cart-checkout" href="checkout.html">Checkout ${icon('arrow')}</a><p class="cart-preview-note">Preview bag. Illustrative products and prices; no payment will be taken.</p>`;
 }else if(panel==='wishlist'){body.innerHTML=saved.length?`<div class="wishlist-products">${saved.map(id=>card(find(id))).join('')}</div>`:`<div class="empty-state"><h3>Keep an eye on your favourites.</h3><p>Tap the heart on a product to save it here for your next visit.</p><button class="button" data-browse>Discover your favourites ${icon('arrow')}</button></div>`;
 }else{body.innerHTML=`<label class="sr-only" for="catalog-search">Search the collection</label><input class="search-input" id="catalog-search" type="search" placeholder="Try ‘hookah’, ‘bowl’ or ‘hose’" autocomplete="off"><p class="search-meta" id="search-meta"></p><div id="search-results"></div>`;$('#catalog-search').addEventListener('input',e=>searchResults(e.target.value));searchResults('');}}
function searchResults(query){const result=products.filter(p=>`${p.name} ${p.label} ${p.type}`.toLowerCase().includes(query.trim().toLowerCase()));$('#search-meta').textContent=query?`${result.length} matching pieces`:'Explore the collection';$('#search-results').innerHTML=result.length?result.map(p=>`<button class="search-result" data-product="${p.id}">${art(p)}<span><h3>${p.name}</h3><p>${money(p.price)}</p></span></button>`).join(''):'<p class="search-meta">No matches. Try a different product or category.</p>';}
function productDetail(id){if(id==='studio-black'){location.href='product.html';return;}const p=find(id);if(!p)return;$('#content-body').innerHTML=`<div class="product-detail"><div class="product-detail-image">${art(p)}</div><div><p class="eyebrow">${p.label}</p><h2 id="content-title">${p.name}</h2><p class="detail-price">${money(p.price)}</p><p class="detail-description">${p.description}</p><button class="button" data-add="${p.id}">Add to bag ${icon('bag')}</button><button class="text-link" data-save="${p.id}" style="margin-top:20px">${saved.includes(id)?'Saved to wishlist':'Save to wishlist'} ${icon('heart')}</button><small>Reference product photo. Prices are illustrative; availability and specifications will be confirmed.</small></div></div>`;openDialog(content);}
const information={
 contact:['Your personal concierge.','Contact and WhatsApp support will open with the store. For now, explore the collection and save the pieces you like.'],
 social:['Stay close to the collection.','Our social channels will be linked when Urban Shisha launches.'],
 shipping:['Shipping & delivery.','Delivery locations, rates and timelines will be published before the store opens. No delivery promise is being made in this design preview.'],
 returns:['Returns & refunds.','The store’s returns, cancellation and refund policy will be published before purchases are enabled.'],
 orders:['Your orders, in one place.','Order tracking will be available through your account when the live store opens. This homepage preview does not place orders.'],
 account:['Make yourself at home.','Your account will bring together your orders and saved products when the store opens. You can already try the wishlist in this preview.'],
 privacy:['Your privacy matters.','A store privacy policy will explain data collection and handling before launch. In this preview, saved products and your bag stay in this browser; newsletter addresses are not submitted.'],
 terms:['Terms & conditions.','Purchase terms will be published with the live store. This homepage preview uses illustrative products and prices.'],
 age:['For adults only.','Urban Shisha is intended for adults aged 18 and over. Smoking is injurious to health.'],
 faq:['A few things to know.','This is the Urban Shisha homepage preview. Product prices and visuals are illustrative. Wishlist, product filters and your preview bag work locally in this browser. Shipping, payment, support and product specifications will be confirmed before launch.']
};
function showInfo(key){if(key==='account'){window.location.href='account.html';return;}if(key==='orders'){window.location.href='account.html?tab=orders';return;}const config=window.URBAN_STORE||{};const phone=String(config.whatsapp||'').replace(/\D/g,'');if(key==='contact'&&phone.length>=7&&phone.length<=15){window.open('https://wa.me/'+phone,'_blank','noopener,noreferrer');return;}if(key==='social'&&/^https:\/\/(www\.)?instagram\.com\//.test(config.instagram||'')){window.open(config.instagram,'_blank','noopener,noreferrer');return;}const [title,body]=information[key]||information.contact;$('#content-body').innerHTML=`<article class="article-content"><p class="eyebrow">URBAN SHISHA / GOOD TO KNOW</p><h2 id="content-title">${title}</h2><p>${body}</p><button class="button" data-browse>Explore the collection ${icon('arrow')}</button></article>`;openDialog(content);}
function showGuide(key){const first=key==='first';$('#content-body').innerHTML=`<article class="article-content"><p class="eyebrow">THE URBAN JOURNAL / ${first?'BUYING GUIDE':'THE DETAILS'}</p><h2 id="content-title">${first?'Find your first hookah.':'The pieces that fit.'}</h2>${first?'<p>A considered setup starts with a few practical choices. Compare the details before choosing a product.</p><h3>Start with your space.</h3><p>Consider the dimensions of the product and where it will sit. A compact silhouette and a larger statement piece have different storage needs.</p><h3>Check what is included.</h3><p>Compare the listed package contents. A product photograph does not always mean the bowl, hose, base and heat-management device are all included.</p><h3>Think beyond the first purchase.</h3><p>Look for clear material information, cleaning instructions and available replacement parts. Keep room in your budget for any required accessories.</p>':'<p>Small details determine whether your accessories fit together. Confirm specifications before building a combination.</p><h3>Bowl and heat-management fit.</h3><p>Check the bowl rim dimensions and the manufacturer’s compatibility guidance for your heat-management device.</p><h3>Hoses and connectors.</h3><p>Verify connector sizes, adapters and included seals. A compatible connector is more useful than a matching colour alone.</p><h3>Care and replacement parts.</h3><p>Follow the manufacturer’s cleaning instructions and use suitable brushes and replacement seals. Do not assume all accessories are universally compatible.</p>'}<button class="button" data-browse>Explore the collection ${icon('arrow')}</button></article>`;openDialog(content);}
const setupOptions={hookah:products.filter(p=>p.type==='hookahs'),bowl:products.filter(p=>p.type==='bowls'),heat:[find('heat-management')],charcoal:[find('coconut-charcoal')]};
Object.entries(setupOptions).forEach(([key,list])=>{$(`#setup-${key}`).innerHTML=list.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');});$('#setup-hookah').value='studio-black';
function chosenSetup(){return Object.keys(setupOptions).map(key=>find($(`#setup-${key}`).value));}
const personalisedChoices=new Set();
function updateSetup(animate=false){
 const selected=chosenSetup(),total=selected.reduce((sum,p)=>sum+p.price,0),totalNode=$('#setup-total'),old=Number(totalNode.dataset.total||0);totalNode.dataset.total=total;
 const views=['#builder-hookah','#builder-bowl','#builder-heat','#builder-charcoal'].map((id,i)=>{const el=$(id);el.className=`${i===0?'builder-hookah ':''}product-art art-${selected[i].art}`;frameArt(el,selected[i].art);el.setAttribute('aria-label',selected[i].name);return el;});
 const count=personalisedChoices.size;$('#vibe-label').textContent=`${count} / 4 personalised`;$('.vibe-meter').setAttribute('aria-valuenow',count);
 if(animate&&window.gsap&&!reduceMotion()){
  const run=()=>{gsap.fromTo(views,{y:16,scale:.94},{y:0,scale:1,duration:.45,stagger:.035,ease:'power3.out',clearProps:'transform'});const number={value:old};gsap.to(number,{value:total,duration:.55,ease:'power2.out',onUpdate:()=>totalNode.textContent=money(Math.round(number.value)),onComplete:()=>totalNode.textContent=money(total)});gsap.to('#vibe-fill',{scaleX:count/4,duration:.6,ease:'power3.out'});};
  if(gsapContext)gsapContext.add(run);else run();
 }else{totalNode.textContent=money(total);$('#vibe-fill').style.transform=`scaleX(${count/4})`;}
}
$('#setup-form').addEventListener('change',e=>{personalisedChoices.add(e.target.id);updateSetup(true);});$('#setup-form').addEventListener('submit',e=>{e.preventDefault();chosenSetup().forEach(p=>add(p.id,1,true));notify('Your four-piece setup is in the bag.');});updateSetup();
const menu=$('.mobile-toggle'),mobile=$('#mobile-nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);mobile.hidden=!open;menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.innerHTML=icon(open?'close':'menu');});
function closeMenu(){mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');menu.innerHTML=icon('menu');}
mobile.addEventListener('click',e=>{if(e.target.closest('a,button'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
// A single image-led category menu supports pointer, keyboard and touch navigation.
const megaToggle=$('#mega-toggle'),mega=$('#category-menu'),header=$('.site-header');let megaTimer;
function closeMega(returnFocus=false){clearTimeout(megaTimer);mega.hidden=true;megaToggle.setAttribute('aria-expanded','false');if(returnFocus)megaToggle.focus();}
function openMega(){clearTimeout(megaTimer);mega.hidden=false;megaToggle.setAttribute('aria-expanded','true');hydratePhotos();}
megaToggle.addEventListener('click',()=>mega.hidden?openMega():closeMega());
megaToggle.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();openMega();$('a',mega).focus();}});
megaToggle.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&matchMedia('(min-width:901px)').matches)openMega();});
mega.addEventListener('pointerenter',()=>clearTimeout(megaTimer));
header.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')megaTimer=setTimeout(()=>closeMega(),180);});
header.addEventListener('focusout',e=>{if(!header.contains(e.relatedTarget))closeMega();});
mega.addEventListener('click',e=>{if(e.target.closest('a'))closeMega();});
document.addEventListener('click',e=>{if(!header.contains(e.target))closeMega();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mega.hidden)closeMega(true);});
matchMedia('(max-width:900px)').addEventListener('change',()=>{closeMega();closeMenu();});

document.addEventListener('click',e=>{const category=e.target.closest('[data-nav-category]');if(category){e.preventDefault();closeMega();closeMenu();if(category.dataset.navCategory==='hookahs'){setBudget('all');$('#collection').scrollIntoView({behavior:reduceMotion()?'instant':'smooth'});}else setAccessory(category.dataset.navCategory,true);return;}const mood=e.target.closest('[data-mood]');if(mood){e.preventDefault();setBudget(mood.dataset.mood);closeAll();$('#collection').scrollIntoView({behavior:reduceMotion()?'instant':'smooth'});return;}const b=e.target.closest('button');if(!b)return;
 if(b.matches('.close-dialog')){b.closest('dialog').close();return;}
 if(b.dataset.open){openPanel(b.dataset.open);return;}
 if(b.dataset.product){productDetail(b.dataset.product);return;}
 if(b.dataset.add){confirmAdd(b);add(b.dataset.add);if(drawer.open&&panel==='cart')renderPanel();return;}
 if(b.dataset.save){pressFeedback(b,'heart');toggleSaved(b.dataset.save);if(drawer.open&&panel==='wishlist')renderPanel();if(content.open){const link=$('[data-save]',content);if(link)link.innerHTML=(saved.includes(b.dataset.save)?'Saved to wishlist':'Save to wishlist')+icon('heart');}return;}
 if(b.dataset.budget){setBudget(b.dataset.budget);return;}
 if(b.dataset.jumpBudget){setBudget(b.dataset.jumpBudget);closeAll();$('#collection').scrollIntoView({behavior:reduceMotion()?'instant':'smooth'});return;}
 if(b.dataset.accessory){setAccessory(b.dataset.accessory);return;}
 if(b.dataset.category){setAccessory(b.dataset.category,true);return;}
 if(b.dataset.quantity){const row=cart.find(p=>p.id===b.dataset.quantity);row.qty=Math.min(99,row.qty+Number(b.dataset.delta));cart=cart.filter(p=>p.qty>0);persist();renderPanel();return;}
 if(b.dataset.remove){cart=cart.filter(p=>p.id!==b.dataset.remove);persist();renderPanel();return;}
 if(b.hasAttribute('data-preview-checkout')){notify('Checkout will open with the live store.');return;}
 if(b.hasAttribute('data-browse')){closeAll();$('#collection').scrollIntoView({behavior:reduceMotion()?'instant':'smooth'});return;}
 if(b.dataset.info){showInfo(b.dataset.info);return;}
 if(b.dataset.guide){showGuide(b.dataset.guide);return;}
 if(b.matches('.footer-toggle')&&matchMedia('(max-width:600px)').matches){const open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',open);$('#'+b.getAttribute('aria-controls')).hidden=!open;}
});
function footerLayout(){const mobile=matchMedia('(max-width:600px)').matches;$$('.footer-toggle').forEach((b,i)=>{const open=!mobile||i===0;b.setAttribute('aria-expanded',open);b.setAttribute('tabindex',mobile?'0':'-1');$('#'+b.getAttribute('aria-controls')).hidden=!open;});}
footerLayout();matchMedia('(max-width:600px)').addEventListener('change',footerLayout);
$('#newsletter-form').addEventListener('submit',e=>{e.preventDefault();$('#newsletter-note').textContent='This is a preview. Your email has not been submitted.';notify('Subscriptions open when the store launches.');});
// Age confirmation controls the initial entrance. No escape or backdrop bypass.
const age=$('#age-dialog');
const ageAccepted=()=>{try{return localStorage.getItem('urban-preview-age')==='accepted';}catch{return false;}};
if(!ageAccepted()){age.showModal();lock();age.addEventListener('cancel',e=>e.preventDefault());}else requestAnimationFrame(startMotion);
$('#age-accept').addEventListener('click',()=>{try{localStorage.setItem('urban-preview-age','accepted');}catch{}age.close();lock();startMotion();});
$('#age-decline').addEventListener('click',()=>{$('.age-actions').hidden=true;$('#age-declined').hidden=false;});
function reduceMotion(){return matchMedia('(prefers-reduced-motion: reduce)').matches;}
function refreshMotion(){if(motionStarted&&window.ScrollTrigger)requestAnimationFrame(()=>ScrollTrigger.refresh());}
function animateSwap(container){if(!motionStarted||reduceMotion()||!window.gsap)return;gsapContext?.add(()=>gsap.fromTo([...container.children],{y:12},{y:0,duration:.32,stagger:.035,ease:'power2.out',clearProps:'transform'}));}
function pressFeedback(button,type='bag'){if(!motionStarted||reduceMotion()||!window.gsap)return;const el=type==='heart'?$('svg',button):button;gsapContext?.add(()=>gsap.fromTo(el,{scale:type==='heart'?.8:.85},{scale:1,duration:.4,ease:'back.out(3)',clearProps:'transform'}));}
const addFeedbackTimers=new WeakMap();
function confirmAdd(button){
 if(!button.dataset.restHtml)button.dataset.restHtml=button.innerHTML;clearTimeout(addFeedbackTimers.get(button));button.innerHTML=(button.classList.contains('quick-add')?'Added ':'')+icon('check');button.classList.add('is-added');
 if(gsapContext)gsapContext.add(()=>window.UrbanMotion?.added(button));
 addFeedbackTimers.set(button,setTimeout(()=>{button.innerHTML=button.dataset.restHtml;button.classList.remove('is-added');},1300));
}
function startMotion(){
 if(motionStarted||!window.gsap||!window.ScrollTrigger||!window.UrbanMotion||reduceMotion())return;
 motionStarted=true;gsap.registerPlugin(ScrollTrigger);gsapContext=UrbanMotion.start({ribbonTemplate});
}
// One scroll listener changes the nav's transform, without changing its layout height.
let navTick=false;
window.addEventListener('scroll',()=>{if(navTick)return;navTick=true;requestAnimationFrame(()=>{$('.site-header').classList.toggle('is-scrolled',scrollY>60);navTick=false;});},{passive:true});
matchMedia('(prefers-reduced-motion:reduce)').addEventListener('change',e=>{if(e.matches){gsapContext?.revert();gsapContext=undefined;motionStarted=false;}else if(!age.open)startMotion();});
window.UrbanShisha={catalog:products,version:'2.0.0',motion:'GSAP + ScrollTrigger'};
})();
