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

The public waitlist form submits to `reis@avrai.org` via FormSubmit's AJAX endpoint from the browser. If you want to replace that later with Supabase, Resend, or another backend, update [`/Users/reisgordon/Websites/avrai-site/src/components/waitlist-form.tsx`](/Users/reisgordon/Websites/avrai-site/src/components/waitlist-form.tsx).

## Notes

- The existing `reis-ship-it/avrai` repository is a separate product/app codebase.
- This repository is intended to be the marketing/public web presence for the domain.
