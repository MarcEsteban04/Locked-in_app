import Constants from 'expo-constants';
import { Link } from 'expo-router';
import { Moon, Palette, Sun, UserRound } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useScheme, useThemeColors } from '@/hooks/use-theme';

export default function ProfileScreen() {
  const scheme = useScheme();
  const themeColors = useThemeColors();
  const SchemeIcon = scheme === 'dark' ? Moon : Sun;

  return (
    <Screen scroll tone="block">
      <Text variant="title">Profile</Text>

      <Card className="flex-row items-center gap-4">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-block">
          <UserRound size={28} strokeWidth={2.5} color={themeColors.inkSoft} />
        </View>
        <View className="flex-1 gap-1">
          <Text variant="subtitle">Not signed in</Text>
          <Text variant="muted">Accounts arrive in Sprint 3.</Text>
        </View>
      </Card>

      <Card className="gap-4">
        <View className="flex-row items-center gap-3">
          <SchemeIcon size={20} strokeWidth={2.5} color={themeColors.ink} />
          <View className="flex-1">
            <Text variant="subtitle">Appearance</Text>
            <Text variant="muted">
              Following your device — currently {scheme}. Change it in system settings to see the
              app repaint.
            </Text>
          </View>
        </View>
      </Card>

      <Card className="gap-4">
        <View className="flex-row items-center gap-3">
          <Palette size={20} strokeWidth={2.5} color={themeColors.ink} />
          <View className="flex-1">
            <Text variant="subtitle">Design system</Text>
            <Text variant="muted">Every token and component in one place.</Text>
          </View>
        </View>
        <Link href="/design-system" asChild>
          <Button title="Open" variant="secondary" fullWidth />
        </Link>
      </Card>

      <Text variant="caption" className="text-center">
        Locked In v{Constants.expoConfig?.version ?? '1.0.0'}
      </Text>
    </Screen>
  );
}
