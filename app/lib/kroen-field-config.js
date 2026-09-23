/** Parametri shader campo WebGL (#kroen-field) — defaults con più contrasto, meno rosso piatto */

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
};

export function mergeKroenFieldParams(partial) {
  return { ...KROEN_FIELD_DEFAULTS, ...partial };
}
