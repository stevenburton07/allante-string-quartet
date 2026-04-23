# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for the Allante String Quartet (Utah County). Handles public pages, concert/event management, ticketing with QR codes, donations, and email notifications.

## Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build (also serves as type-check; no separate tsc command)
- `npm run lint` — ESLint
- `node scripts/run-sql-migration.mjs <migration-file> <db-password>` — run a single SQL migration against Supabase via direct Postgres connection

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
Protected by Supabase Auth via middleware redirect to `/admin/login`. The admin layout conditionally renders `AdminNav` only when authenticated. Admin pages are Server Components that fetch data directly from Supabase.

Admin sub-sections: concerts CRUD, sunset series CRUD, newsletter subscribers, orders/check-in per event.

### Stripe flow
Stripe is initialized lazily — `lib/stripe.ts` exports `null` if `STRIPE_SECRET_KEY` is missing, and all consumers check for this. Checkout sessions are created in API routes with metadata (customer info, event ID, quantity). The webhook at `api/webhooks/stripe/` fulfills the order: inserts into DB, atomically increments `tickets_sold` via Supabase RPC, generates QR code, sends email.

### Email
`lib/email.ts` exports `sendEmail()` which gracefully logs instead of sending when `RESEND_API_KEY` is not set. Templates are React Email components in `emails/`. Include `sendEmailWithRetry()` for reliability.

### Database migrations
SQL files in `supabase/migrations/`, numbered sequentially (001–010). Run via `scripts/run-sql-migration.mjs` with direct Postgres connection. New migrations should continue the numbering sequence.

### Image uploads
Images go to Supabase Storage bucket `event-images`. Upload/delete handled via `app/api/upload-image/` and `app/api/delete-image/` routes. `lib/storage-helpers.ts` provides URL parsing and deletion utilities.

## Environment

All required env vars are documented in `.env.example`. Key vars: Supabase URL/keys, Stripe keys + webhook secret, Resend API key, `TICKET_PRICE` (in cents), `NEXT_PUBLIC_APP_URL`.
