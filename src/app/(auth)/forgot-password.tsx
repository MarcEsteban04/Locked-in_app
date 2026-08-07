import { Link } from 'expo-router';
import { Mail, MailCheck } from 'lucide-react-native';
import { useState } from 'react';

import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconBadge } from '@/components/ui/icon-badge';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme';
import { useSession } from '@/lib/auth/session';

export default function ForgotPasswordScreen() {
  const { sendPasswordReset } = useSession();
  const themeColors = useThemeColors();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    setBusy(true);
    setError(null);
    const result = await sendPasswordReset(email);
    setError(result.error);
    // Shown whether or not the address exists. Confirming which emails have
    // accounts would let anyone enumerate the user base.
    if (!result.error) setSent(true);
    setBusy(false);
  }

  if (sent) {
    return (
      <AuthShell
        eyebrow="On its way"
        title="Check your email"
        description="The link opens straight back into the app.">
        <Card className="items-center gap-4 py-8">
          <IconBadge icon={MailCheck} accent="support" size="lg" />
          <Text variant="subtitle" className="text-center">
            If an account exists for {email.trim()}, a reset link is on its way.
          </Text>
          <Text variant="muted" className="text-center">
            The link expires in an hour.
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
      eyebrow="Password"
      title="Reset it"
      description="We'll email you a link to set a new one."
      footer={
        <Link href="/sign-in" asChild>
          <Text variant="subtitle" className="pt-2 text-center text-brand">
            Back to sign in
          </Text>
        </Link>
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

      {error ? (
        <Card tone="dangerSoft" padding="sm">
          <Text variant="body" className="text-danger">
            {error}
          </Text>
        </Card>
      ) : null}

      <Button
        title="Send reset link"
        size="lg"
        fullWidth
        loading={busy}
        disabled={email.trim().length === 0 || busy}
        onPress={handleSubmit}
      />
    </AuthShell>
  );
}
