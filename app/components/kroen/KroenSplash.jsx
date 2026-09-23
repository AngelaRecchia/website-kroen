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
import {
  markSplashSeen,
  shouldPlaySplash,
} from "../../lib/kroen-mascot/splash-policy.js";

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
  const [splashPhase, setSplashPhase] = useState("pending");
  const [engine, setEngine] = useState(null);
  const mascotWrapRef = useRef(null);
  const svgRef = useRef(null);
  const engineRef = useRef(null);

  const setMascotWrap = useCallback((node) => {
    mascotWrapRef.current = node;
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const play = shouldPlaySplash();

    const mascotEngine = createMascotEngine(
      () => svgRef.current?.getRefs?.(),
      { getPopEl: () => mascotWrapRef.current },
    );
    engineRef.current = mascotEngine;
    setEngine(mascotEngine);
    mascotEngine.start();

    const runSplashFlow = async () => {
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r)),
      );

      mascotEngine.draw();

      if (!play) {
        setSplashPhase("done");
        root.classList.remove("is-splash");
        mascotEngine.setSplashLocked(false);
        return;
      }

      root.classList.add("is-splash");
      setSplashPhase("active");
      mascotEngine.setSplashLocked(true);

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        markSplashSeen();
        root.classList.remove("is-splash");
        mascotEngine.setSplashLocked(false);
        setSplashPhase("done");
        return;
      }

      const wrap = mascotWrapRef.current;
      if (wrap) {
        await mascotEngine.runSplash({ animEl: wrap });
      }

      markSplashSeen();
      root.classList.remove("is-splash");
      mascotEngine.setSplashLocked(false);
      setSplashPhase("done");
    };

    let cancelled = false;
    runSplashFlow().then(() => {
      if (cancelled) return;
    });

    return () => {
      cancelled = true;
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
