"use client";

import { useEffect, useRef } from "react";

import {
  EXPERIENCE_CONTROLS,
  EXPERIENCE_GROUPS,
  EXPERIENCE_PRESET_IDS,
  EXPERIENCE_PRESET_LABELS,
  EXPERIENCE_SWATCHES,
  formatControlValue,
} from "../../lib/kroen-field-config";
import { useKroenFieldParams } from "./KroenFieldContext";

const SHOW_ADVANCED = process.env.NODE_ENV === "development";

function Control({ control, value, onChange }) {
  const { key, label, type } = control;

  if (type === "color") {
    const pick = (hex) =>
      onChange((prev) => ({ [key]: hex, dotColorMix: Math.max(0.6, prev.dotColorMix) }));
    return (
      <div className="kroen-exp-row kroen-exp-row--color">
        <span className="kroen-exp-row__label">{label}</span>
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
          <label className="kroen-exp-swatch kroen-exp-swatch--picker" aria-label="Colore personalizzato">
            <input
              type="color"
              value={value}
              onChange={(e) => pick(e.target.value)}
            />
          </label>
        </div>
      </div>
    );
  }

  if (type === "toggle") {
    return (
      <label className="kroen-exp-row kroen-exp-row--toggle">
        <span className="kroen-exp-row__label">{label}</span>
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

  return (
    <label className="kroen-exp-row">
      <span className="kroen-exp-row__label">
        {label} <output>{formatControlValue(control, value)}</output>
      </span>
      <input
        type="range"
        min={control.min}
        max={control.max}
        step={control.step}
        value={value}
        onChange={(e) => onChange({ [key]: Number(e.target.value) })}
      />
    </label>
  );
}

export default function KroenExperiencePanel({ dockRef }) {
  const { panelOpen, setPanelOpen, preset, params, setPreset, setParams, randomize, reset } =
    useKroenFieldParams();
  const panelRef = useRef(null);
  const firstChipRef = useRef(null);

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

  const groups = EXPERIENCE_GROUPS.map((group) => ({
    group,
    controls: EXPERIENCE_CONTROLS.filter(
      (c) => c.group === group && (SHOW_ADVANCED || !c.advanced),
    ),
  })).filter((g) => g.controls.length > 0);

  return (
    <div
      id="kroen-exp-panel"
      ref={panelRef}
      className="kroen-exp-panel"
      role="dialog"
      aria-label="Regola la tua esperienza"
    >
      <div className="kroen-exp-panel__head">
        <strong>Esperienza</strong>
        <button
          type="button"
          className="kroen-exp-panel__close"
          aria-label="Chiudi"
          onClick={() => setPanelOpen(false)}
        >
          ×
        </button>
      </div>

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

      <div className="kroen-exp-groups">
        {groups.map(({ group, controls }) => (
          <fieldset
            key={group}
            className={`kroen-exp-group${group === "Avanzate" ? " kroen-exp-group--advanced" : ""}`}
          >
            <legend>{group}</legend>
            {controls.map((c) => (
              <Control key={c.key} control={c} value={params[c.key]} onChange={setParams} />
            ))}
          </fieldset>
        ))}
      </div>

      <div className="kroen-exp-actions">
        <button type="button" className="kroen-exp-action kroen-exp-action--primary" onClick={randomize}>
          Randomizza
        </button>
        <button type="button" className="kroen-exp-action" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
