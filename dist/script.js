const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const mobile = window.matchMedia('(max-width: 760px)');
function setMenu(open, restoreFocus = false) {
  nav.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Lukk meny' : 'Åpne meny');
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) setMenu(false, true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header') && nav.classList.contains('open')) setMenu(false);
});
mobile.addEventListener('change', () => setMenu(false));

const productSection = document.querySelector('.products');
const tabList = document.querySelector('.product-tabs');
const tabs = [...document.querySelectorAll('.product-tab')];
const panels = [...document.querySelectorAll('.product-panel')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
tabList.setAttribute('role', 'tablist');
tabs.forEach(tab => {
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', `panel-${tab.dataset.product}`);
});
panels.forEach(panel => {
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', `tab-${panel.dataset.panel}`);
  panel.tabIndex = 0;
});
function selectProduct(name, focusTab = false) {
  const selectedTab = tabs.find(tab => tab.dataset.product === name);
  if (!selectedTab) return;
  tabs.forEach(tab => {
    const selected = tab === selectedTab;
    tab.classList.toggle('selected', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panels.forEach(panel => {
    const selected = panel.dataset.panel === name;
    panel.hidden = !selected;
    panel.classList.remove('panel-enter');
    if (selected && !reducedMotion.matches) {
      // Restart the entrance when the visitor switches to this panel.
      void panel.offsetWidth;
      panel.classList.add('panel-enter');
    }
  });
  if (focusTab) selectedTab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectProduct(tab.dataset.product));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectProduct(tabs[next].dataset.product, true);
    }
  });
});
selectProduct('meal');
productSection.classList.add('enhanced');
document.querySelectorAll('[data-select-product]').forEach(link => {
  link.addEventListener('click', () => selectProduct(link.dataset.selectProduct));
});

const header = document.querySelector('.header');
let scrollFrame = false;
function updateHeader() {
  if (scrollFrame) return;
  scrollFrame = true;
  requestAnimationFrame(() => {
    header.classList.toggle('scrolled', window.scrollY > 12);
    if (window.scrollY < 200) {
      nav.querySelectorAll('.active').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      });
    }
    scrollFrame = false;
  });
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
if ('IntersectionObserver' in window) {
  if (!reducedMotion.matches) {
    document.body.classList.add('motion-ready');
    const reveals = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          reveals.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(element => reveals.observe(element));
  }
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const activeSections = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
  links.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section) activeSections.observe(section);
  });
}
reducedMotion.addEventListener('change', event => {
  if (event.matches) document.body.classList.remove('motion-ready');
});
document.querySelector('#year').textContent = new Date().getFullYear();

// Product enquiry links keep the chosen solution in the email composer.
const inquiryProduct = document.querySelector('#inquiry-product');
document.querySelectorAll('[data-inquiry-product]').forEach(link => {
  link.addEventListener('click', () => {
    inquiryProduct.value = link.dataset.inquiryProduct;
  });
});
const inquiryForm = document.querySelector('#inquiry-form');
inquiryForm.addEventListener('submit', event => {
  event.preventDefault();
  const company = inquiryForm.elements.company.value.trim();
  if (!company) {
    inquiryForm.elements.company.setCustomValidity('Skriv inn navnet på arbeidsplassen.');
    inquiryForm.elements.company.reportValidity();
    return;
  }
  const product = inquiryProduct.value;
  const message = inquiryForm.elements.message.value.trim();
  const body = `Hei SmartVend,\n\nVi ønsker å høre mer om en løsning for arbeidsplassen vår.\n\nBedrift / arbeidsplass: ${company}\nLøsning: ${product}\n${message ? `\nBehov og plassering:\n${message}\n` : ''}\nVennlig hilsen`;
  const email = `mailto:post@smartvend.no?subject=${encodeURIComponent(`Forespørsel — ${product}`)}&body=${encodeURIComponent(body)}`;
  window.location.href = email;
  inquiryForm.querySelector('.form-status').textContent = 'E-posten er klargjort. Hvis e-postprogrammet ikke åpnes, kan du kontakte post@smartvend.no direkte.';
});
inquiryForm.elements.company.addEventListener('input', () => {
  inquiryForm.elements.company.setCustomValidity('');
});

