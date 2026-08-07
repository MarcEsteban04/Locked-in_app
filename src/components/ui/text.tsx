import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/lib/cn';

/**
 * Typography scale. The design system puts hierarchy entirely on size and
 * weight — there are no rules, shadows or boxes doing that work — so these
 * variants are the only sanctioned way to size text.
 */
const variants = {
  /** Screen-owning statement type. One per screen, at most. */
  display: 'font-extrabold text-[40px] leading-[42px] tracking-[-0.8px] text-ink',
  /** Screen title. */
  title: 'font-bold text-[28px] leading-[32px] tracking-[-0.5px] text-ink',
  /** Section heading inside a screen. */
  heading: 'font-bold text-[20px] leading-[24px] tracking-[-0.3px] text-ink',
  /** Card titles and list rows. */
  subtitle: 'font-semibold text-[16px] leading-[22px] text-ink',
  /** Default running text. */
  body: 'font-regular text-[15px] leading-[22px] text-ink',
  /** Supporting copy under a heading or inside a card. */
  muted: 'font-regular text-[14px] leading-[20px] text-ink-soft',
  /** Uppercase eyebrow labels — the design system's "tracking-wider" label. */
  label: 'font-semibold text-[12px] leading-[16px] uppercase tracking-[1.2px] text-ink-soft',
  /** Smallest supporting text. */
  caption: 'font-medium text-[12px] leading-[16px] text-ink-soft',
} as const;

export type TextVariant = keyof typeof variants;

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  className?: string;
}

export function Text({ variant = 'body', className, ...props }: TextProps) {
  return <RNText className={cn(variants[variant], className)} {...props} />;
}
