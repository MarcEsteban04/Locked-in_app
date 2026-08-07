import { Layers } from 'lucide-react-native';

import { SprintPlaceholder } from '@/components/sprint-placeholder';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';

export default function SubjectsScreen() {
  return (
    <Screen scroll>
      <Text variant="title">Subjects</Text>
      <SprintPlaceholder
        icon={Layers}
        title="Organise your courses"
        description="Create subjects, colour-code them, and group your material into units and chapters."
        sprint="Sprint 6 & 7"
      />
    </Screen>
  );
}
