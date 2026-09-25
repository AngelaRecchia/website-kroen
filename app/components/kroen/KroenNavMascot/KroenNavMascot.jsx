"use client";

import Link from "next/link";
import KroenMascotSvg from "../KroenMascotSvg/KroenMascotSvg";
import { useKroenMascotSvgRef, useKroenMascotWrapRef } from "../KroenSplash";
import "./KroenNavMascot.scss";

/** Logo header (SVG wrapper, bianco) + engine mascotte nascosto per splash / menu vernice. */
export default function KroenNavMascot() {
  const setWrap = useKroenMascotWrapRef();
  const svgRef = useKroenMascotSvgRef();

  return (
    <Link
      href="/"
      className="kroen-nav__logo"
      aria-label="Home — Colorificio Kroen"
    >
      <div
        ref={setWrap}
        className="kroen-nav__logo-wrap kroen-nav__mascot-wrap"
        aria-hidden="true"
      >
      <svg
        className="kroen-nav__mascot-logo"
        viewBox="0 0 512 512"
        aria-hidden="true"
        focusable="false"
      >
        <image
          href="/images/kroen-header-logo.png"
          width="512"
          height="512"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
      <KroenMascotSvg
        ref={svgRef}
        className="kroen-mascot-svg kroen-nav__mascot kroen-nav__mascot-engine"
      />
      </div>
    </Link>
  );
}
