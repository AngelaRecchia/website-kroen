"use client";

import { useEffect, useRef, useState } from "react";

import {
  EXPERIENCE_PRESET_IDS,
  EXPERIENCE_PRESET_LABELS,
  EXPERIENCE_SWATCHES,
  controlsForTier,
  formatControlValue,
} from "../../../lib/kroen-field-config";
import { useKroenFieldParams } from "../KroenFieldContext";
import "./KroenExperiencePanel.scss";

const SHOW_ADVANCED = process.env.NODE_ENV === "development";

function Control({ control, value, onChange }) {
  const { key, label, type } = control;

  if (type === "color") {
    const pick = (hex) =>
      onChange((prev) => ({ [key]: hex, dotColorMix: Math.max(0.45, prev.dotColorMix) }));
    return (
      <div className="kroen-exp-row kroen-exp-row--color">
        <div className="kroen-exp-swatches">
          {EXPERIENCE_SWATCHES.map((hex) => (
            <button
              key={hex}
              type="button"
              className={`kroen-exp-swatch${value.toLowerCase() === hex ? " is-active" : ""}`}
              style={{ background: hex }}
              aria-label={`Colore ${hex}`}
              aria-pressed={value.toLowerCase() === hex}
              onClick={() => pick(hex)}
            />
          ))}
          <label className="kroen-exp-swatch kroen-exp-swatch--picker" aria-label="Colore libero">
            <input type="color" value={value} onChange={(e) => pick(e.target.value)} />
          </label>
        </div>
      </div>
    );
  }

  if (type === "toggle") {
    return (
      <label className="kroen-exp-row kroen-exp-row--toggle">
        <span>{label}</span>
        <input
          type="checkbox"
          role="switch"
          className="kroen-exp-switch"
          checked={Boolean(value)}
          onChange={(e) => onChange({ [key]: e.target.checked })}
        />
      </label>
    );
  }

  const span = control.max - control.min || 1;
  const fill = Math.min(100, Math.max(0, ((value - control.min) / span) * 100));

  return (
    <label className="kroen-exp-row">
      <span>
        {label} <output>{formatControlValue(control, value)}</output>
      </span>
      <input
        type="range"
        min={control.min}
        max={control.max}
        step={control.step}
        value={value}
        style={{ "--fill": `${fill}%` }}
        onChange={(e) => onChange({ [key]: Number(e.target.value) })}
      />
    </label>
  );
}

function ControlBlock({ controls, params, setParams, grouped = false }) {
  if (!controls.length) return null;

  if (!grouped) {
    return (
      <div className="kroen-exp-block">
        {controls.map((c) => (
          <Control key={c.key} control={c} value={params[c.key]} onChange={setParams} />
        ))}
      </div>
    );
  }

  const subs = [];
  for (const c of controls) {
    const name = c.sub ?? "";
    const last = subs[subs.length - 1];
    if (last && last.name === name) last.items.push(c);
    else subs.push({ name, items: [c] });
  }

  return (
    <div className="kroen-exp-block">
      {subs.map((sub) => (
        <div key={sub.name || "_"} className="kroen-exp-sub">
          {sub.name && <span className="kroen-exp-sub__label">{sub.name}</span>}
          {sub.items.map((c) => (
            <Control key={c.key} control={c} value={params[c.key]} onChange={setParams} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function KroenExperiencePanel({ dockRef }) {
  const { panelOpen, setPanelOpen, preset, params, setPreset, setParams, randomize, reset } =
    useKroenFieldParams();
  const panelRef = useRef(null);
  const firstChipRef = useRef(null);
  const [effectsOpen, setEffectsOpen] = useState(false);

  useEffect(() => {
    if (!panelOpen) return;
    firstChipRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    const onPointerDown = (e) => {
      const t = e.target;
      if (panelRef.current?.contains(t) || dockRef?.current?.contains(t)) return;
      setPanelOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [panelOpen, setPanelOpen, dockRef]);

  if (!panelOpen) return null;

  const mainControls = controlsForTier("main");
  const effectControls = controlsForTier("effects");
  const advancedControls = SHOW_ADVANCED ? controlsForTier("advanced", { includeAdvanced: true }) : [];

  return (
    <div
      id="kroen-exp-panel"
      ref={panelRef}
      className="kroen-exp-panel"
      role="dialog"
      aria-label="Esperienza"
    >
      <div className="kroen-exp-panel__bar">
        <div className="kroen-exp-presets" role="radiogroup" aria-label="Preset">
          {EXPERIENCE_PRESET_IDS.map((id, i) => (
            <button
              key={id}
              ref={i === 0 ? firstChipRef : undefined}
              type="button"
              role="radio"
              aria-checked={preset === id}
              className={`kroen-exp-chip${preset === id ? " is-active" : ""}`}
              onClick={() => setPreset(id)}
            >
              {EXPERIENCE_PRESET_LABELS[id]}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="kroen-exp-panel__close"
          aria-label="Chiudi"
          onClick={() => setPanelOpen(false)}
        >
          ×
        </button>
      </div>

      <ControlBlock controls={mainControls} params={params} setParams={setParams} grouped />

      <button
        type="button"
        className={`kroen-exp-more${effectsOpen ? " is-open" : ""}`}
        aria-expanded={effectsOpen}
        onClick={() => setEffectsOpen((o) => !o)}
      >
        Effetti
      </button>
      {effectsOpen && (
        <ControlBlock controls={effectControls} params={params} setParams={setParams} />
      )}

      {advancedControls.length > 0 && (
        <details className="kroen-exp-dev">
          <summary>Tuning</summary>
          <ControlBlock controls={advancedControls} params={params} setParams={setParams} />
        </details>
      )}

      <div className="kroen-exp-actions">
        <button type="button" className="kroen-exp-action" onClick={randomize}>
          Shuffle
        </button>
        <button type="button" className="kroen-exp-action kroen-exp-action--ghost" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
