import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { HomePage } from './HomePage';
import { LearnPage } from './LearnPage';
import { ProductsPage } from './learn/ProductsPage';
import { ToolsPage } from './ToolsPage';
import { InfoSheetPage } from './tools/InfoSheetPage';
import { SuccessPlanLayout } from '@/features/success-plan-2026/SuccessPlanLayout';
import { SuccessPlanHub } from '@/features/success-plan-2026/SuccessPlanHub';
import { SuccessPlanSectionPage } from '@/features/success-plan-2026/SuccessPlanSectionPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="learn/products" element={<ProductsPage />} />
        <Route path="tools" element={<ToolsPage />} />
        <Route path="tools/info-sheet" element={<InfoSheetPage />} />
        <Route path="modules/success-plan-2026" element={<SuccessPlanLayout />}>
          <Route index element={<SuccessPlanHub />} />
          <Route path=":sectionId" element={<SuccessPlanSectionPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
