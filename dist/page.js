const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function setMenu(open) {
  nav.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Lukk meny' : 'Åpne meny');
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
