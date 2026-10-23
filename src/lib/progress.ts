import type { LearningProgress } from '@/types/learning';

export type { LearningProgress };

const STORAGE_PREFIX = 'oriflame-learning-progress:';

function storageKey(moduleId: string): string {
  return `${STORAGE_PREFIX}${moduleId}`;
}

export function createEmptyProgress(moduleId: string): LearningProgress {
  return {
    moduleId,
    completedTaskIds: [],
    quizResults: {},
    scenarioResults: {},
    updatedAt: new Date().toISOString(),
  };
}

export function loadProgress(moduleId: string): LearningProgress {
  try {
    const raw = localStorage.getItem(storageKey(moduleId));
    if (!raw) {
      return createEmptyProgress(moduleId);
    }
    const parsed = JSON.parse(raw) as LearningProgress;
    if (parsed.moduleId !== moduleId) {
      return createEmptyProgress(moduleId);
    }
    return parsed;
  } catch {
    return createEmptyProgress(moduleId);
  }
}

export function saveProgress(progress: LearningProgress): LearningProgress {
  const next: LearningProgress = {
    ...progress,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(storageKey(progress.moduleId), JSON.stringify(next));
  } catch {
    // Quota / private mode - keep in-memory only.
  }
  return next;
}

export function markTaskComplete(
  progress: LearningProgress,
  taskId: string,
): LearningProgress {
  if (progress.completedTaskIds.includes(taskId)) {
    return progress;
  }
  return saveProgress({
    ...progress,
    completedTaskIds: [...progress.completedTaskIds, taskId],
  });
}

export function saveQuizAnswer(
  progress: LearningProgress,
  questionId: string,
  selectedIndex: number,
  correct: boolean,
): LearningProgress {
  return saveProgress({
    ...progress,
    quizResults: {
      ...progress.quizResults,
      [questionId]: { selectedIndex, correct },
    },
  });
}

export function saveScenarioResult(
  progress: LearningProgress,
  scenarioId: string,
  passed: boolean,
): LearningProgress {
  return saveProgress({
    ...progress,
    scenarioResults: {
      ...progress.scenarioResults,
      [scenarioId]: { passed, at: new Date().toISOString() },
    },
  });
}

export function clearProgress(moduleId: string): LearningProgress {
  const empty = createEmptyProgress(moduleId);
  try {
    localStorage.removeItem(storageKey(moduleId));
  } catch {
    // ignore
  }
  return empty;
}

/** Clears quiz answers only; keeps other local progress. */
export function clearQuizResults(progress: LearningProgress): LearningProgress {
  const completedTaskIds = progress.completedTaskIds.filter((id) => id !== 'quiz');
  return saveProgress({
    ...progress,
    quizResults: {},
    completedTaskIds,
  });
}
