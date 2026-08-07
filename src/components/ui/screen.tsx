import { ScrollView, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/cn';

export interface ScreenProps extends ViewProps {
  /** Wraps content in a ScrollView. Off by default so lists can own scrolling. */
  scroll?: boolean;
  /** Page background. `block` gives white cards something to sit on. */
  tone?: 'canvas' | 'block';
  /** Removes the default horizontal gutter for edge-to-edge layouts. */
  bleed?: boolean;
  className?: string;
  contentClassName?: string;
}

/**
 * Page shell: safe-area top padding, page background, and the standard gutter.
 *
 * Bottom inset is deliberately not applied here — the custom tab bar owns it,
 * and applying it in both places double-pads every tab screen.
 */
export function Screen({
  scroll = false,
  tone = 'canvas',
  bleed = false,
  className,
  contentClassName,
  children,
  ...props
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const background = tone === 'block' ? 'bg-block' : 'bg-canvas';
  const gutter = bleed ? '' : 'px-6';

  if (scroll) {
    return (
      <View className={cn('flex-1', background, className)} {...props}>
        <ScrollView
          className="flex-1"
          contentContainerClassName={cn('gap-6 pb-10', gutter, contentClassName)}
          contentContainerStyle={{ paddingTop: insets.top + 16 }}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      className={cn('flex-1 gap-6', background, gutter, className)}
      style={{ paddingTop: insets.top + 16 }}
      {...props}>
      {children}
    </View>
  );
}
