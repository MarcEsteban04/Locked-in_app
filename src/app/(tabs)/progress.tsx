import { ChartColumn } from 'lucide-react-native';

import { SprintPlaceholder } from '@/components/sprint-placeholder';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';

export default function ProgressScreen() {
  return (
    <Screen scroll>
      <Text variant="title">Progress</Text>
      <SprintPlaceholder
        icon={ChartColumn}
        title="See what's working"
        description="Study sessions, quiz history and the topics you keep getting wrong."
        sprint="Sprint 17 & 18"
      />
    </Screen>
  );
}
