import { useColorScheme } from 'react-native';

import { colors, type ColorScheme } from '@/constants/theme';

/**
 * Resolved colour scheme, defaulting to light when the OS reports no preference.
 */
export function useScheme(): ColorScheme {
  return useColorScheme() === 'dark' ? 'dark' : 'light';
}

/**
 * Raw token values for the active scheme.
 *
 * Only reach for this when an API refuses a `className` — status bar style,
 * React Navigation's theme, SVG icon colours. Styling a View or Text this way
 * bypasses the design system and will drift.
 */
export function useThemeColors() {
  return colors[useScheme()];
}
