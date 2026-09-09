"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollWaveAnimator } from "../lib/ScrollWaveAnimator";

export default function ScrollWaveGroup({
  children,
  className = "",
  waveNumber = 3,
  waveSpeed = 1,
  direction = 1,
  rangeMode = "symmetric",
  maxShift = 72,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const wrapper = ref.current;
    if (!wrapper) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrapper.querySelectorAll(".wave-item").forEach((item) => {
        item.classList.add("wave-focused");
      });
      return;
    }

    const animator = new ScrollWaveAnimator(wrapper);
    animator.init();

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      animator.destroy();
    };
  }, [waveNumber, waveSpeed, direction, rangeMode, maxShift]);

  return (
    <div
      ref={ref}
      className={className}
      data-wave-number={waveNumber}
      data-wave-speed={waveSpeed}
      data-wave-direction={direction}
      data-wave-range={rangeMode}
      data-wave-max-shift={maxShift}
    >
      {children}
    </div>
  );
}
