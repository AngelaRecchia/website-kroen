"use client";

import { useEffect, useId, useRef, useState } from "react";

function optionLabel(options, value, placeholder) {
  const match = options.find((opt) => opt.value === value);
  if (match) return match.label;
  return placeholder ?? "";
}

export default function KroenSelect({
  id,
  name,
  required = false,
  value = "",
  onChange,
  options = [],
  placeholder,
  invalid = false,
}) {
  const reactId = useId();
  const listId = `${id || reactId}-list`;
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef("");
  const searchTimerRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const display = optionLabel(options, value, placeholder);
  const isPlaceholder = !value;

  function openList(nextIndex) {
    const fallback = selectedIndex >= 0 ? selectedIndex : 0;
    setActiveIndex(
      typeof nextIndex === "number" && nextIndex >= 0 ? nextIndex : fallback,
    );
    setOpen(true);
  }

  function closeList() {
    setOpen(false);
  }

  function selectValue(next) {
    onChange?.(next);
    closeList();
    triggerRef.current?.focus();
  }

  function moveActive(delta) {
    if (options.length === 0) return;
    setActiveIndex((prev) => {
      const next = Math.min(options.length - 1, Math.max(0, prev + delta));
      return next;
    });
  }

  function findByQuery(query) {
    const q = query.toLowerCase();
    return options.findIndex((opt) =>
      String(opt.label).toLowerCase().startsWith(q),
    );
  }

  function onTriggerKeyDown(event) {
    const { key } = event;

    if (key === "Escape") {
      if (!open) return;
      event.preventDefault();
      closeList();
      return;
    }

    if (key === "ArrowDown") {
      event.preventDefault();
      if (!open) openList(selectedIndex >= 0 ? selectedIndex : 0);
      else moveActive(1);
      return;
    }

    if (key === "ArrowUp") {
      event.preventDefault();
      if (!open) openList(selectedIndex >= 0 ? selectedIndex : options.length - 1);
      else moveActive(-1);
      return;
    }

    if (key === "Home") {
      if (!open) return;
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (key === "End") {
      if (!open) return;
      event.preventDefault();
      setActiveIndex(Math.max(0, options.length - 1));
      return;
    }

    if (key === "Enter" || key === " ") {
      event.preventDefault();
      if (!open) {
        openList();
        return;
      }
      const opt = options[activeIndex];
      if (opt) selectValue(opt.value);
      return;
    }

    if (key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      const nextQuery = `${searchRef.current}${key}`;
      searchRef.current = nextQuery;
      window.clearTimeout(searchTimerRef.current);
      searchTimerRef.current = window.setTimeout(() => {
        searchRef.current = "";
      }, 500);
      const match = findByQuery(nextQuery);
      if (match < 0) return;
      if (!open) openList(match);
      else setActiveIndex(match);
    }
  }

  useEffect(() => {
    if (!open) return undefined;

    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) closeList();
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const node = rootRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  useEffect(() => {
    return () => window.clearTimeout(searchTimerRef.current);
  }, []);

  const activeId =
    open && options[activeIndex]
      ? `${listId}-opt-${activeIndex}`
      : undefined;

  return (
    <div
      ref={rootRef}
      className={`field-select${open ? " is-open" : ""}`}
    >
      <input type="hidden" name={name} value={value} />
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className="field-select__trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={activeId}
        aria-autocomplete="none"
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={onTriggerKeyDown}
      >
        <span className={isPlaceholder ? "is-placeholder" : undefined}>
          {display}
        </span>
        <span className="field-select__chevron" aria-hidden="true" />
      </button>
      {open && (
        <ul id={listId} role="listbox" className="field-select__list">
          {options.map((opt, index) => {
            const selected = opt.value === value;
            const active = index === activeIndex;
            return (
              <li
                key={opt.value}
                id={`${listId}-opt-${index}`}
                data-index={index}
                role="option"
                aria-selected={selected}
                className={`field-select__option${selected ? " is-selected" : ""}${active ? " is-active" : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectValue(opt.value)}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
