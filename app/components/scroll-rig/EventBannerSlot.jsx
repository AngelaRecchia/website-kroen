"use client";

import { ScrollScene, UseCanvas, useScrollRig } from "@14islands/r3f-scroll-rig";
import { Suspense, useEffect, useRef, useState } from "react";
import BannerPlane from "./BannerPlane";

/** Effetto WebGL in pausa: `false` per riattivarlo. */
const WEBGL_PAUSED = true;

export default function EventBannerSlot({
  src,
  alt = "",
  title = "",
  className = "",
  loading = "lazy",
  webglEnabled: webglEnabledProp,
}) {
  const trackRef = useRef(null);
  const imageRef = useRef(null);
  const { reflow } = useScrollRig();
  const [localWebgl, setLocalWebgl] = useState(false);

  useEffect(() => {
    if (webglEnabledProp !== undefined) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setLocalWebgl(!reducedMotion);
  }, [webglEnabledProp]);

  /** Dopo il load dell’img il track ha dimensioni reali: scroll-rig ricalcola le scene. */
  useEffect(() => {
    const img = imageRef.current;
    if (!img || !src) return;

    const onLoad = () => requestAnimationFrame(() => reflow());
    img.addEventListener("load", onLoad);
    if (img.complete) onLoad();

    return () => img.removeEventListener("load", onLoad);
  }, [src, reflow]);

  if (!src) {
    return (
      <div
        className={`photo flex w-full items-center justify-center ${className}`.trim()}
      >
        <span className="display t-h4 px-2 sm:px-4 text-center">
          {title || "Evento"}
        </span>
      </div>
    );
  }

  const showWebgl =
    !WEBGL_PAUSED &&
    (webglEnabledProp === true ||
      (webglEnabledProp === undefined && localWebgl));

  return (
    <div
      ref={trackRef}
      data-event-banner
      className={`event-banner-slot photo w-full ${className}`.trim()}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        className="event-banner-slot__fallback h-full w-full object-cover"
        loading={loading}
        decoding="async"
      />
      {showWebgl && (
        <Suspense fallback={null}>
          <UseCanvas>
            <ScrollScene track={trackRef} hideOffscreen>
              {({ scale }) => (
                <BannerPlane track={trackRef} src={src} scale={scale} />
              )}
            </ScrollScene>
          </UseCanvas>
        </Suspense>
      )}
    </div>
  );
}
