import type { Session, User } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Linking from 'expo-linking';
import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { createSessionFromUrl, redirectTo, signInWithProvider } from '@/lib/auth/oauth';
import { hasSupabaseConfig } from '@/lib/env';
import { getSupabase } from '@/lib/supabase';

/** Actions return an error message rather than throwing, so screens can render it. */
export type AuthResult = { error: string | null };

/** Sign-up may complete without a session when email confirmation is on. */
export type SignUpResult = AuthResult & { needsEmailConfirmation: boolean };

interface SessionValue {
  session: Session | null;
  user: User | null;
  /** True until the stored session has been read back from disk. */
  isLoading: boolean;
  /**
   * Whether Supabase credentials are present at all. When false the app runs
   * unauthenticated rather than showing a sign-in screen that cannot succeed.
   */
  isConfigured: boolean;
  /** Set when a password-recovery link opened the app. */
  isRecovering: boolean;
  signIn(email: string, password: string): Promise<AuthResult>;
  signUp(email: string, password: string, displayName: string): Promise<SignUpResult>;
  signOut(): Promise<void>;
  sendPasswordReset(email: string): Promise<AuthResult>;
  updatePassword(password: string): Promise<AuthResult>;
  signInWithGoogle(): Promise<AuthResult>;
  signInWithApple(): Promise<AuthResult>;
}

const SessionContext = createContext<SessionValue | null>(null);

export function useSession(): SessionValue {
  const value = use(SessionContext);
  if (!value) {
    throw new Error('useSession must be used inside <SessionProvider>.');
  }
  return value;
}

/** Supabase error messages are terse and sometimes leak internals. */
function readableError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (/invalid login credentials/i.test(message)) {
    return 'That email and password combination did not match an account.';
  }
  if (/email not confirmed/i.test(message)) {
    return 'Check your inbox and confirm your email address first.';
  }
  if (/user already registered/i.test(message)) {
    return 'An account already exists for that email. Try signing in instead.';
  }
  if (/network|fetch/i.test(message)) {
    return 'Could not reach the server. Check your connection and try again.';
  }
  return message;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const isConfigured = hasSupabaseConfig();
  const [session, setSession] = useState<Session | null>(null);
  // Nothing to wait for when there is no backend — start ready.
  const [isLoading, setIsLoading] = useState(isConfigured);
  const [isRecovering, setIsRecovering] = useState(false);

  // A deep link is how OAuth and email links hand control back to the app.
  const url = Linking.useLinkingURL();

  useEffect(() => {
    if (!isConfigured) return;

    const supabase = getSupabase();
    let active = true;

    // Restores the persisted session on cold start.
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      setIsLoading(false);

      // Supabase reports a recovery link as a normal sign-in plus this event.
      // Without tracking it, the user lands on the dashboard and never gets
      // asked for the new password they came to set.
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovering(true);
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [isConfigured]);

  useEffect(() => {
    if (!url || !isConfigured) return;
    // Unrelated deep links resolve to null rather than throwing.
    void createSessionFromUrl(url).catch(() => undefined);
  }, [url, isConfigured]);

  const signIn = useCallback<SessionValue['signIn']>(async (email, password) => {
    try {
      const { error } = await getSupabase().auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      return { error: error ? readableError(error) : null };
    } catch (error) {
      return { error: readableError(error) };
    }
  }, []);

  const signUp = useCallback<SessionValue['signUp']>(async (email, password, displayName) => {
    try {
      const { data, error } = await getSupabase().auth.signUp({
        email: email.trim(),
        password,
        options: {
          // Read by the handle_new_user trigger to seed the profile row.
          data: { display_name: displayName.trim() },
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        return { error: readableError(error), needsEmailConfirmation: false };
      }

      // A user with no session means the project requires email confirmation.
      return { error: null, needsEmailConfirmation: Boolean(data.user) && !data.session };
    } catch (error) {
      return { error: readableError(error), needsEmailConfirmation: false };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!isConfigured) return;
    await getSupabase().auth.signOut();
    setIsRecovering(false);
  }, [isConfigured]);

  const sendPasswordReset = useCallback<SessionValue['sendPasswordReset']>(async (email) => {
    try {
      const { error } = await getSupabase().auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });
      return { error: error ? readableError(error) : null };
    } catch (error) {
      return { error: readableError(error) };
    }
  }, []);

  const updatePassword = useCallback<SessionValue['updatePassword']>(async (password) => {
    try {
      const { error } = await getSupabase().auth.updateUser({ password });
      if (!error) setIsRecovering(false);
      return { error: error ? readableError(error) : null };
    } catch (error) {
      return { error: readableError(error) };
    }
  }, []);

  const signInWithGoogle = useCallback<SessionValue['signInWithGoogle']>(async () => {
    try {
      await signInWithProvider('google');
      return { error: null };
    } catch (error) {
      return { error: readableError(error) };
    }
  }, []);

  const signInWithApple = useCallback<SessionValue['signInWithApple']>(async () => {
    try {
      // iOS gets the native sheet, which is an App Store requirement once any
      // other social login is offered. Everywhere else falls back to the web
      // flow, which Apple also supports.
      if (Platform.OS !== 'ios') {
        await signInWithProvider('apple');
        return { error: null };
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        return { error: 'Apple did not return an identity token.' };
      }

      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error) return { error: readableError(error) };

      // Apple sends the name on the FIRST sign-in only. Miss it here and it is
      // gone for good, so it is persisted immediately rather than later.
      if (credential.fullName?.givenName) {
        const fullName = [credential.fullName.givenName, credential.fullName.familyName]
          .filter(Boolean)
          .join(' ');
        await supabase.auth.updateUser({ data: { display_name: fullName } });
      }

      return { error: null };
    } catch (error) {
      // The user dismissing the sheet is a cancellation, not a failure.
      if (error instanceof Error && /ERR_REQUEST_CANCELED|canceled/i.test(error.message)) {
        return { error: null };
      }
      return { error: readableError(error) };
    }
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      isConfigured,
      isRecovering,
      signIn,
      signUp,
      signOut,
      sendPasswordReset,
      updatePassword,
      signInWithGoogle,
      signInWithApple,
    }),
    [
      session,
      isLoading,
      isConfigured,
      isRecovering,
      signIn,
      signUp,
      signOut,
      sendPasswordReset,
      updatePassword,
      signInWithGoogle,
      signInWithApple,
    ],
  );

  return <SessionContext value={value}>{children}</SessionContext>;
}
