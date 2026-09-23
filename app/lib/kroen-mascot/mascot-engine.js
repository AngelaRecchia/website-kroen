import { RIG } from "./rig-data.js";
import { BARREL_PATH } from "./barrel-path.js";
import {
  d2r,
  TAU,
  clamp01,
  lerp,
  easeInOutCubic,
  easeOutCubic,
  easeOutBack,
  tween,
  wait,
} from "./easing.js";

const RUN_HZ = 2.5;
const PIV = [
  [1240, 1000],
  [1225, 830],
  [1000, 930],
  [1245, 860],
  [520, 1400],
  [1780, 1400],
];

const SMILE = [
  [884.9, 407.2],
  [998.0, 555.0],
  [1581.2, 551.1],
  [1676.0, 407.8],
];
const CX = (SMILE[0][0] + SMILE[3][0]) / 2;
const K = 4 / 3;
const OL = [CX - 340, 480];
const OR = [CX + 340, 480];
const HT = 104;
const HB = 122;
const CLOSED = [
  SMILE[0],
  SMILE[1],
  SMILE[2],
  SMILE[3],
  SMILE[2],
  SMILE[1],
];
const OPEN = [
  OL,
  [OL[0], OL[1] - K * HT],
  [OR[0], OR[1] - K * HT],
  OR,
  [OR[0], OR[1] + K * HB],
  [OL[0], OL[1] + K * HB],
];

const BAR = { x0: 630, x1: 1976, y0: 86, y1: 650 };
const BCY = (BAR.y0 + BAR.y1) / 2;
const BRY = (BAR.y1 - BAR.y0) / 2 - 8;
const NSTR = 6;

const F_CX = 1150;
const F_CY = 1774;
const F_OFF = 100;
const FLOOR_REST = {
  A: [840, 1704, 1090, 1704],
  B: [1210, 1704, 1460, 1704],
  C: [840, 1844, 1460, 1844],
};
const FLOOR_OPEN = {
  A: [F_CX - F_OFF, F_CY - F_OFF, F_CX, F_CY],
  B: [F_CX, F_CY, F_CX + F_OFF, F_CY + F_OFF],
  C: [F_CX - F_OFF, F_CY + F_OFF, F_CX + F_OFF, F_CY - F_OFF],
};

const DRIPS = [
  [0.07, 70, 22],
  [0.19, 130, 28],
  [0.33, 50, 18],
  [0.41, 110, 26],
  [0.58, 150, 30],
  [0.66, 60, 20],
  [0.79, 120, 26],
  [0.91, 90, 22],
];

