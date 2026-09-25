"use client";

import { storyblokEditable } from "@storyblok/react";
import { useState } from "react";
import "./MapEmbed.scss";

export default function MapEmbed({ blok }) {
  const {
    embed_url = "https://www.openstreetmap.org/export/embed.html?bbox=10.93%2C45.38%2C11.05%2C45.45&layer=mapnik",
    consent_text = "La mappa usa OpenStreetMap. Caricala solo se accetti contenuti esterni.",
    button_label = "Carica mappa",
    address,
  } = blok;

  const [loaded, setLoaded] = useState(false);

  return (
    <div {...storyblokEditable(blok)} className="block">
      {address && <p className="addr">{address}</p>}
      <div className="map">
        {loaded ? (
          <iframe title="Mappa" src={embed_url} loading="lazy" />
        ) : (
          <div className="map__ask">
            <p>{consent_text}</p>
            <button type="button" className="btn" onClick={() => setLoaded(true)}>
              {button_label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
