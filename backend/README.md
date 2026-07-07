# Portfolio Contact Backend

A small Express API that emails you whenever someone submits the contact form on your portfolio.

Sends via the [Resend](https://resend.com) HTTP API rather than raw SMTP — most free-tier hosts
(including Render) block outbound SMTP ports to prevent spam abuse, so a plain Nodemailer/Gmail
setup won't actually deliver mail once deployed. Resend works over HTTPS, so it isn't affected.

## 1. Get a Resend API key

1. Sign up free at https://resend.com using `kaminenirupeshsai0@gmail.com`.
2. Go to **API Keys** → **Create API Key**. Copy the key (starts with `re_`).
3. No domain setup needed: Resend's free tier lets you send from their shared
   `onboarding@resend.dev` address as long as the **recipient** is the same email you signed up
   with — which is exactly this use case (the form emails you, the account owner).

## 2. Configure environment variables

```
cp .env.example .env
```

Edit `.env`:

- `RESEND_API_KEY` — the key from step 1
- `NOTIFY_EMAIL` — your email address (already filled in)
- `ALLOWED_ORIGIN` — your live portfolio URL (already set — update if you redeploy to a new domain)

## 3. Run locally

```
npm install
npm start
```

Server starts on `http://localhost:5000`. Test it:

```
curl http://localhost:5000/health
```

## 4. Deploy it somewhere free

This is a real server, not a static file, so it can't live on Surge. Render.com's free tier works:

1. Push this `backend/` folder to a GitHub repo (can be a separate repo, or a subfolder of your portfolio repo).
2. Go to https://render.com → New → Web Service → connect the repo.
3. Set **Root Directory** to `backend` (if it's a subfolder).
4. Build command: `npm install`. Start command: `npm start`.
5. Add the environment variables from your `.env` in Render's dashboard (never commit `.env` itself).
6. Deploy. Render gives you a URL like `https://your-app.onrender.com`.

Note: Render's free tier spins down after inactivity, so the first request after idle time can take 30-60 seconds to wake up.

## 5. Point the frontend at it

In `../js/script.js`, update:

```js
const CONTACT_API_URL = 'https://your-app.onrender.com/api/contact';
```

Then redeploy the frontend (`npx surge . rupesh-kamineni.surge.sh` from the portfolio root).
