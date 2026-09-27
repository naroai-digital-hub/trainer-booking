-- ============================================================
-- FORGE Personal Training — Supabase schema
-- Run this entire file once in the Supabase SQL Editor.
-- ============================================================

-- ---------- helper: is the signed-in user an admin? ----------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_minutes integer not null default 60,
  price numeric not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  service_id uuid references public.services(id),
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.business_hours (
  id uuid primary key default gen_random_uuid(),
  weekday integer not null check (weekday between 0 and 6), -- 0 = Sunday
  is_open boolean not null default true,
  start_time time not null default '09:00',
  end_time time not null default '18:00',
  created_at timestamptz not null default now(),
  unique (weekday)
);

create table if not exists public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  blocked_date date not null unique,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.trainer_settings (
  id uuid primary key default gen_random_uuid(),
  trainer_name text,
  trainer_email text,
  trainer_phone text,
  trainer_address text,
  slot_interval_minutes integer not null default 30,
  booking_notice_hours integer not null default 12,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.business_hours enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.trainer_settings enable row level security;
alter table public.admin_users enable row level security;

-- services: everyone can read (website filters is_active); only admins write
drop policy if exists "services_select_all" on public.services;
create policy "services_select_all" on public.services for select using (true);
drop policy if exists "services_admin_write" on public.services;
create policy "services_admin_write" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

-- appointments: anyone can create a booking; only admins read/update
drop policy if exists "appointments_public_insert" on public.appointments;
create policy "appointments_public_insert" on public.appointments
  for insert with check (true);
drop policy if exists "appointments_admin_all" on public.appointments;
create policy "appointments_admin_all" on public.appointments
  for all using (public.is_admin()) with check (public.is_admin());

-- business_hours: public read (needed to generate slots); admins write
drop policy if exists "hours_select_all" on public.business_hours;
create policy "hours_select_all" on public.business_hours for select using (true);
drop policy if exists "hours_admin_write" on public.business_hours;
create policy "hours_admin_write" on public.business_hours
  for all using (public.is_admin()) with check (public.is_admin());

-- blocked_dates: public read (needed to generate slots); admins write
drop policy if exists "blocked_select_all" on public.blocked_dates;
create policy "blocked_select_all" on public.blocked_dates for select using (true);
drop policy if exists "blocked_admin_write" on public.blocked_dates;
create policy "blocked_admin_write" on public.blocked_dates
  for all using (public.is_admin()) with check (public.is_admin());

-- trainer_settings: public read (name/contact + booking rules); admins write
drop policy if exists "tsettings_select_all" on public.trainer_settings;
create policy "tsettings_select_all" on public.trainer_settings for select using (true);
drop policy if exists "tsettings_admin_write" on public.trainer_settings;
create policy "tsettings_admin_write" on public.trainer_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- admin_users: only signed-in users can check their own admin row
drop policy if exists "admin_users_self_read" on public.admin_users;
create policy "admin_users_self_read" on public.admin_users
  for select using (auth.uid() = user_id);

-- ============================================================
-- SEED DATA
-- ============================================================

insert into public.services (name, description, duration_minutes, price, is_active)
values
  ('1-on-1 Personal Training', 'Fully personalized coaching built around your goals, movement, and schedule. Every rep coached, every session programmed for you.', 60, 85, true),
  ('Strength Coaching', 'Barbell-based progressive programming focused on safe, sustainable strength gains — squat, hinge, press, pull, carry.', 60, 95, true),
  ('Mobility & Movement', 'Improve how you move: joint prep, controlled stretching, and movement quality work that keeps you training pain-free.', 45, 65, true),
  ('Fitness Assessment', 'A deep-dive starting point — movement screen, strength baselines, and goal mapping, ending with your personal training roadmap.', 60, 75, true),
  ('Small Group Training', 'Coach-led training in a small crew of 2–4. Personal attention, shared energy, smarter pricing.', 60, 45, true),
  ('Conditioning Session', 'Build your engine with coached intervals, sleds, ropes, and circuits — scaled precisely to your current capacity.', 45, 70, true)
on conflict do nothing;

-- Mon–Sat open 07:00–20:00, Sunday closed
insert into public.business_hours (weekday, is_open, start_time, end_time)
values
  (0, false, '09:00', '18:00'),
  (1, true, '07:00', '20:00'),
  (2, true, '07:00', '20:00'),
  (3, true, '07:00', '20:00'),
  (4, true, '07:00', '20:00'),
  (5, true, '07:00', '20:00'),
  (6, true, '08:00', '18:00')
on conflict (weekday) do nothing;

insert into public.trainer_settings
  (trainer_name, trainer_email, trainer_phone, trainer_address, slot_interval_minutes, booking_notice_hours)
select 'Sam Carter', 'coach@forge-training.com', '+1 555 010 2030', '123 Strength Ave, Austin, TX',
       30, 12
where not exists (select 1 from public.trainer_settings);

-- ============================================================
-- MAKE YOURSELF ADMIN (run after creating your auth user):
--
--   insert into public.admin_users (user_id)
--   values ('PASTE_YOUR_AUTH_USER_UID_HERE');
-- ============================================================
