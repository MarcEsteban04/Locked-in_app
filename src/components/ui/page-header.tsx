import { View } from 'react-native';

import { Section, type SectionTone } from '@/components/ui/section';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/cn';

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: SectionTone;
}

/**
 * The standard top block of a screen. Centralised so every tab opens with the
 * same eyebrow/title/description rhythm — consistency across screens is what
 * makes a flat, chrome-less interface feel designed rather than plain.
 */
export function PageHeader({ eyebrow, title, description, tone = 'slab' }: PageHeaderProps) {
  const onDark = tone === 'slab' || tone === 'brand' || tone === 'support';
  const inverted = tone === 'slab' ? 'text-slab-on' : tone === 'brand' ? 'text-brand-on' : '';

  return (
    <Section tone={tone} size="lg" decorated>
      {/* Tight internal rhythm — the three lines are one unit, so they group
          closer than Section's default gap between blocks. */}
      <View className="gap-1">
        {eyebrow ? (
          <Text variant="label" className={cn(inverted, onDark && 'opacity-70')}>
            {eyebrow}
          </Text>
        ) : null}

        <Text variant="title" className={cn('text-[32px] leading-[36px]', inverted)}>
          {title}
        </Text>

        {description ? (
          <Text variant="body" className={cn(inverted, onDark && 'opacity-80')}>
            {description}
          </Text>
        ) : null}
      </View>
    </Section>
  );
}
