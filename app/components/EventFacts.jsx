import { kroenLabel } from "../lib/kroen-labels";

const FIELDS = [
  { key: "open_time", labelKey: "event.open_time" },
  { key: "start_time", labelKey: "event.start_time" },
  { key: "end_time", labelKey: "event.end_time" },
  { key: "contributo", labelKey: "event.contributo" },
];

export default function EventFacts({
  openTime,
  startTime,
  endTime,
  contributo,
  className = "",
}) {
  const values = {
    open_time: openTime,
    start_time: startTime,
    end_time: endTime,
    contributo,
  };

  const items = FIELDS.map(({ key, labelKey }) => {
    const value = values[key];
    if (!value) return null;
    return { key, label: kroenLabel(labelKey), value };
  }).filter(Boolean);

  if (!items.length) return null;

  return (
    <dl className={`facts ${className}`.trim()}>
      {items.map(({ key, label, value }) => (
        <div key={key}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
