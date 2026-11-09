import { InfoSheetApp } from '@/features/info-sheet/InfoSheetApp';
import { PageContainer } from '@/components/PageContainer';
import { PageBackLink } from '@/components/PageHeader';

export function InfoSheetPage() {
  return (
    <PageContainer variant="workspace">
      <PageBackLink to="/tools" />
      <InfoSheetApp />
    </PageContainer>
  );
}
