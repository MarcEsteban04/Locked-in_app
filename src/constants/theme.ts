/**
 * TypeScript mirror of the design tokens in src/global.css.
 *
 * src/global.css is the source of truth — style with `className` wherever you
 * can. This mirror exists only for the handful of APIs that take a raw colour
 * and cannot take a class: the status bar, React Navigation's theme, and SVG
 * icon props.
 *
 * If you change a value here, change it in src/global.css too.
 */

export const colors = {
  light: {
    canvas: '#ffffff',
    ink: '#111827',
    inkSoft: '#6b7280',

    brand: '#3b82f6',
    brandOn: '#ffffff',
    brandTint: '#eff6ff',

    support: '#10b981',
    supportOn: '#ffffff',
    supportTint: '#ecfdf5',

    highlight: '#f59e0b',
    highlightOn: '#111827',
    highlightTint: '#fffbeb',

    danger: '#ef4444',
    dangerOn: '#ffffff',
    dangerTint: '#fef2f2',

    block: '#f3f4f6',
    blockStrong: '#e5e7eb',
    edge: '#e5e7eb',
    surface: '#ffffff',
  },
  dark: {
    canvas: '#030712',
    ink: '#f9fafb',
    inkSoft: '#9ca3af',

    brand: '#3b82f6',
    brandOn: '#ffffff',
    brandTint: '#172554',

    support: '#10b981',
    supportOn: '#022c22',
    supportTint: '#022c22',

    highlight: '#f59e0b',
    highlightOn: '#111827',
    highlightTint: '#451a03',

    danger: '#f87171',
    dangerOn: '#450a0a',
    dangerTint: '#450a0a',

    block: '#111827',
    blockStrong: '#1f2937',
    edge: '#1f2937',
    surface: '#111827',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type ColorToken = keyof (typeof colors)['light'];

/**
 * Font family per weight. React Native cannot synthesise a bold face from a
 * regular one, so weight is selected by family name rather than fontWeight.
 * These keys must match what `useFonts` registers in src/app/_layout.tsx and
 * the `--font-*` tokens in src/global.css.
 */
export const fonts = {
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semibold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
  extrabold: 'Outfit_800ExtraBold',
} as const;

export type FontWeightName = keyof typeof fonts;

/** Matches --radius-* in src/global.css. */
export const radius = { md: 6, lg: 8, xl: 12 } as const;
