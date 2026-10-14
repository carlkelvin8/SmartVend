const header = document.querySelector('.header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 18);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

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

// The product illustration responds subtly to pointer movement on larger screens.
const art = document.querySelector('.hero-art');
const machine = art.querySelector('.machine');
if (window.matchMedia('(pointer:fine) and (prefers-reduced-motion: no-preference)').matches) {
  art.addEventListener('pointermove', event => {
    const box = art.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    machine.style.setProperty('--tilt-x', `${-y * 4}deg`);
    machine.style.setProperty('--tilt-y', `${x * 5 - 9}deg`);
    machine.style.animationPlayState = 'paused';
    machine.style.transform = `translateY(-5px) rotateX(${-y * 4}deg) rotateY(${x * 5 - 9}deg)`;
  });
  art.addEventListener('pointerleave', () => {
    machine.style.transform = '';
    machine.style.animationPlayState = '';
  });
}
