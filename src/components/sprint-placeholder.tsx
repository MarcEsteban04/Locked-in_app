import { type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { IconBadge, type IconBadgeAccent } from '@/components/ui/icon-badge';
import { Section, type SectionTone } from '@/components/ui/section';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/cn';

export interface SprintPlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Which roadmap sprint fills this screen in, from docs/project_development.md. */
  sprint: string;
  /** What the screen will do, as a short list. Keeps an empty tab informative. */
  bullets?: readonly string[];
  accent?: IconBadgeAccent;
  tone?: SectionTone;
}

/**
 * Stand-in for a screen the navigation skeleton reaches but a later sprint
 * builds. It names the owning sprint and lists what is coming, so an empty tab
 * reads as planned scope rather than something broken or forgotten.
 */
export function SprintPlaceholder({
  icon,
  title,
  description,
  sprint,
  bullets = [],
  accent = 'brand',
  tone = 'canvas',
}: SprintPlaceholderProps) {
  const onSlab = tone === 'slab';

  return (
    <Section tone={tone} size="lg">
      <IconBadge icon={icon} accent={accent} size="lg" />

      <View className="gap-2">
        <Text variant="title" className={cn(onSlab && 'text-slab-on')}>
          {title}
        </Text>
        <Text variant="body" className={cn('opacity-70', onSlab && 'text-slab-on')}>
          {description}
        </Text>
      </View>

      {bullets.length > 0 ? (
        <View className="gap-3">
          {bullets.map((bullet) => (
            <View key={bullet} className="flex-row items-center gap-3">
              {/* A solid square, not a bullet glyph — geometry over typography
                  for list markers keeps the grid reading as deliberate. */}
              <View className="h-2 w-2 rounded-[2px] bg-brand" />
              <Text variant="body" className={cn('flex-1', onSlab && 'text-slab-on')}>
                {bullet}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <Badge label={sprint} tone="highlight" />
    </Section>
  );
}
