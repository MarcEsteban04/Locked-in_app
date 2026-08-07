import { router } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
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

/** Swatch name paired with the class that fills it. */
const SWATCHES = [
  { name: 'brand', className: 'bg-brand' },
  { name: 'support', className: 'bg-support' },
  { name: 'highlight', className: 'bg-highlight' },
  { name: 'danger', className: 'bg-danger' },
  { name: 'ink', className: 'bg-ink' },
  { name: 'block', className: 'bg-block' },
  { name: 'brand-tint', className: 'bg-brand-tint' },
  { name: 'support-tint', className: 'bg-support-tint' },
  { name: 'highlight-tint', className: 'bg-highlight-tint' },
] as const;

/**
 * Living reference for the design system. It exists so Sprint 4 extends a set
 * of components that can be seen side by side rather than rediscovered, and so
 * dark mode regressions are obvious in one screen instead of five.
 */
export default function DesignSystemScreen() {
  const themeColors = useThemeColors();
  const [query, setQuery] = useState('');

  return (
    <Screen scroll tone="block">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 gap-2">
          <Text variant="label">Reference</Text>
          <Text variant="title">Design system</Text>
          <Text variant="muted">Flat, zero depth, hierarchy from scale and colour.</Text>
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

      <Card className="gap-4">
        <Text variant="heading">Colour</Text>
        <View className="flex-row flex-wrap gap-3">
          {SWATCHES.map((swatch) => (
            <View key={swatch.name} className="w-[30%] gap-2">
              <View className={cn('h-16 rounded-md', swatch.className)} />
              <Text variant="caption">{swatch.name}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card className="gap-4">
        <Text variant="heading">Type</Text>
        {TYPE_SCALE.map((variant) => (
          <View key={variant} className="gap-1">
            <Text variant="caption" className="text-ink-soft">
              {variant}
            </Text>
            <Text variant={variant}>Outfit renders this</Text>
          </View>
        ))}
      </Card>

      <Card className="gap-4">
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
      </Card>

      <Card className="gap-4">
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
      </Card>

      <Card className="gap-4">
        <Text variant="heading">Badges</Text>
        <View className="flex-row flex-wrap gap-2">
          <Badge label="Neutral" />
          <Badge label="Brand" tone="brand" />
          <Badge label="Support" tone="support" />
          <Badge label="Highlight" tone="highlight" />
          <Badge label="Danger" tone="danger" />
        </View>
      </Card>

      <Card className="gap-3">
        <Text variant="heading">Cards</Text>
        <Card tone="block" padding="sm">
          <Text variant="caption">tone=&quot;block&quot;</Text>
        </Card>
        <Card tone="brand" padding="sm">
          <Text variant="caption">tone=&quot;brand&quot;</Text>
        </Card>
        <Card tone="support" padding="sm">
          <Text variant="caption">tone=&quot;support&quot;</Text>
        </Card>
        <Card tone="highlight" padding="sm">
          <Text variant="caption">tone=&quot;highlight&quot;</Text>
        </Card>
      </Card>
    </Screen>
  );
}
