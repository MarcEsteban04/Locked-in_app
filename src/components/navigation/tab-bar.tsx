import { Tabs } from 'expo-router';
import {
  ChartColumn,
  House,
  Layers,
  Upload,
  UserRound,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme';
import { cn } from '@/lib/cn';

/**
 * `BottomTabBarProps` is not re-exported from the expo-router root, so the type
 * is pulled off the `Tabs` component itself. That keeps it correct across
 * expo-router upgrades without importing from a build path.
 */
type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

/**
 * Icon and label per route. Keyed by route name so the order here does not have
 * to match the order the navigator reports.
 */
const TABS: Record<string, { label: string; icon: LucideIcon }> = {
  index: { label: 'Home', icon: House },
  subjects: { label: 'Subjects', icon: Layers },
  upload: { label: 'Upload', icon: Upload },
  progress: { label: 'Progress', icon: ChartColumn },
  profile: { label: 'Profile', icon: UserRound },
};

/**
 * Flat tab bar.
 *
 * Separation from the page comes from a solid fill rather than a hairline
 * border or a shadow, and the active tab is a solid colour block rather than an
 * underline — "colour as structure", per the design system.
 */
export function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const themeColors = useThemeColors();

  return (
    <View
      className="flex-row items-stretch gap-1 bg-block px-3 pt-3"
      style={{ paddingBottom: insets.bottom + 12 }}>
      {state.routes.map((route, index) => {
        const tab = TABS[route.name];
        if (!tab) return null;

        const focused = state.index === index;
        const Icon = tab.icon;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={tab.label}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            onLongPress={() => {
              navigation.emit({ type: 'tabLongPress', target: route.key });
            }}
            className={cn(
              'flex-1 items-center gap-1 rounded-md py-2 transition-all duration-200',
              focused ? 'bg-brand' : 'bg-transparent active:bg-block-strong',
            )}>
            <Icon
              size={22}
              // Stroke weight carries the emphasis, since there is no shadow to do it.
              strokeWidth={focused ? 2.5 : 2}
              color={focused ? themeColors.brandOn : themeColors.inkSoft}
            />
            <Text
              variant="caption"
              numberOfLines={1}
              className={cn(
                'text-[11px]',
                focused ? 'font-semibold text-brand-on' : 'text-ink-soft',
              )}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
