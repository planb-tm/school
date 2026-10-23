import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { HomePage } from './HomePage';
import { SuccessPlanLayout } from '@/features/success-plan-2026/SuccessPlanLayout';
import { SuccessPlanHub } from '@/features/success-plan-2026/SuccessPlanHub';
import { SuccessPlanSectionPage } from '@/features/success-plan-2026/SuccessPlanSectionPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="modules/success-plan-2026" element={<SuccessPlanLayout />}>
          <Route index element={<SuccessPlanHub />} />
          <Route path=":sectionId" element={<SuccessPlanSectionPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
