const header = document.querySelector('.header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 18);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const progressFill = document.querySelector('.scroll-progress i');
let scrollQueued = false;
const updateScrollProgress = () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    progressFill.style.transform = `scaleX(${available > 0 ? window.scrollY / available : 0})`;
    scrollQueued = false;
  });
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Lukk meny' : 'Åpne meny');
  nav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Åpne meny');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.13, rootMargin: '0px 0px -35px 0px' });

document.querySelectorAll('.reveal').forEach((item, index) => {
  item.style.transitionDelay ||= `${Math.min(index % 4, 3) * 55}ms`;
  revealObserver.observe(item);
});

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = entry.target;
    const end = Number(target.dataset.count);
    const start = performance.now();
    const duration = 1000;
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      target.textContent = Math.round(end * eased).toString().padStart(2, '0');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(target);
  });
}, { threshold: 0.7 });

document.querySelectorAll('[data-count]').forEach(item => countObserver.observe(item));
document.querySelector('#year').textContent = new Date().getFullYear();

// The hero object and product cards use pointer parallax on fine pointers only.
const art = document.querySelector('.hero-art');
const machine = art.querySelector('.machine');
const motionAllowed = window.matchMedia('(prefers-reduced-motion: no-preference)');
if (window.matchMedia('(pointer:fine)').matches && motionAllowed.matches) {
  let pointerFrame = 0;
  art.addEventListener('pointermove', event => {
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
    const box = art.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
      machine.style.setProperty('--pointer-x', `${x * 9}px`);
      machine.style.setProperty('--pointer-y', `${y * 8}px`);
      machine.style.setProperty('--tilt-x', `${-y * 6}deg`);
      machine.style.setProperty('--tilt-y', `${x * 10 - 9}deg`);
      art.style.setProperty('--light-x', `${50 + x * 30}%`);
      art.style.setProperty('--light-y', `${50 + y * 30}%`);
      pointerFrame = 0;
    });
  });
  art.addEventListener('pointerleave', () => {
    ['--pointer-x', '--pointer-y', '--tilt-x', '--tilt-y'].forEach(prop => machine.style.removeProperty(prop));
    ['--light-x', '--light-y'].forEach(prop => art.style.removeProperty(prop));
  });

  document.querySelectorAll('.product-card').forEach(card => {
    let cardFrame = 0;
    card.addEventListener('pointermove', event => {
      if (cardFrame) return;
      cardFrame = requestAnimationFrame(() => {
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - .5;
        const y = (event.clientY - box.top) / box.height - .5;
        card.style.setProperty('--card-x', `${-y * 4}deg`);
        card.style.setProperty('--card-y', `${x * 5}deg`);
        cardFrame = 0;
      });
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--card-x');
      card.style.removeProperty('--card-y');
    });
  });
}

const sectionLinks = [...document.querySelectorAll('.nav a[href^="#"]')].filter(link => link.hash !== '#top');
const sections = sectionLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    sectionLinks.forEach(link => {
      const active = link.hash === `#${entry.target.id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));
