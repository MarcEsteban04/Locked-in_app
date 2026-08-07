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

4. **Authentication → Providers → Email**: enable it. "Confirm email" on is the safe default; the
   sign-up screen already handles the no-session-yet case and tells the user to check their inbox.
5. **Authentication → URL Configuration**: add both `lockedinapp://**` and `exp://**` to the
   redirect allow list. Without them, OAuth and password-reset links bounce. `exp://` is what Expo
   Go uses in development — drop it before production.

### Google

Create an OAuth client in Google Cloud Console (**APIs & Services → Credentials**), type **Web
application**, and add `https://brbawjdmlltjdciivxen.supabase.co/auth/v1/callback` as an authorised
redirect URI. Paste the client ID and secret into **Authentication → Providers → Google**.

The app uses the browser flow (`signInWithOAuth`), not the native SDK, so this works in Expo Go and
in a development build with no extra native config.

### Apple

Enable **Authentication → Providers → Apple**. Under "Client IDs" add:

- `host.exp.Exponent` — required to test in Expo Go
- your real bundle identifier, once you have one

iOS uses the native sheet via `expo-apple-authentication` (`signInWithIdToken`); Android falls back
to the same browser flow as Google. Apple returns the user's full name **only on the first
sign-in**, so the session provider writes it to user metadata immediately — if that write is ever
removed, the name is unrecoverable.

Note that offering Google sign-in on iOS obliges you to offer Apple sign-in too, per App Store
review guideline 4.8.

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
