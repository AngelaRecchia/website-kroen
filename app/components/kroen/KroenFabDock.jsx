"use client";

import { useRef } from "react";

import KroenExperienceFab from "./KroenExperienceFab";
import KroenExperiencePanel from "./KroenExperiencePanel";

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
