"use client";

import { useEffect, useRef } from "react";

import { useKroenFieldParams } from "./KroenFieldContext";

function hexToRgb(cssColor) {
  const h = cssColor.trim().replace("#", "");
  if (h.length < 6) return [0.89, 0.12, 0.12];
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

function readCssRgb(varName, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName);
  return hexToRgb(raw || fallback);
}

export default function KroenField() {
  const canvasRef = useRef(null);
  const { params } = useKroenFieldParams();
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const cv = canvasRef.current;
    if (!cv) return;

    const gl = cv.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      cv.style.display = "none";
      return;
    }

    let prog;
    const u = {};
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let smx = 0.5;
    let smy = 0.5;
    let mx = innerWidth / 2;
    let my = innerHeight / 2;
    let rx = mx;
    let ry = my;
    let lastMove = performance.now();
    let raf = 0;

    function init() {
      const vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
      const fs = [
        "precision highp float;",
        "uniform vec2 uRes;uniform vec2 uMouse;uniform float uTime;uniform float uDpr;",
        "uniform vec3 uRed;uniform vec3 uRedDeep;",
        "uniform float uBaseDeepMix;uniform float uDotRedMix;uniform float uHighlight;",
        "uniform float uDotSizeBase;uniform float uDotSizeFlash;uniform float uDotSizeNear;",
        "uniform float uDotSoftness;uniform float uRippleAmp;uniform float uRippleFreq;",
        "uniform float uRippleDecay;uniform float uGrain;uniform float uCellSize;",
        "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
        "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
        " return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
        "void main(){",
        " vec2 p=gl_FragCoord.xy;",
        " vec2 m=uMouse*uRes;",
        " vec2 d=p-m; float dist=length(d)/uDpr;",
        " float rip=sin(dist*uRippleFreq-uTime*2.4)*exp(-dist*uRippleDecay);",
        " vec2 q=p+normalize(d+vec2(.0001))*rip*uRippleAmp*uDpr;",
        " float cell=uCellSize*uDpr;",
        " float fl=n(q/uDpr*.0035+vec2(uTime*.04,-uTime*.03));",
        " vec2 g=fract(q/cell)-.5;",
        " float r=length(g);",
        " float near=exp(-dist*.0075);",
        " float size=uDotSizeBase+uDotSizeFlash*fl+uDotSizeNear*near;",
        " float dot_=smoothstep(size,size-uDotSoftness,r);",
        " vec3 base=mix(uRed,uRedDeep,uBaseDeepMix);",
        " vec3 dotCol=mix(base,uRed,uDotRedMix);",
        " vec3 col=mix(base,dotCol,dot_);",
        " col=mix(col,vec3(1.),dot_*near*uHighlight);",
        " col+=(h(p+uTime)-.5)*uGrain;",
        " gl_FragColor=vec4(col,1.);",
        "}",
      ].join("\n");

      function sh(t, s) {
        const o = gl.createShader(t);
        gl.shaderSource(o, s);
        gl.compileShader(o);
        if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) {
          throw new Error(gl.getShaderInfoLog(o));
        }
        return o;
      }

      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(prog);
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      const loc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      [
        "uRes",
        "uMouse",
        "uTime",
        "uDpr",
        "uRed",
        "uRedDeep",
        "uBaseDeepMix",
        "uDotRedMix",
        "uHighlight",
        "uDotSizeBase",
        "uDotSizeFlash",
        "uDotSizeNear",
        "uDotSoftness",
        "uRippleAmp",
        "uRippleFreq",
        "uRippleDecay",
        "uGrain",
        "uCellSize",
      ].forEach((k) => {
        u[k] = gl.getUniformLocation(prog, k);
      });
      resize();
    }

    function resize() {
      cv.width = Math.round(innerWidth * dpr);
      cv.height = Math.round(innerHeight * dpr);
      gl.viewport(0, 0, cv.width, cv.height);
    }

    function applyColors() {
      gl.uniform3fv(u.uRed, readCssRgb("--color-red", "#C91515"));
      gl.uniform3fv(u.uRedDeep, readCssRgb("--color-red-deep", "#8F0C0C"));
    }

    function applyParams() {
      const p = paramsRef.current;
      gl.uniform1f(u.uBaseDeepMix, p.baseDeepMix);
      gl.uniform1f(u.uDotRedMix, p.dotRedMix);
      gl.uniform1f(u.uHighlight, p.highlight);
      gl.uniform1f(u.uDotSizeBase, p.dotSizeBase);
      gl.uniform1f(u.uDotSizeFlash, p.dotSizeFlash);
      gl.uniform1f(u.uDotSizeNear, p.dotSizeNear);
      gl.uniform1f(u.uDotSoftness, p.dotSoftness);
      gl.uniform1f(u.uRippleAmp, p.rippleAmp);
      gl.uniform1f(u.uRippleFreq, p.rippleFreq);
      gl.uniform1f(u.uRippleDecay, p.rippleDecay);
      gl.uniform1f(u.uGrain, p.grain);
      gl.uniform1f(u.uCellSize, p.cellSize);
    }

    function onMove(e) {
      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now();
    }

    function frame(t) {
      const now = t / 1000;
      const idle = performance.now() - lastMove > 3500;
      const tx = idle
        ? innerWidth * (0.5 + 0.32 * Math.sin(now * 0.37))
        : mx;
      const ty = idle
        ? innerHeight * (0.45 + 0.28 * Math.sin(now * 0.53 + 1.3))
        : my;
      smx += (tx / innerWidth - smx) * 0.09;
      smy += (1 - ty / innerHeight - smy) * 0.09;
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;

      window.dispatchEvent(
        new CustomEvent("kroen-pointer", {
          detail: { rx, ry, mx, my },
        }),
      );

      applyParams();
      gl.uniform2f(u.uRes, cv.width, cv.height);
      gl.uniform2f(u.uMouse, smx, smy);
      gl.uniform1f(u.uTime, now);
      gl.uniform1f(u.uDpr, dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }

    try {
      init();
      applyColors();
      applyParams();
      window.addEventListener("resize", resize);
      window.addEventListener("mousemove", onMove);
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden && !raf) raf = requestAnimationFrame(frame);
      });
      raf = requestAnimationFrame(frame);
    } catch {
      cv.style.display = "none";
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas id="kroen-field" ref={canvasRef} aria-hidden="true" />;
}
