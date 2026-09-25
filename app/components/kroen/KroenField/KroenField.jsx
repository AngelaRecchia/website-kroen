"use client";

import { useEffect, useRef } from "react";

import { useKroenFieldParams } from "../KroenFieldContext";
import "./KroenField.scss";

const SHOCK_DURATION = 2.4;

function hexToRgb(cssColor) {
  const h = String(cssColor).trim().replace("#", "");
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

const VERTEX_SHADER = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 uRes;uniform vec2 uMouse;uniform float uTime;uniform float uDpr;
uniform vec3 uRed;uniform vec3 uRedDeep;uniform vec3 uDotColor;
uniform float uBaseDeepMix;uniform float uDotRedMix;uniform float uHighlight;uniform float uDotColorMix;
uniform float uDotSizeBase;uniform float uDotSizeFlash;uniform float uDotSizeNear;
uniform float uDotSoftness;uniform float uRippleAmp;uniform float uRippleFreq;
uniform float uRippleDecay;uniform float uGrain;uniform float uCellSize;
uniform float uHue;uniform float uDotHue;uniform float uKaleido;uniform float uChroma;uniform float uSwirl;
uniform float uShape;uniform float uInvert;
uniform vec3 uShock;uniform float uShockAmp;

float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}

vec3 hueRot(vec3 c,float a){
 const mat3 toYIQ=mat3(.299,.596,.211,.587,-.274,-.523,.114,-.322,.312);
 const mat3 toRGB=mat3(1.,1.,1.,.956,-.272,-1.106,.621,-.647,1.703);
 vec3 yiq=toYIQ*c;float ch=cos(a),sh=sin(a);
 yiq.yz=vec2(yiq.y*ch-yiq.z*sh,yiq.y*sh+yiq.z*ch);
 return toRGB*yiq;
}

vec2 warp(vec2 p,vec2 m){
 vec2 d=p-m;
 if(uKaleido>=2.){
  float seg=6.28318530718/uKaleido;
  float a=mod(atan(d.y,d.x),seg);
  a=abs(a-seg*.5);
  d=vec2(cos(a),sin(a))*length(d);
 }
 float dist=length(d)/uDpr;
 float tw=uSwirl*exp(-dist*.004);
 float c=cos(tw),s=sin(tw);
 d=vec2(c*d.x-s*d.y,s*d.x+c*d.y);
 float rip=sin(dist*uRippleFreq-uTime*2.4)*exp(-dist*uRippleDecay);
 d+=normalize(d+vec2(.0001))*rip*uRippleAmp*uDpr;
 if(uShock.z>=0.){
  vec2 sd=p-uShock.xy;
  float sdist=length(sd)/uDpr;
  float front=uShock.z*700.;
  float band=exp(-pow((sdist-front)/45.,2.))*exp(-uShock.z*1.6);
  d+=normalize(sd+vec2(.0001))*band*uShockAmp*uDpr;
 }
 return m+d;
}

vec3 field(vec2 p,vec2 m){
 vec2 q=warp(p,m);
 float dist=length(p-m)/uDpr;
 float cell=uCellSize*uDpr;
 float fl=n(q/uDpr*.0035+vec2(uTime*.04,-uTime*.03));
 vec2 g=fract(q/cell)-.5;
 float r=mix(length(g),max(abs(g.x),abs(g.y)),uShape);
 float near=exp(-dist*.0075);
 float size=uDotSizeBase+uDotSizeFlash*fl+uDotSizeNear*near;
 float dot_=smoothstep(size,size-uDotSoftness,r);
 vec3 base=mix(uRed,uRedDeep,uBaseDeepMix);
 vec3 dotCol=mix(uRedDeep,uRed,uDotRedMix);
 dotCol=mix(dotCol,uDotColor,uDotColorMix);
 dotCol=hueRot(dotCol,uDotHue);
 vec3 col=mix(base,dotCol,dot_);
 return mix(col,vec3(1.),dot_*near*uHighlight);
}

