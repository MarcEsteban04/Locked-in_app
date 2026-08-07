import { type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme';

export interface SprintPlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Which roadmap sprint fills this screen in, from docs/project_development.md. */
  sprint: string;
}

/**
 * Stand-in for a screen the navigation skeleton reaches but a later sprint
 * builds. It states which sprint owns the screen so an empty tab reads as
 * planned scope rather than something broken or forgotten.
 */
export function SprintPlaceholder({
  icon: Icon,
  title,
  description,
  sprint,
}: SprintPlaceholderProps) {
  const themeColors = useThemeColors();

  return (
    <View className="flex-1 items-center justify-center gap-5 py-16">
      {/* Icon in a solid colour block — the design system's circle treatment. */}
      <View className="h-16 w-16 items-center justify-center rounded-full bg-brand">
        <Icon size={28} strokeWidth={2.5} color={themeColors.brandOn} />
      </View>

      <View className="items-center gap-2">
        <Text variant="heading">{title}</Text>
        <Text variant="muted" className="max-w-[280px] text-center">
          {description}
        </Text>
      </View>

      <Badge label={sprint} tone="highlight" />
    </View>
  );
}
