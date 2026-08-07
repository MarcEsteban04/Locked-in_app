import { Link } from 'expo-router';
import { Lock, Mail, MailCheck, UserRound } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { AuthShell } from '@/components/auth/auth-shell';
import { SocialSignIn } from '@/components/auth/social-sign-in';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconBadge } from '@/components/ui/icon-badge';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme';
import { useSession } from '@/lib/auth/session';

/** Matches the default Supabase minimum; the server rejects anything shorter. */
const MIN_PASSWORD_LENGTH = 6;

export default function SignUpScreen() {
  const { signUp, signInWithGoogle, signInWithApple } = useSession();
  const themeColors = useThemeColors();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const passwordTooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH;
  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= MIN_PASSWORD_LENGTH &&
    !busy;

  async function run(action: () => Promise<{ error: string | null }>) {
    setBusy(true);
    setError(null);
    const result = await action();
    setError(result.error);
    setBusy(false);
  }

  async function handleSignUp() {
    setBusy(true);
    setError(null);
    const result = await signUp(email, password, name);
    setError(result.error);
    // When confirmation is required there is no session yet, so the guard will
    // not move the user anywhere. Say so explicitly instead of leaving them on
    // a form that looks like it did nothing.
    if (!result.error && result.needsEmailConfirmation) {
      setSentTo(email.trim());
    }
    setBusy(false);
  }

  if (sentTo) {
    return (
      <AuthShell
        eyebrow="Almost there"
        title="Check your email"
        description="One tap and your account is live.">
        <Card className="items-center gap-4 py-8">
          <IconBadge icon={MailCheck} accent="support" size="lg" />
          <Text variant="subtitle" className="text-center">
            We sent a confirmation link to {sentTo}
          </Text>
          <Text variant="muted" className="text-center">
            Open it on this device and you will be signed in automatically.
          </Text>
        </Card>

        <Link href="/sign-in" asChild>
          <Button title="Back to sign in" variant="secondary" size="lg" fullWidth />
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create account"
      description="Free while you study. No card needed."
      footer={
        <View className="flex-row items-center justify-center gap-1 pt-2">
          <Text variant="muted">Already have one?</Text>
          <Link href="/sign-in" asChild>
            <Text variant="subtitle" className="text-brand">
              Sign in
            </Text>
          </Link>
        </View>
      }>
      <Input
        label="Name"
        placeholder="Marc"
        value={name}
        onChangeText={setName}
        autoComplete="name"
        icon={<UserRound size={18} strokeWidth={2.5} color={themeColors.inkSoft} />}
      />

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
        placeholder="At least 6 characters"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        error={passwordTooShort ? `Use at least ${MIN_PASSWORD_LENGTH} characters.` : undefined}
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
        title="Create account"
        size="lg"
        fullWidth
        loading={busy}
        disabled={!canSubmit}
        onPress={handleSignUp}
      />

      <SocialSignIn
        disabled={busy}
        onGoogle={() => run(signInWithGoogle)}
        onApple={() => run(signInWithApple)}
      />
    </AuthShell>
  );
}
