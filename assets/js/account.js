/* Account page logic — Urban Shisha preview login/register & demo account dashboard. */
(()=>{
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const catalog = window.UrbanCatalog || { products: [], brands: [], imageFrames: [] };
const { products, imageFrames } = catalog;
const findProduct = id => products.find(p => p.id === id);
const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const icon = (name, className = '') => `<svg class="${className}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const readStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
};

// Shared storage (Wishlist & Cart only - NEVER addresses or passwords)
let saved = readStorage('urban-preview-wishlist', []).filter(id => findProduct(id));
let cart = readStorage('urban-preview-cart', [])
  .filter(v => findProduct(v.id) && Number.isInteger(v.qty) && v.qty > 0)
  .map(v => ({ ...v, qty: Math.max(1, Math.min(99, v.qty)) }));

// In-Memory Demo Addresses (NEVER saved to localStorage or uploaded)
let addresses = [];
let editingAddressId = null;
let deletingAddressId = null;
let lastFocusedElement = null;

let toastTimer = null;
function notify(text) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
}

function updateHeaderCounts() {
  cart = readStorage('urban-preview-cart', [])
    .filter(v => findProduct(v.id) && Number.isInteger(v.qty) && v.qty > 0)
    .map(v => ({ ...v, qty: Math.max(1, Math.min(99, v.qty)) }));
  saved = readStorage('urban-preview-wishlist', []).filter(id => findProduct(id));

  const cartTotal = cart.reduce((sum, item) => sum + item.qty, 0);
  $$('.cart-count').forEach(el => el.textContent = cartTotal);
  const bagBtn = $('.bag-button');
  if (bagBtn) bagBtn.setAttribute('aria-label', `Open shopping bag, ${cartTotal} items`);

  // Wishlist count in sidebar & overview
  const wishlistPill = $('#sidebar-wishlist-count');
  if (wishlistPill) wishlistPill.textContent = saved.length;
  const overviewWishlist = $('#overview-wishlist-count');
  if (overviewWishlist) overviewWishlist.textContent = `${saved.length} items saved`;
  const sectionWishlist = $('#wishlist-section-count');
  if (sectionWishlist) sectionWishlist.textContent = `(${saved.length})`;

  // Address count in overview
  const overviewAddress = $('#overview-address-count');
  if (overviewAddress) overviewAddress.textContent = `${addresses.length} saved addresses`;
}

function renderProductArt(p) {
  if (!imageFrames || !imageFrames[p.art]) {
    return `<span class="product-art art-${p.art}" role="img" aria-label="${p.name}"></span>`;
  }
  const [x, y, w, h, sw, sh] = imageFrames[p.art];
  return `<span class="product-art art-${p.art}" role="img" aria-label="${p.name}"><svg class="catalog-photo" viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href="assets/images/product-cutout-${p.art}.webp" width="${sw}" height="${sh}"/></svg></span>`;
}

// Dialog management
function lockBody() {
  document.body.classList.toggle('is-locked', !!$('dialog[open]'));
}

function showModal(d) {
  if (!d || d.open) return;
  lastFocusedElement = document.activeElement;
  d.showModal();
  lockBody();
}

function closeModal(d) {
  if (!d || !d.open) return;
  d.close();
  lockBody();
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

// Attach generic close button handlers to all dialogs
$$('dialog').forEach(d => {
  d.addEventListener('close', lockBody);
  d.addEventListener('click', e => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        closeModal(d);
      }
    }
  });
  $$('.close-dialog, [data-close-dialog]', d).forEach(btn => {
    btn.addEventListener('click', () => closeModal(d));
  });
});

/* ==========================================================================
   PASSWORD SHOW / HIDE CONTROLS
   ========================================================================== */
function initPasswordToggles() {
  $$('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = $('#' + targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      btn.innerHTML = isPassword ? icon('eye-off') : icon('eye');
    });
  });
}

/* ==========================================================================
   AUTH TABS (LOGIN / REGISTER)
   ========================================================================== */
function initAuthTabs() {
  const tabLogin = $('#tab-login');
  const tabRegister = $('#tab-register');
  const panelLogin = $('#panel-login');
  const panelRegister = $('#panel-register');

  if (!tabLogin || !tabRegister || !panelLogin || !panelRegister) return;

  function switchAuthTab(target) {
    const isLogin = target === 'login';
    tabLogin.classList.toggle('is-active', isLogin);
    tabLogin.setAttribute('aria-selected', isLogin ? 'true' : 'false');
    tabRegister.classList.toggle('is-active', !isLogin);
    tabRegister.setAttribute('aria-selected', !isLogin ? 'true' : 'false');

    panelLogin.hidden = !isLogin;
    panelRegister.hidden = isLogin;

    // Clear any active field errors
    $$('.field-error', $('#auth-view')).forEach(el => {
      el.hidden = true;
      el.textContent = '';
    });
    $$('.form-input[aria-invalid="true"]', $('#auth-view')).forEach(el => {
      el.removeAttribute('aria-invalid');
    });
  }

  tabLogin.addEventListener('click', () => switchAuthTab('login'));
  tabRegister.addEventListener('click', () => switchAuthTab('register'));

  // Keyboard navigation for tabs
  const tablist = $('.auth-tabs');
  if (tablist) {
    tablist.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (tabLogin.classList.contains('is-active')) {
          tabRegister.focus();
          switchAuthTab('register');
        } else {
          tabLogin.focus();
          switchAuthTab('login');
        }
      }
    });
  }
}

/* ==========================================================================
   AUTH FORM VALIDATION & SUBMISSION
   ========================================================================== */
function setFieldError(input, errorEl, message) {
  if (message) {
    input.setAttribute('aria-invalid', 'true');
    errorEl.textContent = message;
    errorEl.hidden = false;
  } else {
    input.removeAttribute('aria-invalid');
    errorEl.textContent = '';
    errorEl.hidden = true;
  }
}

function initAuthForms() {
  const loginForm = $('#login-form');
  const registerForm = $('#register-form');
  const authNoticeDialog = $('#auth-notice-dialog');
  const forgotPasswordDialog = $('#forgot-password-dialog');

  // Forgot password preview button
  const forgotBtn = $('#forgot-password-btn');
  if (forgotBtn) {
    forgotBtn.addEventListener('click', () => {
      showModal(forgotPasswordDialog);
    });
  }

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = $('#login-email');
      const pass = $('#login-password');
      const errEmail = $('#error-login-email');
      const errPass = $('#error-login-password');

      let isValid = true;
      let firstInvalid = null;

      // Email validation
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setFieldError(email, errEmail, 'Enter a valid email address.');
        isValid = false;
        if (!firstInvalid) firstInvalid = email;
      } else {
        setFieldError(email, errEmail, '');
      }

      // Password validation
      if (!pass.value) {
        setFieldError(pass, errPass, 'Enter your password.');
        isValid = false;
        if (!firstInvalid) firstInvalid = pass;
      } else {
        setFieldError(pass, errPass, '');
      }

      if (!isValid) {
        firstInvalid?.focus();
        return;
      }

      // Clear password field immediately
      pass.value = '';

      // Honest preview explanation modal
      $('#auth-notice-title').textContent = 'Account Access Preview';
      $('#auth-notice-message').textContent = 'Account logins will connect securely when Urban Shisha launches on WooCommerce. No passwords or credentials are saved or transmitted in this design preview.';
      showModal(authNoticeDialog);
    });
  }

  // Register form submission
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#register-name');
      const email = $('#register-email');
      const pass = $('#register-password');
      const age = $('#register-age');
      const terms = $('#register-terms');

      const errName = $('#error-register-name');
      const errEmail = $('#error-register-email');
      const errPass = $('#error-register-password');
      const errAge = $('#error-register-age');
      const errTerms = $('#error-register-terms');

      let isValid = true;
      let firstInvalid = null;

      if (!name.value.trim()) {
        setFieldError(name, errName, 'Enter your full name.');
        isValid = false;
        if (!firstInvalid) firstInvalid = name;
      } else {
        setFieldError(name, errName, '');
      }

      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setFieldError(email, errEmail, 'Enter a valid email address.');
        isValid = false;
        if (!firstInvalid) firstInvalid = email;
      } else {
        setFieldError(email, errEmail, '');
      }

      if (!pass.value || pass.value.length < 8) {
        setFieldError(pass, errPass, 'Password must be at least 8 characters.');
        isValid = false;
        if (!firstInvalid) firstInvalid = pass;
      } else {
        setFieldError(pass, errPass, '');
      }

      if (!age.checked) {
        errAge.textContent = 'You must confirm that you are 18 or older.';
        errAge.hidden = false;
        isValid = false;
        if (!firstInvalid) firstInvalid = age;
      } else {
        errAge.hidden = true;
      }

      if (!terms.checked) {
        errTerms.textContent = 'You must accept the terms and privacy policy.';
        errTerms.hidden = false;
        isValid = false;
        if (!firstInvalid) firstInvalid = terms;
      } else {
        errTerms.hidden = true;
      }

      if (!isValid) {
        firstInvalid?.focus();
        return;
      }

      // Clear password field immediately
      pass.value = '';

      // Honest preview explanation modal
      $('#auth-notice-title').textContent = 'Account Registration Preview';
      $('#auth-notice-message').textContent = 'Live account creation will open when Urban Shisha launches on WooCommerce. No personal profile records or credentials have been created in this preview.';
      showModal(authNoticeDialog);
    });
  }

  // Policy triggers
  $$('[data-open-policy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-open-policy');
      const policyDialog = $('#policy-dialog');
      if (!policyDialog) return;
      const title = $('#policy-dialog-title');
      const text = $('#policy-dialog-text');
      if (type === 'privacy') {
        title.textContent = 'Privacy Policy';
        text.textContent = 'Your privacy matters. In this preview, saved products and your bag stay in this browser; newsletter and registration data are not submitted to any backend.';
      } else {
        title.textContent = 'Terms & Conditions';
        text.textContent = 'Purchase terms and conditions will be published alongside WooCommerce checkout at store launch. Urban Shisha products are exclusively for adults aged 18 and older.';
      }
      showModal(policyDialog);
    });
  });
}

/* ==========================================================================
   VIEW SWITCHING: AUTH VS DEMO DASHBOARD
   ========================================================================== */
function showDashboardView(activeSection = 'overview') {
  const authView = $('#auth-view');
  const dashboardView = $('#dashboard-view');
  if (!authView || !dashboardView) return;

  authView.hidden = true;
  dashboardView.hidden = false;

  switchSection(activeSection);
  updateHeaderCounts();

  if (window.gsap && !reducedMotion()) {
    gsap.fromTo(dashboardView, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
  }
}

function showAuthView() {
  const authView = $('#auth-view');
  const dashboardView = $('#dashboard-view');
  if (!authView || !dashboardView) return;

  dashboardView.hidden = true;
  authView.hidden = false;

  // Clear URL query/hash without refreshing
  history.replaceState(null, '', window.location.pathname);

  if (window.gsap && !reducedMotion()) {
    gsap.fromTo(authView, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
  }

  notify('Exited demo account. Your cart & wishlist remain saved.');
}

/* ==========================================================================
   DASHBOARD SECTION SWITCHING
   ========================================================================== */
function switchSection(sectionId) {
  const validSections = ['overview', 'orders', 'addresses', 'wishlist', 'details'];
  if (!validSections.includes(sectionId)) sectionId = 'overview';

  // Update desktop sidebar buttons
  $$('.sidebar-btn').forEach(btn => {
    const isTarget = btn.getAttribute('data-section') === sectionId;
    btn.classList.toggle('is-active', isTarget);
    btn.setAttribute('aria-current', isTarget ? 'page' : 'false');
  });

  // Update mobile nav pills
  $$('.mobile-nav-pill').forEach(pill => {
    const isTarget = pill.getAttribute('data-section') === sectionId;
    pill.classList.toggle('is-active', isTarget);
    pill.setAttribute('aria-current', isTarget ? 'page' : 'false');
  });

  // Show target section panel
  validSections.forEach(id => {
    const sec = $('#section-' + id);
    if (sec) sec.hidden = id !== sectionId;
  });

  // Focus panel container accessibly
  const panel = $('#account-panel-container');
  if (panel) panel.focus();

  // Re-render specific sections when opened
  if (sectionId === 'addresses') renderAddresses();
  if (sectionId === 'wishlist') renderWishlist();

  // Update URL hash cleanly
  history.replaceState(null, '', `?tab=${sectionId}`);
}

function initDashboardNavigation() {
  // Desktop sidebar section buttons
  $$('.sidebar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.getAttribute('data-section');
      if (section) switchSection(section);
    });
  });

  // Mobile nav pills
  $$('.mobile-nav-pill').forEach(pill => {
    pill.addEventListener('click', e => {
      e.preventDefault();
      const section = pill.getAttribute('data-section');
      if (section) switchSection(section);
    });
  });

  // Overview quick action buttons
  $$('[data-goto-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.getAttribute('data-goto-section');
      if (section) switchSection(section);
    });
  });

  // Exit demo button
  $$('[data-action="exit-demo"]').forEach(btn => {
    btn.addEventListener('click', () => {
      showAuthView();
    });
  });

  // "Explore demo account" button from auth panel & dialog
  const exploreBtn = $('#explore-demo-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      showDashboardView('overview');
    });
  }

  const exploreNoticeBtn = $('#auth-notice-explore-btn');
  if (exploreNoticeBtn) {
    exploreNoticeBtn.addEventListener('click', () => {
      closeModal($('#auth-notice-dialog'));
      showDashboardView('overview');
    });
  }
}

/* ==========================================================================
   ADDRESSES: IN-MEMORY CRUD INTERACTIONS
   ========================================================================== */
function renderAddresses() {
  const container = $('#addresses-list');
  const emptyBox = $('#addresses-empty');
  if (!container || !emptyBox) return;

  if (addresses.length === 0) {
    emptyBox.hidden = false;
    container.innerHTML = '';
  } else {
    emptyBox.hidden = true;
    container.innerHTML = `
      <div class="addresses-grid">
        ${addresses.map(addr => `
          <div class="address-card" data-id="${addr.id}">
            <div class="address-card-top">
              <span class="address-purpose-badge">${escapeHtml(addr.purpose === 'billing' ? 'Billing address' : 'Delivery address')}</span>
            </div>
            <div class="address-details">
              <p class="address-name">${escapeHtml(addr.name)}</p>
              <p class="address-line">${escapeHtml(addr.address1)}</p>
              ${addr.address2 ? `<p class="address-line">${escapeHtml(addr.address2)}</p>` : ''}
              <p class="address-line">${escapeHtml(addr.city)}, ${escapeHtml(addr.state)} — ${escapeHtml(addr.pincode)}</p>
              <p class="address-line">${escapeHtml(addr.country)}</p>
              <p class="address-phone">Mobile: +91 ${escapeHtml(addr.phone)}</p>
            </div>
            <div class="address-card-actions">
              <button type="button" class="address-action-btn" data-edit-address="${addr.id}" aria-label="Edit address for ${escapeHtml(addr.name)}">
                ${icon('edit')} Edit
              </button>
              <button type="button" class="address-action-btn is-delete" data-delete-address="${addr.id}" aria-label="Delete address for ${escapeHtml(addr.name)}">
                ${icon('trash')} Delete
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  updateHeaderCounts();
}

function openAddressModal(addressToEdit = null) {
  const dialog = $('#address-dialog');
  const title = $('#address-modal-title');
  const form = $('#address-modal-form');
  if (!dialog || !form) return;

  editingAddressId = addressToEdit ? addressToEdit.id : null;
  title.textContent = addressToEdit ? 'Edit Address' : 'Add New Address';

  // Fill or clear fields
  $('#addr-purpose').value = addressToEdit ? addressToEdit.purpose : 'delivery';
  $('#addr-name').value = addressToEdit ? addressToEdit.name : '';
  $('#addr-line1').value = addressToEdit ? addressToEdit.address1 : '';
  $('#addr-line2').value = addressToEdit ? (addressToEdit.address2 || '') : '';
  $('#addr-city').value = addressToEdit ? addressToEdit.city : '';
  $('#addr-state').value = addressToEdit ? addressToEdit.state : '';
  $('#addr-pincode').value = addressToEdit ? addressToEdit.pincode : '';
  $('#addr-phone').value = addressToEdit ? addressToEdit.phone : '';

  // Clear errors
  $$('.field-error', form).forEach(el => {
    el.hidden = true;
    el.textContent = '';
  });
  $$('.form-input[aria-invalid="true"]', form).forEach(el => {
    el.removeAttribute('aria-invalid');
  });

  showModal(dialog);
  $('#addr-name').focus();
}

function initAddressCrud() {
  const btnAdd = $('#btn-add-address');
  const btnAddFirst = $('#btn-add-first-address');
  const addressDialog = $('#address-dialog');
  const deleteDialog = $('#delete-address-dialog');
  const addressForm = $('#address-modal-form');

  if (btnAdd) btnAdd.addEventListener('click', () => openAddressModal(null));
  if (btnAddFirst) btnAddFirst.addEventListener('click', () => openAddressModal(null));

  // Delegate Edit & Delete clicks
  $('#section-addresses').addEventListener('click', e => {
    const editBtn = e.target.closest('[data-edit-address]');
    if (editBtn) {
      const id = editBtn.getAttribute('data-edit-address');
      const item = addresses.find(a => a.id === id);
      if (item) openAddressModal(item);
      return;
    }

    const delBtn = e.target.closest('[data-delete-address]');
    if (delBtn) {
      deletingAddressId = delBtn.getAttribute('data-delete-address');
      showModal(deleteDialog);
      return;
    }
  });

  // Confirm delete address
  $('#btn-confirm-delete-address').addEventListener('click', () => {
    if (deletingAddressId) {
      addresses = addresses.filter(a => a.id !== deletingAddressId);
      deletingAddressId = null;
      closeModal(deleteDialog);
      renderAddresses();
      notify('Address removed (demo session only).');
    }
  });

  // Handle address form save
  if (addressForm) {
    addressForm.addEventListener('submit', e => {
      e.preventDefault();

      const purpose = $('#addr-purpose').value;
      const name = $('#addr-name');
      const line1 = $('#addr-line1');
      const line2 = $('#addr-line2');
      const city = $('#addr-city');
      const state = $('#addr-state');
      const pincode = $('#addr-pincode');
      const phone = $('#addr-phone');

      const errName = $('#error-addr-name');
      const errLine1 = $('#error-addr-line1');
      const errCity = $('#error-addr-city');
      const errState = $('#error-addr-state');
      const errPincode = $('#error-addr-pincode');
      const errPhone = $('#error-addr-phone');

      let isValid = true;
      let firstInvalid = null;

      if (!name.value.trim()) {
        setFieldError(name, errName, 'Full name is required.');
        isValid = false;
        if (!firstInvalid) firstInvalid = name;
      } else {
        setFieldError(name, errName, '');
      }

      if (!line1.value.trim()) {
        setFieldError(line1, errLine1, 'Street address is required.');
        isValid = false;
        if (!firstInvalid) firstInvalid = line1;
      } else {
        setFieldError(line1, errLine1, '');
      }

      if (!city.value.trim()) {
        setFieldError(city, errCity, 'City is required.');
        isValid = false;
        if (!firstInvalid) firstInvalid = city;
      } else {
        setFieldError(city, errCity, '');
      }

      if (!state.value) {
        setFieldError(state, errState, 'Select a State / Union Territory.');
        isValid = false;
        if (!firstInvalid) firstInvalid = state;
      } else {
        setFieldError(state, errState, '');
      }

      if (!/^\d{6}$/.test(pincode.value.trim())) {
        setFieldError(pincode, errPincode, 'Enter a valid 6-digit PIN code.');
        isValid = false;
        if (!firstInvalid) firstInvalid = pincode;
      } else {
        setFieldError(pincode, errPincode, '');
      }

      if (!/^[6-9]\d{9}$/.test(phone.value.trim().replace(/\D/g, ''))) {
        setFieldError(phone, errPhone, 'Enter a valid 10-digit mobile number.');
        isValid = false;
        if (!firstInvalid) firstInvalid = phone;
      } else {
        setFieldError(phone, errPhone, '');
      }

      if (!isValid) {
        firstInvalid?.focus();
        return;
      }

      const addressData = {
        id: editingAddressId || 'addr_' + Date.now(),
        purpose,
        name: name.value.trim(),
        address1: line1.value.trim(),
        address2: line2.value.trim(),
        city: city.value.trim(),
        state: state.value,
        pincode: pincode.value.trim(),
        phone: phone.value.trim(),
        country: 'India'
      };

      if (editingAddressId) {
        addresses = addresses.map(a => a.id === editingAddressId ? addressData : a);
        notify('Address updated (demo session only).');
      } else {
        addresses.push(addressData);
        notify('Address added (demo session only).');
      }

      closeModal(addressDialog);
      renderAddresses();
    });
  }
}

/* ==========================================================================
   WISHLIST: REAL SAVED PRODUCTS & SHARED CART INTEGRATION
   ========================================================================== */
function renderWishlist() {
  const grid = $('#wishlist-grid');
  const empty = $('#wishlist-empty');
  if (!grid || !empty) return;

  saved = readStorage('urban-preview-wishlist', []).filter(id => findProduct(id));
  const validProducts = saved.map(id => findProduct(id)).filter(Boolean);

  if (validProducts.length === 0) {
    grid.hidden = true;
    grid.innerHTML = '';
    empty.hidden = false;
  } else {
    empty.hidden = true;
    grid.hidden = false;
    grid.innerHTML = validProducts.map(p => `
      <div class="account-product-card" data-product-id="${p.id}">
        <div class="account-product-visual">
          ${renderProductArt(p)}
        </div>
        <div class="account-product-meta">
          <span class="account-product-brand">${escapeHtml(p.brand || 'Urban Shisha')}</span>
          <h3 class="account-product-title"><a href="product.html?id=${p.id}">${escapeHtml(p.name)}</a></h3>
          <span class="account-product-price">${money(p.price)}</span>
        </div>
        <div class="account-product-actions">
          <button type="button" class="button button-small account-product-add-btn" data-wishlist-add="${p.id}">
            Add to bag ${icon('bag')}
          </button>
          <button type="button" class="account-product-remove-btn" data-wishlist-remove="${p.id}" aria-label="Remove ${escapeHtml(p.name)} from wishlist">
            ${icon('trash')} Remove
          </button>
        </div>
      </div>
    `).join('');
  }
  updateHeaderCounts();
}

function initWishlistActions() {
  const sectionWishlist = $('#section-wishlist');
  if (!sectionWishlist) return;

  sectionWishlist.addEventListener('click', e => {
    // Add to bag
    const addBtn = e.target.closest('[data-wishlist-add]');
    if (addBtn) {
      const id = addBtn.getAttribute('data-wishlist-add');
      const product = findProduct(id);
      if (!product) return;

      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.qty = Math.min(99, existing.qty + 1);
      } else {
        cart.push({ id, qty: 1 });
      }

      writeStorage('urban-preview-cart', cart);
      updateHeaderCounts();

      // Visual feedback
      const originalHtml = addBtn.innerHTML;
      addBtn.innerHTML = `Added ${icon('check')}`;
      addBtn.classList.add('is-added');
      setTimeout(() => {
        addBtn.innerHTML = originalHtml;
        addBtn.classList.remove('is-added');
      }, 1400);

      notify(`${product.name} added to your bag.`);
      return;
    }

    // Remove from wishlist
    const removeBtn = e.target.closest('[data-wishlist-remove]');
    if (removeBtn) {
      const id = removeBtn.getAttribute('data-wishlist-remove');
      const product = findProduct(id);
      saved = saved.filter(item => item !== id);
      writeStorage('urban-preview-wishlist', saved);
      renderWishlist();
      notify(`${product ? product.name : 'Item'} removed from wishlist.`);
      return;
    }
  });
}

/* ==========================================================================
   ACCOUNT DETAILS: LOCAL VALIDATION ONLY
   ========================================================================== */
function initAccountDetailsForms() {
  const profileForm = $('#profile-form');
  const passwordForm = $('#password-form');

  if (profileForm) {
    profileForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#profile-name');
      const email = $('#profile-email');
      const errName = $('#error-profile-name');
      const errEmail = $('#error-profile-email');

      let isValid = true;
      let firstInvalid = null;

      if (!name.value.trim()) {
        setFieldError(name, errName, 'Full name is required.');
        isValid = false;
        if (!firstInvalid) firstInvalid = name;
      } else {
        setFieldError(name, errName, '');
      }

      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setFieldError(email, errEmail, 'Enter a valid email address.');
        isValid = false;
        if (!firstInvalid) firstInvalid = email;
      } else {
        setFieldError(email, errEmail, '');
      }

      if (!isValid) {
        firstInvalid?.focus();
        return;
      }

      notify('Profile changes validated. Live account sync opens with store launch.');
    });
  }

  if (passwordForm) {
    passwordForm.addEventListener('submit', e => {
      e.preventDefault();
      const currentPass = $('#pass-current');
      const newPass = $('#pass-new');
      const confirmPass = $('#pass-confirm');

      const errCurrent = $('#error-pass-current');
      const errNew = $('#error-pass-new');
      const errConfirm = $('#error-pass-confirm');

      let isValid = true;
      let firstInvalid = null;

      if (!currentPass.value) {
        setFieldError(currentPass, errCurrent, 'Enter your current password.');
        isValid = false;
        if (!firstInvalid) firstInvalid = currentPass;
      } else {
        setFieldError(currentPass, errCurrent, '');
      }

      if (!newPass.value || newPass.value.length < 8) {
        setFieldError(newPass, errNew, 'New password must be at least 8 characters.');
        isValid = false;
        if (!firstInvalid) firstInvalid = newPass;
      } else {
        setFieldError(newPass, errNew, '');
      }

      if (newPass.value !== confirmPass.value) {
        setFieldError(confirmPass, errConfirm, 'Passwords do not match.');
        isValid = false;
        if (!firstInvalid) firstInvalid = confirmPass;
      } else {
        setFieldError(confirmPass, errConfirm, '');
      }

      if (!isValid) {
        firstInvalid?.focus();
        return;
      }

      // Reset fields immediately
      currentPass.value = '';
      newPass.value = '';
      confirmPass.value = '';

      notify('Password change validated. Live password updates handled on WooCommerce.');
    });
  }
}

/* ==========================================================================
   MEGA MENU & MOBILE NAV INTEGRATION
   ========================================================================== */
function initHeaderNav() {
  const megaToggle = $('#mega-toggle');
  const mega = $('#category-menu');
  const header = $('.site-header');
  const menuBtn = $('.mobile-toggle');
  const mobileNav = $('#mobile-nav');
  let megaTimer = null;

  function closeMega() {
    clearTimeout(megaTimer);
    if (!mega) return;
    mega.hidden = true;
    if (megaToggle) megaToggle.setAttribute('aria-expanded', 'false');
  }

  function openMega() {
    clearTimeout(megaTimer);
    if (!mega) return;
    mega.hidden = false;
    if (megaToggle) megaToggle.setAttribute('aria-expanded', 'true');
  }

  if (megaToggle && mega) {
    megaToggle.addEventListener('click', () => (mega.hidden ? openMega() : closeMega()));
    megaToggle.addEventListener('pointerenter', e => {
      if (e.pointerType === 'mouse' && matchMedia('(min-width: 901px)').matches) openMega();
    });
    if (header) {
      header.addEventListener('pointerleave', e => {
        if (e.pointerType === 'mouse') megaTimer = setTimeout(closeMega, 180);
      });
      header.addEventListener('focusout', e => {
        if (!header.contains(e.relatedTarget)) closeMega();
      });
    }
    document.addEventListener('click', e => {
      if (header && !header.contains(e.target)) closeMega();
    });
  }

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') !== 'true';
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobileNav.hidden = !open;
      menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      menuBtn.innerHTML = icon(open ? 'close' : 'menu');
    });
    mobileNav.addEventListener('click', e => {
      if (e.target.closest('a, button')) {
        mobileNav.hidden = true;
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open navigation');
        menuBtn.innerHTML = icon('menu');
      }
    });
  }

  // Footer accordions on mobile
  $$('.footer-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      if (matchMedia('(max-width: 600px)').matches) {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !expanded ? 'true' : 'false');
        const target = $('#' + btn.getAttribute('aria-controls'));
        if (target) target.hidden = expanded;
      }
    });
  });

  const newsForm = $('#newsletter-form');
  if (newsForm) {
    newsForm.addEventListener('submit', e => {
      e.preventDefault();
      $('#newsletter-note').textContent = 'This is a preview. Your email has not been submitted.';
      notify('Subscriptions open when the store launches.');
    });
  }
}

/* ==========================================================================
   INITIALIZATION & ROUTING
   ========================================================================== */
function initRouting() {
  const urlParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace('#', '');
  const tabParam = urlParams.get('tab') || (['overview', 'orders', 'addresses', 'wishlist', 'details'].includes(hash) ? hash : null);
  const isDemo = urlParams.get('demo') === '1' || !!tabParam;

  if (isDemo) {
    showDashboardView(tabParam || 'overview');
  } else {
    // Default: Show auth view
    const authView = $('#auth-view');
    const dashboardView = $('#dashboard-view');
    if (authView) authView.hidden = false;
    if (dashboardView) dashboardView.hidden = true;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initAuthTabs();
  initAuthForms();
  initDashboardNavigation();
  initAddressCrud();
  initWishlistActions();
  initAccountDetailsForms();
  initHeaderNav();
  updateHeaderCounts();
  initRouting();
});

})();
