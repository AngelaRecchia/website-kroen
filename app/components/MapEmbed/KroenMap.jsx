"use client";

import { useEffect, useRef, useState } from "react";
import { Map, Marker, NavigationControl, setWorkerUrl } from "maplibre-gl";
import {
  MAP_LAYERS,
  addKroenRasterLayers,
  setKroenMapLayer,
} from "../../lib/kroen-map-layers";
import { parseOsmEmbed } from "../../lib/osm-embed";
import "maplibre-gl/dist/maplibre-gl.css";

const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
const STREET_ZOOM = 16;

function lngLat(latlng) {
  return [latlng[1], latlng[0]];
}

async function geocodeAddress(address) {
  if (!address || typeof address !== "string") return null;
  try {
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(address.trim())}`);
    if (!res.ok) return null;
    const data = await res.json();
    const lat = Number(data.lat);
    const lon = Number(data.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    return [lat, lon];
  } catch {
    return null;
  }
}

export default function KroenMap({ embedUrl, address }) {
  const rootRef = useRef(null);
  const mapRef = useRef(null);
  const vectorIdsRef = useRef([]);
  const layerRef = useRef("default");
  const [layer, setLayer] = useState("default");

  function applyLayer(next) {
    layerRef.current = next;
    setLayer(next);
    const map = mapRef.current;
    if (map?.isStyleLoaded()) {
      setKroenMapLayer(map, vectorIdsRef.current, next);
    }
  }

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;

    const fallback = parseOsmEmbed(embedUrl);
    let map;
    let cancelled = false;
    let onEnter;
    let onLeave;
    let ro;

    async function mount() {
      setWorkerUrl("/maplibre-gl-worker.mjs");
      const coords = await geocodeAddress(address);
      if (cancelled || !rootRef.current) return;

      const center = coords ?? fallback.marker;

      map = new Map({
        container: rootRef.current,
        style: STYLE_URL,
        center: lngLat(center),
        zoom: coords ? STREET_ZOOM : 13,
        attributionControl: false,
        cooperativeGestures: false,
        dragRotate: false,
        pitchWithRotate: false,
        scrollZoom: false,
        maplibreLogo: false,
        maxPitch: 0,
      });
      mapRef.current = map;

      if (cancelled) {
        map.remove();
        return;
      }

      map.addControl(
        new NavigationControl({
          showCompass: false,
          visualizePitch: false,
        }),
        "top-left",
      );

      if (!coords) {
        map.fitBounds([lngLat(fallback.bounds[0]), lngLat(fallback.bounds[1])], {
          padding: 24,
          maxZoom: 16,
          duration: 0,
        });
      }

      const pin = document.createElement("div");
      pin.className = "map__pin";
      pin.title = address || "Colorificio Kroen";
      new Marker({ element: pin, anchor: "center" })
        .setLngLat(lngLat(center))
        .addTo(map);

      map.on("load", () => {
        if (cancelled) return;
        vectorIdsRef.current = (map.getStyle().layers ?? []).map((item) => item.id);
        addKroenRasterLayers(map);
        setKroenMapLayer(map, vectorIdsRef.current, layerRef.current);
      });

      onEnter = () => map.scrollZoom.enable();
      onLeave = () => map.scrollZoom.disable();
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);

      ro = new ResizeObserver(() => map.resize());
      ro.observe(el);
    }

    mount().catch(() => {});

    return () => {
      cancelled = true;
      if (onEnter) el.removeEventListener("mouseenter", onEnter);
      if (onLeave) el.removeEventListener("mouseleave", onLeave);
      ro?.disconnect();
      mapRef.current = null;
      map?.remove();
    };
  }, [address, embedUrl]);

  const active = MAP_LAYERS.find((item) => item.id === layer) ?? MAP_LAYERS[0];

  return (
    <>
      <div ref={rootRef} className="map__canvas" />
      <div className="map__layers" role="radiogroup" aria-label="Stile mappa">
        {MAP_LAYERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="map__layer"
            role="radio"
            aria-checked={item.id === layer}
            onClick={() => applyLayer(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="map__copy">
        ©{" "}
        {active.hrefs.map((link, index) => (
          <span key={link.href}>
            {index > 0 ? " · " : null}
            <a href={link.href}>{link.label}</a>
          </span>
        ))}
      </p>
    </>
  );
}
