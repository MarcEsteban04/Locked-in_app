import { Layers } from 'lucide-react-native';

import { SprintPlaceholder } from '@/components/sprint-placeholder';
import { PageHeader } from '@/components/ui/page-header';
import { Screen } from '@/components/ui/screen';

export default function SubjectsScreen() {
  return (
    <Screen scroll tone="block">
      <PageHeader
        eyebrow="Your courses"
        title="Subjects"
        description="Every lecture, note and quiz, grouped the way your semester actually runs."
      />

      <SprintPlaceholder
        icon={Layers}
        accent="support"
        title="Organise your courses"
        description="Create a subject, give it a colour, then break it down as far as you need."
        bullets={[
          'Create, rename and delete subjects',
          'Colour-code and sort them',
          'Nest units, chapters and topics inside',
          'Search across everything at once',
        ]}
        sprint="Sprint 6 & 7"
      />
    </Screen>
  );
}
