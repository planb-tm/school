import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { RouteLoadingFallback } from '@/components/RouteLoadingFallback';
import { START_ROUTE_PATH } from '@/data/startRoute';

const HomePage = lazy(() => import('./HomePage').then((module) => ({ default: module.HomePage })));
const LearnPage = lazy(() => import('./LearnPage').then((module) => ({ default: module.LearnPage })));
const StartPage = lazy(() => import('./StartPage').then((module) => ({ default: module.StartPage })));
const BusinessEssencePage = lazy(() => import('./learn/BusinessEssencePage').then((module) => ({ default: module.BusinessEssencePage })));
const InvitingPage = lazy(() => import('./learn/InvitingPage').then((module) => ({ default: module.InvitingPage })));
const OrdersPage = lazy(() => import('./learn/OrdersPage').then((module) => ({ default: module.OrdersPage })));
const OrderStagePage = lazy(() => import('./learn/OrdersPage').then((module) => ({ default: module.OrderStagePage })));
const ToolsPage = lazy(() => import('./ToolsPage').then((module) => ({ default: module.ToolsPage })));
const InfoSheetPage = lazy(() => import('./tools/InfoSheetPage').then((module) => ({ default: module.InfoSheetPage })));
const SuccessPlanLayout = lazy(() => import('@/features/success-plan-2026/SuccessPlanLayout').then((module) => ({ default: module.SuccessPlanLayout })));
const SuccessPlanHub = lazy(() => import('@/features/success-plan-2026/SuccessPlanHub').then((module) => ({ default: module.SuccessPlanHub })));
const SuccessPlanSectionPage = lazy(() => import('@/features/success-plan-2026/SuccessPlanSectionPage').then((module) => ({ default: module.SuccessPlanSectionPage })));

type LazyPage = LazyExoticComponent<ComponentType>;

function renderPage(Page: LazyPage) {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Page />
    </Suspense>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={renderPage(HomePage)} />
        <Route path={START_ROUTE_PATH.slice(1)} element={renderPage(StartPage)} />
        <Route path="learn" element={renderPage(LearnPage)} />
        <Route path="learn/business-essence" element={renderPage(BusinessEssencePage)} />
        <Route path="learn/products" element={<Navigate to="/learn/orders" replace />} />
        <Route path="learn/orders" element={renderPage(OrdersPage)} />
        <Route path="learn/orders/:stageSlug" element={renderPage(OrderStagePage)} />
        <Route path="learn/inviting" element={renderPage(InvitingPage)} />
        <Route path="tools" element={renderPage(ToolsPage)} />
        <Route path="tools/info-sheet" element={renderPage(InfoSheetPage)} />
        <Route path="modules/success-plan-2026" element={renderPage(SuccessPlanLayout)}>
          <Route index element={renderPage(SuccessPlanHub)} />
          <Route path=":sectionId" element={renderPage(SuccessPlanSectionPage)} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
