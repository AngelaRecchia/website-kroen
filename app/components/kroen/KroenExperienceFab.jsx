"use client";

import { useKroenFieldParams } from "./KroenFieldContext";

export default function KroenExperienceFab() {
  const { panelOpen, setPanelOpen, params } = useKroenFieldParams();

  return (
    <button
      type="button"
      className={`kroen-exp-fab${panelOpen ? " is-open" : ""}`}
      aria-expanded={panelOpen}
      aria-controls="kroen-exp-panel"
      aria-label={panelOpen ? "Chiudi esperienza" : "Esperienza"}
      onClick={() => setPanelOpen((o) => !o)}
      style={{ "--exp-dot": params.dotColorMix > 0.05 ? params.dotColor : "var(--color-red)" }}
    >
      <span className="kroen-exp-fab__icon" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
