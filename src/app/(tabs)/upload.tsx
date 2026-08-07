import { CloudUpload } from 'lucide-react-native';

import { SprintPlaceholder } from '@/components/sprint-placeholder';
import { PageHeader } from '@/components/ui/page-header';
import { Screen } from '@/components/ui/screen';

export default function UploadScreen() {
  return (
    <Screen scroll tone="block">
      <PageHeader
        tone="brand"
        eyebrow="Bring it in"
        title="Upload"
        description="However the lecture reached you — a file, a photo, a recording — it starts here."
      />

      <SprintPlaceholder
        icon={CloudUpload}
        accent="brand"
        title="Anything you learned from"
        description="Locked In reads it, then turns it into something you can actually study."
        bullets={[
          'PDF, DOCX, PPTX, TXT and Markdown',
          'Camera scanning with auto-crop',
          'Handwriting and whiteboard OCR',
          'Lecture recordings, transcribed',
        ]}
        sprint="Sprint 8 – 11"
      />
    </Screen>
  );
}
