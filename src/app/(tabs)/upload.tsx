import { CloudUpload } from 'lucide-react-native';

import { SprintPlaceholder } from '@/components/sprint-placeholder';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';

export default function UploadScreen() {
  return (
    <Screen scroll>
      <Text variant="title">Upload</Text>
      <SprintPlaceholder
        icon={CloudUpload}
        title="Bring in your material"
        description="PDFs, slides, scanned notes, whiteboard photos and lecture recordings — all in one place."
        sprint="Sprint 8 – 11"
      />
    </Screen>
  );
}
