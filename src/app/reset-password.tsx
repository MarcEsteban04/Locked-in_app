import { Lock } from 'lucide-react-native';
import { useState } from 'react';

import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme';
import { useSession } from '@/lib/auth/session';

const MIN_PASSWORD_LENGTH = 6;

/**
 * Reached only by following a recovery link. Supabase signs the user in as part
 * of that flow, so this route lives outside `(auth)` — by the time it renders
 * there is already a session, and the signed-out guard would push it away.
 */
export default function ResetPasswordScreen() {
  const { updatePassword, signOut } = useSession();
  const themeColors = useThemeColors();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const tooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH;
  const mismatch = confirm.length > 0 && confirm !== password;
  const canSubmit = password.length >= MIN_PASSWORD_LENGTH && confirm === password && !busy;

  async function handleSubmit() {
    setBusy(true);
    setError(null);
    const result = await updatePassword(password);
    setError(result.error);
    setBusy(false);
    // On success `isRecovering` flips false and the guard hands over to the
    // tabs, so there is no navigation to perform here.
  }

  return (
    <AuthShell
      eyebrow="Almost done"
      title="New password"
      description="Choose something you'll remember."
      footer={
        <Text variant="muted" className="pt-2 text-center" onPress={() => void signOut()}>
          Cancel and sign out
        </Text>
      }>
      <Input
        label="New password"
        placeholder="At least 6 characters"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        error={tooShort ? `Use at least ${MIN_PASSWORD_LENGTH} characters.` : undefined}
        icon={<Lock size={18} strokeWidth={2.5} color={themeColors.inkSoft} />}
      />

      <Input
        label="Confirm password"
        placeholder="Type it again"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        error={mismatch ? 'These do not match.' : undefined}
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
        title="Save password"
        size="lg"
        fullWidth
        loading={busy}
        disabled={!canSubmit}
        onPress={handleSubmit}
      />
    </AuthShell>
  );
}
