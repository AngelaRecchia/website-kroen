import { NextResponse } from "next/server";

const UA = "ColorificioKroen/1.0 (website; map geocode)";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "Manca l'indirizzo." }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "it");

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": UA,
    },
    next: { revalidate: 60 * 60 * 24 * 7 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Geocoding non disponibile." }, { status: 502 });
  }

  const data = await res.json();
  const hit = Array.isArray(data) ? data[0] : null;
  const lat = Number.parseFloat(hit?.lat);
  const lon = Number.parseFloat(hit?.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "Indirizzo non trovato." }, { status: 404 });
  }

  return NextResponse.json({ lat, lon });
}
