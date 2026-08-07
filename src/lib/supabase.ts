// Installs a `localStorage` shim backed by expo-sqlite. Must run before any
// client is created, hence the side-effect import at the top of the file.
import 'expo-sqlite/localStorage/install';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import { requireEnv } from '@/lib/env';
import type { Database } from '@/types/database';

export type LockedInClient = SupabaseClient<Database>;

let client: LockedInClient | null = null;

/**
 * The app's Supabase client, created on first use.
 *
 * Deliberately lazy. Building it at module scope would run `requireEnv` during
 * import, so a missing `.env.local` would crash the app on boot — before any
 * screen could explain what was wrong. Deferring means only the code path that
 * actually talks to the backend fails, and it fails with a message naming the
 * variable.
 *
 * Session storage is expo-sqlite's `localStorage`, per the Expo SDK 57 guide.
 * It is deliberately not SecureStore: iOS caps a keychain item at roughly 2KB
 * and a Supabase session (access token + refresh token + user payload) grows
 * past that once a user carries enough claims — which fails in production long
 * after it stopped failing in testing.
 *
 * The publishable key is safe to ship. Authorisation lives entirely in the row
 * level security policies in supabase/migrations, not in key secrecy.
 */
export function getSupabase(): LockedInClient {
  if (client) return client;

  client = createClient<Database>(requireEnv('supabaseUrl'), requireEnv('supabasePublishableKey'), {
    auth: {
      storage: localStorage,
      autoRefreshToken: true,
      persistSession: true,
      // There is no URL to read a session back from on native; leaving this
      // on makes the client wait for a callback that never arrives.
      detectSessionInUrl: false,
    },
  });

  // Refresh tokens only while the app is in front of the user. Left running in
  // the background it burns battery, and a refresh can be cut in half when the
  // OS suspends the process.
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void client?.auth.startAutoRefresh();
    } else {
      void client?.auth.stopAutoRefresh();
    }
  });

  return client;
}

/**
 * Storage path for a user's upload. The first segment must be the user's id —
 * the storage policies authorise on exactly that segment, so a path built any
 * other way is rejected by the server.
 */
export function uploadPath(userId: string, fileName: string): string {
  return `${userId}/${fileName}`;
}
