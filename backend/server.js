require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

console.log(
  'RESEND_API_KEY loaded:',
  RESEND_API_KEY
    ? `length ${RESEND_API_KEY.length}, fingerprint ${crypto.createHash('sha256').update(RESEND_API_KEY).digest('hex').slice(0, 12)}`
    : 'MISSING'
);
console.log('NOTIFY_EMAIL loaded:', NOTIFY_EMAIL || 'MISSING');

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (
    typeof name !== 'string' || name.trim().length < 2 ||
    typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof subject !== 'string' || subject.trim().length < 3 ||
    typeof message !== 'string' || message.trim().length < 10
  ) {
    return res.status(400).json({ error: 'Please fill in all fields with valid values.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact Form <onboarding@resend.dev>',
        to: NOTIFY_EMAIL,
        reply_to: email,
        subject: `Portfolio Contact: ${subject}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `<p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Resend API error (${response.status}): ${errBody}`);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Failed to send contact email:', err.message);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

app.get('/health', (req, res) => res.send('OK'));

app.listen(PORT, () => console.log(`Contact backend running on port ${PORT}`));
