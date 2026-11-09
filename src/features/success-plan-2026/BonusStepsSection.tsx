import { TEAM_BONUS_LEVELS } from '@/lib/teamBonusLevels';
import { formatNumber } from '@/lib/format';
import { successPlanData } from '@/data/success-plan-2026/module';

export function BonusStepsSection() {
  return (
    <section className="panel" id="bonus-steps" aria-label="Принципы расчёта бонусов">
      <ol className="step-list">
        {successPlanData.bonusSteps.map((step) => (
          <li key={step.title} className="step-list__item">
            <h2 className="content-heading">{step.title}</h2>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="table-wrap">
        <table className="data-table">
          <caption>Баллы Бонуса → уровень Командного бонуса (с. 21)</caption>
          <thead>
            <tr>
              <th scope="col">Баллы Бонуса</th>
              <th scope="col">Командный бонус</th>
            </tr>
          </thead>
          <tbody>
            {TEAM_BONUS_LEVELS.map((band) => (
              <tr key={band.minBb}>
                <td>
                  {band.maxBb === null
                    ? `${formatNumber(band.minBb)}+`
                    : `${formatNumber(band.minBb)} – ${formatNumber(band.maxBb)}`}
                </td>
                <td>{band.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </section>
  );
}
