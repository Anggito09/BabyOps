-- ============================================================
-- BabyOps — skema Supabase (jalankan di Dashboard > SQL Editor)
-- ============================================================
-- 1. Buka https://supabase.com/dashboard > project kamu > SQL Editor
-- 2. Paste seluruh file ini > Run
-- 3. Pastikan Authentication > Providers > Email aktif
-- 4. (Opsional) Matikan "Confirm email" saat testing internal:
--    Authentication > Settings > uncheck "Confirm email"
-- ============================================================

-- ---- Tabel profil (1 baris per user, PK = auth.users.id) ----
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  baby_name text,
  baby_dob date,
  baby_gender text,
  phone text,
  address text,
  research_consent boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---- Tabel history (backup cloud riwayat diagnosa/tangis) ----
create table if not exists public.history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'diagnosis',
  condition_name text not null default '',
  description text,
  severity text,
  emoji text,
  entry_date text,
  matched_symptoms integer default 0,
  symptom_ids text[],
  symptom_names text[],
  guidance text[],
  doctor_when text,
  cry_label text,
  cry_meaning text,
  confidence integer,
  created_at timestamptz default now()
);

-- multi-bayi (kembar): riwayat ditag milik bayi mana (aman untuk DB lama)
alter table public.history add column if not exists baby_id text;
alter table public.history add column if not exists baby_name text;

create index if not exists history_user_idx on public.history (user_id, created_at desc);
create index if not exists history_baby_idx on public.history (user_id, baby_id, created_at desc);

-- ---- Row Level Security: user hanya bisa baca/tulis datanya sendiri ----
alter table public.profiles enable row level security;
alter table public.history enable row level security;

drop policy if exists "profiles_owner" on public.profiles;
create policy "profiles_owner" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "history_owner" on public.history;
create policy "history_owner" on public.history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---- updated_at otomatis ----
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch
  before update on public.profiles
  for each row execute function public.touch_updated_at();
