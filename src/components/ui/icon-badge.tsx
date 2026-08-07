import { type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { colors, type ColorScheme } from '@/constants/theme';
import { useScheme } from '@/hooks/use-theme';
import { cn } from '@/lib/cn';

/**
 * The design system's icon treatment: a solid circle with a contrasting icon.
 * Centralised here so the fill/icon pairing is decided once — getting it wrong
 * is the fastest way to produce a low-contrast icon nobody can see in one of
 * the two colour schemes.
 */
const accents = {
  brand: { fill: 'bg-brand', on: 'brandOn', solid: 'brand' },
  support: { fill: 'bg-support', on: 'supportOn', solid: 'support' },
  highlight: { fill: 'bg-highlight', on: 'highlightOn', solid: 'highlight' },
  danger: { fill: 'bg-danger', on: 'dangerOn', solid: 'danger' },
  ink: { fill: 'bg-ink', on: 'canvas', solid: 'ink' },
} as const;

const sizes = {
  sm: { container: 'h-11 w-11', icon: 18 },
  md: { container: 'h-14 w-14', icon: 24 },
  lg: { container: 'h-16 w-16', icon: 28 },
} as const;

export type IconBadgeAccent = keyof typeof accents;
export type IconBadgeSize = keyof typeof sizes;

export interface IconBadgeProps {
  icon: LucideIcon;
  accent?: IconBadgeAccent;
  size?: IconBadgeSize;
  /**
   * `solid` fills the circle with the accent. `inverse` is the design system's
   * canonical pairing — a light circle carrying a coloured icon — which is what
   * you want on top of a full-strength colour block.
   */
  variant?: 'solid' | 'inverse';
  className?: string;
}

export function IconBadge({
  icon: Icon,
  accent = 'brand',
  size = 'md',
  variant = 'solid',
  className,
}: IconBadgeProps) {
  const scheme: ColorScheme = useScheme();
  const config = accents[accent];
  const palette = colors[scheme];

  const fill = variant === 'solid' ? config.fill : 'bg-surface';
  const iconColor =
    variant === 'solid' ? palette[config.on as keyof typeof palette] : palette[config.solid];

  return (
    <View
      className={cn(
        'shrink-0 items-center justify-center rounded-full',
        fill,
        sizes[size].container,
        className,
      )}>
      <Icon size={sizes[size].icon} strokeWidth={2.5} color={iconColor} />
    </View>
  );
}
