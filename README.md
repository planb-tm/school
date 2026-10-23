# planB

Образовательное веб-приложение команды **planB** внутри Oriflame (без backend).  
Смысл названия: «План Б — альтернативный путь к свободе и своему делу».

Первый рабочий модуль: **План Успеха 2026**.

## Требования

- Node.js 20+
- npm 10+

## Команды

```bash
npm install
npm run dev          # локально http://localhost:5173/school/
npm run test         # контрольные тесты расчётов
npm run typecheck    # строгий TypeScript
npm run build        # production-сборка в dist/
npm run preview      # просмотр сборки
```

## GitHub Pages

По умолчанию Vite `base` = `/school/` — соответствует текущему имени папки/предполагаемому репозиторию `school`.  
Локального git remote пока нет: перед публикацией сверьте имя репозитория на GitHub и при необходимости переопределите base.

Если репозиторий называется иначе:

```bash
# Windows PowerShell
$env:VITE_BASE="/your-repo-name/"; npm run build
```

```bash
# bash
VITE_BASE=/your-repo-name/ npm run build
```

Затем опубликуйте содержимое `dist/` в GitHub Pages (branch `gh-pages` или Actions).  
Публикацию и push выполняйте только осознанно — скрипты проекта сами на GitHub ничего не отправляют.

## Структура

См. [docs/architecture.md](docs/architecture.md), [docs/data-model.md](docs/data-model.md), [docs/review-checklist.md](docs/review-checklist.md).

Официальные PDF Oriflame: `docs/sources/`.

## Важно

- planB — бренд команды, не название компании Oriflame.
- Примеры и калькулятор — учебные, не официальный расчёт дохода.
- Часть формулировок помечена `needs_review` до полной сверки.
- Прогресс теста/сценария хранится только в `localStorage` браузера.
