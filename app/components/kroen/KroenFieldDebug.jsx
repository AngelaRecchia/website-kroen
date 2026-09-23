"use client";

import { useKroenFieldParams } from "./KroenFieldContext";

const SLIDERS = [
  { key: "baseDeepMix", label: "Base scura (deep)", min: 0, max: 1, step: 0.01 },
  { key: "dotRedMix", label: "Dot → rosso", min: 0, max: 1, step: 0.01 },
  { key: "highlight", label: "Highlight cursore", min: 0, max: 1, step: 0.01 },
  { key: "dotSizeBase", label: "Dot size base", min: 0.05, max: 0.35, step: 0.01 },
  { key: "dotSizeFlash", label: "Dot size flash", min: 0, max: 0.5, step: 0.01 },
  { key: "dotSizeNear", label: "Dot size near", min: 0, max: 0.6, step: 0.01 },
  { key: "dotSoftness", label: "Dot morbidezza", min: 0.02, max: 0.2, step: 0.005 },
  { key: "rippleAmp", label: "Ripple amp", min: 0, max: 30, step: 0.5 },
  { key: "grain", label: "Grain", min: 0, max: 0.12, step: 0.002 },
  { key: "cellSize", label: "Cell px", min: 8, max: 28, step: 1 },
];

export default function KroenFieldDebug() {
  const { params, setParams, resetParams, debugOpen, setDebugOpen } =
    useKroenFieldParams();

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <>
      <button
        type="button"
        className="kroen-field-debug-toggle"
        onClick={() => setDebugOpen((o) => !o)}
        aria-expanded={debugOpen}
      >
        Field WebGL
      </button>
      {debugOpen && (
        <div className="kroen-field-debug" role="dialog" aria-label="Debug campo WebGL">
          <div className="kroen-field-debug__head">
            <strong>Campo WebGL</strong>
            <button type="button" className="kroen-field-debug__reset" onClick={resetParams}>
              Reset
            </button>
          </div>
          <p className="kroen-field-debug__hint">
            Contrasto: alza <em>Base scura</em>, regola dot/highlight. URL:{" "}
            <code>?debug=field</code>
          </p>
          <div className="kroen-field-debug__grid">
            {SLIDERS.map(({ key, label, min, max, step }) => (
              <label key={key} className="kroen-field-debug__row">
                <span>
                  {label}{" "}
                  <output>{Number(params[key]).toFixed(key === "cellSize" ? 0 : 2)}</output>
                </span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={params[key]}
                  onChange={(e) =>
                    setParams({ [key]: Number(e.target.value) })
                  }
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
