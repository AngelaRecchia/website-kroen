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
  KROEN_FIELD_DEFAULTS,
  mergeKroenFieldParams,
} from "../../lib/kroen-field-config";

const KroenFieldContext = createContext(null);

export function KroenFieldProvider({ children }) {
  const [params, setParamsState] = useState(KROEN_FIELD_DEFAULTS);
  const [debugOpen, setDebugOpen] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const q = new URLSearchParams(window.location.search);
    if (q.get("debug") === "field") setDebugOpen(true);
  }, []);

  const setParams = useCallback((next) => {
    setParamsState((prev) =>
      typeof next === "function" ? mergeKroenFieldParams(next(prev)) : mergeKroenFieldParams(next),
    );
  }, []);

  const resetParams = useCallback(() => {
    setParamsState(KROEN_FIELD_DEFAULTS);
  }, []);

  const value = useMemo(
    () => ({
      params,
      setParams,
      resetParams,
      debugOpen,
      setDebugOpen,
    }),
    [params, setParams, resetParams, debugOpen],
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
