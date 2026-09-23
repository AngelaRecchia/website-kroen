/** Parametri shader campo WebGL (#kroen-field) e preset "Esperienza" */

export const KROEN_FIELD_DEFAULTS = {
  /** Sfondo tra i puntini: 0 = rosso brand, 1 = rosso deep */
  baseDeepMix: 0.78,
  /** Puntini: quanto tirare verso il rosso brand rispetto alla base */
  dotRedMix: 0.92,
  /** Schiaritura bianca vicino al cursore sui dot */
  highlight: 0.42,
  dotSizeBase: 0.12,
  dotSizeFlash: 0.22,
  dotSizeNear: 0.28,
  dotSoftness: 0.09,
  rippleAmp: 14,
  rippleFreq: 0.045,
  rippleDecay: 0.0085,
  grain: 0.028,
  cellSize: 15,
  dotColor: "#c91515",
  /** 0 = dot nel rosso brand, 1 = dot interamente in dotColor */
  dotColorMix: 0,
  /** Moltiplicatore del tempo; 0 = campo statico */
  speed: 1,
  hueSpeed: 0,
  /** Segmenti caleidoscopio (< 2 = disattivo) */
  kaleido: 0,
  chroma: 0,
  swirl: 0,
  /** 0 = cerchio, 1 = quadrato */
  dotShape: 0,
  invert: false,
  mouseLag: 0.09,
  shockAmp: 12,
  ringEnabled: true,
  ringScale: 1,
};

export const EXPERIENCE_PRESET_IDS = ["none", "mild", "psych", "hard", "custom"];

export const EXPERIENCE_PRESET_LABELS = {
  none: "No animation",
  mild: "Mild",
  psych: "Psych",
  hard: "Hard",
  custom: "Custom",
};

export const EXPERIENCE_PRESETS = {
  none: {
    ...KROEN_FIELD_DEFAULTS,
    speed: 0,
    rippleAmp: 0,
    grain: 0,
    hueSpeed: 0,
    shockAmp: 0,
    ringEnabled: false,
  },
  mild: {
    ...KROEN_FIELD_DEFAULTS,
    rippleAmp: 8,
    grain: 0.015,
    shockAmp: 10,
  },
  psych: {
    ...KROEN_FIELD_DEFAULTS,
    highlight: 0.6,
    rippleAmp: 18,
    speed: 1.2,
    hueSpeed: 0.6,
    kaleido: 6,
    chroma: 0.5,
    swirl: 1.2,
    dotColor: "#00e5ff",
    dotColorMix: 0.7,
    shockAmp: 25,
    ringScale: 1.3,
  },
  /* Niente strobo né flash a piena luminosità (fotosensibilità) */
  hard: {
    ...KROEN_FIELD_DEFAULTS,
    baseDeepMix: 0.95,
    highlight: 0.8,
    dotSizeNear: 0.4,
    rippleAmp: 28,
    cellSize: 10,
    grain: 0.08,
    speed: 1.8,
    chroma: 0.9,
    swirl: -0.8,
    dotShape: 1,
    mouseLag: 0.2,
    shockAmp: 35,
    ringScale: 1.5,
  },
};

export const EXPERIENCE_GROUPS = ["Colore", "Movimento", "Trip", "Cursore", "Avanzate"];

export const EXPERIENCE_SWATCHES = [
  "#c91515",
  "#ffffff",
  "#000000",
  "#ffd400",
  "#00e5ff",
  "#39ff14",
  "#ff2bd6",
];

