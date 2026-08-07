import { View, type ViewProps } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/cn';

/**
 * Tags are the one element the design system allows to be fully rounded.
 */
const tones = {
  neutral: { container: 'bg-block', text: 'text-ink' },
  brand: { container: 'bg-brand', text: 'text-brand-on' },
  support: { container: 'bg-support', text: 'text-support-on' },
  highlight: { container: 'bg-highlight', text: 'text-highlight-on' },
  danger: { container: 'bg-danger', text: 'text-danger-on' },
} as const;

export type BadgeTone = keyof typeof tones;

export interface BadgeProps extends ViewProps {
  label: string;
  tone?: BadgeTone;
  className?: string;
}

export function Badge({ label, tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <View
      className={cn('self-start rounded-full px-3 py-1', tones[tone].container, className)}
      {...props}>
      <Text variant="label" className={cn('text-[11px] tracking-[0.8px]', tones[tone].text)}>
        {label}
      </Text>
    </View>
  );
}
