import { ActivityIndicator, Pressable, View, type PressableProps } from 'react-native';

import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme';
import { cn } from '@/lib/cn';

/**
 * Container classes per variant. The design system gives feedback through
 * colour shift and scale only — `active:` here is the touch equivalent of the
 * doc's hover states, scaling *down* because that is what reads as a press on a
 * touch device.
 */
const container = {
  primary: 'bg-brand active:bg-blue-600',
  secondary: 'bg-block active:bg-block-strong',
  /** border-4 for boldness, per the design system's outline rule. */
  outline: 'border-4 border-brand bg-transparent active:bg-brand',
  danger: 'bg-danger active:bg-red-600',
} as const;

const label = {
  primary: 'text-brand-on',
  secondary: 'text-ink',
  outline: 'text-brand group-active:text-brand-on',
  danger: 'text-danger-on',
} as const;

/** Heights come from the doc's h-14/h-16 guidance — generous touch targets. */
const sizes = {
  sm: { container: 'h-11 px-4', text: 'text-[14px]' },
  md: { container: 'h-14 px-6', text: 'text-[15px]' },
  lg: { container: 'h-16 px-8', text: 'text-[17px]' },
} as const;

export type ButtonVariant = keyof typeof container;
export type ButtonSize = keyof typeof sizes;

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Rendered before the label — pass a lucide icon. */
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  fullWidth = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const themeColors = useThemeColors();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={cn(
        // `group` lets the outline variant recolour its label on press.
        'group flex-row items-center justify-center gap-2 rounded-md',
        // No shadow, ever — the Z-axis does not exist in this design system.
        'transition-all duration-200 active:scale-[0.97]',
        container[variant],
        sizes[size].container,
        fullWidth && 'w-full',
        isDisabled && 'opacity-40',
        className,
      )}
      {...props}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'primary' || variant === 'danger' ? themeColors.brandOn : themeColors.ink
          }
        />
      ) : (
        <>
          {icon ? <View className="shrink-0">{icon}</View> : null}
          <Text className={cn('font-semibold', label[variant], sizes[size].text)}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}
