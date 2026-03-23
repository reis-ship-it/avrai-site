# Avrai Site

Public website for `avrai.org`, built as a standalone Next.js project for deployment on Vercel.

## Stack

- Next.js App Router
- TypeScript
- ESLint
- Vercel-ready deployment target

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

## Deployment

Connect the repo to Vercel, then attach:

- `avrai.org`
- `www.avrai.org`

Only the website DNS records need to move to Vercel. Keep Google Workspace mail records in place.

## Waitlist

The public waitlist form is set up to submit to a Google Apps Script web app that writes directly into a Google Sheet.

Set this environment variable in Vercel and locally:

```bash
NEXT_PUBLIC_WAITLIST_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

The site-side form lives in [`/Users/reisgordon/Websites/avrai-site/src/components/waitlist-form.tsx`](/Users/reisgordon/Websites/avrai-site/src/components/waitlist-form.tsx). The companion Apps Script template is in [`/Users/reisgordon/Websites/avrai-site/docs/google-apps-script-waitlist.gs`](/Users/reisgordon/Websites/avrai-site/docs/google-apps-script-waitlist.gs).

Google setup:

1. Open the target Google Sheet.
2. Open `Extensions` -> `Apps Script`.
3. Replace the default script with the contents of `docs/google-apps-script-waitlist.gs`.
4. Deploy it as a web app:
   - Execute as: `Me`
   - Who has access: `Anyone`
5. Copy the `/exec` URL into `NEXT_PUBLIC_WAITLIST_SCRIPT_URL`.

## Notes

- The existing `reis-ship-it/avrai` repository is a separate product/app codebase.
- This repository is intended to be the marketing/public web presence for the domain.
