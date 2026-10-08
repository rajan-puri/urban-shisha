/* Shared About / policy navigation. No commerce mutations except explicit privacy clear. */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const {products,imageFrames}=window.UrbanCatalog;
const icon=n=>`<svg aria-hidden="true"><use href="#i-${n}"/></svg>`;
const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
function read(key){try{return JSON.parse(localStorage.getItem(key));}catch{return null;}}
let toastTimer,megaTimer,motion;
function notify(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3000);}
function lock(){document.body.classList.toggle('is-locked',!!$('dialog[open]'));}
function loadPhoto(el){const img=$('image[data-photo-src]',el);if(img){img.setAttribute('href',img.dataset.photoSrc);delete img.dataset.photoSrc;}}
const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){loadPhoto(e.target);observer.unobserve(e.target);}}),{rootMargin:'400px 0px'}):null;
$$('.product-art').forEach(el=>{const p=products.find(p=>el.classList.contains('art-'+p.art));if(!p)return;const [x,y,w,h,sw,sh]=imageFrames[p.art];el.innerHTML=`<svg class="catalog-photo" viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image data-photo-src="assets/images/product-cutout-${p.art}.webp" width="${sw}" height="${sh}"/></svg>`;if(el.closest('.about-hero'))loadPhoto(el);else if(observer)observer.observe(el);else loadPhoto(el);});
const header=$('.site-header'),mega=$('#category-menu'),toggle=$('#mega-toggle'),mobile=$('#mobile-nav'),menu=$('.mobile-toggle');
function closeMega(){clearTimeout(megaTimer);mega.hidden=true;toggle.setAttribute('aria-expanded','false');}
function openMega(){clearTimeout(megaTimer);mega.hidden=false;toggle.setAttribute('aria-expanded','true');$$('.product-art',mega).forEach(loadPhoto);}
function closeMobile(){mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');menu.innerHTML=icon('menu');}
toggle.addEventListener('click',()=>mega.hidden?openMega():closeMega());
toggle.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();openMega();$('a',mega).focus();}});
toggle.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&matchMedia('(min-width:901px)').matches)openMega();});
mega.addEventListener('pointerenter',()=>clearTimeout(megaTimer));header.addEventListener('pointerleave',()=>megaTimer=setTimeout(closeMega,180));
header.addEventListener('focusout',e=>{if(!header.contains(e.relatedTarget))closeMega();});
menu.addEventListener('click',()=>{const show=mobile.hidden;mobile.hidden=!show;menu.setAttribute('aria-expanded',show);menu.setAttribute('aria-label',show?'Close navigation':'Open navigation');menu.innerHTML=icon(show?'close':'menu');if(show)$$('.product-art',mobile).forEach(loadPhoto);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!mobile.hidden){closeMobile();menu.focus();}if(!mega.hidden){closeMega();toggle.focus();}}});
document.addEventListener('click',e=>{if(!header.contains(e.target))closeMega();});
matchMedia('(max-width:900px)').addEventListener('change',()=>{closeMega();closeMobile();});
const footerMQ=matchMedia('(max-width:600px)');
function footerLayout(){$$('.footer-toggle').forEach((b,i)=>{const expanded=!footerMQ.matches||i===0;b.setAttribute('aria-expanded',expanded);b.tabIndex=footerMQ.matches?0:-1;$('#'+b.getAttribute('aria-controls')).hidden=!expanded;});}
footerLayout();footerMQ.addEventListener('change',footerLayout);
function showActivePolicy(){const nav=$('.policy-switcher'),active=$('.policy-switcher [aria-current]');if(nav&&active&&matchMedia('(max-width:900px)').matches)nav.scrollLeft=Math.max(0,active.offsetLeft-nav.offsetLeft-(nav.clientWidth-active.clientWidth)/2);}
requestAnimationFrame(showActivePolicy);matchMedia('(max-width:900px)').addEventListener('change',showActivePolicy);
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.open==='search'){location.href='shop.html';return;}
 if(b.dataset.category){location.href='shop.html?category='+encodeURIComponent(b.dataset.category);return;}
 if(b.matches('.footer-toggle')&&footerMQ.matches){const show=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',show);$('#'+b.getAttribute('aria-controls')).hidden=!show;return;}
 if(b.dataset.info==='contact'||b.dataset.info==='faq'){location.href='contact.html'+(b.dataset.info==='faq'?'#faq-heading':'');return;}
 if(b.dataset.info==='social'){const url=window.URBAN_STORE?.instagram||'';if(/^https:\/\/(www\.)?instagram\.com\//.test(url))window.open(url,'_blank','noopener,noreferrer');else notify('Instagram details will be added when available.');}
});
$('#newsletter-form').addEventListener('submit',e=>{e.preventDefault();$('#newsletter-note').textContent='Preview only. Your email has not been submitted.';notify('Subscriptions open with the live store.');});
$('#year').textContent=new Date().getFullYear();
function headerCount(){const rows=read('urban-preview-cart'),count=Array.isArray(rows)?rows.filter(p=>p&&products.some(item=>item.id===p.id)&&Number.isInteger(p.qty)&&p.qty>0).reduce((sum,p)=>sum+p.qty,0):0;$$('.cart-count').forEach(el=>el.textContent=count);$('.bag-button').setAttribute('aria-label',`Open shopping bag, ${count} items`);}
headerCount();window.addEventListener('pageshow',headerCount);window.addEventListener('storage',e=>{if(e.key==='urban-preview-cart')headerCount();});
function entrance(){if(!window.gsap||reduced())return;motion?.revert();motion=gsap.context(()=>gsap.from('.about-hero-copy,.about-cover,.policy-hero-grid',{y:20,duration:.55,stagger:.07,ease:'power3.out',clearProps:'transform'}));}
const age=$('#age-dialog');age.addEventListener('cancel',e=>e.preventDefault());
let accepted=false;try{accepted=localStorage.getItem('urban-preview-age')==='accepted';}catch{}
// Policy information is readable without confirming adult access to the catalogue.
if(!accepted&&document.body.classList.contains('about-page')){age.showModal();lock();}else requestAnimationFrame(entrance);
$('#age-accept').addEventListener('click',()=>{try{localStorage.setItem('urban-preview-age','accepted');}catch{}age.close();lock();entrance();});
$('#age-decline').addEventListener('click',()=>{$('.age-actions').hidden=true;$('#age-declined').hidden=false;});
const clear=$('#clear-data-dialog');
if(clear){$('#clear-preview-data').addEventListener('click',()=>{clear.showModal();lock();});$('#cancel-clear-data').addEventListener('click',()=>clear.close());clear.addEventListener('close',lock);$('#confirm-clear-data').addEventListener('click',()=>{let success=true;for(const key of['urban-preview-cart','urban-preview-wishlist','urban-wholesale-enquiry','urban-preview-age'])try{localStorage.removeItem(key);}catch{success=false;}headerCount();clear.close();$('#storage-feedback').textContent=success?'Your saved Urban Shisha choices have been cleared from this browser.':'Browser storage could not be cleared. Use your browser’s site-data settings.';$('#clear-preview-data').focus();});}
matchMedia('(prefers-reduced-motion:reduce)').addEventListener('change',()=>motion?.revert());
let queued=false;window.addEventListener('scroll',()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{header.classList.toggle('is-scrolled',scrollY>30);queued=false;});},{passive:true});
})();
