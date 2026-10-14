const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const DIST = path.join(__dirname, '..', 'dist');
const TODAY = new Date().toISOString().slice(0, 10);
const ORIGIN = 'https://smartvend.no';
const OG_IMAGE = ORIGIN + '/assets/og-image.jpg';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ld = o => JSON.stringify(o).replace(/</g, '\\u003c');

const IMG = {
  quickmeal: { src: '/assets/quickmeal.webp', srcset: '/assets/quickmeal-480.webp 480w, /assets/quickmeal.webp 656w', w: 656, h: 456, alt: 'QuickMEAL automat for varme måltider' },
  snackstop: { src: '/assets/snackstop.webp', srcset: '/assets/snackstop-480.webp 480w, /assets/snackstop.webp 522w', w: 522, h: 482, alt: 'SNACKstop automat med mat, snacks og kalde drikker' },
  hub: { src: '/assets/hub-800.webp', srcset: '/assets/hub-480.webp 480w, /assets/hub-800.webp 800w, /assets/hub.webp 930w', w: 930, h: 747, alt: 'QuickMEAL HUB med varme måltider, mat, drikke og kaffe' },
  workplace: { src: '/assets/workplace-800.webp', srcset: '/assets/workplace-480.webp 480w, /assets/workplace-800.webp 800w, /assets/workplace.webp 1069w', w: 1069, h: 722, alt: 'En ansatt bruker en SmartVend matserveringsautomat' },
};

const L = {
  bedrift: ['/salgsautomat-bedrift/', 'Salgsautomat for bedrift'],
  varm: ['/varmmatautomat/', 'Varmmatautomat'],
  kantine: ['/kantineautomat/', 'Kantineautomat'],
  uten: ['/kantine-uten-bemanning/', 'Kantine uten bemanning'],
  lease: ['/leasing-eller-kjop-salgsautomat/', 'Leasing eller kjøp'],
};

