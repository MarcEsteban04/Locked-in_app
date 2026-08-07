import { Link } from 'expo-router';
import { ArrowRight, ChevronRight, Flame, Palette, Sparkles, Target } from 'lucide-react-native';
import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card, PressableCard } from '@/components/ui/card';
import { IconBadge } from '@/components/ui/icon-badge';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { Stat } from '@/components/ui/stat';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme';

const QUICK_ACTIONS = [
  {
    icon: Sparkles,
    accent: 'support',
    title: 'Upload your first lecture',
    description: 'Turn a PDF or photo into a reviewer.',
  },
  {
    icon: Target,
    accent: 'highlight',
    title: 'Set an exam date',
    description: 'Get a study plan built around it.',
  },
] as const;

/**
 * Home is the dashboard skeleton. The layout and design language are real; the
 * numbers are placeholders until Sprint 5 wires the dashboard to Supabase.
 *
 * The screen is a stack of full-bleed colour blocks rather than one padded
 * column — sharp transitions between solid fills are what carry the "poster"
 * look the design system asks for.
 */
export default function HomeScreen() {
  const themeColors = useThemeColors();

  return (
    <Screen scroll tone="block">
      {/* Blue hero. The one full-strength block that owns the screen. */}
      <Section tone="brand" size="lg" decorated>
        <View className="gap-1">
          <Text variant="label" className="text-brand-on opacity-70">
            Welcome back
          </Text>
          <Text variant="display" className="text-brand-on">
            Locked In
          </Text>
          <Text variant="body" className="text-brand-on opacity-90">
            Upload. Learn. Ace every exam.
          </Text>
        </View>

        {/* Streak sits on a `surface` fill so it reads as a distinct object
            against the blue without needing a shadow to lift it. `surface`
            rather than a translucent white because it keeps `text-ink` legible
            in both colour schemes. */}
        <Card tone="surface" padding="sm" className="flex-row items-center gap-4">
          <IconBadge icon={Flame} accent="brand" size="md" />
          <View className="flex-1">
            <Text variant="label">Current streak</Text>
            <Text variant="title">0 days</Text>
          </View>
        </Card>
      </Section>

      {/* Stats break the blue with three different accents, per the design
          system's multi-colour stat rule. */}
      <Section tone="block" size="md">
        <View className="flex-row gap-3">
          <Stat value={0} label="Subjects" accent="support" />
          <Stat value={0} label="Uploads" accent="highlight" />
          <Stat value={0} label="Quizzes" accent="brand" />
        </View>
      </Section>

      <Section tone="canvas" size="md">
        <Text variant="heading">Get started</Text>

        <View className="gap-3">
          {QUICK_ACTIONS.map((action) => (
            <PressableCard key={action.title} tone="block" className="flex-row items-center gap-4">
              <IconBadge icon={action.icon} accent={action.accent} size="md" />
              <View className="flex-1 gap-0.5">
                <Text variant="subtitle">{action.title}</Text>
                <Text variant="muted">{action.description}</Text>
              </View>
              <ChevronRight size={20} strokeWidth={2.5} color={themeColors.inkSoft} />
            </PressableCard>
          ))}
        </View>
      </Section>

      {/* Dark slab closes the page — the design system's inverted footer
          section, and a hard stop against the canvas above it. */}
      <Section tone="slab" size="lg">
        <Badge label="Sprint 2" tone="brand" />
        <View className="gap-2">
          <Text variant="heading" className="text-slab-on">
            Backend is defined
          </Text>
          <Text variant="body" className="text-slab-on opacity-70">
            Schema, row level security and storage buckets are written and ready to apply. The
            numbers above stay at zero until accounts land in Sprint 3.
          </Text>
        </View>

        <Link href="/design-system" asChild>
          <PressableCard
            tone="brand"
            padding="none"
            className="h-14 flex-row items-center justify-between px-5">
            <View className="flex-row items-center gap-3">
              <Palette size={20} strokeWidth={2.5} color={themeColors.brandOn} />
              <Text variant="subtitle" className="text-brand-on">
                View design system
              </Text>
            </View>
            <ArrowRight size={20} strokeWidth={2.5} color={themeColors.brandOn} />
          </PressableCard>
        </Link>
      </Section>
    </Screen>
  );
}
