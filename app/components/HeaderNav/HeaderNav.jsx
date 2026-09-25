"use client";



import { useEffect, useMemo, useRef, useState } from "react";



import Link from "../Link";

import KroenNavMascot from "../kroen/KroenNavMascot/KroenNavMascot";

import KroenMenuFab from "../kroen/KroenMenuFab/KroenMenuFab";

import KroenFabDock from "../kroen/KroenFabDock/KroenFabDock";

import KroenPaintMenu from "../kroen/KroenPaintMenu/KroenPaintMenu";

import { useKroenMascotEngine, useKroenSplashPhase } from "../kroen/KroenSplash";

import { splitHeaderLinks } from "../../lib/nav-links";
import "./HeaderNav.scss";



export default function HeaderNav({ links = [] }) {

  const [menuOpen, setMenuOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  const splashPhase = useKroenSplashPhase();

  const engine = useKroenMascotEngine();

  const paintRef = useRef(null);



  const { left, right, extra, all } = useMemo(

    () => splitHeaderLinks(links),

    [links],

  );



  const drawerItems = isMobile ? all : extra;

  const showMenuFab = drawerItems.length > 0;



  useEffect(() => {

    const mq = window.matchMedia("(max-width: 767px)");

    const update = () => setIsMobile(mq.matches);

    update();

    mq.addEventListener("change", update);

    return () => mq.removeEventListener("change", update);

  }, []);



  useEffect(() => {

    if (!engine) return;

    return engine.onMenuChange(setMenuOpen);

  }, [engine]);



  useEffect(() => {

    if (!engine || !paintRef.current) return;

    engine.setPaintLayer(paintRef.current);

  }, [engine, drawerItems]);



  useEffect(() => {

    const onKey = (e) => {

      if (e.key === "Escape" && engine?.getMenuOpen?.()) {

        engine.closeMenu();

      }

    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);

  }, [engine]);



  useEffect(() => {

    if (splashPhase !== "done") engine?.closeMenu?.();

  }, [splashPhase, engine]);



  const handleMenuToggle = () => {

    engine?.toggleMenu?.();

  };



  const handleNavigate = () => {

    engine?.closeMenu?.();

  };



  return (

    <>

      <div className="kroen-nav">

        <nav

          aria-label="Navigazione sinistra"

          className="kroen-nav__col kroen-nav__col--start kroen-nav__col--desktop"

        >

          {left && <Link key={left.key} item={left.blok} variant="nav" />}

        </nav>



        <KroenNavMascot />



        <nav

          aria-label="Navigazione destra"

          className="kroen-nav__col kroen-nav__col--end kroen-nav__col--desktop"

        >

          {right && <Link key={right.key} item={right.blok} variant="nav" />}

        </nav>

      </div>



      {drawerItems.length > 0 && (

        <KroenPaintMenu

          ref={paintRef}

          items={drawerItems}

          onNavigate={handleNavigate}

        />

      )}



      {splashPhase === "done" && (

        <KroenFabDock>

          {showMenuFab && (

            <KroenMenuFab

              open={menuOpen}

              onToggle={handleMenuToggle}

              labelOpen="Chiudi menu"

              labelClosed="Apri menu"

            />

          )}

        </KroenFabDock>

      )}

    </>

  );

}