const A = {
  kantine: ['/innsikt/kantine-eller-automat/', 'Kantine eller automat?'],
  sette: ['/innsikt/for-dere-setter-opp-salgsautomat/', 'Før dere setter opp salgsautomat'],
  kantine_a: ['/innsikt/kantine-eller-automat/', 'Kantine eller automat?'],
  skift: ['/innsikt/mattilbud-skiftarbeid-byggeplass/', 'Mattilbud for skift og byggeplass'],
};
const pages = [
  {
    slug: 'salgsautomat-bedrift',
    title: 'Salgsautomat for bedrift og arbeidsplass | SmartVend',
    desc: 'Salgsautomat for bedrift og arbeidsplass med varm mat, fersk mat, drikke og kaffe. Leasing eller kjøp, og service inkludert. Be om tilbud fra SmartVend.',
    eyebrow: 'SALGSAUTOMAT FOR BEDRIFT',
    h1: 'Salgsautomat for bedrifter og arbeidsplasser',
    lead: 'SmartVend leverer salgsautomater med mat, drikke og kaffe, slik at ansatte, kunder og besøkende har et tilbud hele døgnet – uten bemannet butikk eller kantine.',
    image: IMG.snackstop,
    product: 'Hjelp meg å velge',
    service: 'Salgsautomater med mat, drikke og kaffe for bedrifter og arbeidsplasser, med leasing eller kjøp og service inkludert.',
    sections: [
      { h2: 'Hva er en salgsautomat for bedrift?', p: [
        'En salgsautomat for bedrift er en selvbetjent løsning som gir folk tilgang til mat og drikke på arbeidsplassen, uavhengig av åpningstider. Noen kaller den vendingautomat, matautomat eller automatkiosk – i praksis handler det om det samme: et tilbud som er på plass når folk trenger det.',
        'Hos SmartVend dekker løsningene alt fra varme måltider til sandwich, salat, frukt, smoothies, brus, juice, snacks og kaffe, avhengig av hvilken automat dere velger.' ] },
      { h2: 'Hvilke arbeidsplasser passer løsningen for?', p: ['SmartVend leverer til ulike typer virksomheter. Eksempler er:'],
        ul: ['Kontor og lager', 'Industri og byggeplasser', 'Skoler og offentlige bygg', 'Hoteller', 'Transportknutepunkter'],
        after: 'Felles for stedene er at folk jobber utenfor vanlig kantinetid, eller at det ikke er grunnlag for en bemannet kantine.' },
      { h2: 'Velg riktig løsning for arbeidsplassen', pre: ['SmartVend har tre hovedløsninger. Tabellen viser forskjellen, og hver løsning har en egen side med mer informasjon.'],
        table: { head: ['Løsning', 'Dette får dere', 'Passer når dere ønsker'], rows: [
          ['QuickMEAL', 'Varme måltider', 'Et varmt mattilbud i en kompakt løsning'],
          ['SNACKstop', 'Sandwich, salat, frukt, smoothies, brus, juice og snacks', 'Et variert tilbud til lunsj og små pauser'],
          ['QuickMEAL HUB', 'Varme måltider, fersk mat, kald drikke og kaffe', 'En komplett kantineløsning på ett sted'] ] },
        links: [L.varm, L.kantine] },
      { h2: 'Slik vurderer dere behovet', p: ['Et godt utgangspunkt er å svare på noen enkle spørsmål før dere tar kontakt:'],
        ul: ['Hvem skal bruke automaten, og når på døgnet trenger de mat og drikke?', 'Hvor skal den stå, og hvor mye plass er det?', 'Ønsker dere varme måltider, ferske alternativer, kaffe, eller en kombinasjon?', 'Passer leasing eller kjøp best for driften?'],
        after: 'Svarene gjør det enklere for oss å foreslå en løsning som passer stedet.' },
      { cta: true },
      { h2: 'Hva bør dere være oppmerksomme på?', p: [
        'En automat gir et tilgjengelig og enkelt tilbud, men utvalget er begrenset til det automaten rommer. For arbeidsplasser med mange ansatte eller flere skift kan det være aktuelt å vurdere en større løsning, som QuickMEAL HUB.',
        'Praktiske detaljer som plassering, utvalg og hva som inngår i tilbudet avklarer vi sammen med dere i dialogen, før dere bestemmer dere.' ] },
      { h2: 'Leasing eller kjøp – med service inkludert', p: [
        'SmartVend tilbyr både leasing og kjøp, og service og vedlikehold er inkludert uansett valg. Les mer om forskjellene på siden om leasing eller kjøp av salgsautomat.' ], links: [L.lease] },
    ],
    faq: [
      ['Hva er en salgsautomat for bedrift?', 'Det er en selvbetjent automat som gir ansatte, kunder og besøkende tilgang til mat og drikke hele døgnet, uten at stedet trenger egen bemanning.'],
      ['Kan automaten tilby varm mat?', 'Ja. QuickMEAL og QuickMEAL HUB tilbyr varme måltider. Ferdigtilberedte retter oppbevares kjølig og varmes opp når de kjøpes.'],
      ['Kan vi leie eller kjøpe automaten?', 'SmartVend tilbyr både leasing og kjøp. Leasing gjør at dere slipper kapitalbinding.'],
      ['Er service og vedlikehold inkludert?', 'Ja, alle løsninger leveres med service og vedlikehold inkludert, enten dere velger leasing eller kjøp.'],
      ['Hvordan ber vi om tilbud?', 'Bruk forespørselsskjemaet på forsiden, eller send en e-post til post@smartvend.no eller ring +47 948 46 415. Fortell oss litt om stedet og hva dere ønsker å tilby.'],
    ],
    related: ['varm', 'kantine', 'uten', 'lease', 'sette'],
  },
  {
    slug: 'varmmatautomat',
    title: 'Varmmatautomat for bedrifter – QuickMEAL | SmartVend',
    desc: 'Varmmatautomat for bedrifter: QuickMEAL gir varme måltider hele døgnet, også utenfor kantinens åpningstid. Service inkludert. Be om tilbud fra SmartVend.',
    eyebrow: 'VARMMATAUTOMAT',
    h1: 'Varmmatautomat for bedrifter',
    lead: 'QuickMEAL er en kompakt automat med varm mat, tilgjengelig hele døgnet. Et enkelt tilbud for arbeidsplasser der folk trenger et ordentlig måltid utenfor vanlig kantinetid.',
    image: IMG.quickmeal,
    product: 'QuickMEAL',
    service: 'Varmmatautomaten QuickMEAL med varme måltider hele døgnet for bedrifter og arbeidsplasser.',
    sections: [
      { h2: 'Slik fungerer en automat med varm mat', p: [
        'Ferdigtilberedte retter oppbevares kjølig i automaten. Når et måltid kjøpes, varmes det opp, slik at varm mat er tilgjengelig hele døgnet.',
        'Det betyr at en arbeidsplass kan tilby et varmt måltid også tidlig om morgenen, sent på kvelden og mellom skiftene.' ] },
      { h2: 'Når passer en varmmatautomat?', p: ['QuickMEAL passer godt når dere:'],
        ul: ['har ansatte som jobber skift eller utenfor vanlig kantinetid', 'ikke har en bemannet kantine, eller ønsker et tilbud når kantinen er stengt', 'vil ha et kompakt matserveringstilbud uten egen bemanning'],
        after: 'Automaten er kompakt, men vi vurderer plassering og behov sammen med dere.' },
      { h2: 'QuickMEAL sammenlignet med andre løsninger', table: { head: ['Løsning', 'Varme måltider', 'Kald mat og drikke', 'Kaffe'], rows: [
          ['QuickMEAL', 'Ja', 'Se SNACKstop eller HUB', 'Se HUB'],
          ['SNACKstop', 'Nei', 'Ja', 'Nei'],
          ['QuickMEAL HUB', 'Ja', 'Ja', 'Ja'] ] },
        p: ['Ønsker dere varm mat, kald drikke og kaffe samlet, er QuickMEAL HUB et alternativ som beskrives på siden om kantineautomat.'], links: [L.kantine] },
      { cta: true },
      { h2: 'Gode spørsmål før dere velger', p: [
        'Tenk gjennom hvor mange som skal bruke automaten, hvilke tidspunkt den vil bli brukt mest, og hvor den kan stå. Hvilke retter som tilbys og hva som inngår i driften avklarer vi i dialogen og tilbudet.',
        'En kompakt varmmatautomat er ikke en erstatning for et bemannet kjøkken med stort, skiftende utvalg. Den er et enkelt og tilgjengelig tilbud som fungerer når kantinen ikke er åpen.' ] },
    ],
    faq: [
      ['Hvordan blir maten varm?', 'Ferdigtilberedte retter oppbevares kjølig i automaten og varmes opp når de kjøpes.'],
      ['Er automaten tilgjengelig hele døgnet?', 'Ja, QuickMEAL gir varme måltider 24/7.'],
      ['Er service og vedlikehold inkludert?', 'Ja, service og vedlikehold er inkludert, enten dere velger leasing eller kjøp.'],
      ['Hvilke retter finnes?', 'Utvalget avklares i tilbudet. Ta kontakt, så går vi gjennom hva som passer arbeidsplassen.'],
    ],
    related: ['kantine', 'bedrift', 'lease', 'uten', 'skift'],
  },
  {
    slug: 'kantineautomat',
    title: 'Kantineautomat og automatkiosk for bedrift | SmartVend',
    desc: 'Kantineautomat med varm mat, fersk mat, drikke og kaffe på ett sted. QuickMEAL HUB er en selvbetjent automatkiosk for bedrifter. Be om tilbud.',
    eyebrow: 'KANTINEAUTOMAT',
    h1: 'Kantineautomat og selvbetjent mattilbud',
    lead: 'QuickMEAL HUB samler varme måltider, fersk mat, kald drikke og kaffe i én løsning. En selvbetjent automatkiosk som fungerer som kantine hele døgnet.',
    image: IMG.hub,
    product: 'QuickMEAL HUB',
    service: 'Kantineautomaten QuickMEAL HUB med varme måltider, fersk mat, kald drikke og kaffe for bedrifter.',
    sections: [
      { h2: 'Hva er en kantineautomat?', p: [
        'En kantineautomat, eller automatkiosk, er en selvbetjent løsning som gir et bredere tilbud enn en enkelt automat. QuickMEAL HUB kombinerer varme måltider, fersk mat, kald drikke og kaffe, og er tilgjengelig hele døgnet – også utenfor vanlige kantineåpningstider.' ] },
      { h2: 'Dette inngår i QuickMEAL HUB', ul: ['Varme måltider', 'Fersk mat', 'Kald drikke', 'Kaffe'], after: 'Alt samlet på ett sted, med service og vedlikehold inkludert.' },
      { h2: 'Når bør dere velge en samlet løsning?', p: [
        'En samlet kantineautomat passer når mange skal bruke tilbudet, eller når dere ønsker at ett sted skal dekke både måltid, drikke og kaffe. For mindre behov kan en enkeltstående automat være nok: QuickMEAL for varm mat eller SNACKstop for lunsj og små pauser.' ], links: [L.varm, L.bedrift] },
      { cta: true },
      { h2: 'Kantineautomat sammenlignet med tradisjonell kantine', table: { head: ['', 'Kantineautomat', 'Tradisjonell kantine'], rows: [
          ['Tilgjengelighet', 'Hele døgnet', 'Etter kantinens åpningstid'],
          ['Betjening', 'Selvbetjent', 'Bemannet'],
          ['Utvalg', 'Begrenset til det automaten rommer', 'Normalt bredere og mer skiftende'] ] },
        p: ['Mange velger en kantineautomat som alternativ til kantine, eller som tilbud når kantinen er stengt. Les mer om dette på siden om kantine uten bemanning.'], links: [L.uten] },
    ],
    faq: [
      ['Hva er forskjellen på en kantineautomat og en vanlig salgsautomat?', 'En kantineautomat som QuickMEAL HUB samler varme måltider, fersk mat, kald drikke og kaffe, mens en enkeltstående automat normalt dekker ett av disse områdene.'],
      ['Kan den være et alternativ til tradisjonell kantine?', 'Ja, QuickMEAL HUB er laget som et alternativ til tradisjonell kantine. Utvalget er likevel begrenset til det automaten rommer.'],
      ['Er den tilgjengelig utenom åpningstid?', 'Ja, løsningen er tilgjengelig hele døgnet.'],
      ['Kan vi leie eller kjøpe?', 'SmartVend tilbyr både leasing og kjøp, med service og vedlikehold inkludert.'],
    ],
    related: ['varm', 'bedrift', 'uten', 'lease', 'kantine_a'],
  },
  {
    slug: 'kantine-uten-bemanning',
    title: 'Kantine uten bemanning – alternativ til kantine | SmartVend',
    desc: 'Vurderer dere kantine uten bemanning? Se hvordan en matautomat kan erstatte eller supplere kantinen, med varm mat og drikke hele døgnet.',
    eyebrow: 'KANTINE UTEN BEMANNING',
    h1: 'Kantine uten bemanning: et alternativ til tradisjonell kantine',
    lead: 'Mange arbeidsplasser har ikke grunnlag for en bemannet kantine, eller trenger et tilbud utenom åpningstid. En selvbetjent automat gir mat og drikke når folk trenger det.',
    image: IMG.workplace,
    product: 'QuickMEAL HUB',
    service: 'Selvbetjent mattilbud som alternativ til eller supplement for bemannet kantine.',
    sections: [
      { h2: 'Hvorfor vurdere kantine uten bemanning?', p: ['Arbeidsdagen følger ikke alltid kantinens åpningstid. Skift, tidlige morgener og sene kvelder gjør at mange ikke får et godt mattilbud på jobb. En automat gir tilgang gjennom hele døgnet, uten at noen må stå i betjening.'] },
      { h2: 'Kan en automat erstatte kantinen?', p: [
        'For noen arbeidsplasser ja, for andre fungerer den som et supplement. QuickMEAL HUB er laget som et alternativ til tradisjonell kantine, med varme måltider, fersk mat, kald drikke og kaffe samlet.',
        'Vær klar over at en automat ikke gir samme opplevelse og utvalg som et bemannet kjøkken. Vi hjelper dere med å vurdere hva som er realistisk for akkurat deres arbeidsplass.' ] },
      { h2: 'Fra kantine til selvbetjent tilbud', p: ['Slik kan dere gå frem:'],
        ul: ['Beskriv arbeidsplassen: antall ansatte, skift og hvor tilbudet skal stå.', 'Velg løsning – QuickMEAL, SNACKstop eller QuickMEAL HUB.', 'Velg mellom leasing og kjøp. Service og vedlikehold er inkludert.'],
        links: [L.kantine, L.lease] },
      { cta: true },
      { h2: 'Passer det for oss?', p: ['SmartVend leverer til kontor og lager, industri og byggeplasser, skoler og offentlige bygg, hoteller og transportknutepunkter. Fortell oss om stedet, så gir vi en ærlig vurdering av hva som passer.'], links: [L.bedrift] },
    ],
    faq: [
      ['Hva betyr kantine uten bemanning?', 'Et mattilbud som er selvbetjent, uten kantinepersonale på stedet. Folk kjøper mat og drikke i en automat når det passer dem.'],
      ['Kan en automat erstatte hele kantinen?', 'Det avhenger av arbeidsplassen. QuickMEAL HUB er et alternativ til tradisjonell kantine, men utvalget er begrenset til det automaten rommer. Vi hjelper dere med å vurdere behovet.'],
      ['Hva med utenom åpningstid?', 'Automatene er tilgjengelige hele døgnet.'],
      ['Hva koster det?', 'Prisen avhenger av løsning og valg mellom leasing og kjøp. Be om tilbud, så får dere et forslag tilpasset stedet.'],
    ],
    related: ['kantine', 'varm', 'bedrift', 'lease', 'kantine_a'],
  },
  {
    slug: 'leasing-eller-kjop-salgsautomat',
    title: 'Leasing eller kjøp av salgsautomat | SmartVend',
    desc: 'Leie, leasing eller kjøpe salgsautomat? Se forskjellen og hva som inngår. SmartVend tilbyr leasing uten kapitalbinding eller kjøp, med service inkludert.',
    eyebrow: 'LEASING ELLER KJØP',
    h1: 'Leasing eller kjøp av salgsautomat',
    lead: 'Skal dere leie, lease eller kjøpe en salgsautomat? SmartVend tilbyr både leasing og kjøp, og service og vedlikehold er inkludert uansett valg.',
    product: 'Hjelp meg å velge',
    service: 'Leasing og kjøp av salgsautomater for bedrifter, med service og vedlikehold inkludert.',
    sections: [
      { h2: 'To måter å få en salgsautomat på', p: [
        'Mange søker etter å leie en salgsautomat. Hos SmartVend er det leasing som er det fleksible alternativet til å eie selv. Ønsker dere heller å eie automaten, kan dere kjøpe den.' ] },
      { h2: 'Leasing sammenlignet med kjøp', table: { head: ['', 'Leasing', 'Kjøp'], rows: [
          ['Kapitalbinding', 'Ingen kapitalbinding', 'Dere eier automaten'],
          ['Service og vedlikehold', 'Inkludert', 'Inkludert'],
          ['Pris og vilkår', 'Avklares i tilbudet', 'Avklares i tilbudet'] ] } },
      { h2: 'Hva bør dere avklare?', p: ['Velg modell ut fra behovet og driften:'],
        ul: ['Hvor lenge forventer dere å ha tilbudet på plass?', 'Hvor mye ønsker dere å binde opp i investering?', 'Hvilken løsning passer: QuickMEAL, SNACKstop eller QuickMEAL HUB?'],
        after: 'Vilkår, priser og eventuell bindingstid avtaler vi i tilbudet. Vi gjengir ikke tall her fordi de avhenger av løsning og sted.' },
      { cta: true },
      { h2: 'Velg løsningen først', p: ['Det er enklest å vurdere leasing eller kjøp når dere vet hva dere vil tilby. Les mer om løsningene:'], links: [L.bedrift, L.varm, L.kantine] },
    ],
    faq: [
      ['Kan vi leie en salgsautomat?', 'SmartVend tilbyr leasing uten kapitalbinding. Ta kontakt hvis dere har spesielle ønsker om periode.'],
      ['Kan vi kjøpe automaten?', 'Ja, kjøp er et alternativ til leasing.'],
      ['Er service inkludert?', 'Ja, service og vedlikehold er inkludert, enten dere velger leasing eller kjøp.'],
      ['Hva koster det?', 'Det avhenger av løsning og modell. Be om tilbud for et konkret forslag.'],
    ],
    related: ['bedrift', 'varm', 'kantine', 'uten'],
  },
];


