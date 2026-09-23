export default function EventFacts({ startTime, endTime, contributo, className = "" }) {
  const items = [
    startTime && { label: "Inizio", value: startTime },
    endTime && { label: "Fine", value: endTime },
    contributo && { label: "Contributo", value: contributo },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <dl className={`facts ${className}`.trim()}>
      {items.map(({ label, value }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
