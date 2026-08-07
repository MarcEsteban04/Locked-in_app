import { View, type ViewProps } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/cn';

/**
 * Full-strength accent fills rather than soft tints. The design system calls
 * for "multi-colour stat numbers" and vibrant blocks; tinted backgrounds go
 * muddy in dark mode and flatten the contrast between adjacent tiles.
 */
const accents = {
  brand: 'bg-brand',
  support: 'bg-support',
  highlight: 'bg-highlight',
  danger: 'bg-danger',
} as const;

const foreground = {
  brand: 'text-brand-on',
  support: 'text-support-on',
  highlight: 'text-highlight-on',
  danger: 'text-danger-on',
} as const;

export type StatAccent = keyof typeof accents;

export interface StatProps extends ViewProps {
  value: string | number;
  label: string;
  accent?: StatAccent;
  className?: string;
}

export function Stat({ value, label, accent = 'brand', className, ...props }: StatProps) {
  return (
    <View className={cn('flex-1 gap-1 rounded-lg p-4', accents[accent], className)} {...props}>
      <Text variant="title" className={cn('text-[30px] leading-[34px]', foreground[accent])}>
        {value}
      </Text>
      <Text variant="caption" className={cn('opacity-80', foreground[accent])}>
        {label}
      </Text>
    </View>
  );
}
