-- Locked In — Sprint 2: schema, row level security, storage.
--
-- Every table is scoped to a single owner. There is no sharing model yet;
-- study groups arrive in Sprint 28 and will extend these policies rather than
-- replace them.
--
-- Note on the "users" table from the roadmap: Supabase already owns identity in
-- `auth.users`, and a second `public.users` table would be a copy that drifts.
-- `public.profiles` below is that table — keyed 1:1 to `auth.users(id)` — which
-- is the Supabase-idiomatic shape and keeps a single source of truth for a user.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- Keeps `updated_at` honest without every client having to remember to set it.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text,
  avatar_url    text,
  school        text,
  education_level text check (
    education_level in ('junior_high', 'senior_high', 'college', 'other')
  ),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- A profile row must exist the moment a user signs up, otherwise the first
-- screen after registration has nothing to read. Doing it in a trigger rather
-- than from the client means it cannot be skipped or raced.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- subjects
-- ---------------------------------------------------------------------------

create table if not exists public.subjects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  name        text not null check (length(trim(name)) > 0),
  -- Hex from the design system palette; the app maps it back to a token.
  color       text not null default '#3B82F6' check (color ~* '^#[0-9a-f]{6}$'),
  icon        text,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists subjects_user_id_idx on public.subjects (user_id, position);
create unique index if not exists subjects_user_name_key
  on public.subjects (user_id, lower(name));

create trigger subjects_set_updated_at
  before update on public.subjects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- folders — units / chapters / semesters / topics
-- ---------------------------------------------------------------------------

-- Self-referencing rather than a fixed unit/chapter/topic hierarchy, because
-- students organise courses in ways we cannot predict. Depth is a UI concern.
create table if not exists public.folders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  subject_id  uuid not null references public.subjects (id) on delete cascade,
  parent_id   uuid references public.folders (id) on delete cascade,
  name        text not null check (length(trim(name)) > 0),
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  -- A folder cannot be its own parent. Deeper cycles are prevented in the app;
  -- enforcing them here would need a recursive trigger on every write.
  constraint folders_no_self_parent check (id <> parent_id)
);

create index if not exists folders_subject_idx on public.folders (subject_id, position);
create index if not exists folders_parent_idx on public.folders (parent_id);
create index if not exists folders_user_idx on public.folders (user_id);

create trigger folders_set_updated_at
  before update on public.folders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- uploads
-- ---------------------------------------------------------------------------

