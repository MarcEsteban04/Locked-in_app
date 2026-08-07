import { Link } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { AuthShell } from '@/components/auth/auth-shell';
import { SocialSignIn } from '@/components/auth/social-sign-in';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme';
import { useSession } from '@/lib/auth/session';

export default function SignInScreen() {
  const { signIn, signInWithGoogle, signInWithApple } = useSession();
  const themeColors = useThemeColors();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Nothing here is a hard validation — the server is the authority. This only
  // avoids a pointless round trip on an obviously empty form.
  const canSubmit = email.trim().length > 0 && password.length > 0 && !busy;

  async function run(action: () => Promise<{ error: string | null }>) {
    setBusy(true);
    setError(null);
    const result = await action();
    setError(result.error);
    setBusy(false);
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      description="Pick up where you left off."
      footer={
        <View className="items-center gap-3 pt-2">
          <Link href="/forgot-password" asChild>
            <Text variant="subtitle" className="text-brand">
              Forgot your password?
            </Text>
          </Link>
          <View className="flex-row items-center gap-1">
            <Text variant="muted">New here?</Text>
            <Link href="/sign-up" asChild>
              <Text variant="subtitle" className="text-brand">
                Create an account
              </Text>
            </Link>
          </View>
        </View>
      }>
      <Input
        label="Email"
        placeholder="you@school.edu"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        inputMode="email"
        icon={<Mail size={18} strokeWidth={2.5} color={themeColors.inkSoft} />}
      />

      <Input
        label="Password"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="current-password"
        icon={<Lock size={18} strokeWidth={2.5} color={themeColors.inkSoft} />}
      />

      {error ? (
        <Card tone="dangerSoft" padding="sm">
          <Text variant="body" className="text-danger">
            {error}
          </Text>
        </Card>
      ) : null}

      <Button
        title="Sign in"
        size="lg"
        fullWidth
        loading={busy}
        disabled={!canSubmit}
        onPress={() => run(() => signIn(email, password))}
      />

      <SocialSignIn
        disabled={busy}
        onGoogle={() => run(signInWithGoogle)}
        onApple={() => run(signInWithApple)}
      />
    </AuthShell>
  );
}
