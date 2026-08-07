import { ScrollView, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_BAR_HEIGHT } from '@/components/navigation/tab-bar';
import { cn } from '@/lib/cn';

export interface ScreenProps extends ViewProps {
  /** Wraps content in a ScrollView. Off by default so lists can own scrolling. */
  scroll?: boolean;
  /** Page background behind the sections. */
  tone?: 'canvas' | 'block';
  /**
   * Applies the standard horizontal gutter to children. Leave off when the
   * screen is built from <Section> blocks, which run full-bleed and carry
   * their own gutter.
   */
  gutter?: boolean;
  /** Reserves room under the content so the tab bar never covers the last item. */
  tabBarInset?: boolean;
  className?: string;
  contentClassName?: string;
}

/**
 * Page shell: page background, safe-area top padding, and scroll behaviour.
 *
 * Note the deliberate split between `contentContainerStyle` and the inner
 * View's className. NativeWind maps `contentContainerClassName` onto
 * `contentContainerStyle`, so passing BOTH silently drops every class — the
 * explicit prop wins and the class-derived padding vanishes. Keeping the
 * dynamic inset on the ScrollView and every static style on an inner View
 * means the two can never collide.
 */
export function Screen({
  scroll = false,
  tone = 'canvas',
  gutter = false,
  tabBarInset = true,
  className,
  contentClassName,
  children,
  ...props
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const background = tone === 'block' ? 'bg-block' : 'bg-canvas';
  const padding = {
    paddingTop: insets.top,
    paddingBottom: tabBarInset ? TAB_BAR_HEIGHT + insets.bottom : insets.bottom,
  };

  const content = (
    <View className={cn(gutter && 'gap-6 px-6', contentClassName)} style={padding}>
      {children}
    </View>
  );

  if (scroll) {
    return (
      <View className={cn('flex-1', background, className)} {...props}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className={cn('flex-1', background, className)} {...props}>
      {content}
    </View>
  );
}
