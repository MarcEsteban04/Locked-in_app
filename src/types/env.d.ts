/**
 * Autocomplete and type-safety for the public env vars declared in .env.example.
 * Keep in sync with src/lib/env.ts.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    readonly EXPO_PUBLIC_SUPABASE_URL?: string;
    readonly EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
  }
}
