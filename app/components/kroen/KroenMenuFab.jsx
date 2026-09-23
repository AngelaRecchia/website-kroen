"use client";

/**
 * Trigger menu: pulsante floating sticky (non la mascotte in nav).
 */
export default function KroenMenuFab({ open, onToggle, labelOpen, labelClosed }) {
  return (
    <button
      type="button"
      className={`kroen-menu-fab${open ? " is-open" : ""}`}
      aria-expanded={open}
      aria-controls="kroen-nav-menu"
      aria-label={open ? labelOpen : labelClosed}
      onClick={onToggle}
    >
      <span className="kroen-menu-fab__icon" aria-hidden="true">
        <span className="kroen-menu-fab__bar" />
        <span className="kroen-menu-fab__bar" />
        <span className="kroen-menu-fab__bar" />
      </span>
      <span className="kroen-menu-fab__text">Menu</span>
    </button>
  );
}
