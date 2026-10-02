"use client";

import "./KroenFabDock.scss";

/** Floating button in basso a destra. Il pannello sfondo resta disattivato. */
export default function KroenFabDock({ children }) {
  return <div className="kroen-fab-dock">{children}</div>;
}