// Stagger related items within a section, with a short maximum delay.
['.value-details', '.business-benefits', '.steps'].forEach(selector => {
  document.querySelectorAll(`${selector} .reveal`).forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${Math.min(index * 75, 225)}ms`);
  });
});

// Dismiss the opening logo after the hero is ready, with a short maximum wait.
const introStarted = performance.now();
let introDismissed = false;
function dismissIntro() {
  if (introDismissed) return;
  introDismissed = true;
  const delay = reducedMotion.matches ? 0 : Math.max(0, 1050 - (performance.now() - introStarted));
  window.setTimeout(() => document.documentElement.classList.remove('intro-pending'), delay);
}
const openingImage = document.querySelector('.hero-image img');
if (openingImage.decode) openingImage.decode().then(dismissIntro, dismissIntro);
else if (document.readyState === 'complete') dismissIntro();
else window.addEventListener('load', dismissIntro, { once: true });
window.setTimeout(dismissIntro, 1800);
window.addEventListener('pageshow', event => {
  if (event.persisted) document.documentElement.classList.remove('intro-pending');
});

// Reading progress is updated once per frame; resize handles product changes too.
const progressFill = document.querySelector('.scroll-progress > span');
let progressFrame = false;
function updateProgress() {
  if (progressFrame) return;
  progressFrame = true;
  requestAnimationFrame(() => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
    progressFill.style.transform = `scaleX(${progress})`;
    progressFrame = false;
  });
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
if ('ResizeObserver' in window) new ResizeObserver(updateProgress).observe(document.body);
updateProgress();

const animatedFooter = document.querySelector('.footer');
const motionToggle = document.querySelector('.motion-toggle');
function syncFooterMotion() {
  animatedFooter.classList.toggle('footer-motion', !reducedMotion.matches);
}
syncFooterMotion();
reducedMotion.addEventListener('change', syncFooterMotion);
motionToggle.addEventListener('click', () => {
  const paused = animatedFooter.classList.toggle('motion-paused');
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.innerHTML = paused ? 'Start animasjon <svg class="icon" aria-hidden="true"><use href="#icon-play"/></svg>' : 'Pause animasjon <svg class="icon" aria-hidden="true"><use href="#icon-pause"/></svg>';
});
if ('IntersectionObserver' in window) {
  const footerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      animatedFooter.classList.toggle('footer-in-view', entry.isIntersecting);
      if (entry.isIntersecting) animatedFooter.classList.add('footer-entered');
    });
  }, { threshold: 0 });
  footerObserver.observe(animatedFooter);
} else animatedFooter.classList.add('footer-entered');

// A small, brand-colored cursor accent only appears for precise pointer devices.
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
if (cursorDot && cursorRing && matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion.matches) {
  let cursorFrame = false;
  let cursorX = 0;
  let cursorY = 0;
  document.addEventListener('pointermove', event => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    if (cursorFrame) return;
    cursorFrame = true;
    requestAnimationFrame(() => {
      cursorDot.style.left = `${cursorX}px`;
      cursorDot.style.top = `${cursorY}px`;
      cursorRing.style.left = `${cursorX}px`;
      cursorRing.style.top = `${cursorY}px`;
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
      cursorFrame = false;
    });
  }, { passive: true });
  document.addEventListener('pointerleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });
  document.querySelectorAll('a,button,summary,select,[data-view-image]').forEach(element => {
    element.addEventListener('mouseenter', () => cursorRing.classList.add('is-hover'));
    element.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hover'));
  });
}

// The mobile CTA appears after the opening story, so it supports conversion without covering the hero.
const mobileCta = document.querySelector('.mobile-cta');
if (mobileCta) {
  const ctaObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => mobileCta.classList.toggle('is-visible', !entry.isIntersecting));
  }, { threshold: 0.05 });
  ctaObserver.observe(document.querySelector('.hero'));
}

// Cookie preference is local and limited to this static site's own notice.
const cookieNotice = document.querySelector('#cookie-notice');
const cookieKey = 'smartvend-cookie-notice';
if (cookieNotice && localStorage.getItem(cookieKey) !== 'accepted') {
  window.setTimeout(() => cookieNotice.classList.add('visible'), 1300);
}
cookieNotice?.querySelector('.cookie-accept').addEventListener('click', () => {
  localStorage.setItem(cookieKey, 'accepted');
  cookieNotice.classList.remove('visible');
  window.setTimeout(() => cookieNotice.remove(), 500);
});

// Gallery framing is a crop of the supplied image, not an invented product view.
document.querySelectorAll('[data-gallery]').forEach(gallery => {
  gallery.querySelectorAll('[data-image-view]').forEach(button => {
    button.addEventListener('click', () => {
      gallery.dataset.view = button.dataset.imageView;
      gallery.querySelectorAll('[data-image-view]').forEach(control => {
        control.setAttribute('aria-pressed', String(control === button));
      });
    });
  });
});
const imageDialog = document.querySelector('.image-dialog');
const viewerImage = imageDialog.querySelector('.viewer-image');
const viewerCanvas = imageDialog.querySelector('.viewer-canvas');
const zoomButton = imageDialog.querySelector('.viewer-zoom');
let viewerTrigger;
function resetViewerZoom() {
  viewerCanvas.classList.remove('zoomed');
  zoomButton.setAttribute('aria-pressed', 'false');
  zoomButton.innerHTML = 'Se nærmere <svg class="icon" aria-hidden="true"><use href="#icon-plus"/></svg>';
  viewerCanvas.scrollTop = 0;
  viewerCanvas.scrollLeft = 0;
}
document.querySelectorAll('[data-view-image]').forEach(link => {
  link.addEventListener('click', event => {
    if (!imageDialog.showModal) return;
    event.preventDefault();
    const galleryImage = link.closest('[data-gallery]').querySelector('img');
    viewerImage.src = link.href;
    viewerImage.alt = galleryImage.alt;
    viewerImage.width = Number(galleryImage.getAttribute('width'));
    viewerImage.height = Number(galleryImage.getAttribute('height'));
    imageDialog.querySelector('h2').textContent = link.closest('[data-gallery]').querySelector('figcaption > span').textContent;
    viewerTrigger = link;
    resetViewerZoom();
    document.body.classList.add('viewer-open');
    imageDialog.showModal();
  });
});
imageDialog.querySelector('.viewer-close').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', event => {
  if (event.target !== imageDialog) return;
  const rect = imageDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) imageDialog.close();
});
imageDialog.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  viewerTrigger?.focus({ preventScroll: true });
});
zoomButton.addEventListener('click', () => {
  const zoomed = viewerCanvas.classList.toggle('zoomed');
  zoomButton.setAttribute('aria-pressed', String(zoomed));
  zoomButton.innerHTML = zoomed ? 'Hele bildet <svg class="icon" aria-hidden="true"><use href="#icon-minus"/></svg>' : 'Se nærmere <svg class="icon" aria-hidden="true"><use href="#icon-plus"/></svg>';
  if (!zoomed) {
    viewerCanvas.scrollTop = 0;
    viewerCanvas.scrollLeft = 0;
  }
});
