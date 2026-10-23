import { Link } from 'react-router-dom';
import { InfoSheetApp } from '@/features/info-sheet/InfoSheetApp';

export function InfoSheetPage() {
  return (
    <div className="tools-page tools-page--wide">
      <Link to="/tools" className="tools-back">
        ← К инструментам
      </Link>
      <InfoSheetApp />
    </div>
  );
}
