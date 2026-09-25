"use client";

import { useRef } from "react";

import KroenExperienceFab from "../KroenExperienceFab/KroenExperienceFab";
import KroenExperiencePanel from "../KroenExperiencePanel/KroenExperiencePanel";
import "./KroenFabDock.scss";

/** Dock floating in basso a destra: FAB Esperienza + eventuali altri FAB (es. menu) come children. */
export default function KroenFabDock({ children }) {
  const dockRef = useRef(null);

  return (
    <>
      <KroenExperiencePanel dockRef={dockRef} />
      <div className="kroen-fab-dock" ref={dockRef}>
        <KroenExperienceFab />
        {children}
      </div>
    </>
  );
}
