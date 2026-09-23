export const d2r = Math.PI / 180;
export const TAU = Math.PI * 2;
export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutBack = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};

export function tween(durationMs, ease, fn, reducedMotion) {
  const d = reducedMotion ? 1 : durationMs;
  const t0 = performance.now();
  return new Promise((resolve) => {
    const step = (now) => {
      const p = clamp01((now - t0) / d);
      fn(ease(p), p);
      if (p < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

export function wait(ms, reducedMotion) {
  return new Promise((r) => setTimeout(r, reducedMotion ? 0 : ms));
}
