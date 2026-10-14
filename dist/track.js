// Lettvekts hendelsessporing. Sender til dataLayer / gtag hvis de finnes. Laster ingen tredjepartstjenester.
(function () {
  function send(name, params) {
    try {
      var data = Object.assign({ page: location.pathname }, params || {});
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: name }, data));
      if (typeof window.gtag === 'function') window.gtag('event', name, data);
    } catch (e) {}
  }
  window.svTrack = send;
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('a,button');
    if (!t) return;
    var href = t.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) send('phone_click');
    else if (href.indexOf('mailto:') === 0) send('email_click');
    else if (t.classList.contains('cb-launcher')) send('chat_open');
    else if (t.classList.contains('cb-link')) send('chat_link_click', { target: href });
    else if (t.matches('.button-orange,.mobile-cta a,[data-inquiry-product]') || href.indexOf('inquiry-form') > -1 || href.indexOf('#kontakt') > -1) send('cta_click', { label: (t.textContent || '').trim().slice(0, 60) });
  }, true);
})();
