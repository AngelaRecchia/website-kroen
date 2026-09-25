"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { BARREL_PATH } from "../../../lib/kroen-mascot/barrel-path.js";
import "./KroenMascotSvg.scss";

const STRIPE_COUNT = 6;

const KroenMascotSvg = forwardRef(function KroenMascotSvg(
  { className, paintFill = "var(--color-ink)" },
  ref,
) {
  const bodyRef = useRef(null);
  const rollerGRef = useRef(null);
  const mouthRef = useRef(null);
  const eyeLRef = useRef(null);
  const eyeRRef = useRef(null);
  const fillRectRef = useRef(null);
  const floorARef = useRef(null);
  const floorBRef = useRef(null);
  const floorMidRef = useRef(null);
  const floorCRef = useRef(null);
  const stripeRefs = useRef([]);
  const rootRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getRefs: () => ({
      root: rootRef.current,
      body: bodyRef.current,
      rollerG: rollerGRef.current,
      mouth: mouthRef.current,
      eyeL: eyeLRef.current,
      eyeR: eyeRRef.current,
      fillRect: fillRectRef.current,
      floorA: floorARef.current,
      floorB: floorBRef.current,
      floorMid: floorMidRef.current,
      floorC: floorCRef.current,
      stripes: stripeRefs.current.filter(Boolean),
    }),
  }));

  return (
    <svg
      ref={rootRef}
      className={className}
      viewBox="0 0 2276 1900"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="kroen-barrelClip">
          <path d={BARREL_PATH} />
        </clipPath>
        <clipPath id="kroen-fillClip">
          <rect ref={fillRectRef} x="0" y="0" width="2276" height="0" />
        </clipPath>
      </defs>

      <path
        ref={bodyRef}
        fill="currentColor"
        fillRule="nonzero"
        d=""
      />

      <g ref={rollerGRef}>
        <g clipPath="url(#kroen-barrelClip)">
          <g clipPath="url(#kroen-fillClip)">
            <path d={BARREL_PATH} style={{ fill: paintFill }} />
          </g>
          <g stroke="#fff" strokeLinecap="round">
            {Array.from({ length: STRIPE_COUNT }, (_, i) => (
              <line
                key={i}
                ref={(node) => {
                  stripeRefs.current[i] = node;
                }}
                x1={590}
                x2={2016}
                opacity="0"
              />
            ))}
          </g>
        </g>
        <circle ref={eyeLRef} cx="1094" cy="299" r="54" fill="currentColor" />
        <circle ref={eyeRRef} cx="1464" cy="301" r="54" fill="currentColor" />
        <path
          ref={mouthRef}
          fill="none"
          stroke="currentColor"
          strokeWidth="64"
          strokeLinecap="round"
          strokeLinejoin="round"
          d=""
        />
      </g>

      <g fill="none" stroke="currentColor" strokeWidth="34" strokeLinecap="round">
        <line ref={floorARef} x1="840" y1="1704" x2="1090" y2="1704" />
        <line ref={floorBRef} x1="1210" y1="1704" x2="1460" y2="1704" />
        <line ref={floorMidRef} x1="840" y1="1774" x2="1460" y2="1774" />
        <line ref={floorCRef} x1="840" y1="1844" x2="1460" y2="1844" />
      </g>
    </svg>
  );
});

export default KroenMascotSvg;