create table if not exists public.uploads (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  -- Filing is optional: a student can upload first and organise later, and
  -- deleting a subject should not delete the material inside it.
  subject_id    uuid references public.subjects (id) on delete set null,
  folder_id     uuid references public.folders (id) on delete set null,
  bucket        text not null default 'uploads',
  storage_path  text not null,
  file_name     text not null,
  mime_type     text,
  size_bytes    bigint check (size_bytes >= 0),
  kind          text not null check (kind in ('document', 'image', 'audio')),
  -- Drives the processing pipeline from Sprint 8 onward.
  status        text not null default 'pending'
                check (status in ('pending', 'processing', 'ready', 'failed')),
  error_message text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists uploads_user_idx on public.uploads (user_id, created_at desc);
create index if not exists uploads_subject_idx on public.uploads (subject_id);
create index if not exists uploads_folder_idx on public.uploads (folder_id);
create index if not exists uploads_status_idx on public.uploads (status) where status <> 'ready';
create unique index if not exists uploads_storage_path_key on public.uploads (bucket, storage_path);

create trigger uploads_set_updated_at
  before update on public.uploads
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- notes
-- ---------------------------------------------------------------------------

-- Holds text, whatever produced it: typed by the student, pulled out by OCR,
-- transcribed from audio, or generated by the model. Keeping one table rather
-- than one per source means search and review work the same way across all of
-- them.
create table if not exists public.notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  subject_id  uuid references public.subjects (id) on delete set null,
  folder_id   uuid references public.folders (id) on delete set null,
  upload_id   uuid references public.uploads (id) on delete cascade,
  title       text not null check (length(trim(title)) > 0),
  content     text,
  source      text not null default 'manual'
              check (source in ('manual', 'ocr', 'transcript', 'ai')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists notes_user_idx on public.notes (user_id, created_at desc);
create index if not exists notes_subject_idx on public.notes (subject_id);
create index if not exists notes_upload_idx on public.notes (upload_id);

create trigger notes_set_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

-- RLS is the entire authorisation model. The publishable key ships inside the
-- app bundle in plain text, so anything not protected by a policy here is
-- effectively public. Every table below denies by default and is then opened
-- only to its owner.

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.folders  enable row level security;
alter table public.uploads  enable row level security;
alter table public.notes    enable row level security;

-- profiles — keyed by id, not user_id
create policy "profiles are readable by their owner"
  on public.profiles for select using ((select auth.uid()) = id);
create policy "profiles are insertable by their owner"
  on public.profiles for insert with check ((select auth.uid()) = id);
create policy "profiles are updatable by their owner"
  on public.profiles for update using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
-- Deliberately no delete policy: deleting the auth user cascades to the
-- profile, and a profile without an auth user is not a state we want.

-- subjects
create policy "subjects are readable by their owner"
  on public.subjects for select using ((select auth.uid()) = user_id);
create policy "subjects are insertable by their owner"
  on public.subjects for insert with check ((select auth.uid()) = user_id);
create policy "subjects are updatable by their owner"
  on public.subjects for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "subjects are deletable by their owner"
  on public.subjects for delete using ((select auth.uid()) = user_id);

-- folders
create policy "folders are readable by their owner"
  on public.folders for select using ((select auth.uid()) = user_id);
create policy "folders are insertable by their owner"
  on public.folders for insert with check ((select auth.uid()) = user_id);
create policy "folders are updatable by their owner"
  on public.folders for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "folders are deletable by their owner"
  on public.folders for delete using ((select auth.uid()) = user_id);

-- uploads
create policy "uploads are readable by their owner"
  on public.uploads for select using ((select auth.uid()) = user_id);
create policy "uploads are insertable by their owner"
  on public.uploads for insert with check ((select auth.uid()) = user_id);
create policy "uploads are updatable by their owner"
  on public.uploads for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "uploads are deletable by their owner"
  on public.uploads for delete using ((select auth.uid()) = user_id);

-- notes
create policy "notes are readable by their owner"
  on public.notes for select using ((select auth.uid()) = user_id);
create policy "notes are insertable by their owner"
  on public.notes for insert with check ((select auth.uid()) = user_id);
create policy "notes are updatable by their owner"
  on public.notes for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "notes are deletable by their owner"
  on public.notes for delete using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------

-- `uploads` is private — lecture material is the student's own and is read
-- through signed URLs. `avatars` is public because profile pictures are shown
-- in contexts where minting a signed URL per render is wasteful.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'uploads',
    'uploads',
    false,
    104857600, -- 100 MB, enough for a long lecture recording
    array[
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/markdown',
      'image/jpeg',
      'image/png',
      'image/heic',
      'image/webp',
      'audio/mpeg',
      'audio/mp4',
      'audio/m4a',
      'audio/wav',
      'audio/webm'
    ]
  ),
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Objects are namespaced by user id: `uploads/<user_id>/<uuid>.<ext>`. The
-- first path segment IS the authorisation check, so the client must always
-- write under its own id.
create policy "users read their own uploads"
  on storage.objects for select
  using (bucket_id = 'uploads' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "users write their own uploads"
  on storage.objects for insert
  with check (bucket_id = 'uploads' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "users update their own uploads"
  on storage.objects for update
  using (bucket_id = 'uploads' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "users delete their own uploads"
  on storage.objects for delete
  using (bucket_id = 'uploads' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "avatars are publicly readable"
  on storage.objects for select using (bucket_id = 'avatars');

create policy "users write their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "users update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "users delete their own avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
