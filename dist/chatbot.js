// SmartVend assistant: forhåndsskrevne svar, ingen ekstern tjeneste. Svarene bygger kun på informasjon fra nettstedet.
(function () {
  const L = {
    bedrift: ['/salgsautomat-bedrift/', 'Salgsautomat for bedrift'],
    varm: ['/varmmatautomat/', 'Varmmatautomat'],
    kantine: ['/kantineautomat/', 'Kantineautomat'],
    uten: ['/kantine-uten-bemanning/', 'Kantine uten bemanning'],
    lease: ['/leasing-eller-kjop-salgsautomat/', 'Leasing eller kjøp'],
    tilbud: ['/#inquiry-form', 'Be om tilbud'],
    epost: ['mailto:post@smartvend.no', 'post@smartvend.no'],
    tlf: ['tel:+4794846415', '+47 948 46 415']
  };
  const REPLIES = [
    { id: 'produkter', k: ['produkt', 'automat', 'losning', 'løsning', 'quickmeal', 'snackstop', 'hub', 'hva tilbyr', 'utvalg'],
      a: 'SmartVend har tre hovedløsninger: QuickMEAL (varme måltider), SNACKstop (sandwich, salat, frukt, smoothies, brus, juice og snacks) og QuickMEAL HUB (varm mat, fersk mat, kald drikke og kaffe samlet). Vi har også QuickMEAL Plus, verneutstyr og reseptfrie legemidler – spør oss på e-post.', l: ['bedrift'] },
    { id: 'varm', k: ['varm', 'varmt', 'varme', 'middag', 'lunsj', 'mikro'],
      a: 'QuickMEAL og QuickMEAL HUB tilbyr varme måltider. Ferdigtilberedte retter oppbevares kjølig og varmes opp når de kjøpes, så varm mat er tilgjengelig hele døgnet.', l: ['varm'] },
    { id: 'kaffe', k: ['kaffe', 'drikke', 'brus', 'juice', 'smoothie'],
      a: 'Kaffe og kald drikke er en del av QuickMEAL HUB. SNACKstop har kalde drikker som brus, juice og smoothies.', l: ['kantine'] },
    { id: 'kantine', k: ['kantine', 'bemann', 'erstatt', 'uten ansatte', 'personale'],
      a: 'QuickMEAL HUB er laget som et alternativ til tradisjonell kantine. Utvalget er begrenset til det automaten rommer, så vi hjelper dere å vurdere om det passer som erstatning eller supplement.', l: ['uten', 'kantine'] },
    { id: 'lease', k: ['lease', 'leasing', 'leie', 'kjøp', 'kjop', 'kjøpe', 'eie', 'finansier'],
      a: 'SmartVend tilbyr både leasing uten kapitalbinding og kjøp av automaten. Service og vedlikehold er inkludert uansett valg.', l: ['lease'] },
    { id: 'pris', k: ['pris', 'koster', 'kostnad', 'kroner', 'budsjett', 'dyrt'],
      a: 'Prisen avhenger av løsning og valget mellom leasing og kjøp. Vi oppgir ikke priser her, men dere får et tilbud tilpasset stedet.', l: ['tilbud'] },
    { id: 'service', k: ['service', 'vedlikehold', 'support', 'feil', 'drift'],
      a: 'Alle løsninger leveres med service og vedlikehold inkludert, enten dere velger leasing eller kjøp. Detaljer om hva som inngår går vi gjennom i tilbudet.', l: ['epost'] },
    { id: 'hvor', k: ['hvor', 'passer', 'kontor', 'lager', 'industri', 'bygg', 'skole', 'hotell', 'plassering', 'arbeidsplass'],
      a: 'SmartVend leverer til blant annet kontor og lager, industri og byggeplasser, skoler og offentlige bygg, hoteller og transportknutepunkter.', l: ['bedrift'] },
    { id: 'døgn', k: ['døgn', 'dogn', '24', 'åpningstid', 'apningstid', 'natt', 'skift', 'kveld'],
      a: 'Løsningene er tilgjengelige hele døgnet, også utenfor vanlige kantineåpningstider, tidlig morgen, sene kvelder og mellom skift.', l: ['bedrift'] },
    { id: 'tilbud', k: ['tilbud', 'komme i gang', 'bestill', 'bestille', 'start', 'forespørsel', 'foresporsel', 'prøve'],
      a: 'Slik kommer dere i gang: 1) Fortell oss om stedet og hva dere vil tilby. 2) Vi hjelper dere å velge løsning og leasing eller kjøp. 3) Mat og drikke blir tilgjengelig med service inkludert. Send en forespørsel, så tar vi kontakt.', l: ['tilbud'] },
    { id: 'kontakt', k: ['kontakt', 'ring', 'telefon', 'mail', 'e-post', 'epost', 'snakke', 'menneske'],
      a: 'Du når oss på post@smartvend.no eller telefon +47 948 46 415.', l: ['epost', 'tlf'] },
    { id: 'hei', k: ['hei', 'hallo', 'hey', 'god dag', 'morn'],
      a: 'Hei! Jeg svarer gjerne på spørsmål om SmartVend sine automater, leasing og kjøp, og hvordan dere kommer i gang.', l: [] }
  ];
  const SUGGEST = [['Hvilke automater finnes?', 'produkter'], ['Kan vi få varm mat?', 'varm'], ['Leasing eller kjøp?', 'lease'], ['Hva koster det?', 'pris'], ['Be om tilbud', 'tilbud']];
  const FALLBACK = 'Det kan jeg dessverre ikke svare sikkert på her. Ta gjerne kontakt, så hjelper vi deg videre.';

  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
  const norm = s => s.toLowerCase();
  const root = el('div', 'cb');
  const launcher = el('button', 'cb-launcher');
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'cb-panel');
  launcher.append(el('span', 'cb-launcher-icon', '💬'), el('span', 'cb-launcher-label', 'Spør oss'));
  const panel = el('section', 'cb-panel');
  panel.id = 'cb-panel';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'SmartVend-assistent');
  const head = el('header', 'cb-head');
  const close = el('button', 'cb-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Lukk chat');
  head.append(el('div', null), close);
  head.firstChild.append(el('strong', null, 'SmartVend-assistent'), el('small', null, 'Automatiske svar. Ikke en ansatt.'));
  const log = el('div', 'cb-log');
  log.setAttribute('role', 'log');
  log.setAttribute('aria-live', 'polite');
  const chips = el('div', 'cb-chips');
  const form = el('form', 'cb-form');
  const input = el('input');
  input.type = 'text';
  input.maxLength = 200;
  input.placeholder = 'Skriv spørsmålet ditt';
  input.setAttribute('aria-label', 'Skriv spørsmålet ditt');
  const send = el('button', null, 'Send');
  send.type = 'submit';
  form.append(input, send);
  panel.append(head, log, chips, form);
  root.append(panel, launcher);

  function say(text, who, links) {
    const m = el('div', 'cb-msg cb-' + who);
    m.append(el('p', null, text));
    (links || []).forEach(key => {
      const [href, label] = L[key];
      const a = el('a', 'cb-link', label + ' →');
      a.href = href;
      m.append(a);
    });
    log.append(m);
    log.scrollTop = log.scrollHeight;
  }
  function answer(text) {
    const q = norm(text);
    let best = null, score = 0;
    REPLIES.forEach(r => {
      const s = r.k.reduce((n, w) => n + (q.includes(w) ? 1 : 0), 0);
      if (s > score) { score = s; best = r; }
    });
    if (best) say(best.a, 'bot', best.l);
    else say(FALLBACK, 'bot', ['epost', 'tlf', 'tilbud']);
  }
  function ask(text) { say(text, 'user'); window.setTimeout(() => answer(text), 250); }
  function open(state) {
    panel.hidden = !state;
    launcher.setAttribute('aria-expanded', String(state));
    root.classList.toggle('is-open', state);
    if (state) {
      if (!log.children.length) say('Hei! Jeg er SmartVend sin assistent. Velg et tema under, eller skriv et spørsmål.', 'bot');
      input.focus();
    } else launcher.focus();
  }
  SUGGEST.forEach(([label, id]) => {
    const b = el('button', 'cb-chip', label);
    b.type = 'button';
    b.addEventListener('click', () => {
      say(label, 'user');
      const r = REPLIES.find(x => x.id === id);
      window.setTimeout(() => say(r.a, 'bot', r.l), 250);
    });
    chips.append(b);
  });
  launcher.addEventListener('click', () => open(panel.hidden));
  close.addEventListener('click', () => open(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) open(false); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    input.value = '';
    ask(v);
  });
  document.body.append(root);
})();
