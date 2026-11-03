# AVRAI Public Site

This standalone Next.js site is the public introduction to AVRAI. The canonical
host is `https://www.avrai.org`; `https://avrai.org` redirects there. The AVRAI
product code lives in the separate `reis-ship-it/avrai` repository.

## Routes

- `/` is a dark visual landing page with an animated knot, brief introduction,
  and link to the access request.
- `/access` collects an early access request. It does not create an account or
  guarantee access.
- `/about` redirects to `/`.
- `/contact` redirects to `/#contact`, where the footer provides email links.
- `/business` redirects to `https://business.avrai.org/signup`, the separate
  business account creation flow.
- `POST /api/waitlist` accepts the access request from the `/access` form.

The sitemap lists only `/` and `/access`. The old page routes remain as
redirects for existing links.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Before deploying, run `npm run lint` and
`npm run build`. This repository has no separate test script.

## Access request delivery

The form in `src/components/waitlist-intake-form.tsx` submits to the same-origin
`/api/waitlist` route. The route forwards the request to `WAITLIST_WEBHOOK_URL`
when set, otherwise `NEXT_PUBLIC_WAITLIST_SCRIPT_URL`, otherwise its configured
Apps Script fallback. The repository includes
`docs/google-apps-script-waitlist.gs` as a reference template.

For a normal submission, the route reports success after the configured
endpoint returns an acceptable HTTP response. It does not independently verify
a Google Sheet row, account creation, or access approval. Verify the receiving
system before claiming that a particular request was recorded.

## Deployment boundary

The site uses the existing Vercel `avrai-site` project. Preserve the separate
`avrai-business` project and the Google Workspace mail records when changing
domain or DNS settings.
