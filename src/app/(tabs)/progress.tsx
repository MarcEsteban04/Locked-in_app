import { ChartColumn } from 'lucide-react-native';
import { View } from 'react-native';

import { SprintPlaceholder } from '@/components/sprint-placeholder';
import { PageHeader } from '@/components/ui/page-header';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { Stat } from '@/components/ui/stat';

export default function ProgressScreen() {
  return (
    <Screen scroll tone="block">
      <PageHeader
        eyebrow="Where you stand"
        title="Progress"
        description="Study time, quiz history, and the topics you keep getting wrong."
      />

      <Section tone="block" size="md">
        <View className="flex-row gap-3">
          <Stat value="0h" label="Studied" accent="brand" />
          <Stat value={0} label="Quizzes" accent="support" />
          <Stat value="—" label="Accuracy" accent="highlight" />
        </View>
      </Section>

      <SprintPlaceholder
        icon={ChartColumn}
        accent="highlight"
        title="See what's working"
        description="Once sessions are tracked, this becomes the screen you check before every exam."
        bullets={[
          'Session, quiz and mock exam history',
          'Charts over time',
          'Weak topics surfaced automatically',
          'Questions you miss most often',
        ]}
        sprint="Sprint 17 & 18"
      />
    </Screen>
  );
}
