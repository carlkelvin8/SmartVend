// Vercel Function: mottar forespørsler fra skjemaet og sender dem som e-post via Resend.
// Krever miljøvariabelen RESEND_API_KEY. Valgfritt: LEAD_TO (standard post@smartvend.no) og LEAD_FROM.
const MAX = { product: 80, company: 160, contact: 160, message: 2000 };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clean = (v, max) => (typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max) : '');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  if (clean(body.website, 50)) return res.status(200).json({ ok: true }); // honeypot
  const lead = {
    product: clean(body.product, MAX.product) || 'Ikke oppgitt',
    company: clean(body.company, MAX.company),
    contact: clean(body.contact, MAX.contact),
    message: clean(body.message, MAX.message)
  };
  if (!lead.company || !lead.contact) return res.status(400).json({ error: 'missing_fields' });
  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ error: 'not_configured' });

  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.contact);
  const html = `<h2>Ny forespørsel fra smartvend.no</h2><p><strong>Løsning:</strong> ${esc(lead.product)}<br><strong>Bedrift / arbeidsplass:</strong> ${esc(lead.company)}<br><strong>Kontakt:</strong> ${esc(lead.contact)}</p><p><strong>Melding:</strong><br>${esc(lead.message || '(ingen)').replace(/\n/g, '<br>')}</p>`;
  const text = `Ny forespørsel fra smartvend.no\n\nLøsning: ${lead.product}\nBedrift / arbeidsplass: ${lead.company}\nKontakt: ${lead.contact}\n\nMelding:\n${lead.message || '(ingen)'}`;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.LEAD_FROM || 'SmartVend nettskjema <onboarding@resend.dev>',
        to: [process.env.LEAD_TO || 'post@smartvend.no'],
        subject: `Forespørsel — ${lead.product} — ${lead.company}`.slice(0, 200),
        html,
        text,
        ...(looksLikeEmail ? { reply_to: lead.contact } : {})
      })
    });
    if (!r.ok) return res.status(502).json({ error: 'send_failed' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'send_failed' });
  }
};

function safeParse(s) {
  try { return JSON.parse(s); } catch (e) { return {}; }
}
