"use client";

import { useEffect, useState } from "react";
import { GlobalCanvas, SmoothScrollbar } from "@14islands/r3f-scroll-rig";
import { WebGLRenderer } from "three";
import "@14islands/r3f-scroll-rig/css";

/** Renderer WebGL1: shader Codrops (texture2D / varying) senza errori di programma. */
function createWebGL1Renderer(canvas) {
  const context =
    canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    }) ||
    canvas.getContext("experimental-webgl", {
      alpha: true,
      antialias: true,
    });

  if (!context) {
    return undefined;
  }

  const renderer = new WebGLRenderer({ canvas, context, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  return renderer;
}

export default function ScrollRigRoot() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setEnabled(!reducedMotion);
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <GlobalCanvas
        gl={createWebGL1Renderer}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 30,
          pointerEvents: "none",
        }}
      />
      <SmoothScrollbar />
    </>
  );
}
