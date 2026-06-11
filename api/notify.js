// api/notify.js — sends a signup notification email via Resend
// Setup: create account at resend.com, verify a sending domain or email,
// then add RESEND_API_KEY and RESEND_FROM to Vercel environment variables.
// RESEND_FROM example: "Ephemera <notifications@yourdomain.com>"

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(200).json({ ok: false, reason: 'no key configured' });

  const { name, email, username, newsletter, betaTester } = req.body || {};
  const from = process.env.RESEND_FROM || 'onboarding@resend.dev';
  const ts = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', dateStyle: 'medium', timeStyle: 'short' });

  const html = `
    <div style="font-family:sans-serif;max-width:480px;padding:20px;color:#1F2D2A">
      <h2 style="margin:0 0 16px;color:#7A9E7E">New Ephemera signup</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 0;color:#8A948F;font-size:12px;width:120px">Name</td><td style="padding:6px 0;font-weight:600">${name || 'Not provided'}</td></tr>
        <tr><td style="padding:6px 0;color:#8A948F;font-size:12px">Email</td><td style="padding:6px 0;font-weight:600">${email || 'Not provided'}</td></tr>
        ${username ? `<tr><td style="padding:6px 0;color:#8A948F;font-size:12px">Username</td><td style="padding:6px 0;font-weight:600">@${username}</td></tr>` : ''}
        <tr><td style="padding:6px 0;color:#8A948F;font-size:12px">Newsletter</td><td style="padding:6px 0">${newsletter ? 'Yes' : 'No'}</td></tr>
        <tr><td style="padding:6px 0;color:#8A948F;font-size:12px">Beta tester</td><td style="padding:6px 0">${betaTester ? 'Yes' : 'No'}</td></tr>
        <tr><td style="padding:6px 0;color:#8A948F;font-size:12px">Time</td><td style="padding:6px 0">${ts}</td></tr>
      </table>
    </div>
  `;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from,
        to: ['ephemeraguideapp@gmail.com'],
        subject: `New signup: ${name || email || 'unknown'}${username ? ' (@' + username + ')' : ''}`,
        html
      })
    });
    const data = await r.json();
    if (!r.ok) console.error('Resend error:', data);
    return res.status(200).json({ ok: r.ok });
  } catch (err) {
    console.error('notify error:', err);
    return res.status(200).json({ ok: false });
  }
}
