/* Checkout page logic — Urban Shisha single-page checkout preview with validation and cart summary */
(()=>{
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const { products, imageFrames } = window.UrbanCatalog;
const find = id => products.find(p => p.id === id);
const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
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

// Finish/variant metadata
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

// Dialog management
const completeDialog = $('#checkout-complete-dialog');
const policyDialog = $('#policy-dialog');

function lock() {
  document.body.classList.toggle('is-locked', !!$('dialog[open]'));
}

function openDialog(d) {
  if (!d || d.open) return;
  d.showModal();
  lock();
}

[completeDialog, policyDialog].forEach(d => {
  if (!d) return;
  d.addEventListener('close', lock);
  d.addEventListener('click', e => {
    if (e.target !== d) return;
    const r = d.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
  });
});

function renderSummaryItem(row) {
  const p = find(row.id);
  if (!p) return '';
  const variant = variants[p.id] || p.label;
  const lineTotal = p.price * row.qty;

  return `
    <div class="summary-product-row">
      <div class="summary-product-thumb">
        ${art(p)}
      </div>
      <div class="summary-product-details">
        <h3 class="summary-product-title">${escape(p.name)}</h3>
        <p class="summary-product-variant">${escape(variant)}</p>
        <span class="summary-product-qty">Qty: ${row.qty}</span>
      </div>
      <strong class="summary-product-total">${money(lineTotal)}</strong>
    </div>
  `;
}

function renderCheckout() {
  const layoutEl = $('#checkout-layout');
  const emptyEl = $('#checkout-empty');
  const mobileAccordion = $('#mobile-summary-accordion');

  if (cart.length === 0) {
    if (layoutEl) layoutEl.hidden = true;
    if (mobileAccordion) mobileAccordion.hidden = true;
    if (emptyEl) emptyEl.hidden = false;
    return;
  }

  if (layoutEl) layoutEl.hidden = false;
  if (mobileAccordion) mobileAccordion.hidden = false;
  if (emptyEl) emptyEl.hidden = true;

  const totalQty = cart.reduce((s, r) => s + r.qty, 0);
  const subtotal = cart.reduce((s, r) => s + find(r.id).price * r.qty, 0);

  const formattedSubtotal = money(subtotal);
  const qtyText = `${totalQty} ${totalQty === 1 ? 'item' : 'items'}`;

  // Desktop summary
  const desktopList = $('#summary-products-list');
  if (desktopList) desktopList.innerHTML = cart.map(renderSummaryItem).join('');
  const desktopSubtotal = $('#summary-subtotal');
  if (desktopSubtotal) desktopSubtotal.textContent = formattedSubtotal;
  const desktopQty = $('#summary-qty');
  if (desktopQty) desktopQty.textContent = qtyText;
  const desktopPayable = $('#summary-total');
  if (desktopPayable) desktopPayable.textContent = formattedSubtotal;

  // Mobile accordion summary
  const mobileList = $('#mobile-summary-products-list');
  if (mobileList) mobileList.innerHTML = cart.map(renderSummaryItem).join('');
  const mobileQty = $('#mobile-summary-qty');
  if (mobileQty) mobileQty.textContent = qtyText;
  const mobileTotal = $('#mobile-summary-total');
  if (mobileTotal) mobileTotal.textContent = formattedSubtotal;
  const mobileSubtotal = $('#mobile-calc-subtotal');
  if (mobileSubtotal) mobileSubtotal.textContent = formattedSubtotal;
  const mobilePayable = $('#mobile-calc-payable');
  if (mobilePayable) mobilePayable.textContent = formattedSubtotal;
}

// Billing address toggle
const billingSameCheckbox = $('#billing-same');
const billingFields = $('#billing-fields');

function toggleBillingFields() {
  if (!billingSameCheckbox || !billingFields) return;
  const same = billingSameCheckbox.checked;
  billingFields.hidden = same;

  const billingInputs = $$('input, select', billingFields);
  billingInputs.forEach(input => {
    if (same) {
      input.removeAttribute('required');
      clearError(input);
    } else {
      if (input.id !== 'billing-address2') {
        input.setAttribute('required', '');
      }
    }
  });
}

if (billingSameCheckbox) {
  billingSameCheckbox.addEventListener('change', toggleBillingFields);
}

// Validation helpers
function setError(input, message) {
  const group = input.closest('.form-group') || input.closest('.checkbox-option') || input.parentElement;
  const errorEl = $(`#error-${input.dataset.errorId || input.name || input.id}`) || $('.field-error', group);

  input.setAttribute('aria-invalid', 'true');
  if (input.type === 'checkbox') {
    input.closest('.checkbox-option')?.classList.add('is-invalid');
  }
  const phoneWrap = input.closest('.phone-input-wrap');
  if (phoneWrap) phoneWrap.setAttribute('data-invalid', 'true');

  if (errorEl) {
    errorEl.innerHTML = `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>${escape(message)}</span>`;
    errorEl.hidden = false;
    input.setAttribute('aria-describedby', errorEl.id);
  }
}

function clearError(input) {
  const group = input.closest('.form-group') || input.closest('.checkbox-option') || input.parentElement;
  const errorEl = $(`#error-${input.dataset.errorId || input.name || input.id}`) || $('.field-error', group);

  input.removeAttribute('aria-invalid');
  if (input.type === 'checkbox') {
    input.closest('.checkbox-option')?.classList.remove('is-invalid');
  }
  const phoneWrap = input.closest('.phone-input-wrap');
  if (phoneWrap) phoneWrap.removeAttribute('data-invalid');

  if (errorEl) {
    errorEl.hidden = true;
    errorEl.textContent = '';
    input.removeAttribute('aria-describedby');
  }
}

// Field validation checks
function validateField(input) {
  const val = (input.value || '').trim();

  if (input.id === 'contact-email') {
    if (!val) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address (e.g. name@example.com).';
    return '';
  }

  if (input.id === 'contact-phone') {
    if (!val) return 'Mobile number is required.';
    const digits = val.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(digits)) return 'Please enter a valid 10-digit Indian mobile number.';
    return '';
  }

  if (input.id === 'delivery-name' || input.id === 'billing-name') {
    if (!val) return 'Full name is required.';
    if (val.length < 2) return 'Please enter at least 2 characters.';
    return '';
  }

  if (input.id === 'delivery-address1' || input.id === 'billing-address1') {
    if (!val) return 'Street address is required.';
    if (val.length < 5) return 'Please enter a complete street address.';
    return '';
  }

  if (input.id === 'delivery-city' || input.id === 'billing-city') {
    if (!val) return 'City is required.';
    if (val.length < 2) return 'Please enter a valid city name.';
    return '';
  }

  if (input.id === 'delivery-state' || input.id === 'billing-state') {
    if (!val) return 'Please select a State or Union Territory.';
    return '';
  }

  if (input.id === 'delivery-pincode' || input.id === 'billing-pincode') {
    if (!val) return 'PIN code is required.';
    if (!/^\d{6}$/.test(val)) return 'Please enter a valid 6-digit PIN code.';
    return '';
  }

  if (input.id === 'confirm-age') {
    if (!input.checked) return 'You must confirm that you are 18 or older to proceed.';
    return '';
  }

  if (input.id === 'confirm-terms') {
    if (!input.checked) return 'You must accept the terms & conditions to proceed.';
    return '';
  }

  return '';
}

// Live validation listener on user input
const form = $('#checkout-form');
if (form) {
  form.addEventListener('input', e => {
    if (e.target.hasAttribute('aria-invalid')) {
      const err = validateField(e.target);
      if (!err) clearError(e.target);
    }
  });

  form.addEventListener('change', e => {
    if (e.target.hasAttribute('aria-invalid') || e.target.type === 'checkbox') {
      const err = validateField(e.target);
      if (!err) clearError(e.target);
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const fieldsToValidate = [
      $('#contact-email'),
      $('#contact-phone'),
      $('#delivery-name'),
      $('#delivery-address1'),
      $('#delivery-city'),
      $('#delivery-state'),
      $('#delivery-pincode')
    ];

    if (!billingSameCheckbox.checked) {
      fieldsToValidate.push(
        $('#billing-name'),
        $('#billing-address1'),
        $('#billing-city'),
        $('#billing-state'),
        $('#billing-pincode')
      );
    }

    fieldsToValidate.push(
      $('#confirm-age'),
      $('#confirm-terms')
    );

    let firstInvalid = null;

    fieldsToValidate.forEach(input => {
      if (!input) return;
      const errorMsg = validateField(input);
      if (errorMsg) {
        setError(input, errorMsg);
        if (!firstInvalid) firstInvalid = input;
      } else {
        clearError(input);
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Success: valid checkout preview submission!
    // Open accessible confirmation dialog (does NOT generate fake order number or clear cart)
    openDialog(completeDialog);
  });
}

// Policy dialog modal opener
document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;

  if (b.matches('.close-dialog')) {
    const d = b.closest('dialog');
    if (d) d.close();
    return;
  }

  if (b.dataset.openPolicy) {
    const policy = b.dataset.openPolicy;
    const title = policy === 'terms' ? 'Terms & Conditions' : 'Privacy Policy';
    const text = policy === 'terms'
      ? 'Purchase terms, age requirements, warranty and usage disclosures will be published with the live store. In this design preview, products, prices, and combinations are illustrative.'
      : 'Customer data privacy policy will be published prior to checkout launch. In this preview, entered form details stay strictly in your local browser session and are not submitted to any remote server.';

    $('#policy-dialog-title').textContent = title;
    $('#policy-dialog-text').textContent = text;
    openDialog(policyDialog);
  }
});

// Sync on browser back/forward navigation
window.addEventListener('pageshow', () => {
  cart = read('urban-preview-cart', []).filter(v => find(v.id) && v.qty > 0);
  renderCheckout();
});

// GSAP entrance animation if available and not reduced motion
if (window.gsap && !reduced()) {
  gsap.from('.checkout-card, .checkout-summary-card', {
    y: 16,
    opacity: 0.8,
    duration: 0.35,
    stagger: 0.04,
    ease: 'power2.out',
    clearProps: 'all'
  });
}

// Initial setup
toggleBillingFields();
renderCheckout();

})();
