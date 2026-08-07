import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Section } from '@/components/ui/section';
import { Text } from '@/components/ui/text';

export interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  /** Rendered under the form — links to the other auth routes. */
  footer?: React.ReactNode;
}

/**
 * Shared frame for the auth routes: brand block on top, form on the canvas
 * below.
 *
 * Auth screens do not use <Screen> because they must not reserve room for the
 * tab bar (there isn't one yet) and because they need keyboard avoidance, which
 * no other screen in the app does.
 */
export function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-canvas"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={{ paddingTop: insets.top }}>
          <Section tone="brand" size="lg" decorated>
            <View className="gap-1">
              <Text variant="label" className="text-brand-on opacity-70">
                {eyebrow}
              </Text>
              <Text variant="title" className="text-[32px] leading-[36px] text-brand-on">
                {title}
              </Text>
              <Text variant="body" className="text-brand-on opacity-90">
                {description}
              </Text>
            </View>
          </Section>
        </View>

        <View className="flex-1 gap-5 px-6 py-8" style={{ paddingBottom: insets.bottom + 32 }}>
          {children}
          {footer}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
