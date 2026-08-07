import { Stack } from 'expo-router';

/**
 * Signed-out routes. Headers are off because each screen draws its own brand
 * block instead — a native header bar would be the one piece of chrome in an
 * otherwise chrome-less design.
 */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
