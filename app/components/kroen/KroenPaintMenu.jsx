"use client";

import { forwardRef } from "react";

/**
 * Menu a pannello vernice (clip-path animato dal mascot-engine).
 */
const KroenPaintMenu = forwardRef(function KroenPaintMenu(
  { items = [], onNavigate },
  ref,
) {
  if (items.length === 0) return null;

  return (
    <div
      ref={ref}
      id="kroen-nav-menu"
      className="kroen-paint"
      aria-hidden="true"
    >
      <nav aria-label="Menu aggiuntivo">
        <ul className="kroen-paint__list">
          {items.map((item) => (
            <li key={item.key} className="kroen-paint__item">
              <a
                href={item.href}
                className="kroen-paint__link"
                onClick={() => onNavigate?.()}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <small className="kroen-paint__hint">Colorificio Kroen</small>
    </div>
  );
});

export default KroenPaintMenu;
