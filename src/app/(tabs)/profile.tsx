import Constants from 'expo-constants';
import { Link } from 'expo-router';
import {
  ChevronRight,
  Database,
  LogOut,
  Moon,
  Palette,
  PlugZap,
  Sun,
  UserRound,
} from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, PressableCard } from '@/components/ui/card';
import { IconBadge } from '@/components/ui/icon-badge';
import { PageHeader } from '@/components/ui/page-header';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { Text } from '@/components/ui/text';
import { useScheme, useThemeColors } from '@/hooks/use-theme';
import { useSession } from '@/lib/auth/session';
import { hasSupabaseConfig } from '@/lib/env';

export default function ProfileScreen() {
  const scheme = useScheme();
  const themeColors = useThemeColors();
  const { user, isConfigured, signOut } = useSession();
  const SchemeIcon = scheme === 'dark' ? Moon : Sun;
  const backendReady = hasSupabaseConfig();

  // `display_name` is set by the sign-up form and by the Apple flow; falling
  // back to the email local part beats showing an empty row.
  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.split('@')[0] ??
    'Not signed in';

  return (
    <Screen scroll tone="block">
      <PageHeader eyebrow="Account" title="Profile" />

      <Section tone="block" size="md">
        <Card className="flex-row items-center gap-4">
          <IconBadge icon={UserRound} accent="ink" size="lg" />
          <View className="flex-1 gap-0.5">
            <Text variant="subtitle">{displayName}</Text>
            <Text variant="muted">{user?.email ?? 'Running without an account.'}</Text>
          </View>
        </Card>

        {/* Surfaces whether .env.local has been filled in. Without this, a
            missing key first shows up as an opaque failure on the login screen
            in Sprint 3. */}
        <Card className="flex-row items-center gap-4">
          <IconBadge
            icon={backendReady ? Database : PlugZap}
            accent={backendReady ? 'support' : 'highlight'}
            size="md"
          />
          <View className="flex-1 gap-0.5">
            <Text variant="subtitle">Backend</Text>
            <Text variant="muted">
              {backendReady
                ? 'Supabase credentials found. Apply supabase/migrations to finish setup.'
                : 'Not configured — copy .env.example to .env.local and add your Supabase URL and key.'}
            </Text>
          </View>
        </Card>

        <Card className="flex-row items-center gap-4">
          <IconBadge icon={SchemeIcon} accent="highlight" size="md" />
          <View className="flex-1 gap-0.5">
            <Text variant="subtitle">Appearance</Text>
            <Text variant="muted">
              Following your device — currently {scheme}. Change it in system settings and the app
              repaints.
            </Text>
          </View>
        </Card>

        <Link href="/design-system" asChild>
          <PressableCard className="flex-row items-center gap-4">
            <IconBadge icon={Palette} accent="brand" size="md" />
            <View className="flex-1 gap-0.5">
              <Text variant="subtitle">Design system</Text>
              <Text variant="muted">Every token and component in one place.</Text>
            </View>
            <ChevronRight size={20} strokeWidth={2.5} color={themeColors.inkSoft} />
          </PressableCard>
        </Link>
      </Section>

      <Section tone="canvas" size="md">
        {user ? (
          <Button
            title="Sign out"
            variant="outline"
            size="lg"
            fullWidth
            icon={<LogOut size={18} strokeWidth={2.5} color={themeColors.brand} />}
            onPress={() => void signOut()}
          />
        ) : isConfigured ? null : (
          <Card tone="highlightSoft" padding="sm">
            <Text variant="muted">
              Sign-in is bypassed because Supabase is not configured. Fill in .env.local and restart
              the bundler to turn the gate on.
            </Text>
          </Card>
        )}

        <Text variant="caption" className="text-center">
          Locked In v{Constants.expoConfig?.version ?? '1.0.0'}
        </Text>
      </Section>
    </Screen>
  );
}
