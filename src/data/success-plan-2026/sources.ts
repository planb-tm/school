import type { SourceDocument } from '@/types/learning';

export const SUCCESS_PLAN_SOURCE_ID = 'success-plan-2026';

export const sources: SourceDocument[] = [
  {
    id: SUCCESS_PLAN_SOURCE_ID,
    title: '«План Успеха для Бизнес Партнёров»',
    version: '2026',
    market: 'Россия / СНГ (RU)',
    fileName: 'План_Успеха_2026.pdf',
    pages: [15, 17, 18, 19, 20, 21, 22, 127],
    status: 'needs_review',
    notes:
      'Текст извлечён из PDF для учебного модуля. Таблица уровней (с. 21) и контрольные примеры 1–2 (с. 20, 22) сверены с документом. Определение «План Успеха Бизнес Партнёров» взято из словаря (с. 127). Полная сверка всех условий, исключений и Директорских бонусов ещё не завершена.',
  },
  {
    id: 'business-partner-terms',
    title: 'Правила и условия для Бизнес Партнёров',
    version: 'файл в docs/sources',
    market: 'RU',
    fileName: 'Правила и условия для Бизнес Партнёров.pdf',
    status: 'needs_review',
    notes: 'Документ добавлен в проект; детальная выгрузка в карточки знаний пока не выполнена.',
  },
  {
    id: 'beauty-partner-terms',
    title: 'Правила и условия для Бьюти Партнёров',
    version: 'файл в docs/sources',
    market: 'RU',
    fileName: 'Правила и условия для Бьюти Партнёров.pdf',
    status: 'needs_review',
    notes: 'Документ добавлен в проект; в модуле «Плана Успеха» пока не используется как основной источник расчётов.',
  },
  {
    id: 'beauty-benefits-2026',
    title: 'Программа Преимуществ Бьюти Партнёров 2026',
    version: '2026',
    market: 'RU',
    fileName: 'Программа Преимуществ Бьюти Партнёров 2026.pdf',
    status: 'needs_review',
    notes: 'Отдельный модуль не реализован. Не смешивать с расчётами Командного бонуса Бизнес Партнёра.',
  },
  {
    id: 'oriflame-charter-2026',
    title: 'Устав Орифлэйм RU 2026',
    version: 'FINAL_EG 07 05 26',
    market: 'RU',
    fileName: 'Устав Орифлэйм RU_2026_FINAL_EG 07 05 26.pdf',
    status: 'needs_review',
    notes: 'Юридический документ; для модуля бонусов используется только как справочный источник при необходимости.',
  },
];

export function getSourceById(id: string): SourceDocument | undefined {
  return sources.find((s) => s.id === id);
}
