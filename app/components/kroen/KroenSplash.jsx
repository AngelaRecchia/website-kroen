"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createMascotEngine } from "../../lib/kroen-mascot/mascot-engine.js";

const KroenSplashContext = createContext(null);

export function useKroenSplashPhase() {
  return useContext(KroenSplashContext)?.splashPhase ?? "done";
}

export function useKroenMascotWrapRef() {
  const ctx = useContext(KroenSplashContext);
  return ctx?.setMascotWrap ?? (() => {});
}

export function useKroenMascotSvgRef() {
  const ctx = useContext(KroenSplashContext);
  return ctx?.svgRef ?? { current: null };
}

/** @deprecated use useKroenMascotWrapRef */
export function useKroenLogoAnchorRef() {
  return useKroenMascotWrapRef();
}

export function useKroenMascotEngine() {
  return useContext(KroenSplashContext)?.engine ?? null;
}

export function KroenSplashProvider({ children }) {
  const splashPhase = "done";
  const [engine, setEngine] = useState(null);
  const mascotWrapRef = useRef(null);
  const svgRef = useRef(null);
  const engineRef = useRef(null);

  const setMascotWrap = useCallback((node) => {
    mascotWrapRef.current = node;
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("is-splash");

    const mascotEngine = createMascotEngine(
      () => svgRef.current?.getRefs?.(),
      { getPopEl: () => mascotWrapRef.current },
    );
    engineRef.current = mascotEngine;
    setEngine(mascotEngine);
    mascotEngine.setSplashLocked(false);
    mascotEngine.start();

    return () => {
      mascotEngine.setSplashLocked(false);
      mascotEngine.stop();
      root.classList.remove("is-splash");
    };
  }, []);

  return (
    <KroenSplashContext.Provider
      value={{ setMascotWrap, svgRef, engine, splashPhase }}
    >
      {children}
    </KroenSplashContext.Provider>
  );
}
