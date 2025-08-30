# Launch Instructions — Keystone Notary Group

Plain‑English steps to go live. No coding required.

---

## 1) What’s inside
- `client/` — your website code (already production‑ready)
- `client/public/privacy.html` — privacy policy page
- `client/public/robots.staging.txt` — blocks search engines on staging
- `netlify.toml` — build + security headers (for Netlify)
- `vercel.json` — build + security headers (for Vercel)
- `REPORT.md` — audit summary (optional reading)

Analytics is **off by default**. You can enable it later with one setting.

---

## 2) Choose a host (either is fine)
### Option A — Netlify
1. Create a Netlify account.
2. Click “**Add new site → Import an existing project**”.
3. Connect your GitHub repo **or** upload this zip’s contents.
4. Netlify will auto‑detect `netlify.toml` and build with:
   - Build: `npm --prefix client ci && npm --prefix client run build`
   - Publish directory: `client/dist`

### Option B — Vercel
1. Create a Vercel account.
2. “**Add New… → Project**”, import your repo or “Deploy from a different source” and upload.
3. Vercel will read `vercel.json` and build with:
   - Build Command: `npm --prefix client ci && npm --prefix client run build`
   - Output dir: `client/dist`

Both options will give you a temporary preview URL after the first deploy.

---

## 3) Point your domain
1. In Netlify/Vercel, open the project’s **Domain** settings.
2. Add your domain (e.g. `keystonenotarygroup.com`).
3. Update your DNS at your registrar (GoDaddy, Cloudflare, etc.) as they instruct (usually a CNAME for `www` and A/ALIAS for root).
4. Wait for DNS to propagate (typically within minutes). HTTPS certs are automatic.

---

## 4) Privacy & robots (staging vs. live)
- **Staging (do this only if you want to hide a preview):**
  - Temporarily replace `client/public/robots.txt` with `client/public/robots.staging.txt` (blocks Google).
- **Go‑Live (public):**
  - Ensure `client/public/robots.txt` contains:
    ```
    User-agent: *
    Allow: /
    Sitemap: /sitemap.xml
    ```
  - Keep `privacy.html` available at `/privacy.html`.

---

## 5) (Optional) Simple analytics later
If, in the future, you want basic visitor stats:
1. Create a site in Plausible (privacy‑friendly analytics).
2. In your host’s build settings, add an environment variable:
   - Key: `VITE_PLAUSIBLE_DOMAIN`
   - Value: `keystonenotarygroup.com` (your exact domain)
3. Redeploy. A tiny script will load, and a small consent notice will appear.

If you never set this variable, **no analytics will load** and no consent banner appears.

---

## 6) Email deliverability (important)
If you use the contact form emailing feature, set these DNS records with your email provider:
- **SPF** (TXT): authorize your sending service
- **DKIM** (TXT): cryptographic signature
- **DMARC** (TXT): policy for spoofing protection

This keeps your emails out of spam. Your email provider’s docs will give exact values.

---

## 7) Sanity check after launch (5 minutes)
1. Open your site on your phone and a laptop.
2. Submit the contact form with a test message; confirm the email arrives.
3. Test the phone `Call` button and email link on the homepage.
4. Search `site:keystonenotarygroup.com` in Google a few days after launch to see indexing start.
5. Check Google Business Profile → ensure your **Website** link points to your domain.

---

## 8) Optional security extras
Already included via headers (CSP, HSTS, frame/ctype/referrer policies).
If you add scripts or third‑party widgets later, update CSP to allow them.

---

## 9) Need to rollback?
If a deployment misbehaves, both Netlify and Vercel let you **rollback** to the previous deploy with one click in their dashboards.

---

### That’s it.
You’re production‑ready. If anything feels unclear, ping me and I’ll tighten it up.

---

## 10) Enable Appointment emails
The appointment form posts to `/api/appointment` on your server.
1) In the `server/.env` file, set:
   ```
   SMTP_HOST=...
   SMTP_PORT=...
   SMTP_SECURE=true|false
   SMTP_USER=...
   SMTP_PASS=...
   SMTP_FROM="Keystone Notary Group" <no-reply@keystonenotarygroup.com>
   CONTACT_TO=info@keystonenotarygroup.com
   APPOINTMENT_TO=appointments@keystonenotarygroup.com
   ```
2) Start the server (`npm --prefix server ci && npm --prefix server start`) or however you currently run it.
3) Submit the form at `/appointment` and confirm the email arrives.

*(If you use a static host for the client and a separate server, set the client `VITE_API_BASE` to your API domain and I can wire the fetch to that.)*

---

## 11) Confirm/Decline appointment requests (owner only)
When a client submits the form, you receive an email with **Confirm** and **Decline** links.
1) Set a strong key in `server/.env`:
   ```
   APPOINTMENT_ADMIN_KEY=change-this-to-a-strong-random-key
   PUBLIC_URL=https://api.yourdomain.com   # or wherever your server is reachable
   ```
2) The links look like:
   - Confirm: `https://api.yourdomain.com/api/appointment/<id>/confirm?key=...`
   - Decline: `https://api.yourdomain.com/api/appointment/<id>/decline?key=...&reason=Optional+message`
3) Clicking the link updates the appointment record on the server and emails the client a confirmation/decline notice.

**Notes:**
- Appointments are stored in `server/data/appointments.json` (simple, zero‑DB storage).
- If your client and server are on different domains, set CORS accordingly (I can add that for you).

---

## 12) Google Calendar (Workspace) integration
Use a **Service Account with domain‑wide delegation** so the server can add events to your calendar automatically.

**One-time setup:**
1. In Google Cloud Console: create a Service Account, enable **Google Calendar API**, and generate a JSON key.
2. In Workspace Admin Console → Security → API controls → **Domain‑wide delegation** → **Add new**:
   - Client ID: the Service Account's **unique ID** (not the email)
   - Scopes: `https://www.googleapis.com/auth/calendar.events`
3. In `server/.env` set:
   ```
   GOOGLE_CLIENT_EMAIL=svc-calendar@your-project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY_BASE64=<base64 of the private_key from JSON>
   GOOGLE_IMPERSONATE_SUBJECT=you@keystonenotarygroup.com
   GCAL_CALENDAR_ID=primary          # or bookings@yourdomain.com
   TIMEZONE=America/New_York
   GCAL_USE_MEET=false               # set true to auto-create a Meet link
   ```
4. Redeploy/restart the server. When you click **Confirm** on an appointment, an event will be created on your calendar and the client will receive a link to add it to theirs.

*Tip:* To get the Base64 key:
```sh
base64 -w0 key.json | pbcopy   # macOS/Linux; copy the 'private_key' field only
```
