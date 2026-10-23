# planB

Образовательное веб-приложение команды **planB** внутри Oriflame (без backend).  
Смысл названия: «План Б — альтернативный путь к свободе и своему делу».

Первый рабочий модуль: **План Успеха 2026**.

Раздел **Инструменты** (`/tools`): каталог практических помощников. Сейчас доступен
**Информационный листок** — локальный разбор Excel-отчёта Oriflame в браузере
(данные отчёта не сохраняются в `localStorage` и не уходят на сервер).

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

По умолчанию Vite `base` = `/school/` - соответствует репозиторию [planb-tm/school](https://github.com/planb-tm/school).

Сборка и публикация идут через GitHub Actions (`.github/workflows/ci.yml`):
на каждый push в `main` - `typecheck` → `test` → `build` → deploy на Pages.

Сайт: https://planb-tm.github.io/school/

Приложение можно установить на рабочий экран (PWA): манифест `public/manifest.webmanifest`,
иконки `public/icons/`, service worker `public/sw.js`. На поддерживаемых браузерах в шапке
появляется кнопка «Установить».

Один раз в настройках репозитория:
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

Если репозиторий называется иначе:

```bash
# Windows PowerShell
$env:VITE_BASE="/your-repo-name/"; npm run build
```

```bash
# bash
VITE_BASE=/your-repo-name/ npm run build
```

## Структура

См. [docs/architecture.md](docs/architecture.md), [docs/data-model.md](docs/data-model.md), [docs/review-checklist.md](docs/review-checklist.md).

Официальные PDF Oriflame: `docs/sources/`.

## Важно

- planB — бренд команды, не название компании Oriflame.
- Примеры и калькулятор — учебные, не официальный расчёт дохода.
- Часть формулировок помечена `needs_review` до полной сверки.
- Прогресс теста/сценария хранится только в `localStorage` браузера.
