/**
 * Typed access to public runtime configuration.
 *
 * Expo inlines `process.env.EXPO_PUBLIC_*` at build time, but ONLY when written
 * as a literal dot-access expression — destructuring or `process.env['X']`
 * silently produces `undefined` in a release build. That is why every value
 * below is spelled out longhand instead of looped over.
 *
 * Everything here ships in the bundle in plain text. Anything secret belongs in
 * EAS Secrets and must be read server-side (Supabase Edge Functions, Sprint 2).
 */

export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
} as const;

export type EnvKey = keyof typeof env;

/**
 * Read a value that the app cannot run without, failing loudly at the call site
 * rather than surfacing as a confusing `undefined` deep inside a network layer.
 *
 * Kept separate from `env` so Sprint 1 can boot with an empty `.env.local` —
 * only the code that genuinely needs a variable pays for its absence.
 */
export function requireEnv(key: EnvKey): string {
  const value = env[key];

  if (!value) {
    throw new Error(
      `Missing environment variable for "${key}". Copy .env.example to .env.local and fill it in, then restart the bundler with --clear.`,
    );
  }

  return value;
}
