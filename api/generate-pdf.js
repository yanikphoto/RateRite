const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

// ─── TEMPLATES ────────────────────────────────────────────────────────────────

function renderExecutiveDark(d) {
  const services = (d.services || []).slice(0, 8);
  return `
<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:794px; height:1123px; background:#0d1117; color:#e6edf3; font-family:'DM Sans',sans-serif; overflow:hidden; }
  .page { width:794px; height:1123px; display:grid; grid-template-columns:200px 1fr; }
  .sidebar { background:#161b22; padding:32px 24px; display:flex; flex-direction:column; gap:20px; border-right:1px solid rgba(255,255,255,0.06); }
  .avatar { width:52px; height:52px; background:#0d9e8a; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:1.4rem; font-weight:800; color:white; margin-bottom:4px; }
  .sb-name { font-family:'Syne',sans-serif; font-weight:700; font-size:0.92rem; line-height:1.3; }
  .sb-title { font-size:0.72rem; color:#8b949e; margin-top:3px; line-height:1.4; }
  .sb-divider { height:1px; background:rgba(255,255,255,0.06); }
  .sb-section-title { font-size:0.62rem; text-transform:uppercase; letter-spacing:0.1em; color:#0d9e8a; font-weight:600; margin-bottom:8px; }
  .sb-contact-item { font-size:0.7rem; color:#8b949e; margin-bottom:6px; word-break:break-all; }
  .sb-service { font-size:0.72rem; color:#c9d1d9; margin-bottom:6px; padding-left:10px; position:relative; }
  .sb-service::before { content:''; position:absolute; left:0; top:6px; width:4px; height:4px; background:#0d9e8a; border-radius:50%; }
  .main { padding:36px 36px 28px; display:flex; flex-direction:column; gap:0; }
  .top-bar { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:6px; }
  .brand { font-family:'Syne',sans-serif; font-size:1.1rem; font-weight:800; letter-spacing:0.04em; }
  .brand span { color:#0d9e8a; }
  .year { font-size:0.72rem; color:#8b949e; }
  .subtitle { font-size:0.75rem; color:#8b949e; margin-bottom:20px; }
  .teal-bar { height:2px; background:linear-gradient(90deg,#0d9e8a,transparent); margin-bottom:24px; }
  .rates-hero { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:14px; margin-bottom:24px; }
  .rate-box { background:#161b22; border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:16px 14px; }
  .rate-label { font-size:0.62rem; text-transform:uppercase; letter-spacing:0.08em; color:#8b949e; margin-bottom:6px; }
  .rate-value { font-family:'Syne',sans-serif; font-size:1.5rem; font-weight:800; color:#0d9e8a; line-height:1; }
  .rate-sub { font-size:0.62rem; color:#8b949e; margin-top:4px; }
  .rate-box.hero { grid-column:1/3; background:rgba(13,158,138,0.08); border-color:rgba(13,158,138,0.2); }
  .rate-box.hero .rate-value { font-size:2.2rem; }
  .proj-min { background:#161b22; border:1px solid rgba(13,158,138,0.3); border-radius:8px; padding:12px 16px; margin-bottom:22px; display:flex; align-items:center; justify-content:space-between; }
  .proj-min-label { font-size:0.72rem; color:#8b949e; }
  .proj-min-value { font-family:'Syne',sans-serif; font-weight:700; font-size:1rem; color:#0d9e8a; }
  .two-col { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .section-title { font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em; color:#0d9e8a; font-weight:600; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.06); }
  .included-item { font-size:0.72rem; color:#c9d1d9; margin-bottom:8px; padding-left:12px; position:relative; line-height:1.4; }
  .included-item::before { content:''; position:absolute; left:0; top:6px; width:5px; height:5px; background:#0d9e8a; border-radius:50%; }
  .included-item strong { display:block; font-weight:500; }
  .terms-item { font-size:0.7rem; color:#8b949e; margin-bottom:7px; padding-left:12px; position:relative; line-height:1.4; }
  .terms-item::before { content:'•'; position:absolute; left:0; color:#0d9e8a; }
  .footer { margin-top:auto; padding-top:16px; border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; }
  .footer-note { font-size:0.62rem; color:#8b949e; }
  .footer-brand { font-family:'Syne',sans-serif; font-size:0.7rem; font-weight:700; color:#0d9e8a; }
</style>
</head><body><div class="page">
<div class="sidebar">
  <div>
    <div class="avatar">${(d.name||'?')[0].toUpperCase()}</div>
    <div class="sb-name">${d.name||''}</div>
    <div class="sb-title">${d.title||''}</div>
  </div>
  <div class="sb-divider"></div>
  <div>
    <div class="sb-section-title">Contact</div>
    ${d.email ? `<div class="sb-contact-item">✉ ${d.email}</div>` : ''}
    ${d.website ? `<div class="sb-contact-item">⬡ ${d.website}</div>` : ''}
    ${d.phone ? `<div class="sb-contact-item">✆ ${d.phone}</div>` : ''}
    ${d.location ? `<div class="sb-contact-item">◎ ${d.location}</div>` : ''}
  </div>
  ${services.length ? `
  <div class="sb-divider"></div>
  <div>
    <div class="sb-section-title">Services</div>
    ${services.map(s => `<div class="sb-service">${s}</div>`).join('')}
  </div>` : ''}
</div>
<div class="main">
  <div class="top-bar">
    <div class="brand"><span>RATE</span>CARD</div>
    <div class="year">2025</div>
  </div>
  <div class="subtitle">Professional Fee Schedule</div>
  <div class="teal-bar"></div>

  <div class="rates-hero">
    <div class="rate-box hero">
      <div class="rate-label">Hourly Rate</div>
      <div class="rate-value">${d.hourly||'—'}</div>
      <div class="rate-sub">per billable hour</div>
    </div>
    <div class="rate-box hero" style="grid-column:3/5;">
      <div class="rate-label">Monthly Retainer</div>
      <div class="rate-value">${d.retainer||'—'}</div>
      <div class="rate-sub">ongoing engagement</div>
    </div>
    ${d.dayRate ? `<div class="rate-box"><div class="rate-label">Day Rate</div><div class="rate-value">${d.dayRate}</div><div class="rate-sub">8-hour day</div></div>` : ''}
    ${d.halfDay ? `<div class="rate-box"><div class="rate-label">Half Day</div><div class="rate-value">${d.halfDay}</div><div class="rate-sub">4-hour session</div></div>` : ''}
    ${d.projectMin ? `<div class="rate-box"><div class="rate-label">Project Min</div><div class="rate-value">${d.projectMin}</div></div>` : ''}
    ${d.rush ? `<div class="rate-box"><div class="rate-label">Rush Rate</div><div class="rate-value">${d.rush}</div><div class="rate-sub">< 48hr turnaround</div></div>` : ''}
  </div>

  <div class="two-col">
    <div>
      <div class="section-title">What's Included</div>
      <div class="included-item"><strong>Initial Consultation</strong>30-min discovery call with all projects</div>
      <div class="included-item"><strong>Revisions</strong>${d.revisions||'2 rounds included in project scope'}</div>
      <div class="included-item"><strong>File Delivery</strong>All source files on final payment</div>
      <div class="included-item"><strong>Communication</strong>Response within 24hrs Mon–Fri</div>
    </div>
    <div>
      <div class="section-title">Terms & Conditions</div>
      ${d.deposit ? `<div class="terms-item">${d.deposit}</div>` : '<div class="terms-item">50% deposit required to begin work</div>'}
      ${d.paymentTerms ? `<div class="terms-item">${d.paymentTerms}</div>` : '<div class="terms-item">Net-15 payment terms on all invoices</div>'}
      <div class="terms-item">Rush work billed at 1.5x rate</div>
      <div class="terms-item">All work remains client property upon final payment</div>
      ${d.validity ? `<div class="terms-item">Valid for ${d.validity}</div>` : '<div class="terms-item">This rate card valid for 90 days</div>'}
    </div>
  </div>

  <div class="footer">
    <div class="footer-note">This rate card is valid for 90 days from date of issue${d.email ? ` • ${d.email}` : ''}</div>
    <div class="footer-brand">CREATED WITH RATERIGHT.CO</div>
  </div>
</div>
</div></body></html>`;
}

