// SEO- og kvalitetssjekk for statiske sider. Kjør: node scripts/check.js
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const ORIGIN = 'https://smartvend.no';
let problems = 0;
const fail = (file, msg) => { console.log(`FAIL ${file}: ${msg}`); problems++; };

function pages(dir = DIST, base = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    if (e.isDirectory()) return e.name === 'assets' ? [] : pages(path.join(dir, e.name), `${base}${e.name}/`);
    return e.name.endsWith('.html') ? [`${base}${e.name}`] : [];
  });
}
const files = pages();
const titles = new Map(), descs = new Map();
const canonicals = new Map();

for (const f of files) {
  const h = fs.readFileSync(path.join(DIST, f), 'utf8');
  const is404 = f === '404.html';
  if (!/<html lang="nb">/.test(h)) fail(f, 'mangler lang="nb"');
  if ((h.match(/<h1[ >]/g) || []).length !== 1) fail(f, 'må ha nøyaktig én H1');
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(h)) fail(f, 'bruker Google Fonts');
  if (!/rel="icon"/.test(h)) fail(f, 'mangler favicon');
  for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/ alt=/.test(m[0])) fail(f, 'img uten alt');
  const ids = [...h.matchAll(/ id="([^"]+)"/g)].map(m => m[1]);
  if (new Set(ids).size !== ids.length) fail(f, 'duplikate id-er');
  for (const m of h.matchAll(/application\/ld\+json">(.*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { fail(f, 'ugyldig JSON-LD'); }
  }
  for (const m of h.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const p = m[1];
    if (p.length > 1) {
      const target = path.join(DIST, p.endsWith('/') ? p + 'index.html' : p);
      if (!fs.existsSync(target)) fail(f, `brutt lenke/ressurs ${p}`);
    }
  }
  const noindexLiteral = h.replace(/<script>if\(location.*?<\/script>/, '');
  if (is404) { if (!/noindex/.test(h)) fail(f, '404 skal være noindex'); continue; }
  if (/noindex/.test(noindexLiteral)) fail(f, 'uventet noindex');
  const title = (h.match(/<title>(.*?)<\/title>/) || [])[1];
  const desc = (h.match(/name="description" content="(.*?)"/) || [])[1];
  const canon = (h.match(/rel="canonical" href="(.*?)"/) || [])[1];
  if (!title) fail(f, 'mangler title');
  if (!desc) fail(f, 'mangler description');
  if (!canon || !canon.startsWith(ORIGIN + '/')) fail(f, 'ugyldig canonical');
  if (titles.has(title)) fail(f, `duplikat title med ${titles.get(title)}`); else titles.set(title, f);
  if (descs.has(desc)) fail(f, `duplikat description med ${descs.get(desc)}`); else descs.set(desc, f);
  canonicals.set(canon, f);
  if (!/og:image" content="https:\/\/smartvend\.no\//.test(h)) fail(f, 'mangler og:image');
  const guard = h.match(/<script>(if\(location.*?)<\/script>/);
  if (!guard) fail(f, 'mangler noindex-vakt for ikke-produksjon');
  else for (const [host, expected] of [['smartvend.no', false], ['x.vercel.app', true]]) {
    let added = false;
    new Function('location', 'document', guard[1])({ hostname: host }, { createElement: () => ({}), head: { appendChild: () => { added = true; } } });
    if (added !== expected) fail(f, `noindex-vakt feil for ${host}`);
  }
}

const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
for (const u of locs) if (!canonicals.has(u)) fail('sitemap.xml', `${u} har ikke samsvarende canonical`);
for (const c of canonicals.keys()) if (!locs.includes(c)) fail('sitemap.xml', `${c} mangler i sitemap`);
const robots = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) fail('robots.txt', 'mangler sitemap-referanse');
if (/Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt', 'blokkerer hele nettstedet');

console.log(`${files.length} sider, ${locs.length} sitemap-URL-er, ${problems} problemer`);
process.exit(problems ? 1 : 0);
