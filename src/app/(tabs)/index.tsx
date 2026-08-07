import { Link } from 'expo-router';
import { ChevronRight, Flame, Sparkles, Target } from 'lucide-react-native';
import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, PressableCard } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme';

/**
 * Home is the dashboard skeleton. The layout and design language are real; the
 * numbers are placeholders until Sprint 5 wires the dashboard to Supabase.
 */
export default function HomeScreen() {
  const themeColors = useThemeColors();

  return (
    <Screen scroll tone="block">
      <View className="gap-2">
        <Text variant="label">Welcome back</Text>
        <Text variant="display">Locked In</Text>
        <Text variant="muted">Upload. Learn. Ace every exam.</Text>
      </View>

      {/* Hero block — the one full-strength colour block on the screen. */}
      <Card tone="brandSolid" padding="lg" className="gap-4">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-brand-on">
            <Flame size={24} strokeWidth={2.5} color={themeColors.brand} />
          </View>
          <View className="flex-1">
            <Text variant="label" className="text-brand-on opacity-80">
              Current streak
            </Text>
            <Text variant="title" className="text-brand-on">
              0 days
            </Text>
          </View>
        </View>
        <Text variant="body" className="text-brand-on opacity-90">
          Streaks start counting once study sessions are tracked in Sprint 17.
        </Text>
      </Card>

      {/* Stat row — each stat takes a different accent, per the design system. */}
      <View className="flex-row gap-3">
        <Card tone="support" padding="sm" className="flex-1 gap-1">
          <Text variant="title" className="text-support">
            0
          </Text>
          <Text variant="caption">Subjects</Text>
        </Card>
        <Card tone="highlight" padding="sm" className="flex-1 gap-1">
          <Text variant="title" className="text-highlight">
            0
          </Text>
          <Text variant="caption">Uploads</Text>
        </Card>
        <Card tone="brand" padding="sm" className="flex-1 gap-1">
          <Text variant="title" className="text-brand">
            0
          </Text>
          <Text variant="caption">Quizzes</Text>
        </Card>
      </View>

      <View className="gap-3">
        <Text variant="heading">Get started</Text>

        <PressableCard className="flex-row items-center gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-support-tint">
            <Sparkles size={24} strokeWidth={2.5} color={themeColors.support} />
          </View>
          <View className="flex-1 gap-1">
            <Text variant="subtitle">Upload your first lecture</Text>
            <Text variant="muted">Turn a PDF or photo into a reviewer.</Text>
          </View>
          <ChevronRight size={20} strokeWidth={2.5} color={themeColors.inkSoft} />
        </PressableCard>

        <PressableCard className="flex-row items-center gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-highlight-tint">
            <Target size={24} strokeWidth={2.5} color={themeColors.highlight} />
          </View>
          <View className="flex-1 gap-1">
            <Text variant="subtitle">Set an exam date</Text>
            <Text variant="muted">Get a study plan built around it.</Text>
          </View>
          <ChevronRight size={20} strokeWidth={2.5} color={themeColors.inkSoft} />
        </PressableCard>
      </View>

      <Card className="gap-4">
        <Badge label="Sprint 1" tone="brand" />
        <Text variant="subtitle">Foundation is in place</Text>
        <Text variant="muted">
          Navigation, theming, light and dark mode, and the first reusable components are wired up.
          Everything above is a skeleton until the backend lands in Sprint 2.
        </Text>
        <Link href="/design-system" asChild>
          <Button title="View design system" variant="outline" fullWidth />
        </Link>
      </Card>
    </Screen>
  );
}
