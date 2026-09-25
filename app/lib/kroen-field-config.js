/** Parametri shader campo WebGL (#kroen-field) e preset "Esperienza" */

export const KROEN_FIELD_DEFAULTS = {
  /** 0 = sfondo --color-red; 1 = sfondo rosso scuro */
  baseDeepMix: 0,
  /** 0 = dot --color-red-deep; 1 = dot rosso Kroen */
  dotRedMix: 0,
  highlight: 0.28,
  dotSizeBase: 0.12,
  dotSizeFlash: 0.22,
  dotSizeNear: 0.28,
  dotSoftness: 0.09,
  rippleAmp: 14,
  rippleFreq: 0.045,
  rippleDecay: 0.0085,
  grain: 0.028,
  cellSize: 15,
  dotColor: "#8f0c0c",
  dotColorMix: 0,
  speed: 1,
  /** Rotazione tinta globale (arcobaleno) */
  hueSpeed: 0,
  /** Deriva lenta del colore dei dot (0 = fisso) */
  colorShift: 0,
  kaleido: 0,
  chroma: 0,
  swirl: 0,
  dotShape: 0,
  invert: false,
  mouseLag: 0.09,
  shockAmp: 12,
  ringEnabled: true,
  ringScale: 1,
};

export const EXPERIENCE_PRESET_IDS = ["none", "mild", "psych", "hard", "custom"];

export const EXPERIENCE_PRESET_LABELS = {
  none: "Off",
  mild: "Soft",
  psych: "Trip",
  hard: "Max",
  custom: "Tu",
};

export const EXPERIENCE_PRESETS = {
  none: {
    ...KROEN_FIELD_DEFAULTS,
    speed: 0,
    rippleAmp: 0,
    grain: 0,
    hueSpeed: 0,
    colorShift: 0,
    dotColorMix: 0,
    shockAmp: 0,
    ringEnabled: false,
  },
  mild: {
    ...KROEN_FIELD_DEFAULTS,
    speed: 0.8,
    rippleAmp: 7,
    rippleFreq: 0.036,
    rippleDecay: 0.0075,
    grain: 0.008,
    highlight: 0.4,
    dotSizeNear: 0.3,
    mouseLag: 0.1,
    shockAmp: 9,
    dotColorMix: 0.06,
    colorShift: 0,
    hueSpeed: 0,
  },
  psych: {
    ...KROEN_FIELD_DEFAULTS,
    speed: 0.95,
    rippleAmp: 13,
    rippleFreq: 0.05,
    highlight: 0.52,
    hueSpeed: 0.12,
    colorShift: 0.09,
    kaleido: 6,
    chroma: 0.3,
    swirl: 0.7,
    dotColor: "#5ad1ff",
    dotColorMix: 0.55,
    dotSizeNear: 0.32,
    grain: 0.02,
    mouseLag: 0.12,
    shockAmp: 18,
    ringScale: 1.15,
  },
  /* Niente strobo né flash a piena luminosità (fotosensibilità) */
  hard: {
    ...KROEN_FIELD_DEFAULTS,
    baseDeepMix: 0.35,
    dotRedMix: 0.55,
    highlight: 0.66,
    dotSizeNear: 0.36,
    dotSizeFlash: 0.26,
    speed: 1.3,
    rippleAmp: 21,
    rippleFreq: 0.06,
    cellSize: 11,
    grain: 0.05,
    hueSpeed: 0.24,
    colorShift: 0.16,
    chroma: 0.7,
    swirl: -0.6,
    dotShape: 0.85,
    mouseLag: 0.15,
    shockAmp: 30,
    dotColorMix: 0.3,
    ringScale: 1.35,
  },
};

export const EXPERIENCE_SWATCHES = [
  "#c91515",
  "#ffffff",
  "#ffd400",
  "#00e5ff",
  "#39ff14",
  "#ff2bd6",
];

