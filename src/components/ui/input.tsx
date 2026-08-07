import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme';
import { cn } from '@/lib/cn';

export interface InputProps extends Omit<TextInputProps, 'className'> {
  label?: string;
  /** Replaces the hint and switches the field to its error styling. */
  error?: string;
  hint?: string;
  /** Rendered inside the field, before the text — pass a lucide icon. */
  icon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

/**
 * Focus is expressed as a hard 2px border plus a background flip to the canvas
 * colour, per the design system. There is deliberately no glow or focus ring
 * shadow — those would reintroduce depth.
 *
 * Focus state is tracked in React rather than via a `focus:` class because
 * React Native has no CSS focus pseudo-class on TextInput, and the border needs
 * to be reserved in the unfocused state too so the field doesn't shift by 2px
 * when it gains focus.
 */
export function Input({
  label,
  error,
  hint,
  icon,
  className,
  containerClassName,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const themeColors = useThemeColors();
  const invalid = Boolean(error);

  return (
    <View className={cn('gap-2', containerClassName)}>
      {label ? <Text variant="label">{label}</Text> : null}

      <View
        className={cn(
          'h-14 flex-row items-center gap-3 rounded-md border-2 px-4',
          focused ? 'border-brand bg-canvas' : 'border-transparent bg-block',
          invalid && 'border-danger bg-danger-tint',
        )}>
        {icon ? <View className="shrink-0">{icon}</View> : null}

        <TextInput
          placeholderTextColor={themeColors.inkSoft}
          accessibilityLabel={label}
          // React Native has no aria-invalid, so the error is announced as a hint.
          accessibilityHint={error ?? hint}
          className={cn('h-full flex-1 font-regular text-[15px] text-ink', className)}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
      </View>

      {error ? (
        <Text variant="caption" className="text-danger">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption">{hint}</Text>
      ) : null}
    </View>
  );
}
