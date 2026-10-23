import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>
          planB - образовательный продукт команды Долиных Сергея и Надежды.
        </p>
        <p>
          Материалы не заменяют официальный кабинет Oriflame и актуальные
          правила компании.
        </p>
      </footer>
      <BottomNav />
    </div>
  );
}
