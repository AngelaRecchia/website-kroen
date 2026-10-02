"use client";

import { storyblokEditable } from "@storyblok/react";
import dynamic from "next/dynamic";
import "./MapEmbed.scss";

const KroenMap = dynamic(() => import("./KroenMap"), { ssr: false });

export default function MapEmbed({ blok }) {
  const { embed_url, address } = blok;

  return (
    <div {...storyblokEditable(blok)} className="block">
      {address && <p className="addr">{address}</p>}
      <div className="map">
        <KroenMap embedUrl={embed_url} address={address} />
      </div>
    </div>
  );
}
