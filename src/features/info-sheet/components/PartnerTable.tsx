import styles from '../styles/app.module.css';
import type { PartnerSearchHit } from '../features/partners/searchPartners';
import { formatNumber } from '../utils/formatters';

type Props = {
  hits: PartnerSearchHit[];
  onSelect: (partnerNumber: string) => void;
};

export function PartnerTable({ hits, onSelect }: Props) {
  if (hits.length === 0) {
    return (
      <div className={styles.emptyState}>
        <strong>Никого не найдено</strong>
        Измените запрос или сбросьте фильтры
      </div>
    );
  }

  return (
    <>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Партнёр</th>
              <th scope="col">Спонсор</th>
              <th scope="col">Личные ББ</th>
              <th scope="col">ББ в ПГ</th>
            </tr>
          </thead>
          <tbody>
            {hits.map(({ partner, exactNumber }) => (
              <tr
                key={partner.partnerNumber}
                className={exactNumber ? styles.tableExact : undefined}
                onClick={() => onSelect(partner.partnerNumber)}
              >
                <td>
                  <button
                    type="button"
                    className={styles.partnerOpenButton}
                    aria-label={`Открыть карточку: ${partner.fullName ?? partner.partnerNumber}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelect(partner.partnerNumber);
                    }}
                  >
                  <span className={styles.nameCell}>
                    <span className={styles.namePrimary}>
                      {partner.fullName ?? 'Без ФИО'}
                      {exactNumber ? (
                        <span
                          className={`${styles.chip} ${styles.chipAccent}`}
                          style={{ marginLeft: 8 }}
                        >
                          точное совпадение
                        </span>
                      ) : null}
                    </span>
                    <span className={styles.nameSecondary}>
                      {partner.partnerNumber}
                    </span>
                  </span>
                  </button>
                </td>
                <td>{partner.sponsorNumber ?? '-'}</td>
                <td>{formatNumber(partner.personalBB)}</td>
                <td>{formatNumber(partner.groupBB)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.mobileList}>
        {hits.map(({ partner, exactNumber }) => (
          <button
            key={`m-${partner.partnerNumber}`}
            type="button"
            className={styles.mobileItem}
            onClick={() => onSelect(partner.partnerNumber)}
          >
            <div className={styles.nameCell}>
              <span className={styles.namePrimary}>
                {partner.fullName ?? 'Без ФИО'}
              </span>
              <span className={styles.nameSecondary}>
                {partner.partnerNumber}
                {exactNumber ? ' · точное совпадение' : ''}
              </span>
            </div>
            <div className={styles.muted}>
              Спонсор {partner.sponsorNumber ?? '-'} · ББ{' '}
              {formatNumber(partner.personalBB)} · ПГ{' '}
              {formatNumber(partner.groupBB)}
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
