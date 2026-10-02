import { NextResponse } from "next/server";

const UA = "ColorificioKroen/1.0 (website; transport tiles)";

function parseTile(value) {
  const n = Number.parseInt(String(value).replace(/\.png$/i, ""), 10);
  return Number.isInteger(n) ? n : NaN;
}

export async function GET(_request, context) {
  const { z, x, y } = await context.params;
  const zi = parseTile(z);
  const xi = parseTile(x);
  const yi = parseTile(y);
  const max = 2 ** zi;

  if (
    !Number.isInteger(zi) ||
    zi < 0 ||
    zi > 18 ||
    !Number.isInteger(xi) ||
    !Number.isInteger(yi) ||
    xi < 0 ||
    yi < 0 ||
    xi >= max ||
    yi >= max
  ) {
    return NextResponse.json({ error: "Tile non valida." }, { status: 400 });
  }

  const url = `https://tile.memomaps.de/tilegen/${zi}/${xi}/${yi}.png`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/png" },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!res.ok) {
    return new NextResponse(null, { status: 502 });
  }

  return new NextResponse(res.body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
