export const MAP_LAYERS = [
  {
    id: "default",
    label: "Mappa",
    hrefs: [
      { href: "https://www.openstreetmap.org/copyright", label: "OpenStreetMap" },
      { href: "https://openfreemap.org/", label: "OpenFreeMap" },
    ],
  },
  {
    id: "cyclosm",
    label: "CyclOSM",
    hrefs: [
      { href: "https://www.openstreetmap.org/copyright", label: "OpenStreetMap" },
      { href: "https://www.cyclosm.org/", label: "CyclOSM" },
    ],
  },
  {
    id: "transport",
    label: "Trasporti",
    hrefs: [
      { href: "https://www.openstreetmap.org/copyright", label: "OpenStreetMap" },
      { href: "https://memomaps.de/", label: "ÖPNVKarte" },
    ],
  },
];

const CYCLOSM_TILES = ["a", "b", "c"].map(
  (s) => `https://${s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png`,
);

export function addKroenRasterLayers(map) {
  if (!map.getSource("kroen-cyclosm")) {
    map.addSource("kroen-cyclosm", {
      type: "raster",
      tiles: CYCLOSM_TILES,
      tileSize: 256,
      maxzoom: 20,
    });
    map.addLayer({
      id: "kroen-cyclosm",
      type: "raster",
      source: "kroen-cyclosm",
      layout: { visibility: "none" },
    });
  }

  if (!map.getSource("kroen-transport")) {
    map.addSource("kroen-transport", {
      type: "raster",
      tiles: ["/api/tiles/opnv/{z}/{x}/{y}.png"],
      tileSize: 256,
      maxzoom: 18,
    });
    map.addLayer({
      id: "kroen-transport",
      type: "raster",
      source: "kroen-transport",
      layout: { visibility: "none" },
    });
  }
}

export function setKroenMapLayer(map, vectorIds, layerId) {
  const showVector = layerId === "default";
  for (const id of vectorIds) {
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, "visibility", showVector ? "visible" : "none");
    }
  }
  if (map.getLayer("kroen-cyclosm")) {
    map.setLayoutProperty(
      "kroen-cyclosm",
      "visibility",
      layerId === "cyclosm" ? "visible" : "none",
    );
  }
  if (map.getLayer("kroen-transport")) {
    map.setLayoutProperty(
      "kroen-transport",
      "visibility",
      layerId === "transport" ? "visible" : "none",
    );
  }
}
