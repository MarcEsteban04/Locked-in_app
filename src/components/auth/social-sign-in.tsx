import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export interface SocialSignInProps {
  onGoogle(): void;
  onApple(): void;
  disabled?: boolean;
}

/**
 * Google and Apple sign-in, plus the divider above them.
 *
 * Apple is hidden where it is unavailable rather than shown and failing:
 * `isAvailableAsync` is false on Android and on iOS below 13, and rendering a
 * dead button is worse than rendering none.
 */
export function SocialSignIn({ onGoogle, onApple, disabled }: SocialSignInProps) {
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    let active = true;
    void AppleAuthentication.isAvailableAsync().then((available) => {
      if (active) setAppleAvailable(available);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <View className="gap-4">
      {/* Two solid rules with a label between them. The design system bans thin
          dividers between sections, but this is a label inside one block. */}
      <View className="flex-row items-center gap-3">
        <View className="h-0.5 flex-1 bg-block-strong" />
        <Text variant="label">or</Text>
        <View className="h-0.5 flex-1 bg-block-strong" />
      </View>

      <Button
        title="Continue with Google"
        variant="outline"
        fullWidth
        disabled={disabled}
        onPress={onGoogle}
      />

      {appleAvailable && Platform.OS === 'ios' ? (
        <Button
          title="Continue with Apple"
          variant="secondary"
          fullWidth
          disabled={disabled}
          onPress={onApple}
        />
      ) : null}
    </View>
  );
}
