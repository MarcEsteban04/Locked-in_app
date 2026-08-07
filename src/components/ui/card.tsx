import { Pressable, View, type PressableProps, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';

/**
 * "Colour block" cards. Grouping is communicated by a solid fill — never by a
 * border or a shadow — so the tone you pick *is* the visual hierarchy.
 */
const tones = {
  /** Default card sitting on a `bg-block` page. */
  surface: 'bg-surface',
  /** Card sitting on a white page — the fill supplies the separation. */
  block: 'bg-block',
  brand: 'bg-brand-tint',
  support: 'bg-support-tint',
  highlight: 'bg-highlight-tint',
  danger: 'bg-danger-tint',
  /** Full-strength fill for a single hero card. Use sparingly. */
  brandSolid: 'bg-brand',
} as const;

const padding = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const;

export type CardTone = keyof typeof tones;
export type CardPadding = keyof typeof padding;

interface BaseProps {
  tone?: CardTone;
  padding?: CardPadding;
  className?: string;
}

export interface CardProps extends ViewProps, BaseProps {}

export function Card({ tone = 'surface', padding: pad = 'md', className, ...props }: CardProps) {
  return <View className={cn('rounded-lg', tones[tone], padding[pad], className)} {...props} />;
}

export interface PressableCardProps extends Omit<PressableProps, 'children'>, BaseProps {
  children?: React.ReactNode;
}

/**
 * Tappable variant. Kept separate rather than a prop on `Card` so a tappable
 * card always gets a button role and press feedback, and a static one never
 * accidentally advertises itself as interactive to a screen reader.
 */
export function PressableCard({
  tone = 'surface',
  padding: pad = 'md',
  className,
  children,
  ...props
}: PressableCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        'group rounded-lg transition-all duration-200 active:scale-[0.98]',
        tones[tone],
        padding[pad],
        className,
      )}
      {...props}>
      {children}
    </Pressable>
  );
}
