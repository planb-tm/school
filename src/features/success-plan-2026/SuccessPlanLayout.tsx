import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { successPlanModuleMeta } from '@/data/success-plan-2026/module';
import {
  clearProgress,
  loadProgress,
  type LearningProgress,
} from '@/lib/progress';
import { MODULE_SECTIONS, sectionPath } from './sectionsConfig';

export type SuccessPlanRouteContext = {
  progress: LearningProgress;
  setProgress: (next: LearningProgress) => void;
  resetProgress: () => void;
  navSections: { id: string; label: string; to: string }[];
};

export function SuccessPlanLayout() {
  const [progress, setProgress] = useState<LearningProgress>(() =>
    loadProgress(successPlanModuleMeta.id),
  );

  const context = useMemo<SuccessPlanRouteContext>(
    () => ({
      progress,
      setProgress,
      resetProgress: () => setProgress(clearProgress(successPlanModuleMeta.id)),
      navSections: MODULE_SECTIONS.map((section) => ({
        id: section.id,
        label: section.label,
        to: sectionPath(section.id),
      })),
    }),
    [progress],
  );

  return <Outlet context={context} />;
}
