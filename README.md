# Design Marketplace

A platform for selling and purchasing design assets — logos, templates, merchandise graphics, and more.

## Tech Stack

- **Framework** — Next.js 14 (App Router)
- **Database** — Supabase (Postgres)
- **Auth** — Firebase Authentication
- **Payments** — Razorpay
- **Analytics** — PostHog
- **Email** — Resend
- **Styling** — Tailwind CSS

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/MOD-AH/design-marketplace.git
cd design-marketplace
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in the values:

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Console → Project Settings → Your apps |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay Dashboard → API Keys |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog → Project Settings → API Keys |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://us.i.posthog.com` |
| `RESEND_API_KEY` | Resend Dashboard → API Keys (optional) |

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Services Required

- [Supabase](https://supabase.com) — free tier works
- [Firebase](https://console.firebase.google.com) — enable Authentication (Email/Password + Google)
- [Razorpay](https://razorpay.com) — use test mode keys for local dev
- [PostHog](https://posthog.com) — optional, analytics only
- [Resend](https://resend.com) — optional, order confirmation emails only
