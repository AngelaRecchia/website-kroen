"use client";

import { useEffect, useRef } from "react";

import { useKroenFieldParams } from "../KroenFieldContext";
import "./KroenCursorRing.scss";

export default function KroenCursorRing() {
  const ringRef = useRef(null);
  const { params, ready } = useKroenFieldParams();
  const enabled = ready && params.ringEnabled;

  useEffect(() => {
    if (!enabled) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    const ring = ringRef.current;
    if (!ring) return;

    const onMove = () => ring.classList.add("is-on");
    const onLeave = () => {
      ring.classList.remove("is-on");
      ring.classList.remove("is-hot");
    };
    const onOver = (e) => {
      const t = e.target;
      if (
        t instanceof Element &&
        t.closest("a, button, .event__head, .btn, .tab, input, select, textarea, label")
      ) {
        ring.classList.add("is-hot");
      } else {
        ring.classList.remove("is-hot");
      }
    };
    const onPointer = (e) => {
      const { rx, ry } = e.detail;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover", onOver);
    window.addEventListener("kroen-pointer", onPointer);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("kroen-pointer", onPointer);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="kroen-ring"
      ref={ringRef}
      aria-hidden="true"
      style={{ "--ring-scale": params.ringScale }}
    />
  );
}
