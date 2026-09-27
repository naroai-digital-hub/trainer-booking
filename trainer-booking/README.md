# FORGE — Personal Training & Coaching

A premium personal trainer booking platform: a high-end public website with a
real multi-step booking flow, plus a secure admin dashboard. Built with
React + TypeScript + Vite, backed by Supabase (Postgres + Auth).

## 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste the entire contents of `supabase/schema.sql` and run it. This creates
   all tables, row-level security policies, and seed data (services, business
   hours, trainer settings).

## 2. Create your admin account

1. In Supabase go to **Authentication → Users → Add user** and create a user
   with your email and a strong password (check "Auto Confirm User").
2. Copy the new user's **UID**.
3. In the SQL Editor run:

   ```sql
   insert into admin_users (user_id) values ('PASTE_UID_HERE');
   ```

4. Log in at `/admin` with that email and password.

## 3. Configure the app

1. Copy `.env.local` values: in Supabase go to **Settings → API** and paste the
   **Project URL** and **Publishable key** (anon key) into `.env.local`.

## 4. Run it

```bash
npm install
npm run dev
```

- Public site: `http://localhost:5173`
- Admin login: `http://localhost:5173/admin`

## 5. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import it in Vercel.
3. Add the two environment variables (`VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings.
4. Deploy — Vercel redeploys automatically on every push.

## Customizing

- **Images**: all image URLs live in `src/lib/media.ts` — swap any URL there.
- **Brand**: studio name and tagline in `src/lib/media.ts` (`BRAND`).
- **Trainer details**: edit in the dashboard under **Trainer Settings** (name,
  email, phone, address, slot interval, booking notice).

## Booking rules

Available slots are generated from `business_hours`,
`services.duration_minutes`, `trainer_settings.slot_interval_minutes`,
`trainer_settings.booking_notice_hours`, `blocked_dates`, and existing
non-cancelled appointments. Overlap rule:
`new_start < existing_end AND new_end > existing_start`.
