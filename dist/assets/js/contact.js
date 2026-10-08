/* Contact page logic — Urban Shisha enquiry validation, dynamic channels and FAQ accordions. */
(()=>{
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const readStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

let toastTimer = null;
function notify(text) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
}

function updateHeaderCount() {
  const cart = readStorage('urban-preview-cart', []);
  const cartTotal = cart.reduce((sum, item) => sum + (Number.isInteger(item.qty) ? item.qty : 0), 0);
  $$('.cart-count').forEach(el => el.textContent = cartTotal);
  const bagBtn = $('.bag-button');
  if (bagBtn) bagBtn.setAttribute('aria-label', `Open shopping bag, ${cartTotal} items`);
}

/* ==========================================================================
   DYNAMIC CONTACT CHANNELS (FROM config.js)
   ========================================================================== */
function initContactChannels() {
  const config = window.URBAN_STORE || {};

  // 1. WhatsApp Channel
  const waContainer = $('#channel-whatsapp-action');
  if (waContainer) {
    const rawPhone = String(config.whatsapp || '').replace(/\D/g, '');
    if (rawPhone.length >= 7 && rawPhone.length <= 15) {
      waContainer.innerHTML = `
        <a class="channel-link" href="https://wa.me/${rawPhone}" target="_blank" rel="noopener noreferrer">
          Chat on WhatsApp ${icon('arrow')}
        </a>
      `;
    } else {
      waContainer.innerHTML = `
        <p class="channel-status">WhatsApp concierge will be available when the store launches.</p>
      `;
    }
  }

  // 2. Email Channel
  const emailContainer = $('#channel-email-action');
  if (emailContainer) {
    const email = String(config.email || '').trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailContainer.innerHTML = `
        <a class="channel-link" href="mailto:${email}">
          ${email} ${icon('arrow')}
        </a>
      `;
    } else {
      emailContainer.innerHTML = `
        <p class="channel-status">Direct email support opens with the live store. You can preview an enquiry below.</p>
      `;
    }
  }

  // 3. Location / Studio Address (Only if configured)
  const locationCard = $('#channel-location-card');
  if (locationCard) {
    const address = String(config.address || '').trim();
    if (address) {
      locationCard.hidden = false;
      const addrText = $('#channel-location-text');
      if (addrText) addrText.textContent = address;
    } else {
      locationCard.hidden = true;
    }
  }
}

/* ==========================================================================
   ENQUIRY FORM VALIDATION & INTERACTION
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

function initContactForm() {
  const form = $('#contact-form');
  const topicSelect = $('#contact-topic');
  const orderRefGroup = $('#order-ref-group');
  const feedbackBox = $('#contact-form-feedback');

  if (!form) return;

  // Conditional Order Reference field
  if (topicSelect && orderRefGroup) {
    topicSelect.addEventListener('change', () => {
      const isOrderTopic = topicSelect.value === 'order-support';
      orderRefGroup.hidden = !isOrderTopic;
      if (!isOrderTopic) {
        const orderInput = $('#contact-order-ref');
        if (orderInput) orderInput.value = '';
      }
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = $('#contact-name');
    const email = $('#contact-email');
    const phone = $('#contact-phone');
    const topic = $('#contact-topic');
    const message = $('#contact-message');

    const errName = $('#error-contact-name');
    const errEmail = $('#error-contact-email');
    const errPhone = $('#error-contact-phone');
    const errTopic = $('#error-contact-topic');
    const errMessage = $('#error-contact-message');

    let isValid = true;
    let firstInvalid = null;

    // Full Name
    if (!name.value.trim()) {
      setFieldError(name, errName, 'Enter your full name.');
      isValid = false;
      if (!firstInvalid) firstInvalid = name;
    } else {
      setFieldError(name, errName, '');
    }

    // Email
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setFieldError(email, errEmail, 'Enter a valid email address.');
      isValid = false;
      if (!firstInvalid) firstInvalid = email;
    } else {
      setFieldError(email, errEmail, '');
    }

    // Optional Mobile Number (validate only if provided)
    const phoneVal = phone.value.trim().replace(/\D/g, '');
    if (phone.value.trim() && (phoneVal.length < 10 || !/^[6-9]\d{9}$/.test(phoneVal))) {
      setFieldError(phone, errPhone, 'Enter a valid 10-digit mobile number.');
      isValid = false;
      if (!firstInvalid) firstInvalid = phone;
    } else {
      setFieldError(phone, errPhone, '');
    }

    // Topic
    if (!topic.value) {
      setFieldError(topic, errTopic, 'Select a topic for your enquiry.');
      isValid = false;
      if (!firstInvalid) firstInvalid = topic;
    } else {
      setFieldError(topic, errTopic, '');
    }

    // Message
    if (!message.value.trim() || message.value.trim().length < 5) {
      setFieldError(message, errMessage, 'Enter a message with at least 5 characters.');
      isValid = false;
      if (!firstInvalid) firstInvalid = message;
    } else {
      setFieldError(message, errMessage, '');
    }

    if (!isValid) {
      if (feedbackBox) feedbackBox.hidden = true;
      firstInvalid?.focus();
      return;
    }

    // Valid preview submission — Do NOT persist or clear form automatically
    if (feedbackBox) {
      feedbackBox.hidden = false;
      feedbackBox.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'nearest' });
    }

    notify('Enquiry validated. Sending opens with store launch.');
  });
}

/* ==========================================================================
   HEADER NAVIGATION & FOOTER BEHAVIOURS
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
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initContactChannels();
  initContactForm();
  initHeaderNav();
  updateHeaderCount();

  if (window.gsap && !reducedMotion()) {
    gsap.fromTo('.contact-hero', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    gsap.fromTo('.contact-layout', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, delay: 0.1, ease: 'power2.out' });
  }
});

})();
