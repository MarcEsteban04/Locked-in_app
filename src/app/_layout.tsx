import '@/global.css';

import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/outfit';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import { useScheme } from '@/hooks/use-theme';
import { SessionProvider, useSession } from '@/lib/auth/session';

SplashScreen.preventAutoHideAsync();

/**
 * Route guards.
 *
 * `Stack.Protected` swaps which group is mounted instead of redirecting after
 * the fact, so a signed-out user never briefly renders a dashboard.
 *
 * Note the `!isConfigured` escape hatch: with no Supabase credentials the app
 * runs unauthenticated rather than parking the user on a sign-in screen that
 * cannot possibly succeed. Profile shows a card explaining the state. Fill in
 * .env.local and the gate turns itself on.
 */
function RootNavigator() {
  const { session, isLoading, isConfigured, isRecovering } = useSession();

  useEffect(() => {
    if (!isLoading) {
      void SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // Holding on the splash avoids a flash of the sign-in screen while the
  // persisted session is still being read off disk.
  if (isLoading) return null;

  const signedIn = Boolean(session) || !isConfigured;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={signedIn && !isRecovering}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="design-system" options={{ presentation: 'modal' }} />
      </Stack.Protected>

      {/* A recovery link signs the user in, so this is gated on the recovery
          flag rather than on the absence of a session. */}
      <Stack.Protected guard={signedIn && isRecovering}>
        <Stack.Screen name="reset-password" />
      </Stack.Protected>

      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const scheme = useScheme();

  /**
   * Weight is selected by font family rather than fontWeight, so every weight
   * the design system uses has to be registered here. The keys must match the
   * `--font-*` tokens in src/global.css and `fonts` in src/constants/theme.ts.
   */
  const [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  // Render nothing rather than the wrong typeface. A missing font falls through
  // on error so a font CDN failure cannot brick the app.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  /**
   * React Navigation paints the screen background during transitions, so it
   * needs the raw token values rather than a class.
   */
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors[scheme].canvas,
      card: colors[scheme].block,
      text: colors[scheme].ink,
      border: colors[scheme].edge,
      primary: colors[scheme].brand,
    },
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <SessionProvider>
          <RootNavigator />
        </SessionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