function b64(s) {
  if (typeof atob === "undefined") return new Uint8Array(0);
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

const PTS = new Int16Array(b64(RIG.pts).buffer);
const WTS = b64(RIG.w);
const NP = RIG.n;

const rotAbout = (deg, px, py, tx = 0, ty = 0) => {
  const r = deg * d2r;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [c, s, -s, c, px - (c * px - s * py) + tx, py - (s * px + c * py) + ty];
};

const mul = (A, B) => [
  A[0] * B[0] + A[2] * B[1],
  A[1] * B[0] + A[3] * B[1],
  A[0] * B[2] + A[2] * B[3],
  A[1] * B[2] + A[3] * B[3],
  A[0] * B[4] + A[2] * B[5] + A[4],
  A[1] * B[4] + A[3] * B[5] + A[5],
];

const f1 = (n) => n.toFixed(1);

export function createMascotEngine(getRefs, { getPopEl } = {}) {
  let reducedMotion = false;
  let rafId = 0;
  let running = false;

  let runAmp = 0;
  let runTarget = 0;
  let runPhase = 0;
  let runSpeed = 1;
  let rollTilt = 0;

  let spinV = 0;
  let spinTarget = 0;
  let spinPhase = 0;

  let dirty = true;
  let last = performance.now();

  let paintEl = null;
  let paintLinks = [];
  let menuOpen = false;
  let menuAnimating = false;
  let splashLocked = false;
  const menuListeners = new Set();

  function createChannel() {
    let v = 0;
    let token = 0;
    return {
      get value() {
        return v;
      },
      set value(n) {
        v = n;
        dirty = true;
      },
      to(target, { dur, delay = 0, ease = easeInOutCubic }) {
        token += 1;
        const my = token;
        const from = v;
        const d = reducedMotion ? 1 : dur;
        const t0 = performance.now() + (reducedMotion ? 0 : delay);
        return new Promise((resolve) => {
          const step = (now) => {
            if (my !== token) return resolve(false);
            const p = clamp01((now - t0) / d);
            if (now >= t0) {
              v = from + (target - from) * ease(p);
              dirty = true;
            }
            if (p < 1) requestAnimationFrame(step);
            else {
              v = target;
              dirty = true;
              resolve(true);
            }
          };
          requestAnimationFrame(step);
        });
      },
    };
  }

  const mouthCh = createChannel();
  const fillCh = createChannel();
  const paintCh = createChannel();
  const xCh = createChannel();

  function notifyMenu() {
    menuListeners.forEach((fn) => fn(menuOpen));
  }

  function popSvg(k = 1) {
    if (reducedMotion) return;
    const el = getPopEl?.() || getRefs()?.root;
    if (!el?.animate) return;
    el.animate(
      [
        { transform: "scale(1)" },
        { transform: `scale(${1 - 0.08 * k})`, offset: 0.25 },
        { transform: `scale(${1 + 0.05 * k})`, offset: 0.6 },
        { transform: "scale(1)" },
      ],
      { duration: 320, easing: "ease-out" },
    );
  }

  function pose() {
    const A = runAmp;
    const s = Math.sin(runPhase);
    const T0 = rotAbout(3.2 * A, PIV[0][0], PIV[0][1], 0, -24 * A * Math.abs(s));
    const halfL = rotAbout(5.5 * A * s, PIV[2][0], PIV[2][1], 0, -26 * Math.max(0, s));
    const halfR = rotAbout(
      5.5 * A * s,
      PIV[3][0],
      PIV[3][1],
      0,
      -26 * Math.max(0, -s),
    );
    return [
      T0,
      mul(
        T0,
        rotAbout(
          2.6 * A * Math.sin(2 * runPhase + 0.9) + rollTilt,
          PIV[1][0],
          PIV[1][1],
        ),
      ),
      mul(T0, halfL),
      mul(T0, halfR),
      mul(
        T0,
        mul(halfL, rotAbout(17 * A * Math.sin(runPhase + 0.6), PIV[4][0], PIV[4][1])),
      ),
      mul(
        T0,
        mul(
          halfR,
          rotAbout(
            -17 * A * Math.sin(runPhase + 0.6 + Math.PI),
            PIV[5][0],
            PIV[5][1],
          ),
        ),
      ),
    ];
  }

  function skin(M) {
    const out = new Array(NP * 2);
    for (let i = 0; i < NP; i++) {
      const x = PTS[2 * i] / 2;
      const y = PTS[2 * i + 1] / 2;
      let X = 0;
      let Y = 0;
      for (let k = 0; k < 6; k++) {
        const w = WTS[6 * i + k];
        if (!w) continue;
        const m = M[k];
        X += w * (m[0] * x + m[2] * y + m[4]);
        Y += w * (m[1] * x + m[3] * y + m[5]);
      }
      out[2 * i] = X / 255;
      out[2 * i + 1] = Y / 255;
    }
    let d = "";
    let p = 0;
    for (const n of RIG.segs) {
      d += "M" + out[2 * p].toFixed(1) + " " + out[2 * p + 1].toFixed(1);
      p++;
      for (let j = 0; j < n; j++) {
        d +=
          "C" +
          out[2 * p].toFixed(1) +
          " " +
          out[2 * p + 1].toFixed(1) +
          " " +
          out[2 * p + 2].toFixed(1) +
          " " +
          out[2 * p + 3].toFixed(1) +
          " " +
          out[2 * p + 4].toFixed(1) +
          " " +
          out[2 * p + 5].toFixed(1);
        p += 3;
      }
      d += "Z";
    }
    return d;
  }

  function draw(now = performance.now()) {
    const refs = getRefs();
    if (!refs?.body) return;

    const M = pose();
    refs.body.setAttribute("d", skin(M));
    const R = M[1];
    refs.rollerG.setAttribute(
      "transform",
      `matrix(${R.map((v) => v.toFixed(5)).join(" ")})`,
    );

    const mo = mouthCh.value;
    const mix = CLOSED.map((p, i) => [
      lerp(p[0], OPEN[i][0], mo),
      lerp(p[1], OPEN[i][1], mo),
    ]);
    const [L, a1, a2, Rr, b1, b2] = mix;
    refs.mouth.setAttribute(
      "d",
      `M${f1(L[0])} ${f1(L[1])}C${f1(a1[0])} ${f1(a1[1])} ${f1(a2[0])} ${f1(a2[1])} ${f1(Rr[0])} ${f1(Rr[1])}C${f1(b1[0])} ${f1(b1[1])} ${f1(b2[0])} ${f1(b2[1])} ${f1(L[0])} ${f1(L[1])}Z`,
    );
    refs.mouth.setAttribute("stroke-width", f1(lerp(64, 48, clamp01(mo))));

    const eyes = [
      { el: refs.eyeL, y: 299 },
      { el: refs.eyeR, y: 301 },
    ];
    for (const e of eyes) {
      e.el.setAttribute("r", f1(54 * (1 + 0.28 * mo)));
      e.el.setAttribute("cy", f1(e.y - 40 * mo));
    }

    const spinAmt = clamp01(Math.abs(spinV) / 8);
    refs.stripes.forEach((l, i) => {
      const th = spinPhase + (i * TAU) / NSTR;
      const c = Math.cos(th);
      if (c <= 0.04 || spinAmt < 0.01) {
        l.setAttribute("opacity", "0");
        return;
      }
      l.setAttribute("y1", f1(BCY + BRY * Math.sin(th)));
      l.setAttribute("y2", f1(BCY + BRY * Math.sin(th)));
      l.setAttribute("stroke-width", f1(14 + 40 * c));
      l.setAttribute("opacity", (0.5 * c * spinAmt).toFixed(2));
    });

    const H = BAR.y1 - BAR.y0 + 40;
    const h = fillCh.value * H;
    refs.fillRect.setAttribute("y", f1(BAR.y1 + 20 - h));
    refs.fillRect.setAttribute("height", f1(Math.max(0, h)));

    const xv = clamp01(xCh.value);
    const setLine = (el, rest, open) => {
      el.setAttribute("x1", f1(lerp(rest[0], open[0], xv)));
      el.setAttribute("y1", f1(lerp(rest[1], open[1], xv)));
      el.setAttribute("x2", f1(lerp(rest[2], open[2], xv)));
      el.setAttribute("y2", f1(lerp(rest[3], open[3], xv)));
    };
    setLine(refs.floorA, FLOOR_REST.A, FLOOR_OPEN.A);
    setLine(refs.floorB, FLOOR_REST.B, FLOOR_OPEN.B);
    setLine(refs.floorC, FLOOR_REST.C, FLOOR_OPEN.C);
    refs.floorMid.setAttribute("opacity", f1(1 - xv));

    const p = paintCh.value;
    if (paintEl) {
      if (p > 0.001) {
        const W = window.innerWidth;
        const Hh = window.innerHeight;
        const maxD = 160;
        const Y = p * (Hh + maxD + 40);
        const amp = 16 * Math.sin(Math.PI * clamp01(p * 1.05));
        const pts = ["0px -2px", `${W + 2}px -2px`];
        const N = 72;
        const ph = now / 300;
        for (let i = N; i >= 0; i -= 1) {
          const x = (W * i) / N;
          let y = Y + amp * Math.sin(x * 0.012 + ph);
          for (const [rx, len, wd] of DRIPS) {
            const u = (x - rx * W) / wd;
            y +=
              len *
              Math.exp(-u * u) *
              clamp01(p * 1.6) *
              (1 - clamp01((p - 0.85) * 6.7));
          }
          pts.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`);
        }
        paintEl.style.visibility = "visible";
        paintEl.style.clipPath = `polygon(${pts.join(",")})`;
        paintEl.setAttribute("aria-hidden", "false");
      } else {
        paintEl.style.visibility = "hidden";
        paintEl.style.clipPath = "polygon(0 0,0 0,0 0)";
        paintEl.setAttribute("aria-hidden", "true");
      }
      paintLinks.forEach((a, i) => {
        const q = easeOutCubic(clamp01((p - 0.45 - i * 0.08) / 0.45));
        a.style.transform = `translateY(${((1 - q) * 115).toFixed(1)}%)`;
      });
    }
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    runAmp += (runTarget - runAmp) * (1 - Math.exp(-dt * 7));
    if (runTarget === 0 && runAmp < 0.003) runAmp = 0;
    if (runAmp > 0) runPhase += dt * RUN_HZ * TAU * runSpeed;
    spinV += (spinTarget - spinV) * (1 - Math.exp(-dt * 4));
    if (Math.abs(spinV) < 0.02 && spinTarget === 0) spinV = 0;
    spinPhase += dt * spinV;
    if (
      dirty ||
      runAmp > 0 ||
      spinV !== 0 ||
      rollTilt !== 0 ||
      paintCh.value > 0.001
    ) {
      draw(now);
      dirty = false;
    }
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    last = performance.now();
    dirty = true;
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  function setRollTilt(v) {
    rollTilt = v;
    dirty = true;
  }

  async function runSplash({ animEl }) {
    if (!animEl) return;
    if (reducedMotion) return;

    animEl.classList.add("is-splash-anim");

    const r = animEl.getBoundingClientRect();
    const fx = r.left + r.width / 2;
    const fy = r.top + r.height / 2;

    animEl.style.position = "fixed";
    animEl.style.left = `${fx}px`;
    animEl.style.top = `${fy}px`;
    animEl.style.width = `${r.width}px`;
    animEl.style.margin = "0";
    animEl.style.transform = "translate(-50%, -50%)";
    animEl.style.transformOrigin = "center center";
    animEl.style.zIndex = "56";

    await wait(30, reducedMotion);

    const bigW = Math.min(
      window.innerWidth * 0.46,
      360,
      window.innerHeight * 0.34 * 1.356,
    );
    const S0 = bigW / r.width;
    const cxStart = -bigW * 0.7;
    const cyStart = fy + window.innerHeight * 0.05;

    const put = (cx, cy, s, sx = 1, sy = 1) => {
      animEl.style.transform = `translate(calc(-50% + ${(cx - fx).toFixed(1)}px), calc(-50% + ${(cy - fy).toFixed(1)}px)) scale(${(s * sx).toFixed(3)}, ${(s * sy).toFixed(3)})`;
    };
    put(cxStart, cyStart, S0);

    spinTarget = 6;
    let prevCx = cxStart;

    await tween(
      1000,
      easeInOutCubic,
      (e) => {
        const cx = lerp(cxStart, fx, e);
        const cy = lerp(cyStart, fy, e);
        const s = lerp(S0, 1, e);
        rollTilt += (cx - prevCx) * 0.05;
        prevCx = cx;
        dirty = true;
        put(cx, cy, s);
      },
      reducedMotion,
    );

    await tween(
      360,
      easeOutCubic,
      (e, p) => {
        rollTilt = lerp(rollTilt, 0, e);
        dirty = true;
        put(
          fx,
          fy,
          1,
          1 + 0.09 * Math.sin(Math.PI * p),
          1 - 0.12 * Math.sin(Math.PI * p),
        );
      },
      reducedMotion,
    );

    animEl.style.position = "";
    animEl.style.left = "";
    animEl.style.top = "";
    animEl.style.width = "";
    animEl.style.margin = "";
    animEl.style.transform = "";
    animEl.style.zIndex = "";
    animEl.classList.remove("is-splash-anim");
    rollTilt = 0;
    spinTarget = 0;
    dirty = true;
  }

  async function openMenu() {
    if (menuOpen || menuAnimating || splashLocked) return;
    menuAnimating = true;
    menuOpen = true;
    notifyMenu();
    document.documentElement.style.overflow = "hidden";

    if (reducedMotion) {
      spinTarget = 0;
      rollTilt = 0;
      fillCh.value = 1;
      xCh.value = 1;
      paintCh.value = 1;
      draw();
      menuAnimating = false;
      return;
    }

    spinTarget = 9;
    rollTilt = 0;
    popSvg(1.1);
    fillCh.to(1, { dur: 650, ease: easeInOutCubic });
    xCh.to(1, { dur: 420, delay: 80, ease: easeOutBack });
    await wait(420, reducedMotion);
    if (!menuOpen) {
      menuAnimating = false;
      return;
    }
    await paintCh.to(1, { dur: 1150, ease: easeInOutCubic });
    if (menuOpen) spinTarget = 0;
    menuAnimating = false;
  }

  async function closeMenu() {
    if (!menuOpen || menuAnimating) return;
    menuAnimating = true;
    menuOpen = false;
    notifyMenu();

    if (reducedMotion) {
      spinTarget = 0;
      fillCh.value = 0;
      xCh.value = 0;
      paintCh.value = 0;
      document.documentElement.style.overflow = "";
      draw();
      menuAnimating = false;
      return;
    }

    spinTarget = -9;
    xCh.to(0, { dur: 320, ease: easeInOutCubic });
    await paintCh.to(0, { dur: 850, ease: easeInOutCubic });
    document.documentElement.style.overflow = "";
    spinTarget = 0;
    fillCh.to(0, { dur: 450, ease: easeInOutCubic });
    menuAnimating = false;
  }

  function toggleMenu() {
    if (menuOpen) closeMenu();
    else openMenu();
  }

  function setPaintLayer(el) {
    paintEl = el;
    paintLinks = el ? [...el.querySelectorAll("a.kroen-paint__link")] : [];
    dirty = true;
    draw();
  }

  function onMenuChange(fn) {
    menuListeners.add(fn);
    fn(menuOpen);
    return () => menuListeners.delete(fn);
  }

  function setSplashLocked(locked) {
    splashLocked = locked;
  }

  return {
    start,
    stop,
    draw,
    setRollTilt,
    runSplash,
    openMenu,
    closeMenu,
    toggleMenu,
    setPaintLayer,
    onMenuChange,
    setSplashLocked,
    getMenuOpen: () => menuOpen,
    BARREL_PATH,
  };
}