function renderCleanMinimal(d) {
  const services = (d.services || []).slice(0, 8);
  return `
<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:794px; height:1123px; background:#ffffff; color:#1a1a1a; font-family:'Inter',sans-serif; overflow:hidden; }
  .page { width:794px; height:1123px; padding:56px 60px; display:flex; flex-direction:column; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; padding-bottom:24px; border-bottom:2px solid #1a1a1a; }
  .name { font-family:'Playfair Display',serif; font-size:2rem; font-weight:700; color:#1a1a1a; }
  .title { font-size:0.8rem; color:#666; margin-top:4px; }
  .contact { text-align:right; }
  .contact-item { font-size:0.72rem; color:#888; margin-bottom:3px; }
  .tagline { font-size:0.72rem; font-weight:600; letter-spacing:0.15em; text-transform:uppercase; color:#0d9e8a; margin-bottom:28px; }
  .rates-section { display:grid; grid-template-columns:1fr 1fr 1fr; gap:1px; background:#e0e0e0; border:1px solid #e0e0e0; margin-bottom:32px; }
  .rate-cell { background:white; padding:20px 18px; }
  .rate-cell.primary { background:#f8f9fa; }
  .rate-label { font-size:0.62rem; text-transform:uppercase; letter-spacing:0.1em; color:#999; margin-bottom:8px; }
  .rate-value { font-family:'Playfair Display',serif; font-size:1.8rem; font-weight:700; color:#0d9e8a; line-height:1; }
  .rate-value.big { font-size:2.4rem; }
  .rate-sub { font-size:0.65rem; color:#bbb; margin-top:4px; }
  .two-col { display:grid; grid-template-columns:1fr 1fr; gap:32px; margin-bottom:28px; }
  .section-title { font-size:0.62rem; text-transform:uppercase; letter-spacing:0.12em; color:#0d9e8a; font-weight:600; margin-bottom:12px; }
  .item { font-size:0.75rem; color:#444; margin-bottom:8px; padding-left:14px; position:relative; line-height:1.5; }
  .item::before { content:''; position:absolute; left:0; top:7px; width:5px; height:1px; background:#0d9e8a; }
  .services-wrap { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:28px; }
  .service-pill { background:#f0faf8; border:1px solid #b8e8e0; color:#0d9e8a; font-size:0.7rem; padding:4px 10px; border-radius:20px; }
  .footer { margin-top:auto; padding-top:16px; border-top:1px solid #e0e0e0; display:flex; justify-content:space-between; align-items:center; }
  .footer-note { font-size:0.62rem; color:#bbb; }
  .footer-brand { font-size:0.62rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#0d9e8a; }
</style>
</head><body><div class="page">
  <div class="header">
    <div>
      <div class="name">${d.name||''}</div>
      <div class="title">${d.title||''}</div>
    </div>
    <div class="contact">
      ${d.email ? `<div class="contact-item">${d.email}</div>` : ''}
      ${d.website ? `<div class="contact-item">${d.website}</div>` : ''}
      ${d.phone ? `<div class="contact-item">${d.phone}</div>` : ''}
      ${d.location ? `<div class="contact-item">${d.location}</div>` : ''}
    </div>
  </div>

  <div class="tagline">Fee Schedule · 2025</div>

  <div class="rates-section">
    <div class="rate-cell primary">
      <div class="rate-label">Standard Hourly Rate</div>
      <div class="rate-value big">${d.hourly||'—'}</div>
      <div class="rate-sub">per billable hour</div>
    </div>
    <div class="rate-cell">
      <div class="rate-label">Day Rate</div>
      <div class="rate-value">${d.dayRate||'—'}</div>
      <div class="rate-sub">8-hour day</div>
    </div>
    <div class="rate-cell">
      <div class="rate-label">Half Day</div>
      <div class="rate-value">${d.halfDay||'—'}</div>
      <div class="rate-sub">4-hour session</div>
    </div>
    ${d.retainer ? `<div class="rate-cell"><div class="rate-label">Monthly Retainer</div><div class="rate-value">${d.retainer}</div><div class="rate-sub">ongoing · billed monthly</div></div>` : ''}
    ${d.projectMin ? `<div class="rate-cell"><div class="rate-label">Project Minimum</div><div class="rate-value">${d.projectMin}</div></div>` : ''}
    ${d.rush ? `<div class="rate-cell"><div class="rate-label">Rush Rate</div><div class="rate-value">${d.rush}</div><div class="rate-sub">under 48hr turnaround</div></div>` : ''}
  </div>

  ${services.length ? `
  <div class="section-title">Services Offered</div>
  <div class="services-wrap">
    ${services.map(s => `<span class="service-pill">${s}</span>`).join('')}
  </div>` : ''}

  <div class="two-col">
    <div>
      <div class="section-title">Terms & Conditions</div>
      ${d.deposit ? `<div class="item">${d.deposit}</div>` : '<div class="item">50% deposit required to begin all project work</div>'}
      ${d.paymentTerms ? `<div class="item">${d.paymentTerms}</div>` : '<div class="item">Net-15 payment terms on all invoices</div>'}
      ${d.revisions ? `<div class="item">${d.revisions}</div>` : '<div class="item">2 rounds of revisions included in scope</div>'}
      <div class="item">All source files delivered upon final payment</div>
      ${d.validity ? `<div class="item">Valid for ${d.validity}</div>` : ''}
    </div>
    <div>
      <div class="section-title">What's Included</div>
      <div class="item">30-min discovery call with all projects</div>
      <div class="item">24hr response time Mon–Fri during engagement</div>
      <div class="item">Rush work available at 1.5x hourly rate</div>
      <div class="item">Project work remains client property on payment</div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-note">Valid for 90 days from issue${d.email ? ` · ${d.email}` : ''}</div>
    <div class="footer-brand">RateRight.co</div>
  </div>
</div></body></html>`;
}

