# Portfolio Contact Backend

A small Express API that emails you whenever someone submits the contact form on your portfolio.

## 1. Get a Gmail App Password

Gmail won't let plain passwords authenticate SMTP anymore, so you need an App Password:

1. Turn on 2-Step Verification on `kaminenirupeshsai0@gmail.com` (Google Account → Security).
2. Go to https://myaccount.google.com/apppasswords
3. Create an app password named "Portfolio Contact Form" and copy the 16-character code.

## 2. Configure environment variables

```
cp .env.example .env
```

Edit `.env`:

- `EMAIL_USER` — your Gmail address (already filled in)
- `EMAIL_PASS` — the app password from step 1
- `ALLOWED_ORIGIN` — your live portfolio URL (already set to the current Surge link — update if you redeploy to a new domain)

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

This is a real server, not a static file, so it can't live on Surge. Render.com's free tier is the simplest option:

1. Push this `backend/` folder to a GitHub repo (can be a separate repo, or a subfolder of your portfolio repo).
2. Go to https://render.com → New → Web Service → connect the repo.
3. Set **Root Directory** to `backend` (if it's a subfolder).
4. Build command: `npm install`. Start command: `npm start`.
5. Add the environment variables from your `.env` in Render's dashboard (never commit `.env` itself).
6. Deploy. Render gives you a URL like `https://your-app.onrender.com`.

Note: Render's free tier spins down after inactivity, so the first request after idle time can take ~30-50 seconds to wake up.

## 5. Point the frontend at it

In `../js/script.js`, update:

```js
const CONTACT_API_URL = 'https://your-app.onrender.com/api/contact';
```

Then redeploy the frontend (`npx surge . rupesh-kamineni.surge.sh` from the portfolio root).
