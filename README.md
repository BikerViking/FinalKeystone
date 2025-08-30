# Keystone Notary — God‑Tier Site (Vite + React + TS + Tailwind + GSAP + Lenis)

Apple‑level single page experience with scroll‑driven, reversible animations, booking, contact form, and OpenAI chat.

## Quick start (two terminals)
### 1) API (for email + OpenAI chat)
```
cd server
cp .env.example .env    # fill in SMTP, OpenAI, Google IDs, etc.
npm install
npm run dev
```
Runs at http://localhost:8787

### 2) Client
```
cd client
npm install
npm run dev
```
Vite dev server: http://localhost:5173 (proxying /api to :8787)

## Build for production
```
cd client && npm run build
```
Deploy `client/dist` to static hosting. Deploy `server/` to Node hosting and set env vars.

## Tech
- **React + TypeScript + Vite** for speed and DX
- **TailwindCSS** for design tokens and consistent theming (black/platinum/silver)
- **GSAP + ScrollTrigger** for god‑tier motion, **Lenis** for silky scrolling
- **Express** server for secure contact email + OpenAI chat proxy

## Branding
- Update copy, phone, email inside the sections (`src/modules/sections/*`).
- Replace `/client/public/assets` with your final logos/badges.

## Accessibility
- Reduced motion by the OS is respected via GSAP’s prefers‑reduced‑motion behavior; keep content legible without animations.


## Optional power-ups
- **reCAPTCHA v3**: set `VITE_RECAPTCHA_SITEKEY` in client env and `RECAPTCHA_SECRET` in server env.
- **Analytics**: set `VITE_PLAUSIBLE_DOMAIN` to enable Plausible in `client/index.html`.
- **Calendar invites**: ICS auto-attached on contact confirmation.
- **Travel fee estimator**: click on the map to compute distance & fee.


## Google Workspace Integrations
- **SMTP relay (recommended)**: use `smtp-relay.gmail.com` from Admin Console for highly deliverable emails.
- **Sheets logging**: every contact submission can append a row to your Google Sheet (`SHEETS_SPREADSHEET_ID` + `SHEETS_CONTACTS_RANGE`).
- **Calendar event creation**: if `CALENDAR_ID` is set, the server creates a Google Calendar event for the requested time.
- **Service account**: paste JSON into `GOOGLE_APPLICATION_CREDENTIALS_JSON` and enable domain-wide delegation for Sheets/Calendar scopes.


## Document Uploads (Infinity Edition)
- Client can upload PDFs (or multiple files) via the Contact form or the `/upload` page.
- Server uploads to **Google Drive** if `DRIVE_ROOT_FOLDER_ID` and service account JSON are configured.
- If not configured, files save to `server/uploads` (demo mode) and still work for local testing.
- Uploaded file links are appended to your **Contacts** Google Sheet and included in the **Calendar** event description.


---
(Additional owner playbook content appended below)
# Keystone Notary Group – Owner Playbook

This document is your **single-source cheat sheet** for running the website’s appointment and calendar system. 
It summarizes operational workflows, security keys, and daily tasks so you don’t need to remember code details.

---

## 📥 Appointment Requests
1. A client fills out the `/appointment` form.
2. An email is sent to you with details of the request.
3. Each request is stored in `server/data/appointments.json` (simple JSON file, no database).

**Important:** Requests are always *pending* until you confirm or decline.

---

## ✅ Confirm or ❌ Decline
- Your notification email includes two secure links:
  - **Confirm** → marks request confirmed, emails client a confirmation, and (if configured) creates a Calendar event.
  - **Decline** → marks request declined, emails client a polite message (optionally with a reason).

### Security
- Links are protected with `APPOINTMENT_ADMIN_KEY` from your `.env` file.  
- If the key ever leaks, change it and restart the server.

### Where responses live
- `server/data/appointments.json` is updated with status (`pending`, `confirmed`, `declined`).  
- Each entry has timestamps for when status changed.

---

## 📅 Google Calendar Integration (Workspace)
When you confirm, the system can create a Google Calendar event **automatically**.

### Setup Summary
1. Create a Service Account in Google Cloud and enable **Calendar API**.
2. Grant domain-wide delegation in Workspace Admin for scope:
   ```
   https://www.googleapis.com/auth/calendar.events
   ```
3. Add these values to `server/.env`:
   ```
   GOOGLE_CLIENT_EMAIL=svc-calendar@your-project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY_BASE64=<base64 of private_key>
   GOOGLE_IMPERSONATE_SUBJECT=you@keystonenotarygroup.com
   GCAL_CALENDAR_ID=primary          # or bookings@yourdomain.com
   TIMEZONE=America/New_York
   GCAL_USE_MEET=false               # true to auto-create Meet links
   ```
4. Restart the server. Confirmations now add events.

### Event Details
- Title: `Notary — {Service} — {Client Name}`
- Duration: 2-hour block based on selected window
- Location: client address or "TBD"
- Attendee: client email (so they get invite link)
- Reminders: 1 day before + 1 hour before

---

## 📧 Email Notifications
- Outgoing email uses your SMTP settings in `.env` (`SMTP_HOST`, `SMTP_USER`, etc.).
- `CONTACT_TO` → default recipient for contact form.  
- `APPOINTMENT_TO` → default recipient for appointment requests.  
- `APPOINTMENT_ADMIN_KEY` → secures confirm/decline links.

---

## 🔐 Environment Variables Overview
- **APPOINTMENT_ADMIN_KEY** → secret key for confirm/decline links.  
- **PUBLIC_URL** → base URL for your API server (used in confirm/decline links).  
- **GOOGLE_CLIENT_EMAIL** → service account identity.  
- **GOOGLE_PRIVATE_KEY_BASE64** → private key from Google, base64 encoded.  
- **GOOGLE_IMPERSONATE_SUBJECT** → Workspace user to impersonate.  
- **GCAL_CALENDAR_ID** → which calendar to write to.  
- **TIMEZONE** → ensures events align with your local time.

---

## 🚦 Day-to-Day Flow
1. **Check your inbox** for new requests.
2. **Click Confirm or Decline** based on eligibility of documents.  
   - Confirm → client gets confirmation + event on your calendar.  
   - Decline → client gets polite decline with reason if provided.  
3. **Check Google Calendar** (if enabled) to see confirmed events.  
4. **Optional:** Open `server/data/appointments.json` if you want to audit past requests.

---

## 🛠 Troubleshooting
- **Emails not sending?** Check SMTP vars in `.env` and restart server.  
- **Calendar not syncing?** Ensure service account delegation is set in Workspace Admin.  
- **Clients not seeing updates?** Verify their email address was entered correctly in the form.  
- **Security concern?** Rotate `APPOINTMENT_ADMIN_KEY` and redeploy.

---

## 🗂 File Paths (for reference)
- Client pages: `client/src/modules/pages/Appointment.tsx`, `Prices.tsx`, etc.  
- Server logic: `server/server.js`.  
- Appointment storage: `server/data/appointments.json`.  
- Config samples: `server/.env.example`.  
- Docs: `LAUNCH_INSTRUCTIONS.md` (full technical setup) and this `OWNER_PLAYBOOK.md` (daily ops).

---

Keep this file handy. It’s meant as your **operational manual**, not for developers.