void main(){
 vec2 p=gl_FragCoord.xy;
 vec2 m=uMouse*uRes;
 vec3 col;
 if(uChroma>.001){
  vec2 dir=normalize(p-m+vec2(.0001))*uChroma*6.*uDpr;
  col=vec3(field(p+dir,m).r,field(p,m).g,field(p-dir,m).b);
 }else{
  col=field(p,m);
 }
 col=hueRot(col,uHue);
 col=mix(col,1.-col,uInvert);
 col+=(h(p+uTime)-.5)*uGrain;
 gl_FragColor=vec4(clamp(col,0.,1.),1.);
}
`;

const FLOAT_UNIFORMS = {
  uBaseDeepMix: "baseDeepMix",
  uDotRedMix: "dotRedMix",
  uHighlight: "highlight",
  uDotColorMix: "dotColorMix",
  uDotSizeBase: "dotSizeBase",
  uDotSizeFlash: "dotSizeFlash",
  uDotSizeNear: "dotSizeNear",
  uDotSoftness: "dotSoftness",
  uRippleAmp: "rippleAmp",
  uRippleFreq: "rippleFreq",
  uRippleDecay: "rippleDecay",
  uGrain: "grain",
  uCellSize: "cellSize",
  uKaleido: "kaleido",
  uChroma: "chroma",
  uSwirl: "swirl",
  uShape: "dotShape",
  uShockAmp: "shockAmp",
};

const UNIFORM_NAMES = [
  "uRes",
  "uMouse",
  "uTime",
  "uDpr",
  "uRed",
  "uRedDeep",
  "uDotColor",
  "uHue",
  "uDotHue",
  "uInvert",
  "uShock",
  ...Object.keys(FLOAT_UNIFORMS),
];

function isAnimated(p) {
  return p.speed > 0 || p.hueSpeed > 0 || p.colorShift > 0;
}

export default function KroenField() {
  const canvasRef = useRef(null);
  const requestRenderRef = useRef(null);
  const { params, ready } = useKroenFieldParams();
  const paramsRef = useRef(params);

  useEffect(() => {
    paramsRef.current = params;
    if (ready) requestRenderRef.current?.();
  }, [params, ready]);

  useEffect(() => {
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

    const u = {};
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let smx = 0.5;
    let smy = 0.5;
    let mx = innerWidth / 2;
    let my = innerHeight / 2;
    let rx = mx;
    let ry = my;
    let lastMove = performance.now();
    let lastFrame = 0;
    let simTime = 0;
    let hue = 0;
    let dotHue = 0;
    let shock = null;
    let raf = 0;

    function sh(t, s) {
      const o = gl.createShader(t);
      gl.shaderSource(o, s);
      gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(o));
      }
      return o;
    }

    function init() {
      const prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERTEX_SHADER));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(prog));
      }
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      UNIFORM_NAMES.forEach((k) => {
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

    function applyParams(p) {
      for (const [uniform, key] of Object.entries(FLOAT_UNIFORMS)) {
        gl.uniform1f(u[uniform], p[key]);
      }
      gl.uniform3fv(u.uDotColor, hexToRgb(p.dotColor));
      gl.uniform1f(u.uInvert, p.invert ? 1 : 0);
    }

    function emitPointer() {
      window.dispatchEvent(new CustomEvent("kroen-pointer", { detail: { rx, ry, mx, my } }));
    }

    function shockAge(nowMs) {
      if (!shock) return -1;
      const age = (nowMs - shock.t) / 1000;
      if (age > SHOCK_DURATION) {
        shock = null;
        return -1;
      }
      return age;
    }

    function frame(t) {
      raf = 0;
      const p = paramsRef.current;
      const dt = lastFrame ? Math.min((t - lastFrame) / 1000, 0.1) : 0;
      lastFrame = t;
      const animated = isAnimated(p);

      simTime += dt * p.speed;
      hue = p.hueSpeed > 0 ? (hue + dt * p.hueSpeed * Math.PI * 2) % (Math.PI * 2) : 0;
      dotHue =
        p.colorShift > 0
          ? (dotHue + dt * p.colorShift * Math.PI * 2) % (Math.PI * 2)
          : 0;

      if (animated) {
        const idle = performance.now() - lastMove > 3500;
        const tx = idle ? innerWidth * (0.5 + 0.32 * Math.sin(simTime * 0.37)) : mx;
        const ty = idle ? innerHeight * (0.45 + 0.28 * Math.sin(simTime * 0.53 + 1.3)) : my;
        smx += (tx / innerWidth - smx) * p.mouseLag;
        smy += (1 - ty / innerHeight - smy) * p.mouseLag;
      }
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      emitPointer();

      const age = shockAge(t);
      applyParams(p);
      gl.uniform2f(u.uRes, cv.width, cv.height);
      gl.uniform2f(u.uMouse, smx, smy);
      gl.uniform1f(u.uTime, simTime);
      gl.uniform1f(u.uHue, hue);
      gl.uniform1f(u.uDotHue, dotHue);
      gl.uniform1f(u.uDpr, dpr);
      gl.uniform3f(u.uShock, shock ? shock.x : 0, shock ? shock.y : 0, age);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      const pointerSettling = Math.abs(mx - rx) + Math.abs(my - ry) > 0.5;
      if (animated || shock || (p.ringEnabled && pointerSettling)) {
        raf = requestAnimationFrame(frame);
      } else {
        lastFrame = 0;
      }
    }

    function requestRender() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function onResize() {
      resize();
      requestRender();
    }

    function onMove(e) {
      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now();
      if (paramsRef.current.ringEnabled) requestRender();
    }

    function onClick(e) {
      if (paramsRef.current.shockAmp <= 0) return;
      shock = {
        x: e.clientX * dpr,
        y: cv.height - e.clientY * dpr,
        t: performance.now(),
      };
      requestRender();
    }

    function onVisibility() {
      if (!document.hidden) requestRender();
    }

    try {
      init();
      applyColors();
      requestRenderRef.current = requestRender;
      window.addEventListener("resize", onResize);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("pointerdown", onClick);
      document.addEventListener("visibilitychange", onVisibility);
      requestRender();
    } catch {
      cv.style.display = "none";
      return;
    }

    return () => {
      cancelAnimationFrame(raf);
      requestRenderRef.current = null;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointerdown", onClick);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas id="kroen-field" ref={canvasRef} aria-hidden="true" />;
}
