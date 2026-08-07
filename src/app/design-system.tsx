import { router } from 'expo-router';
import { Flame, Search, Sparkles, Target, X } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, type CardTone } from '@/components/ui/card';
import { IconBadge } from '@/components/ui/icon-badge';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { Stat } from '@/components/ui/stat';
import { Text, type TextVariant } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme';
import { cn } from '@/lib/cn';

const TYPE_SCALE: TextVariant[] = [
  'display',
  'title',
  'heading',
  'subtitle',
  'body',
  'muted',
  'label',
  'caption',
];

const SWATCHES = [
  { name: 'brand', className: 'bg-brand' },
  { name: 'support', className: 'bg-support' },
  { name: 'highlight', className: 'bg-highlight' },
  { name: 'danger', className: 'bg-danger' },
  { name: 'ink', className: 'bg-ink' },
  { name: 'slab', className: 'bg-slab' },
  { name: 'canvas', className: 'bg-canvas' },
  { name: 'block', className: 'bg-block' },
  { name: 'surface', className: 'bg-surface' },
  { name: 'brand-tint', className: 'bg-brand-tint' },
  { name: 'support-tint', className: 'bg-support-tint' },
  { name: 'highlight-tint', className: 'bg-highlight-tint' },
] as const;

const CARD_TONES: CardTone[] = [
  'surface',
  'block',
  'brandSoft',
  'supportSoft',
  'highlightSoft',
  'brand',
  'support',
  'highlight',
  'slab',
];

/**
 * Living reference for the design system. It exists so Sprint 4 extends a set
 * of components that can be seen side by side rather than rediscovered, and so
 * dark mode regressions are obvious in one screen instead of five.
 */
export default function DesignSystemScreen() {
  const themeColors = useThemeColors();
  const [query, setQuery] = useState('');

  return (
    <Screen scroll tone="block" tabBarInset={false}>
      <Section tone="slab" size="lg" decorated>
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1 gap-1">
            <Text variant="label" className="text-slab-on opacity-70">
              Reference
            </Text>
            <Text variant="title" className="text-slab-on">
              Design system
            </Text>
            <Text variant="body" className="text-slab-on opacity-80">
              Flat, zero depth. Hierarchy from scale and colour.
            </Text>
          </View>
          <Button
            title=""
            variant="secondary"
            size="sm"
            accessibilityLabel="Close"
            className="w-11 px-0"
            icon={<X size={20} strokeWidth={2.5} color={themeColors.ink} />}
            onPress={() => router.back()}
          />
        </View>
      </Section>

      <Section tone="canvas" size="md">
        <Text variant="heading">Colour</Text>
        <View className="flex-row flex-wrap gap-3">
          {SWATCHES.map((swatch) => (
            <View key={swatch.name} className="w-[30%] gap-2">
              <View className={cn('h-16 rounded-md', swatch.className)} />
              <Text variant="caption">{swatch.name}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section tone="block" size="md">
        <Text variant="heading">Stats</Text>
        <View className="flex-row gap-3">
          <Stat value={12} label="Subjects" accent="brand" />
          <Stat value={48} label="Uploads" accent="support" />
          <Stat value="92%" label="Accuracy" accent="highlight" />
        </View>
      </Section>

      <Section tone="canvas" size="md">
        <Text variant="heading">Icon badges</Text>
        <View className="flex-row items-center gap-3">
          <IconBadge icon={Flame} accent="brand" size="lg" />
          <IconBadge icon={Sparkles} accent="support" size="md" />
          <IconBadge icon={Target} accent="highlight" size="md" />
          <IconBadge icon={Flame} accent="ink" size="sm" />
        </View>
      </Section>

      <Section tone="block" size="md">
        <Text variant="heading">Type</Text>
        {TYPE_SCALE.map((variant) => (
          <View key={variant} className="gap-1">
            <Text variant="caption">{variant}</Text>
            <Text variant={variant}>Outfit renders this</Text>
          </View>
        ))}
      </Section>

      <Section tone="canvas" size="md">
        <Text variant="heading">Buttons</Text>
        <Button title="Primary" fullWidth />
        <Button title="Secondary" variant="secondary" fullWidth />
        <Button title="Outline" variant="outline" fullWidth />
        <Button title="Danger" variant="danger" fullWidth />
        <Button title="Loading" loading fullWidth />
        <Button title="Disabled" disabled fullWidth />
        <View className="flex-row items-center gap-3">
          <Button title="Small" size="sm" />
          <Button title="Large" size="lg" />
        </View>
      </Section>

      <Section tone="block" size="md">
        <Text variant="heading">Inputs</Text>
        <Input
          label="Search"
          placeholder="Photosynthesis"
          value={query}
          onChangeText={setQuery}
          icon={<Search size={18} strokeWidth={2.5} color={themeColors.inkSoft} />}
          hint="Focus the field to see the hard 2px border."
        />
        <Input label="With an error" placeholder="you@school.edu" error="That email looks wrong." />
      </Section>

      <Section tone="canvas" size="md">
        <Text variant="heading">Badges</Text>
        <View className="flex-row flex-wrap gap-2">
          <Badge label="Neutral" />
          <Badge label="Brand" tone="brand" />
          <Badge label="Support" tone="support" />
          <Badge label="Highlight" tone="highlight" />
          <Badge label="Danger" tone="danger" />
        </View>
      </Section>

      <Section tone="block" size="md">
        <Text variant="heading">Card tones</Text>
        {CARD_TONES.map((tone) => (
          <Card key={tone} tone={tone} padding="sm">
            <Text
              variant="caption"
              className={cn(
                tone === 'brand' && 'text-brand-on',
                tone === 'support' && 'text-support-on',
                tone === 'highlight' && 'text-highlight-on',
                tone === 'slab' && 'text-slab-on',
              )}>
              {tone}
            </Text>
          </Card>
        ))}
      </Section>

      <Section tone="brand" size="lg" decorated>
        <Text variant="label" className="text-brand-on opacity-70">
          Section tones
        </Text>
        <Text variant="title" className="text-brand-on">
          Full-bleed colour blocks
        </Text>
        <Text variant="body" className="text-brand-on opacity-90">
          Sections run edge to edge with sharp transitions. The fill separates one from the next —
          never a rule or a shadow.
        </Text>
      </Section>

      <Section tone="support" size="md">
        <Text variant="subtitle" className="text-support-on">
          support
        </Text>
      </Section>

      <Section tone="highlight" size="md">
        <Text variant="subtitle" className="text-highlight-on">
          highlight
        </Text>
      </Section>

      <Section tone="slab" size="md">
        <Text variant="subtitle" className="text-slab-on">
          slab
        </Text>
      </Section>
    </Screen>
  );
}