function renderBoldEditorial(d) {
  const services = (d.services || []).slice(0, 6);
  return `
<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:794px; height:1123px; background:#0d1117; color:white; font-family:'DM Sans',sans-serif; overflow:hidden; }
  .page { width:794px; height:1123px; display:grid; grid-template-columns:1fr 1fr; }
  .left { background:#0d1117; padding:48px 40px; display:flex; flex-direction:column; }
  .right { background:#0d9e8a; padding:48px 40px; display:flex; flex-direction:column; }
  .top-label { font-size:0.65rem; text-transform:uppercase; letter-spacing:0.15em; color:#0d9e8a; font-weight:600; margin-bottom:20px; }
  .right .top-label { color:rgba(255,255,255,0.6); }
  h1 { font-family:'Syne',sans-serif; font-size:1.9rem; font-weight:800; line-height:1.1; margin-bottom:6px; }
  .right h1 { color:white; }
  .sub { font-size:0.8rem; color:#8b949e; margin-bottom:32px; }
  .right .sub { color:rgba(255,255,255,0.7); }
  .rate-block { margin-bottom:20px; }
  .rate-label { font-size:0.62rem; text-transform:uppercase; letter-spacing:0.1em; color:#8b949e; margin-bottom:4px; }
  .right .rate-label { color:rgba(255,255,255,0.6); }
  .rate-value { font-family:'Syne',sans-serif; font-size:2.4rem; font-weight:800; color:white; line-height:1; }
  .right .rate-value { color:white; }
  .divider { height:1px; background:rgba(255,255,255,0.08); margin:20px 0; }
  .right .divider { background:rgba(255,255,255,0.2); }
  .list-item { font-size:0.78rem; margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; color:#c9d1d9; }
  .right .list-item { border-bottom-color:rgba(255,255,255,0.15); color:rgba(255,255,255,0.9); }
  .list-item strong { color:white; font-family:'Syne',sans-serif; }
  .section-title { font-size:0.62rem; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:12px; font-weight:600; color:#0d9e8a; }
  .right .section-title { color:rgba(255,255,255,0.6); }
  .service-item { font-size:0.75rem; margin-bottom:8px; padding-left:12px; position:relative; color:#c9d1d9; }
  .service-item::before { content:'→'; position:absolute; left:0; font-size:0.6rem; color:#0d9e8a; }
  .right .service-item::before { color:rgba(255,255,255,0.5); }
  .right .service-item { color:rgba(255,255,255,0.9); }
  .footer { margin-top:auto; font-size:0.62rem; color:#8b949e; }
  .right .footer { color:rgba(255,255,255,0.5); }
</style>
</head><body><div class="page">
  <div class="left">
    <div class="top-label">Rate Card · 2025</div>
    <h1>${d.name||''}</h1>
    <div class="sub">${d.title||''}</div>

    <div class="rate-block">
      <div class="rate-label">Day Rate</div>
      <div class="rate-value">${d.dayRate||'—'}</div>
    </div>
    <div class="divider"></div>

    <div>
      <div class="list-item"><span>Half Day</span><strong>${d.halfDay||'—'}</strong></div>
      <div class="list-item"><span>Project Minimum</span><strong>${d.projectMin||'—'}</strong></div>
      ${d.retainer ? `<div class="list-item"><span>Monthly Retainer</span><strong>${d.retainer}</strong></div>` : ''}
      ${d.rush ? `<div class="list-item"><span>Rush Rate</span><strong>${d.rush}</strong></div>` : ''}
    </div>
    <div class="divider"></div>

    ${services.length ? `
    <div class="section-title">Services</div>
    ${services.map(s => `<div class="service-item">${s}</div>`).join('')}` : ''}

    <div class="footer" style="margin-top:auto">
      ${d.email || ''}<br>
      ${d.location || ''}
    </div>
  </div>

  <div class="right">
    <div class="top-label">Fee Schedule</div>
    <div class="rate-label">Hourly Rate</div>
    <div class="rate-value" style="font-size:3.2rem; margin-bottom:4px;">${d.hourly||'—'}</div>
    <div class="sub">per billable hour</div>

    <div class="divider"></div>
    <div class="section-title">Terms & Conditions</div>
    ${d.deposit ? `<div class="list-item"><span>${d.deposit}</span></div>` : '<div class="list-item"><span>50% deposit to begin all project work</span></div>'}
    ${d.paymentTerms ? `<div class="list-item"><span>${d.paymentTerms}</span></div>` : '<div class="list-item"><span>Net-15 on all invoices</span></div>'}
    ${d.revisions ? `<div class="list-item"><span>${d.revisions}</span></div>` : '<div class="list-item"><span>2 rounds of revisions included</span></div>'}
    <div class="list-item"><span>All source files on final payment</span></div>

    <div class="divider"></div>
    <div class="section-title">What's Included</div>
    <div class="service-item">30-min discovery call included</div>
    <div class="service-item">24hr response time Mon–Fri</div>
    <div class="service-item">Rush work at 1.5x hourly rate</div>

    <div class="footer" style="margin-top:auto">
      ${d.website || ''}<br>
      Valid for ${d.validity || '90 days'} from issue
    </div>
  </div>
</div></body></html>`;
}

// ─── HANDLER ──────────────────────────────────────────────────────────────────

module.exports = async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'Missing session_id' });

  // 1. Verify payment with Stripe
  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.payment_status !== 'paid') {
    return res.status(402).json({ error: 'Payment not confirmed' });
  }

  // 2. Decode form data from metadata
  const encoded = (session.metadata.formData || '')
    + (session.metadata.formData2 || '')
    + (session.metadata.formData3 || '')
    + (session.metadata.formData4 || '');
  const formData = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));

  // 3. Pick template
  const templateMap = {
    'executive-dark': renderExecutiveDark,
    'clean-minimal': renderCleanMinimal,
    'bold-editorial': renderBoldEditorial,
  };
  const render = templateMap[formData.template] || renderExecutiveDark;
  const html = render(formData);

  // 4. Launch Puppeteer and generate PDF
  const executablePath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: { width: 794, height: 1123 },
    executablePath,
    headless: 'new',
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    width: '794px',
    height: '1123px',
    printBackground: true,
  });
  await browser.close();

  // 5. Return PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="rate-card-${formData.name?.replace(/\s+/g,'-').toLowerCase() || 'rateright'}.pdf"`);
  res.send(pdf);
};
