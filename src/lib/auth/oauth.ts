import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';

import { getSupabase } from '@/lib/supabase';

/**
 * Where the auth provider sends the user back to.
 *
 * `makeRedirectUri` resolves to `lockedinapp://` in a build and to the Expo Go
 * `exp://…` URL while developing, which is why it is computed rather than
 * hardcoded. Whatever it produces has to be on the redirect allow list in the
 * Supabase dashboard or the provider refuses the round trip.
 */
export const redirectTo = makeRedirectUri();

/**
 * Turn a callback URL into a session.
 *
 * Handles both shapes Supabase can return: a `code` to exchange (PKCE, used by
 * OAuth) and a raw token pair (used by email links). Returning `null` for a URL
 * carrying neither means an unrelated deep link can be passed in safely.
 */
export async function createSessionFromUrl(url: string) {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) {
    throw new Error(errorCode);
  }

  const supabase = getSupabase();

  if (params.code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (error) throw error;
    return data.session;
  }

  const { access_token, refresh_token } = params;
  if (!access_token || !refresh_token) {
    return null;
  }

  const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) throw error;
  return data.session;
}

/**
 * Browser-based OAuth, used for Google on both platforms and as the Apple
 * fallback on Android.
 *
 * `skipBrowserRedirect` matters: without it supabase-js tries to navigate the
 * page itself, which does nothing on native. We want the URL back so it can be
 * opened in an auth session the OS will hand back to us on completion.
 */
export async function signInWithProvider(provider: 'google' | 'apple') {
  const supabase = getSupabase();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo, skipBrowserRedirect: true },
  });

  if (error) throw error;
  if (!data.url) throw new Error('The provider did not return a sign-in URL.');

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  // `dismiss` and `cancel` are the user backing out — not an error worth
  // showing them a red banner for.
  if (result.type !== 'success') {
    return null;
  }

  return createSessionFromUrl(result.url);
}
