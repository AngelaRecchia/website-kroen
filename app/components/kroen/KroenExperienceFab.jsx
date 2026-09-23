"use client";

import { EXPERIENCE_PRESET_LABELS } from "../../lib/kroen-field-config";
import { useKroenFieldParams } from "./KroenFieldContext";

export default function KroenExperienceFab() {
  const { panelOpen, setPanelOpen, preset, params } = useKroenFieldParams();

  return (
    <button
      type="button"
      className={`kroen-exp-fab${panelOpen ? " is-open" : ""}`}
      aria-expanded={panelOpen}
      aria-controls="kroen-exp-panel"
      aria-label={panelOpen ? "Chiudi esperienza" : "Regola esperienza"}
      onClick={() => setPanelOpen((o) => !o)}
      style={{ "--exp-dot": params.dotColorMix > 0.05 ? params.dotColor : "var(--color-red)" }}
    >
      <span className="kroen-exp-fab__icon" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="kroen-exp-fab__text">
        Esperienza
        <span className="kroen-exp-fab__preset">{EXPERIENCE_PRESET_LABELS[preset]}</span>
      </span>
    </button>
  );
}
