"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  EXPERIENCE_PRESETS,
  EXPERIENCE_PRESET_IDS,
  mergeKroenFieldParams,
  randomExperienceParams,
} from "../../lib/kroen-field-config";

const STORAGE_KEY = "kroen-experience";
const DEFAULT_PRESET = "mild";

const KroenFieldContext = createContext(null);

function paramsForPreset(id, custom) {
  if (id === "custom") return mergeKroenFieldParams(custom);
  return mergeKroenFieldParams(EXPERIENCE_PRESETS[id] ?? EXPERIENCE_PRESETS[DEFAULT_PRESET]);
}

function readStoredState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!EXPERIENCE_PRESET_IDS.includes(data?.preset)) return null;
    return { preset: data.preset, custom: data.custom ?? null };
  } catch {
    return null;
  }
}

function initialState() {
  return {
    preset: DEFAULT_PRESET,
    params: paramsForPreset(DEFAULT_PRESET),
    custom: null,
  };
}

export function KroenFieldProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [ready, setReady] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const stored = readStoredState();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const preset = stored?.preset ?? (reduce ? "none" : DEFAULT_PRESET);
    const custom = stored?.custom ? mergeKroenFieldParams(stored.custom) : null;
    // localStorage e matchMedia esistono solo sul client: lo stato iniziale
    // resta quello del server per evitare mismatch di idratazione.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ preset, custom, params: paramsForPreset(preset, custom) });
    setReady(true);

    if (new URLSearchParams(window.location.search).get("debug") === "field") {
      setPanelOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ preset: state.preset, custom: state.custom }),
      );
    } catch {
      /* storage non disponibile (private mode, quota) */
    }
  }, [ready, state.preset, state.custom]);

  const setPreset = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      preset: id,
      params: paramsForPreset(id, prev.custom ?? prev.params),
    }));
  }, []);

  const setParams = useCallback((partial) => {
    setState((prev) => {
      const next = mergeKroenFieldParams(
        prev.params,
        typeof partial === "function" ? partial(prev.params) : partial,
      );
      return { preset: "custom", params: next, custom: next };
    });
  }, []);

  const randomize = useCallback(() => {
    setParams((prev) => ({ ...prev, ...randomExperienceParams() }));
  }, [setParams]);

  const reset = useCallback(() => setPreset(DEFAULT_PRESET), [setPreset]);

  const value = useMemo(
    () => ({
      ready,
      preset: state.preset,
      params: state.params,
      setPreset,
      setParams,
      randomize,
      reset,
      panelOpen,
      setPanelOpen,
    }),
    [ready, state.preset, state.params, setPreset, setParams, randomize, reset, panelOpen],
  );

  return (
    <KroenFieldContext.Provider value={value}>{children}</KroenFieldContext.Provider>
  );
}

export function useKroenFieldParams() {
  const ctx = useContext(KroenFieldContext);
  if (!ctx) {
    throw new Error("useKroenFieldParams must be used within KroenFieldProvider");
  }
  return ctx;
}
