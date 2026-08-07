# Locked In

**Your personal AI study companion.** Upload a lecture — a PDF, slide deck, scanned page or
whiteboard photo — and get back reviewers, flashcards, quizzes, mock exams and a study plan.

See [docs/app_description.md](docs/app_description.md) for the product, and
[docs/project_development.md](docs/project_development.md) for the 30-sprint roadmap.

## Status

Sprint 1 (Project Initialization) is complete: navigation skeleton, design system, light/dark mode
and the first reusable components. The screens behind the tabs are deliberate placeholders that name
the sprint which fills them in. There is no backend yet — that is Sprint 2.

## Getting started

```bash
npm install
cp .env.example .env.local   # values are optional until Sprint 2
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
  lib/                    cn() class merging, typed env access
  global.css              Design tokens — the source of truth
docs/                     Product description, roadmap, design system brief
```

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