const articles = [
  {
    slug: 'innsikt/kantine-eller-automat', kind: 'article',
    title: 'Kantine eller automat: slik vurderer dere | SmartVend',
    desc: 'Skal arbeidsplassen ha bemannet kantine eller selvbetjent automat? En enkel guide med spørsmål dere bør stille før dere velger.',
    eyebrow: 'GUIDE', h1: 'Kantine eller automat: slik vurderer dere',
    lead: 'Et mattilbud på arbeidsplassen handler om mer enn mat. Her er spørsmålene som hjelper dere å velge mellom en bemannet kantine, en automat, eller en kombinasjon.',
    product: 'QuickMEAL HUB', service: 'Guide til valg mellom bemannet kantine og selvbetjent automat.',
    sections: [
      { h2: 'Start med arbeidsdagen, ikke med utstyret', p: ['Hvem skal bruke tilbudet, og når? En kantine med faste åpningstider dekker lunsjtoppen godt. Har dere skift, tidlige morgener eller sene kvelder, er det ofte da behovet for mat og drikke er størst, og da er det kantinen som er stengt.'] },
      { h2: 'Sammenligning', table: { head: ['', 'Selvbetjent automat', 'Bemannet kantine'], rows: [
          ['Tilgjengelighet', 'Hele døgnet', 'Etter åpningstid'],
          ['Betjening', 'Selvbetjent', 'Bemannet'],
          ['Utvalg', 'Begrenset til det automaten rommer', 'Normalt bredere og mer skiftende'] ] },
        p: ['Tabellen er en forenkling. Hva som passer best avhenger av antall brukere og hva dere ønsker å tilby.'] },
      { h2: 'Spørsmål å stille før dere velger', ul: ['Hvor mange bruker tilbudet daglig, og når?', 'Har dere skift eller utvidede arbeidstider?', 'Hva skal tilbudet være: varm mat, lunsj, kaffe, drikke?', 'Er automaten et supplement til kantinen, eller skal den erstatte den?', 'Passer leasing eller kjøp best?'] },
      { cta: true },
      { h2: 'Kombinasjon er også et alternativ', p: ['Mange arbeidsplasser vurderer en automat som tilbud utenom kantinens åpningstid. QuickMEAL HUB er laget som et alternativ til tradisjonell kantine, mens QuickMEAL eller SNACKstop kan fungere som et enklere supplement.'], links: [L.kantine, L.uten] },
    ],
    faq: [], related: ['kantine', 'uten', 'varm', 'lease'],
  },
  {
    slug: 'innsikt/for-dere-setter-opp-salgsautomat', kind: 'article',
    title: 'Før dere setter opp en salgsautomat: sjekkliste | SmartVend',
    desc: 'Hva bør dere avklare før dere setter opp en salgsautomat på arbeidsplassen? En praktisk sjekkliste om behov, plassering og valg av løsning.',
    eyebrow: 'GUIDE', h1: 'Før dere setter opp en salgsautomat: dette bør dere avklare',
    lead: 'Jo tydeligere behovet er, jo enklere er det å velge riktig løsning. Her er en sjekkliste dere kan bruke før dere tar kontakt.',
    product: 'Hjelp meg å velge', service: 'Sjekkliste før oppsett av salgsautomat på arbeidsplassen.',
    sections: [
      { h2: 'Behov og bruk', ul: ['Antall ansatte, besøkende eller kunder som kan bruke automaten', 'Hvilke tider på døgnet den vil bli brukt mest', 'Om dere har skift, nattarbeid eller byggeplasstider'] },
      { h2: 'Hva vil dere tilby?', p: ['Varme måltider, sandwich og salat, frukt, smoothies, brus, juice, snacks eller kaffe? Svaret avgjør hvilken løsning som passer: QuickMEAL, SNACKstop eller QuickMEAL HUB.'], links: [L.bedrift] },
      { h2: 'Plassering', p: ['Tenk gjennom hvor automaten kan stå, og hvor lett den er å nå for dem som skal bruke den. Praktiske krav til plassen avklarer vi sammen med dere i dialogen.'] },
      { h2: 'Leasing eller kjøp', p: ['SmartVend tilbyr både leasing uten kapitalbinding og kjøp. Service og vedlikehold er inkludert uansett valg.'], links: [L.lease] },
      { cta: true },
      { h2: 'Neste steg', p: ['Send en forespørsel med det dere vet om stedet, så hjelper vi dere videre. Dere trenger ikke å ha alle svarene klare.'] },
    ],
    faq: [], related: ['bedrift', 'lease', 'kantine', 'varm'],
  },
  {
    slug: 'innsikt/mattilbud-skiftarbeid-byggeplass', kind: 'article',
    title: 'Mattilbud for skiftarbeid og byggeplasser | SmartVend',
    desc: 'Hvordan gir dere et godt mattilbud til ansatte som jobber skift eller på byggeplass? Se hva som er viktig å vurdere før dere velger løsning.',
    eyebrow: 'GUIDE', h1: 'Mattilbud til skiftarbeid og byggeplasser',
    lead: 'Når arbeidsdagen ikke følger kantinens åpningstid, trenger dere et tilbud som er på plass når folk har pause.',
    product: 'QuickMEAL', service: 'Guide til mattilbud for skiftarbeid og byggeplasser.',
    sections: [
      { h2: 'Utfordringen med faste åpningstider', p: ['Ansatte på tidlig- og kveldsskift, og de som jobber på byggeplass eller industri, får ofte ikke tilgang til en bemannet kantine. Et selvbetjent tilbud som er tilgjengelig hele døgnet kan fylle det hullet.'] },
      { h2: 'Hva bør tilbudet inneholde?', ul: ['Varm mat for dem som trenger et skikkelig måltid', 'Enklere alternativer som sandwich, salat, frukt og snacks', 'Drikke og kaffe'], after: 'QuickMEAL gir varme måltider, SNACKstop dekker lunsj og små pauser, og QuickMEAL HUB samler alt på ett sted.', links: [L.varm, L.kantine] },
      { cta: true },
      { h2: 'Hva bør dere være oppmerksomme på?', p: ['Utvalget er begrenset til det automaten rommer. Plassering og hva som passer det aktuelle stedet vurderer vi sammen med dere.'], links: [L.bedrift] },
    ],
    faq: [], related: ['varm', 'bedrift', 'uten', 'lease'],
  },
  {
    slug: 'personvern', kind: 'plain',
    title: 'Personvern | SmartVend',
    desc: 'Slik behandler SmartVend opplysninger du sender gjennom forespørselsskjemaet på smartvend.no.',
    eyebrow: 'PERSONVERN', h1: 'Personvern',
    lead: 'Her forklarer vi kort hvilke opplysninger nettstedet behandler og hvorfor.',
    product: 'Hjelp meg å velge', service: '',
    sections: [
      { h2: 'Forespørselsskjemaet', p: ['Når du sender en forespørsel, mottar SmartVend navnet på virksomheten, hvilken løsning du er interessert i, kontaktopplysningen du oppgir (e-post eller telefon) og en eventuell melding. Vi bruker opplysningene til å svare på forespørselen.'] },
      { h2: 'Informasjonskapsler og lagring', p: ['Nettstedet bruker kun nødvendig nettleserlagring, for eksempel for å huske at du har lukket informasjonsmeldingen og at åpningsanimasjonen er vist.'] },
      { h2: 'Kontakt', p: ['Spørsmål om personvern kan sendes til post@smartvend.no.'] },
    ],
    faq: [], related: [],
  },
];
pages.push(...articles);

