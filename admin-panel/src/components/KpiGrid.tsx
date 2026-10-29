import './KpiGrid.css';

export interface Kpi {
  label: string;
  value: number | string;
  sub?: string;
  tone?: 'red' | 'green' | 'blue' | 'amber' | 'purple';
}

/** The summary boxes at the top of an admin page, in the same style as the Contacts page. */
export default function KpiGrid({ items }: { items: Kpi[] }) {
  return (
    <div className="kpi-grid">
      {items.map((item) => (
        <div className={`kpi-card kpi-card--${item.tone ?? 'red'}`} key={item.label}>
          <p className="kpi-card__label">{item.label}</p>
          <p className="kpi-card__value">{item.value}</p>
          {item.sub && <p className="kpi-card__sub">{item.sub}</p>}
        </div>
      ))}
    </div>
  );
}
