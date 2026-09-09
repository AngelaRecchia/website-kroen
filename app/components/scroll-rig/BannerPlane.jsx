"use client";

import { invalidate, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { LinearFilter, TextureLoader } from "three";
import * as THREE from "three";
import { storyblokImageUrl } from "../../lib/storyblok-utils";
import { createSubstanceMaterial } from "./substanceShaders";

function lerp(a, b, t) {
  return a + (b - a) * t;
}

const LERP = 0.1;
const SHIFT_DIVISOR = 72;
const SHIFT_MAX = 2.8;
const MIN_TRACK_SCALE = 2;
const VIEW_MARGIN = 24;
const WEBGL_ON_FRAMES = 6;

function isInViewport(rect) {
  const vh = window.innerHeight;
  return rect.bottom > VIEW_MARGIN && rect.top < vh - VIEW_MARGIN;
}

export default function BannerPlane({ track, src, scale }) {
  const imageUrl = useMemo(() => storyblokImageUrl(src) || src, [src]);
  const texture = useLoader(TextureLoader, imageUrl, (loader) => {
    loader.crossOrigin = "anonymous";
  });

  const material = useMemo(
    () => createSubstanceMaterial(texture),
    [texture],
  );

  const anim = useRef({ uShift: 0, lastTop: 0, lastScrollY: 0 });
  const readyFrames = useRef(0);
  const webglActive = useRef(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    material.uniforms.uMap.value = texture;

    return () => material.dispose();
  }, [texture, material]);

  useEffect(() => {
    const el = track.current;
    return () => {
      webglActive.current = false;
      el?.removeAttribute("data-webgl-active");
    };
  }, [track]);

  const setWebglActive = (active) => {
    const el = track.current;
    if (!el) return;

    if (active && !webglActive.current) {
      webglActive.current = true;
      el.setAttribute("data-webgl-active", "true");
    } else if (!active && webglActive.current) {
      webglActive.current = false;
      el.removeAttribute("data-webgl-active");
    }
  };

  useFrame((_, delta) => {
    const el = track.current;
    if (!el) {
      setWebglActive(false);
      setShouldRender(false);
      return;
    }

    const rect = el.getBoundingClientRect();
    const inView = isInViewport(rect);
    const hasScale =
      scale?.x >= MIN_TRACK_SCALE && scale?.y >= MIN_TRACK_SCALE;
    const canDraw = inView && hasScale && rect.width > 2;

    if (!canDraw) {
      readyFrames.current = 0;
      anim.current.uShift = 0;
      material.uniforms.uShift.value = 0;
      setWebglActive(false);
      if (shouldRender) setShouldRender(false);
      return;
    }

    if (!shouldRender) setShouldRender(true);

    readyFrames.current += 1;

    if (readyFrames.current >= WEBGL_ON_FRAMES) {
      setWebglActive(true);
    }

    if (readyFrames.current === 1) {
      anim.current.lastTop = rect.top;
      anim.current.lastScrollY = window.scrollY;
    }

    const blend = 1 - Math.pow(1 - LERP, delta * 60);
    const scrollY = window.scrollY;
    const velocity =
      rect.top -
      anim.current.lastTop +
      (scrollY - anim.current.lastScrollY) * 0.4;
    const targetShift = THREE.MathUtils.clamp(
      velocity / SHIFT_DIVISOR,
      -SHIFT_MAX,
      SHIFT_MAX,
    );

    anim.current.uShift = lerp(anim.current.uShift, targetShift, blend);
    anim.current.lastTop = rect.top;
    anim.current.lastScrollY = scrollY;
    material.uniforms.uScale.value = 0;
    material.uniforms.uShift.value = anim.current.uShift;

    invalidate();
  });

  if (!shouldRender || !scale?.x || scale.x < MIN_TRACK_SCALE || !scale?.y) {
    return null;
  }

  return (
    <mesh scale={[scale.x, scale.y, 1]} material={material}>
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  );
}