const ICON = id => `<svg class="icon" aria-hidden="true" focusable="false"><use href="#${id}"/></svg>`;
const SPRITE = `<svg class="icon-library" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="icon-arrow" viewBox="0 0 24 24"><path d="M7 17 17 7M7 7h10v10"/></symbol><symbol id="icon-right" viewBox="0 0 24 24"><path d="M4 12h16m-6-6 6 6-6 6"/></symbol><symbol id="icon-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></symbol><symbol id="icon-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol></defs></svg>`;
const NOINDEX_GUARD = `<script>if(location.hostname!=='smartvend.no'){var m=document.createElement('meta');m.name='robots';m.content='noindex,nofollow';document.head.appendChild(m);}</script>`;

const header = () => `<header class="header"><div class="header-inner">
    <a class="brand" href="/" aria-label="SmartVend hjem"><img src="/assets/logo.jpg" alt="SmartVend" width="1080" height="161"></a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="navigation" aria-label="Åpne meny"><span></span><span></span></button>
    <nav class="nav" id="navigation" aria-label="Hovedmeny"><a href="/#produktoversikt">Produkter</a><a href="${L.bedrift[0]}">For bedrifter</a><a href="${L.lease[0]}">Leasing eller kjøp</a><a href="/#service">Service</a><a href="/#kontakt" class="button button-orange">Be om tilbud <span aria-hidden="true">${ICON('icon-arrow')}</span></a></nav>
  </div></header>`;