export const EXPERIENCE_CONTROLS = [
  { key: "dotColor", label: "Colore dot", type: "color", group: "Colore" },
  { key: "dotColorMix", label: "Intensità colore", type: "range", min: 0, max: 1, step: 0.01, group: "Colore" },
  { key: "highlight", label: "Luce cursore", type: "range", min: 0, max: 1, step: 0.01, group: "Colore" },
  { key: "invert", label: "Inverti", type: "toggle", group: "Colore" },

  { key: "speed", label: "Velocità", type: "range", min: 0, max: 3, step: 0.05, randomMin: 0.3, group: "Movimento" },
  { key: "rippleAmp", label: "Onde", type: "range", min: 0, max: 30, step: 0.5, group: "Movimento" },
  { key: "mouseLag", label: "Reattività cursore", type: "range", min: 0.02, max: 0.3, step: 0.01, group: "Movimento" },
  { key: "shockAmp", label: "Onda d'urto (click)", type: "range", min: 0, max: 40, step: 1, group: "Movimento" },

  { key: "hueSpeed", label: "Arcobaleno", type: "range", min: 0, max: 2, step: 0.05, group: "Trip" },
  { key: "kaleido", label: "Caleidoscopio", type: "range", min: 0, max: 12, step: 1, group: "Trip" },
  { key: "chroma", label: "Split RGB", type: "range", min: 0, max: 1, step: 0.01, group: "Trip" },
  { key: "swirl", label: "Vortice", type: "range", min: -3, max: 3, step: 0.05, group: "Trip" },
  { key: "dotShape", label: "Cerchio → quadrato", type: "range", min: 0, max: 1, step: 0.01, group: "Trip" },
  { key: "grain", label: "Grana", type: "range", min: 0, max: 0.12, step: 0.002, group: "Trip" },
  { key: "cellSize", label: "Griglia px", type: "range", min: 8, max: 28, step: 1, group: "Trip" },

  { key: "ringEnabled", label: "Anello cursore", type: "toggle", group: "Cursore" },
  { key: "ringScale", label: "Dimensione anello", type: "range", min: 0.5, max: 2, step: 0.05, group: "Cursore" },

  { key: "baseDeepMix", label: "Base scura (deep)", type: "range", min: 0, max: 1, step: 0.01, group: "Avanzate", advanced: true },
  { key: "dotRedMix", label: "Dot → rosso", type: "range", min: 0, max: 1, step: 0.01, group: "Avanzate", advanced: true },
  { key: "dotSizeBase", label: "Dot size base", type: "range", min: 0.05, max: 0.35, step: 0.01, group: "Avanzate", advanced: true },
  { key: "dotSizeFlash", label: "Dot size flash", type: "range", min: 0, max: 0.5, step: 0.01, group: "Avanzate", advanced: true },
  { key: "dotSizeNear", label: "Dot size near", type: "range", min: 0, max: 0.6, step: 0.01, group: "Avanzate", advanced: true },
  { key: "dotSoftness", label: "Dot morbidezza", type: "range", min: 0.02, max: 0.2, step: 0.005, group: "Avanzate", advanced: true },
  { key: "rippleFreq", label: "Ripple freq", type: "range", min: 0.005, max: 0.15, step: 0.001, group: "Avanzate", advanced: true },
  { key: "rippleDecay", label: "Ripple decay", type: "range", min: 0.001, max: 0.03, step: 0.0005, group: "Avanzate", advanced: true },
];

export function mergeKroenFieldParams(...partials) {
  return Object.assign({}, KROEN_FIELD_DEFAULTS, ...partials);
}

function randomHex() {
  const h = Math.random() * 360;
  const s = 0.85;
  const l = 0.55;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function randomExperienceParams() {
  const out = {};
  for (const c of EXPERIENCE_CONTROLS) {
    if (c.advanced) continue;
    if (c.type === "color") out[c.key] = randomHex();
    else if (c.type === "toggle") out[c.key] = c.key === "ringEnabled" ? Math.random() < 0.8 : Math.random() < 0.25;
    else {
      const min = c.randomMin ?? c.min;
      const raw = min + Math.random() * (c.max - min);
      out[c.key] = Math.round(raw / c.step) * c.step;
    }
  }
  return out;
}

export function formatControlValue(control, value) {
  if (control.step >= 1) return String(Math.round(value));
  if (control.step < 0.01) return Number(value).toFixed(3);
  return Number(value).toFixed(2);
}
