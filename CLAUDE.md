# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for the Allante String Quartet (Utah County). Handles public pages, concert/event management, ticketing with QR codes, donations, and email notifications.

## Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build (also serves as type-check; no separate tsc command)
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`; lint is deliberately NOT a build gate, see below)
- `npm run images:compress` — recompress oversized images already in the Supabase `event-images` bucket
- `npm run images:compress-public` — recompress `public/images` in place; run after adding images there (see Images below)
- `node scripts/run-sql-migration.mjs <migration-file> <db-password>` — run a single SQL migration against Supabase via direct Postgres connection

Node 24 (`engines: node >=22`). CI and deploy pin the same version.

## Tech Stack

- **Next.js 15** with App Router, React 19, TypeScript
- **Tailwind CSS** with custom brand colors defined in `tailwind.config.ts`: `primary` (#002E5C), `secondary` (#D14377), `light-gray`, `light-blue`
- **Supabase** — Postgres database, auth, and storage (bucket: `event-images`)
- **Stripe** — ticket checkout and donations (amounts in cents everywhere)
- **Resend** with React Email templates in `emails/` — transactional emails
- **Zod** — API request validation
- **QR codes** — `qrcode` (generation) + `html5-qrcode` (scanning)

## Architecture

### Two-client Supabase pattern
- `lib/supabase/server.ts` — server-side client (Server Components, API routes). Use `await createClient()`.
- `lib/supabase/client.ts` — browser client. Use `createClient()` (no await).
- `lib/supabase/middleware.ts` — session refresh; only runs auth checks on `/admin` routes.

### API routes (`app/api/`)
All API routes use Next.js Route Handlers. Pattern: validate with Zod, create Supabase server client, check auth for admin operations, return `NextResponse.json()`.

- **Public**: `concerts/`, `contact/`, `donate/`, `hire/`, `newsletter/subscribe`, `sunset-series/checkout`
- **Admin** (auth required): `admin/concerts/`, `admin/sunset-series/`, `admin/newsletter/`
- **Webhooks**: `webhooks/stripe/` — handles `checkout.session.completed`, creates order + QR code + sends confirmation email

### Two event systems
The app manages two distinct event types with separate DB tables and parallel admin CRUD:
1. **Concerts** — `concerts` table, free or paid, registration-based
2. **Sunset Series** — `sunset_events` table, paid tickets via Stripe Checkout, includes location reveal on purchase, QR code check-in

### Admin panel (`/admin`)
Protected by Supabase Auth via middleware redirect to `/admin/login`. The admin layout conditionally renders `AdminNav` only when authenticated — it does **not** redirect, because the login page renders through the same layout.

Auth is therefore two layers, and both are required:
1. Middleware redirects unauthenticated traffic away from `/admin`.
2. Every admin API route checks `supabase.auth.getUser()` itself, and every admin Server Component that reads data calls `requireAdmin()` from `lib/auth.ts`.

Do not rely on middleware alone — Next.js has shipped repeated middleware-bypass advisories. Any new admin page that reads data server-side must call `requireAdmin()`.

Admin sub-sections: concerts CRUD, sunset series CRUD, newsletter subscribers, orders/check-in per event.

### Ticket check-in
QR payloads are always JSON (`generateTicketQRCode()` wraps whatever it is given). The `orderId` inside points at a **different column depending on how the ticket was bought**:
- Paid tickets → `stripe_session_id`
- Comp / free tickets → `qr_code` (a `SUNSET:<id>:<nanoid>` or `CONCERT:<id>:<nanoid>` string; these rows have no `stripe_session_id`)

Both check-in routes branch on the prefix to pick the right column. Getting this wrong silently makes comp tickets unscannable, with no manual check-in fallback in the UI.

Check-in also rejects any order whose `payment_status` is not `completed`. Comp tickets are written as `completed` with `amount_paid` 0, so they pass. Note nothing writes `refunded` yet — refunds are manual, so a refunded order must be updated by hand for the door check to take effect.

### Stripe flow
Stripe is initialized lazily — `lib/stripe.ts` exports `null` if `STRIPE_SECRET_KEY` is missing, and all consumers check for this. Checkout sessions are created in API routes with metadata (customer info, event ID, quantity). The webhook at `api/webhooks/stripe/` fulfills the order: inserts into DB, atomically increments `tickets_sold` via Supabase RPC, generates QR code, sends email.

### Email
`lib/email.ts` exports `sendEmail()` which gracefully logs instead of sending when `RESEND_API_KEY` is not set. Templates are React Email components in `emails/`. Include `sendEmailWithRetry()` for reliability.

### Database migrations
SQL files in `supabase/migrations/`, numbered sequentially (001–013). Run via `scripts/run-sql-migration.mjs` with direct Postgres connection. New migrations should continue the numbering sequence.

### Image uploads
Images go to Supabase Storage bucket `event-images`. Upload/delete handled via `app/api/upload-image/` and `app/api/delete-image/` routes. `lib/storage-helpers.ts` provides URL parsing and deletion utilities. New uploads are downscaled in the browser first (`lib/image-resize.ts`).

### Images: `next/image` does nothing here
On the Cloudflare Workers deploy the image optimizer is a **passthrough** — `/_next/image` returns the original bytes for every width in the generated `srcset`. `<Image />` still emits a correct-looking `srcset`, so the site appears responsive while every visitor downloads the full-resolution file.

Consequences:
- The only thing that affects payload is the file on disk. Run `npm run images:compress-public` after adding to `public/images`.
- Swapping `<img>` for `<Image />` buys nothing today. The remaining `@next/next/no-img-element` warnings are left in place deliberately as the signal that this is still broken.
- A real fix needs Cloudflare Images / Image Resizing (paid) or a custom loader over pre-generated variants.

### Lint, CI, and deploy
- `eslint.config.mjs` is flat config. `react/no-unescaped-entities` is off on purpose (raw apostrophes render fine; enforcing it would mean rewriting live email copy). A leading `_` marks a deliberately unused parameter.
- `next.config.ts` sets `eslint.ignoreDuringBuilds` — lint is a separate gate so pre-existing style debt cannot fail a deploy. Run `npm run lint` yourself.
- `.github/workflows/ci.yml` runs lint + build on every non-main branch and **must never deploy**.
- `.github/workflows/deploy.yml` deploys to Cloudflare on push to `main` only. It generates `wrangler.jsonc` from GitHub Secrets — the local `wrangler.jsonc` is gitignored and does not affect production.

## Environment

All required env vars are documented in `.env.example`. Key vars: Supabase URL/keys, Stripe keys + webhook secret, Resend API key, `TICKET_PRICE` (in cents), `NEXT_PUBLIC_APP_URL`.