const footer = () => `<footer class="footer lp-footer"><div class="container"><div class="footer-main footer-main-4"><div class="footer-brand"><a class="brand" href="/" aria-label="SmartVend hjem"><img src="/assets/logo.jpg" alt="SmartVend" width="1080" height="161" loading="lazy"></a><p>Smart løsning. Enkel drift.<br>Tilgjengelig hele døgnet.</p></div><div class="footer-links"><span>LØSNINGER</span>${Object.values(L).map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</div><div class="footer-links"><span>GUIDER</span>${Object.values(A).map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</div><div class="footer-links"><span>SMARTVEND</span><a href="/#om-oss">Om oss</a><a href="/personvern/">Personvern</a><a href="mailto:post@smartvend.no">post@smartvend.no</a><a href="tel:+4794846415">+47 948 46 415</a></div></div><div class="footer-bottom"><span>© 2026 SmartVend</span><a href="#top">Til toppen ${ICON('icon-arrow')}</a></div></div></footer>`;

const ctaLink = (p, label) => `<a class="button button-orange" href="/?losning=${encodeURIComponent(p.product)}#inquiry-form">${label} <span aria-hidden="true">${ICON('icon-arrow')}</span></a>`;

function render(p) {
  const url = `${ORIGIN}/${p.slug}/`;
  const crumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartVend', item: ORIGIN + '/' },
    { '@type': 'ListItem', position: 2, name: p.h1, item: url } ] };
  const service = p.kind === 'article'
    ? { '@context': 'https://schema.org', '@type': 'Article', headline: p.h1, description: p.desc, url, mainEntityOfPage: url, inLanguage: 'nb-NO',
        author: { '@id': ORIGIN + '/#organization' }, publisher: { '@id': ORIGIN + '/#organization' }, image: OG_IMAGE }
    : p.kind === 'plain' ? null
    : { '@context': 'https://schema.org', '@type': 'Service', '@id': url + '#service', name: p.h1, description: p.service, url,
        provider: { '@id': ORIGIN + '/#organization' }, inLanguage: 'nb-NO' };
  const body = p.sections.map(s => {
    if (s.cta) return `<aside class="lp-cta"><div><h2>Finn riktig løsning for arbeidsplassen</h2><p>Fortell oss litt om stedet, så hjelper vi dere videre.</p></div>${ctaLink(p, 'Be om tilbud')}</aside>`;
    let h = `<section class="lp-section"><h2>${esc(s.h2)}</h2>`;
    (s.pre || []).forEach(t => { h += `<p>${esc(t)}</p>`; });
    if (!s.table) (s.p || []).forEach(t => { h += `<p>${esc(t)}</p>`; });
    if (s.ul) h += `<ul class="lp-list">${s.ul.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
    if (s.table) h += `<div class="lp-table"><table><thead><tr>${s.table.head.map(c => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map(r => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    if (s.table) (s.p || []).forEach(t => { h += `<p>${esc(t)}</p>`; });
    if (s.after) h += `<p>${esc(s.after)}</p>`;
    if (s.links) h += `<p class="lp-links">${s.links.map(([href, t]) => `<a class="text-link" href="${href}">${esc(t)} <span aria-hidden="true">${ICON('icon-arrow')}</span></a>`).join('')}</p>`;
    return h + '</section>';
  }).join('\n      ');
  // sections with table AND p placed after table (varm, kantine): handled by order p then table; acceptable
  const faq = !p.faq.length ? '' : `<section class="lp-section lp-faq"><h2>Vanlige spørsmål</h2>${p.faq.map(([q, a]) => `<details><summary>${esc(q)}<span aria-hidden="true">${ICON('icon-plus')}</span></summary><p>${esc(a)}</p></details>`).join('')}</section>`;
  const related = !p.related.length ? '' : `<nav class="lp-related" aria-label="Relaterte sider"><h2>Les også</h2><ul>${p.related.map(k => { const [h, t] = L[k] || A[k]; return `<li><a href="${h}">${esc(t)}</a></li>`; }).join('')}</ul></nav>`;
  const img = p.image ? `<figure class="lp-figure"><img src="${p.image.src}" srcset="${p.image.srcset}" sizes="(max-width:900px) 100vw, 42vw" alt="${esc(p.image.alt)}" width="${p.image.w}" height="${p.image.h}" fetchpriority="high"></figure>` : '';
  return `<!doctype html>
<html lang="nb">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0B3557">
  <title>${esc(p.title)}</title>
  <meta name="description" content="${esc(p.desc)}">
  <link rel="canonical" href="${url}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta property="og:type" content="website"><meta property="og:locale" content="nb_NO"><meta property="og:site_name" content="SmartVend">
  <meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.desc)}"><meta property="og:url" content="${url}">
  <meta property="og:image" content="${OG_IMAGE}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="SmartVend – salgsautomater for bedrifter med mat, drikke og kaffe"><meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(p.title)}"><meta name="twitter:description" content="${esc(p.desc)}"><meta name="twitter:image" content="${OG_IMAGE}">
  ${NOINDEX_GUARD}
  <link rel="preload" href="/assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="stylesheet" href="/styles.css">
  <script defer src="/page.js"></script>
  <script defer src="/track.js"></script>
  ${service ? `<script type="application/ld+json">${ld(service)}</script>` : ''}
  <script type="application/ld+json">${ld(crumb)}</script>
</head>
<body id="top">
  ${SPRITE}
  <a class="skip-link" href="#main">Hopp til innhold</a>
  ${header()}
  <main id="main">
    <div class="container lp-top">
      <nav class="lp-breadcrumb" aria-label="Brødsmulesti"><a href="/">SmartVend</a> <span aria-hidden="true">/</span> <span aria-current="page">${esc(p.h1)}</span></nav>
      <div class="lp-hero${p.image ? '' : ' lp-hero-plain'}">
        <div class="lp-hero-copy"><p class="eyebrow">${esc(p.eyebrow)}</p><h1>${esc(p.h1)}</h1><p class="lp-lead">${esc(p.lead)}</p><div class="lp-actions">${ctaLink(p, 'Be om tilbud')}<a class="text-link" href="/#kontakt">Kontakt oss <span aria-hidden="true">${ICON('icon-arrow')}</span></a></div></div>
        ${img}
      </div>
    </div>
    <div class="container lp-body">
      ${body}
      ${faq}
      ${related}
    </div>
    <section class="lp-final"><div class="container"><h2>Klar for å finne riktig løsning?</h2><p>Send en forespørsel, eller ta kontakt direkte på <a href="mailto:post@smartvend.no">post@smartvend.no</a> eller <a href="tel:+4794846415">+47 948 46 415</a>.</p>${ctaLink(p, 'Be om tilbud')}</div></section>
  </main>
  ${footer()}
  <script defer charset="utf-8" src="/chatbot.js"></script>
</body>
</html>
`;
}

pages.forEach(p => {
  const dir = path.join(DIST, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), render(p));
  console.log(p.slug, 'title', p.title.length, 'desc', p.desc.length);
});

// 404
fs.writeFileSync(path.join(DIST, '404.html'), `<!doctype html>
<html lang="nb"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Siden finnes ikke | SmartVend</title><meta name="robots" content="noindex,follow"><link rel="preload" href="/assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="stylesheet" href="/styles.css"><script defer src="/page.js"></script></head>
<body id="top">${SPRITE}<a class="skip-link" href="#main">Hopp til innhold</a>${header()}<main id="main" class="container lp-top"><div class="lp-hero lp-hero-plain"><div class="lp-hero-copy"><p class="eyebrow">404</p><h1>Vi finner ikke siden</h1><p class="lp-lead">Siden du leter etter finnes ikke lenger, eller adressen er skrevet feil.</p><div class="lp-actions"><a class="button button-navy" href="/">Til forsiden <span aria-hidden="true">${ICON('icon-right')}</span></a><a class="text-link" href="${L.bedrift[0]}">Se salgsautomat for bedrift <span aria-hidden="true">${ICON('icon-arrow')}</span></a></div></div></div></main>${footer()}</body></html>
`);

// robots + sitemap
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
function lastmod(u) {
  const file = path.join('dist', u === '/' ? 'index.html' : u.slice(1) + 'index.html');
  try {
    const d = execSync(`git log -1 --format=%cs -- ${JSON.stringify(file)}`, { cwd: path.join(__dirname, '..') }).toString().trim();
    return d || TODAY;
  } catch (e) { return TODAY; }
}
const urls = ['/', ...pages.map(p => `/${p.slug}/`)];
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${ORIGIN}${u}</loc><lastmod>${lastmod(u)}</lastmod></url>`).join('\n')}\n</urlset>\n`);

fs.writeFileSync(path.join(DIST, 'page.js'), `const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function setMenu(open) {
  nav.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Lukk meny' : 'Åpne meny');
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
`);
