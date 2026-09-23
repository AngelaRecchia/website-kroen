"use client";

import { storyblokEditable } from "@storyblok/react";
import { useMemo, useState } from "react";

function parseRows(raw) {
  if (!raw || typeof raw !== "string") return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export default function RevenueTable({ blok }) {
  const {
    title = "Entrate",
    data_json = "",
  } = blok;

  const data = useMemo(() => parseRows(data_json), [data_json]);
  const years = Object.keys(data).sort();
  const [year, setYear] = useState(years[years.length - 1] || "");

  const rows = year ? data[year] || {} : {};
  const entries = Object.entries(rows);
  const total = entries.reduce((sum, [, v]) => sum + Number(v || 0), 0);
  const fmt = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  if (!years.length) {
    return (
      <div {...storyblokEditable(blok)} className="block">
        <h2 className="display t-h2">{title}</h2>
        <p className="prose">Dati non configurati nel CMS (campo JSON).</p>
      </div>
    );
  }

  return (
    <div {...storyblokEditable(blok)} className="block">
      <h2 className="display t-h2">{title}</h2>
      <div className="tabs" role="group" aria-label="Anno">
        {years.map((y) => (
          <button
            key={y}
            type="button"
            className="tab"
            aria-pressed={y === year}
            onClick={() => setYear(y)}
          >
            {y}
          </button>
        ))}
      </div>
      <div className="total">
        <span className="display t-h4">{fmt.format(total)}</span>
        <span className="date">Entrate {year}</span>
      </div>
      <div className="table-wrap">
        <table className="rev">
          <caption className="sr-only">Entrate per fonte</caption>
          <thead>
            <tr>
              <th scope="col">Fonte</th>
              <th scope="col" className="num">
                Importo
              </th>
              <th scope="col" className="barcell">
                Quota
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([label, amount]) => {
              const n = Number(amount || 0);
              const pct = total ? Math.round((n / total) * 100) : 0;
              return (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td className="num">{fmt.format(n)}</td>
                  <td className="barcell">
                    <span className="bar">
                      <i style={{ width: `${pct}%` }} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
