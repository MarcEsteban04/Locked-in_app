# Supabase

Everything the backend needs lives in [migrations/](migrations/). The migration is
idempotent (`create ... if not exists`, `on conflict do nothing`), so re-running it is safe.

## What you have to do by hand

The project itself can't be created from this repo — it needs your Supabase account.

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard). Pick a region
   close to your users; for a Philippines-focused app that's Southeast Asia (Singapore).
2. Copy **Project Settings → API → Project URL** and the **publishable** (anon) key into
   `.env.local`, matching the names in [.env.example](../.env.example).
3. Apply the schema, either way:

   **Dashboard** — paste [migrations/0001_init.sql](migrations/0001_init.sql) into the SQL Editor
   and run it.

   **CLI** — preferred once you're iterating:

   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

4. **Authentication → Providers**: enable Email. Turn on "Confirm email" for production. Google
   and Apple sign-in are Sprint 3 — they need OAuth client IDs and a redirect URL of
   `lockedinapp://` (the `scheme` in [app.json](../app.json)).
5. **Authentication → URL Configuration**: add `lockedinapp://` to the redirect allow list, or
   magic links and OAuth will bounce.

Restart the bundler with `npx expo start --clear` afterwards — Expo inlines env vars at build
time and won't pick up a running edit.

## Schema

| Table      | Holds                                                                      |
| ---------- | -------------------------------------------------------------------------- |
| `profiles` | One row per user, keyed 1:1 to `auth.users`. Created by trigger on signup. |
| `subjects` | A course. Name, colour, sort position.                                     |
| `folders`  | Units, chapters, topics. Self-referencing, so nesting is unbounded.        |
| `uploads`  | One row per file in storage, plus its processing status.                   |
| `notes`    | Text from any source — typed, OCR'd, transcribed, or AI-generated.         |

The roadmap lists a `users` table; there isn't one. Supabase already owns identity in
`auth.users`, and a parallel `public.users` would be a copy that drifts out of sync. `profiles`
is that table.

Filing is optional throughout: `uploads.subject_id` and `folder_id` are nullable and
`on delete set null`, so a student can upload first and organise later, and deleting a subject
never destroys the material inside it.

## Security

**Row level security is the whole authorisation model.** The publishable key ships inside the app
bundle in plain text, so any table without a policy is effectively world-readable. Every table
here has RLS enabled and is opened only to `auth.uid() = user_id` (`= id` for `profiles`).

Policies use `(select auth.uid())` rather than a bare `auth.uid()`. Postgres treats the subquery
form as a constant per statement instead of re-evaluating it per row, which matters as soon as a
student has a few hundred notes.

Storage objects are namespaced `<user_id>/<file>`, and the policies authorise on that first path
segment — so the path prefix _is_ the access check. Build paths with `uploadPath()` from
[src/lib/supabase.ts](../src/lib/supabase.ts) rather than by hand.

## After changing a migration

Regenerate the types so TypeScript matches the database:

```bash
npx supabase gen types typescript --project-id <ref> > src/types/database.ts
```

Until then [src/types/database.ts](../src/types/database.ts) is hand-maintained — change a
migration, change that file.
