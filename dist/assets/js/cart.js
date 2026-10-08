/* Cart page logic — Urban Shisha preview cart, live quantity adjustments, totals, and wishlist sync. */
(()=>{
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const { products, brands, imageFrames } = window.UrbanCatalog;
const find = id => products.find(p => p.id === id);
const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escape = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

let cart = read('urban-preview-cart', [])
  .filter(v => find(v.id) && Number.isInteger(v.qty) && v.qty > 0)
  .map(v => ({ ...v, qty: Math.max(1, Math.min(99, v.qty)) }));

let saved = read('urban-preview-wishlist', []).filter(id => find(id));
let toastTimer;

// Finish/variant details matching catalog & design specifications
const variants = {
  'studio-black': 'Bronze Stem / Green Line Base (32″)',
  'signature-chrome': 'Slims Sterling Finish (30″)',
  'compact-emerald': 'Matte Emerald Compact Finish',
  'carbon-edition': 'Carbon Fiber & Stainless Steel',
  'phunnel-bowl': 'Glazed Ceramic (Phunnel)',
  'heat-management': 'Machined Heat Management Unit',
  'silicone-hose': 'Gold Metal Handle / Black Silicone Pipe (5ft)',
  'mouthpiece': 'Matte Black Compact Handle',
  'tongs': 'Gold Stainless Steel Tongs',
  'cleaning-brush': 'Foil Puncher Setup Tool',
  'coconut-charcoal': '250g / 18 Cubes (2.5cm)',
  'ceramic-duo': 'Silicone Funnel Bowl Finish'
};

function art(p) {
  const [x, y, w, h, sw, sh] = imageFrames[p.art];
  return `<span class="product-art art-${p.art}" role="img" aria-label="${p.name}"><svg class="catalog-photo" viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href="assets/images/product-cutout-${p.art}.webp" width="${sw}" height="${sh}"/></svg></span>`;
}

function updateHeaderCount() {
  const n = cart.reduce((sum, p) => sum + p.qty, 0);
  $$('.cart-count').forEach(el => el.textContent = n);
  const bagBtn = $('.bag-button');
  if (bagBtn) bagBtn.setAttribute('aria-label', `Open shopping bag, ${n} items`);
}

function persist() {
  try {
    localStorage.setItem('urban-preview-cart', JSON.stringify(cart));
    localStorage.setItem('urban-preview-wishlist', JSON.stringify(saved));
  } catch {}
  updateHeaderCount();
}

function notify(text) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
}

// Dialog management
const drawer = $('#shop-dialog');
const content = $('#content-dialog');
const checkoutDialog = $('#checkout-preview-dialog');
const ageDialog = $('#age-dialog');

function lock() {
  document.body.classList.toggle('is-locked', !!$('dialog[open]'));
}

function openDialog(d) {
  if (!d || d.open) return;
  [drawer, content, checkoutDialog].forEach(dialog => {
    if (dialog && dialog.open) dialog.close();
  });
  d.showModal();
  lock();
}

[drawer, content, checkoutDialog].forEach(d => {
  if (!d) return;
  d.addEventListener('close', lock);
  d.addEventListener('click', e => {
    if (e.target !== d) return;
    const r = d.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
  });
});

function renderRow(row) {
  const p = find(row.id);
  if (!p) return '';
  const isSaved = saved.includes(p.id);
  const variant = variants[p.id] || p.label;
  const targetUrl = p.id === 'studio-black' ? 'product.html' : 'shop.html';
  const lineTotal = p.price * row.qty;

  return `
    <article class="cart-row" data-id="${p.id}" id="cart-row-${p.id}">
      <div class="cart-row-grid">
        <a href="${targetUrl}" class="cart-row-thumb" aria-label="View ${p.name}">
          ${art(p)}
        </a>
        <div class="cart-row-content">
          <div class="cart-row-info">
            <span class="cart-row-brand">${escape(p.brand || 'URBAN SHISHA')}</span>
            <h3 class="cart-row-title">
              <a href="${targetUrl}">${escape(p.name)}</a>
            </h3>
            <p class="cart-row-variant"><span class="cart-field-label">Spec:</span><strong>${escape(variant)}</strong></p>
            <div class="cart-row-actions">
              <button type="button" class="cart-action-btn cart-save-btn ${isSaved ? 'is-saved' : ''}" data-cart-save="${p.id}" aria-pressed="${isSaved}">
                ${icon('heart')}
                <span>${isSaved ? 'Saved to wishlist' : 'Save to wishlist'}</span>
              </button>
              <button type="button" class="cart-action-btn cart-remove-btn" data-cart-remove="${p.id}" aria-label="Remove ${escape(p.name)} from bag">
                ${icon('close')}
                <span>Remove</span>
              </button>
            </div>
          </div>
          <div class="cart-row-pricing">
            <div class="cart-row-unit-price">
              <span class="cart-field-label">Price:</span>
              <span>${money(p.price)}</span>
            </div>
            <div class="cart-row-qty">
              <span class="cart-field-label">Qty:</span>
              <div class="cart-qty-ctrl" role="group" aria-label="Quantity for ${escape(p.name)}">
                <button type="button" class="cart-qty-btn" data-cart-qty="${p.id}" data-delta="-1" aria-label="Decrease ${escape(p.name)} quantity" ${row.qty <= 1 ? 'disabled' : ''}>−</button>
                <label class="sr-only" for="qty-${p.id}">Quantity</label>
                <input type="number" id="qty-${p.id}" class="cart-qty-input" data-input-qty="${p.id}" min="1" max="99" value="${row.qty}" inputmode="numeric">
                <button type="button" class="cart-qty-btn" data-cart-qty="${p.id}" data-delta="1" aria-label="Increase ${escape(p.name)} quantity" ${row.qty >= 99 ? 'disabled' : ''}>+</button>
              </div>
            </div>
            <div class="cart-row-total">
              <span class="cart-field-label">Total:</span>
              <strong class="line-total-amount" id="line-total-${p.id}">${money(lineTotal)}</strong>
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderCart(animate = false) {
  const listEl = $('#cart-items-list');
  const emptyEl = $('#cart-empty');
  const layoutEl = $('#cart-layout');
  const mobileBar = $('#cart-mobile-bar');
  const countLabel = $('#cart-item-count');

  const totalQty = cart.reduce((s, row) => s + row.qty, 0);
  const subtotal = cart.reduce((s, row) => {
    const p = find(row.id);
    return s + (p ? p.price * row.qty : 0);
  }, 0);

  countLabel.textContent = `${totalQty} ${totalQty === 1 ? 'item' : 'items'} in your bag`;
  $('#summary-item-count').textContent = `${totalQty} ${totalQty === 1 ? 'item' : 'items'}`;
  $('#summary-subtotal').textContent = money(subtotal);
  $('#summary-total').textContent = money(subtotal);
  $('#mobile-bar-total').textContent = money(subtotal);

  updateHeaderCount();

  if (cart.length === 0) {
    emptyEl.hidden = false;
    layoutEl.hidden = true;
    if (mobileBar) mobileBar.hidden = true;
    return;
  }

  emptyEl.hidden = true;
  layoutEl.hidden = false;
  if (mobileBar) mobileBar.hidden = false;

  listEl.innerHTML = cart.map(renderRow).join('');

  if (animate && window.gsap && !reduced()) {
    gsap.fromTo('.cart-row', { opacity: 0.7, y: 8 }, { opacity: 1, y: 0, duration: 0.28, stagger: 0.03, ease: 'power2.out', clearProps: 'all' });
  }
}

function updateQuantity(id, delta) {
  const row = cart.find(r => r.id === id);
  if (!row) return;
  const newQty = Math.max(1, Math.min(99, row.qty + delta));
  if (newQty === row.qty) return;
  row.qty = newQty;
  persist();
  renderCart(false);
  notify('Quantity updated');
}

function setQuantity(id, value) {
  const row = cart.find(r => r.id === id);
  if (!row) return;
  const num = Math.floor(Number(value));
  const newQty = Math.max(1, Math.min(99, isNaN(num) ? 1 : num));
  row.qty = newQty;
  persist();
  renderCart(false);
}

function removeItem(id) {
  const p = find(id);
  cart = cart.filter(r => r.id !== id);
  persist();
  renderCart(true);
  notify(p ? `Removed ${p.name} from bag` : 'Removed from bag');
}

function toggleWishlist(id) {
  const p = find(id);
  if (!p) return;
  if (saved.includes(id)) {
    saved = saved.filter(v => v !== id);
    persist();
    notify(`Removed ${p.name} from wishlist`);
  } else {
    saved.push(id);
    persist();
    notify(`Saved ${p.name} to wishlist`);
  }
  // Update button in place
  const btn = $(`[data-cart-save="${id}"]`);
  if (btn) {
    const isSaved = saved.includes(id);
    btn.classList.toggle('is-saved', isSaved);
    btn.setAttribute('aria-pressed', isSaved);
    btn.querySelector('span').textContent = isSaved ? 'Saved to wishlist' : 'Save to wishlist';
  }
}

function clearCart() {
  if (!cart.length) return;
  cart = [];
  persist();
  renderCart(true);
  notify('Your bag is now empty');
}

function triggerCheckoutPreview() {
  openDialog(checkoutDialog);
}

// Quick Bag Drawer rendering for cart.html (in case user clicks bag button in header)
function renderDrawer() {
  const body = $('#drawer-body');
  if (!body) return;
  if (!cart.length) {
    body.innerHTML = `
      <div class="empty-state">
        <h3>A little room for character.</h3>
        <p>Your bag is empty. Start with a hookah or find the finishing touches.</p>
        <a class="button" href="shop.html">Explore the collection ${icon('arrow')}</a>
      </div>
    `;
    return;
  }
  body.innerHTML = cart.map(row => {
    const p = find(row.id);
    return `
      <div class="cart-item">
        <a class="cart-thumb" href="${p.id === 'studio-black' ? 'product.html' : 'shop.html'}" aria-label="View ${p.name}">
          ${art(p)}
        </a>
        <div>
          <h3>${p.name}</h3>
          <p>${money(p.price)}</p>
          <div class="quantity-control">
            <button data-drawer-qty="${p.id}" data-delta="-1" aria-label="Decrease ${p.name} quantity">−</button>
            <span>${row.qty}</span>
            <button data-drawer-qty="${p.id}" data-delta="1" aria-label="Increase ${p.name} quantity">+</button>
          </div>
        </div>
        <button class="remove-item" data-drawer-remove="${p.id}">Remove</button>
      </div>
    `;
  }).join('') + `
    <div class="cart-summary">
      <span>Subtotal</span>
      <strong>${money(cart.reduce((sum, row) => sum + find(row.id).price * row.qty, 0))}</strong>
    </div>
    <a class="view-full-cart" href="cart.html">View full bag ${icon('arrow')}</a>
    <a class="button cart-checkout" href="checkout.html">Checkout ${icon('arrow')}</a>
    <p class="cart-preview-note">Preview bag. Illustrative products and prices; no payment will be taken.</p>
  `;
}

// Global click event delegation
document.addEventListener('click', e => {
  const b = e.target.closest('button, a');
  if (!b) return;

  if (b.matches('.close-dialog')) {
    const d = b.closest('dialog');
    if (d) d.close();
    return;
  }

  // Quantity delta
  if (b.dataset.cartQty) {
    updateQuantity(b.dataset.cartQty, Number(b.dataset.delta));
    return;
  }

  // Remove from cart
  if (b.dataset.cartRemove) {
    removeItem(b.dataset.cartRemove);
    return;
  }

  // Save to wishlist
  if (b.dataset.cartSave) {
    toggleWishlist(b.dataset.cartSave);
    return;
  }

  // Clear cart
  if (b.id === 'cart-clear') {
    clearCart();
    return;
  }

  // Drawer buttons
  if (b.dataset.drawerQty) {
    updateQuantity(b.dataset.drawerQty, Number(b.dataset.delta));
    renderDrawer();
    return;
  }
  if (b.dataset.drawerRemove) {
    removeItem(b.dataset.drawerRemove);
    renderDrawer();
    return;
  }

  // Open drawer from header bag button or actions
  if (b.dataset.open === 'cart') {
    $('#drawer-title').textContent = 'Your bag.';
    $('#drawer-eyebrow').textContent = 'YOUR COLLECTION.';
    renderDrawer();
    openDialog(drawer);
    return;
  }
  if (b.dataset.open === 'wishlist') {
    $('#drawer-title').textContent = 'Your saved edit.';
    $('#drawer-eyebrow').textContent = 'MAKE IT YOURS.';
    const body = $('#drawer-body');
    body.innerHTML = saved.length ? `
      <div class="wishlist-products">
        ${saved.map(id => {
          const p = find(id);
          return `<div class="cart-item">
            <a class="cart-thumb" href="${p.id === 'studio-black' ? 'product.html' : 'shop.html'}">${art(p)}</a>
            <div><h3>${p.name}</h3><p>${money(p.price)}</p></div>
          </div>`;
        }).join('')}
      </div>
    ` : '<div class="empty-state"><h3>Your saved edit.</h3><p>Tap a heart to keep your favourites here.</p></div>';
    openDialog(drawer);
    return;
  }
  if (b.dataset.open === 'search') {
    location.href = 'shop.html';
    return;
  }

  // Footer accordions on mobile
  if (b.matches('.footer-toggle') && matchMedia('(max-width:600px)').matches) {
    const show = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', show);
    const target = $('#' + b.getAttribute('aria-controls'));
    if (target) target.hidden = !show;
  }
});

// Quantity input change listener
document.addEventListener('change', e => {
  if (e.target.dataset.inputQty) {
    setQuantity(e.target.dataset.inputQty, e.target.value);
  }
});

// Mobile nav & Mega menu logic
const mega = $('#category-menu');
const megaToggle = $('#mega-toggle');
const header = $('.site-header');
const mobile = $('#mobile-nav');
const mobileToggle = $('.mobile-toggle');
let megaTimer;

function closeMega() {
  if (mega) {
    mega.hidden = true;
    megaToggle.setAttribute('aria-expanded', 'false');
  }
}
function openMega() {
  if (mega) {
    mega.hidden = false;
    megaToggle.setAttribute('aria-expanded', 'true');
  }
}
function closeMenu() {
  if (mobile) {
    mobile.hidden = true;
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-label', 'Open navigation');
    mobileToggle.innerHTML = icon('menu');
  }
}

if (megaToggle) {
  megaToggle.addEventListener('click', () => (mega.hidden ? openMega() : closeMega()));
  megaToggle.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      openMega();
      $('a', mega)?.focus();
    }
  });
  megaToggle.addEventListener('pointerenter', e => {
    if (e.pointerType === 'mouse' && !matchMedia('(max-width:900px)').matches) {
      clearTimeout(megaTimer);
      openMega();
    }
  });
}
if (mega) {
  mega.addEventListener('pointerenter', () => clearTimeout(megaTimer));
}
if (header) {
  header.addEventListener('pointerleave', () => {
    megaTimer = setTimeout(closeMega, 180);
  });
  header.addEventListener('focusout', e => {
    if (!header.contains(e.relatedTarget)) closeMega();
  });
}
document.addEventListener('click', e => {
  if (header && !header.contains(e.target)) closeMega();
});

if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    const show = mobile.hidden;
    mobile.hidden = !show;
    mobileToggle.setAttribute('aria-expanded', show);
    mobileToggle.setAttribute('aria-label', show ? 'Close navigation' : 'Open navigation');
    mobileToggle.innerHTML = icon(show ? 'close' : 'menu');
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeMenu();
    if (mega && !mega.hidden) {
      closeMega();
      megaToggle?.focus();
    }
  }
});

matchMedia('(max-width:900px)').addEventListener('change', () => {
  closeMenu();
  closeMega();
});

// Footer accordion setup
const footerMQ = matchMedia('(max-width:600px)');
function footerLayout() {
  $$('.footer-toggle').forEach((b, i) => {
    const show = !footerMQ.matches || i === 0;
    b.setAttribute('aria-expanded', show);
    b.tabIndex = footerMQ.matches ? 0 : -1;
    const col = $('#' + b.getAttribute('aria-controls'));
    if (col) col.hidden = !show;
  });
}
footerLayout();
footerMQ.addEventListener('change', footerLayout);

// Age verification handling
let ageAccepted = false;
try {
  ageAccepted = localStorage.getItem('urban-preview-age') === 'accepted';
} catch {}

if (ageDialog) {
  ageDialog.addEventListener('cancel', e => e.preventDefault());
  if (!ageAccepted) {
    ageDialog.showModal();
    lock();
  }
  $('#age-accept')?.addEventListener('click', () => {
    try {
      localStorage.setItem('urban-preview-age', 'accepted');
    } catch {}
    ageDialog.close();
    lock();
  });
  $('#age-decline')?.addEventListener('click', () => {
    $('.age-actions').hidden = true;
    $('#age-declined').hidden = false;
  });
}

// Newsletter preview feedback
$('#newsletter-form')?.addEventListener('submit', e => {
  e.preventDefault();
  $('#newsletter-note').textContent = 'Preview only. Your email has not been submitted.';
  notify('Subscriptions open with the store');
});

// Sync on browser back/forward pageshow
window.addEventListener('pageshow', () => {
  cart = read('urban-preview-cart', []).filter(v => find(v.id) && v.qty > 0);
  saved = read('urban-preview-wishlist', []).filter(find);
  renderCart(false);
});

// Header scroll shadow
let scrollQueued = false;
window.addEventListener('scroll', () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    header?.classList.toggle('is-scrolled', scrollY > 30);
    scrollQueued = false;
  });
}, { passive: true });

// Initial render
renderCart(true);

})();
