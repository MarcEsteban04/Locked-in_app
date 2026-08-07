# Locked In

**Your personal AI study companion.** Upload a lecture — a PDF, slide deck, scanned page or
whiteboard photo — and get back reviewers, flashcards, quizzes, mock exams and a study plan.

See [docs/app_description.md](docs/app_description.md) for the product, and
[docs/project_development.md](docs/project_development.md) for the 30-sprint roadmap.

## Status

Sprints 1–3 are complete: design system and navigation, the backend schema with row level security
and storage, and the full authentication flow (email, register, password reset, Google, Apple,
persisted sessions). Screens behind the tabs are deliberate placeholders naming the sprint that
fills them in. Subjects and uploads are next.

Applying the schema and enabling the auth providers needs your Supabase account — see
[supabase/README.md](supabase/README.md).

## Authentication

Route protection uses `Stack.Protected` in [src/app/_layout.tsx](src/app/_layout.tsx), which mounts
a different group rather than redirecting after render, so a signed-out user never briefly sees the
dashboard. State lives in [src/lib/auth/session.tsx](src/lib/auth/session.tsx).

**If Supabase isn't configured the auth gate is bypassed** and the app runs unauthenticated, with a
notice on Profile. A sign-in screen that cannot succeed is worse than no sign-in screen. Fill in
`.env.local` and the gate turns itself on — there is no flag to flip.

Never put a **service-role key** in `.env.local` or anywhere else in this repo. It bypasses every
RLS policy. It belongs in Edge Function secrets or EAS Secrets, read server-side only.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL and publishable key
npx expo start
```

Expo Go must match the SDK — this project is on SDK 57, so an older Expo Go will refuse to open it
with "Project is incompatible with this version of Expo Go". Install the matching build from
[expo.dev/go](https://expo.dev/go), or move to a development build:

```bash
npx expo install expo-dev-client
npx expo run:android   # or: npx expo run:ios
```

## Scripts

| Command             | What it does                             |
| ------------------- | ---------------------------------------- |
| `npm start`         | Start the Metro bundler                  |
| `npm run android`   | Start and open on Android                |
| `npm run ios`       | Start and open on iOS                    |
| `npm run web`       | Start and open in the browser            |
| `npm run lint`      | ESLint, with Prettier enforced as a rule |
| `npm run format`    | Rewrite files with Prettier              |
| `npm run typecheck` | `tsc --noEmit`                           |

## Project structure

```
src/
  app/                    Routes (Expo Router, file-based)
    _layout.tsx           Fonts, splash, navigation theme, status bar
    (tabs)/               The five main tabs
    design-system.tsx     Living reference for every token and component
  components/
    ui/                   Design-system primitives — Button, Card, Input, Text, Badge, Screen
    navigation/           The custom flat tab bar
  constants/theme.ts      TypeScript mirror of the CSS tokens
  hooks/use-theme.ts      Resolved colour scheme and raw token values
  lib/                    cn() class merging, typed env access, Supabase client
  types/database.ts       Shape of the Postgres schema
  global.css              Design tokens — the source of truth
supabase/migrations/      Schema, RLS policies, storage buckets
docs/                     Product description, roadmap, design system brief
```

## Screen layout

A screen is a stack of full-bleed `<Section>` blocks inside a `<Screen>`, not one padded column.
Sections carry their own gutter and run edge to edge, so the sharp transition between two solid
fills is what separates them — there are no rules or shadows available to do that job. `<Screen>`
reserves room for the tab bar using the height the tab bar exports, so the constant can never drift
out of sync with the component.

## Styling

Styling is [NativeWind v5](https://nativewind.dev) (Tailwind 4 for React Native). Tailwind 4 has no
`tailwind.config.js` — **all design tokens live in [src/global.css](src/global.css)** as `@theme`
variables, and that file is the single source of truth. `src/constants/theme.ts` mirrors those
values in TypeScript for the few APIs that take a raw colour instead of a class (status bar,
React Navigation theme, SVG icon props); change one, change the other.

The design language is flat: no shadows, no gradients on elements, no blur. Hierarchy comes from
scale, weight and solid blocks of colour. The full brief is in
[docs/design_prompt.xml](docs/design_prompt.xml), and every component is on screen at once under
Profile → Design system.

Dark mode needs no theme context or provider. Tokens are declared once under `:root` and again under
`@media (prefers-color-scheme: dark)`, and utilities emit `var(--token)`, so the whole app repaints
when the OS scheme changes.

### Two pinned versions worth knowing about

- **`lightningcss` is pinned to exactly `1.30.1`** (with an npm `override`). 1.30.2 has a bug that
  breaks NativeWind's native compile step with `failed to deserialize; expected an object-like
struct named Specifier`. The guard inside `react-native-css` that is supposed to warn about this
  is swallowed by a `catch`, so the failure gives no hint about the cause.
- **`postcss.config.js` is required, not optional.** NativeWind hands CSS to Expo's own pipeline, so
  without the `@tailwindcss/postcss` plugin registered there, `@theme` and `@import 'tailwindcss'`
  pass through unprocessed and no utility classes are generated at all — silently, on both web and
  native.

## Environment variables

Only `EXPO_PUBLIC_*` variables reach the app and they ship in the bundle as plain text, so nothing
secret belongs in them. Read them through [src/lib/env.ts](src/lib/env.ts) rather than touching
`process.env` directly. Expo inlines these at build time — restart with `npx expo start --clear`
after editing `.env.local`.
