const DEFAULT_BOUNDS = [
  [45.38, 10.93],
  [45.45, 11.05],
];

function midpoint(bounds) {
  return [
    (bounds[0][0] + bounds[1][0]) / 2,
    (bounds[0][1] + bounds[1][1]) / 2,
  ];
}

function parsePair(raw, latFirst = true) {
  if (!raw) return null;
  const parts = String(raw)
    .split(",")
    .map((n) => Number.parseFloat(n.trim()));
  if (parts.length < 2 || !parts.slice(0, 2).every(Number.isFinite)) return null;
  return latFirst ? [parts[0], parts[1]] : [parts[1], parts[0]];
}

/** Legge bbox/marker da un URL embed OpenStreetMap. */
export function parseOsmEmbed(embedUrl) {
  const fallbackCenter = midpoint(DEFAULT_BOUNDS);
  const fallback = {
    bounds: DEFAULT_BOUNDS,
    center: fallbackCenter,
    marker: fallbackCenter,
  };

  if (!embedUrl || typeof embedUrl !== "string") return fallback;

  try {
    const url = new URL(embedUrl, "https://www.openstreetmap.org/");
    const bboxRaw = url.searchParams.get("bbox");
    let bounds = DEFAULT_BOUNDS;

    if (bboxRaw) {
      const parts = bboxRaw.split(",").map((n) => Number.parseFloat(n.trim()));
      if (parts.length === 4 && parts.every(Number.isFinite)) {
        const [west, south, east, north] = parts;
        bounds = [
          [south, west],
          [north, east],
        ];
      }
    }

    const fromMarker = parsePair(url.searchParams.get("marker"), true);
    const fromMl =
      parsePair(
        `${url.searchParams.get("mlat") ?? ""},${url.searchParams.get("mlon") ?? ""}`,
        true,
      );
    const marker = fromMarker || fromMl;

    const center = marker ?? midpoint(bounds);
    return {
      bounds,
      center,
      marker: marker ?? center,
    };
  } catch {
    return fallback;
  }
}