export const EXPERIENCE_CONTROLS = [
  { key: "dotColor", label: "Colore", type: "color", tier: "main", sub: "Colore" },
  { key: "dotColorMix", label: "Forza colore", type: "range", min: 0, max: 1, step: 0.01, tier: "main", sub: "Colore" },
  {
    key: "colorShift",
    label: "Cambio colore",
    type: "range",
    min: 0,
    max: 0.45,
    step: 0.01,
    randomMax: 0.32,
    randomBias: "low",
    tier: "main",
    sub: "Colore",
  },
  {
    key: "hueSpeed",
    label: "Arcobaleno",
    type: "range",
    min: 0,
    max: 1.2,
    step: 0.01,
    randomMax: 0.4,
    randomBias: "low",
    tier: "main",
    sub: "Colore",
  },
  {
    key: "speed",
    label: "Velocità",
    type: "range",
    min: 0,
    max: 2.5,
    step: 0.05,
    randomMin: 0.25,
    randomBias: "low",
    tier: "main",
    sub: "Movimento",
  },
  { key: "rippleAmp", label: "Onde", type: "range", min: 0, max: 30, step: 0.5, tier: "main", sub: "Movimento" },
  { key: "ringEnabled", label: "Anello", type: "toggle", tier: "main", sub: "Movimento" },

  { key: "highlight", label: "Luce cursore", type: "range", min: 0, max: 1, step: 0.01, tier: "effects" },
  { key: "invert", label: "Inverti", type: "toggle", tier: "effects" },
  { key: "mouseLag", label: "Inerzia cursore", type: "range", min: 0.02, max: 0.3, step: 0.01, tier: "effects" },
  { key: "shockAmp", label: "Urto click", type: "range", min: 0, max: 40, step: 1, tier: "effects" },
  { key: "kaleido", label: "Caleidoscopio", type: "range", min: 0, max: 12, step: 1, tier: "effects" },
  { key: "chroma", label: "Split RGB", type: "range", min: 0, max: 1, step: 0.01, tier: "effects" },
  { key: "swirl", label: "Vortice", type: "range", min: -3, max: 3, step: 0.05, tier: "effects" },
  { key: "dotShape", label: "Quadrato", type: "range", min: 0, max: 1, step: 0.01, tier: "effects" },
  { key: "grain", label: "Grana", type: "range", min: 0, max: 0.12, step: 0.002, tier: "effects" },
  { key: "cellSize", label: "Griglia", type: "range", min: 8, max: 28, step: 1, tier: "effects" },
  { key: "ringScale", label: "Size anello", type: "range", min: 0.5, max: 2, step: 0.05, tier: "effects" },

  { key: "baseDeepMix", label: "Base deep", type: "range", min: 0, max: 1, step: 0.01, tier: "advanced", advanced: true },
  { key: "dotRedMix", label: "Dot chiaro", type: "range", min: 0, max: 1, step: 0.01, tier: "advanced", advanced: true },
  { key: "dotSizeBase", label: "Dot base", type: "range", min: 0.05, max: 0.35, step: 0.01, tier: "advanced", advanced: true },
  { key: "dotSizeFlash", label: "Dot flash", type: "range", min: 0, max: 0.5, step: 0.01, tier: "advanced", advanced: true },
  { key: "dotSizeNear", label: "Dot near", type: "range", min: 0, max: 0.6, step: 0.01, tier: "advanced", advanced: true },
  { key: "dotSoftness", label: "Morbidezza", type: "range", min: 0.02, max: 0.2, step: 0.005, tier: "advanced", advanced: true },
  { key: "rippleFreq", label: "Ripple freq", type: "range", min: 0.005, max: 0.15, step: 0.001, tier: "advanced", advanced: true },
  { key: "rippleDecay", label: "Ripple decay", type: "range", min: 0.001, max: 0.03, step: 0.0005, tier: "advanced", advanced: true },
];

export function mergeKroenFieldParams(...partials) {
  return Object.assign({}, KROEN_FIELD_DEFAULTS, ...partials);
}

function roundStep(value, step) {
  return Math.round(value / step) * step;
}

function randomHex() {
  const h = Math.random() * 360;
  const s = 0.72 + Math.random() * 0.2;
  const l = 0.45 + Math.random() * 0.22;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function randomColor() {
  if (Math.random() < 0.45) {
    return EXPERIENCE_SWATCHES[Math.floor(Math.random() * EXPERIENCE_SWATCHES.length)];
  }
  return randomHex();
}

function randomControlValue(control) {
  if (control.type === "toggle") {
    if (control.key === "ringEnabled") return Math.random() < 0.75;
    return Math.random() < 0.2;
  }

  const min = control.randomMin ?? control.min;
  const max = control.randomMax ?? control.max;
  let t = Math.random();
  if (control.randomBias === "low") t = t * t;
  else if (control.randomBias === "high") t = 1 - (1 - t) * (1 - t);

  return roundStep(min + t * (max - min), control.step);
}

export function randomExperienceParams() {
  const out = {
    dotColor: randomColor(),
    dotColorMix: roundStep(0.4 + Math.random() * 0.55, 0.01),
  };

  for (const c of EXPERIENCE_CONTROLS) {
    if (c.advanced || c.type === "color") continue;
    if (c.key === "dotColorMix") continue;
    out[c.key] = randomControlValue(c);
  }

  if (out.colorShift < 0.04 && out.hueSpeed < 0.05 && Math.random() < 0.35) {
    out.colorShift = roundStep(0.06 + Math.random() * 0.14, 0.01);
  }

  return out;
}

export function formatControlValue(control, value) {
  if (control.step >= 1) return String(Math.round(value));
  if (control.step < 0.01) return Number(value).toFixed(3);
  return Number(value).toFixed(2);
}

export function controlsForTier(tier, { includeAdvanced = false } = {}) {
  return EXPERIENCE_CONTROLS.filter((c) => {
    if (c.tier !== tier) return false;
    if (c.advanced && !includeAdvanced) return false;
    return true;
  });
}
