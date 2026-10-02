function parseCssSize(value) {
  if (value == null || value === "") return null;
  const v = String(value).trim().toLowerCase();
  if (v === "auto") return null;
  if (v.endsWith("%")) {
    const n = parseFloat(v);
    return Number.isFinite(n) && n > 0 ? { kind: "percent", n } : null;
  }
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? { kind: "px", n } : null;
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i"))?.[1];
}

function styleDecl(style, name) {
  if (!style) return null;
  return style.match(new RegExp(`(?:^|;)\\s*${name}\\s*:\\s*([^;]+)`, "i"))?.[1];
}

function isVideoSrc(src) {
  return /youtube|youtu\.be|vimeo/i.test(src);
}

function embedLayout(src, width, height) {
  const wPx = width?.kind === "px" ? width.n : null;
  const hPx = height?.kind === "px" ? height.n : null;

  if (isVideoSrc(src)) {
    return {
      className: "embed--ratio",
      style: { "--embed-ratio": wPx && hPx ? `${wPx} / ${hPx}` : "16 / 9" },
    };
  }

  if (hPx && !wPx) {
    return { className: "embed--bar", style: { "--embed-h": `${hPx}px` } };
  }

  if (wPx && hPx) {
    return {
      className: "embed--ratio",
      style: { "--embed-ratio": `${wPx} / ${hPx}` },
    };
  }

  return { className: "embed--bar", style: { "--embed-h": "120px" } };
}

/** Legge src e layout da un iframe incollato, o da un URL nudo (legacy). */
export function parseEmbedIframe(value) {
  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed) && !trimmed.includes("<")) {
    return {
      src: trimmed,
      title: "",
      allow: "",
      allowFullScreen: true,
      ...embedLayout(trimmed, null, null),
    };
  }

  const tag = trimmed.match(
    /<iframe\b[^>]*(?:\/>|>[\s\S]*?<\/iframe>)/i,
  )?.[0];
  if (!tag) return null;

  const src = attr(tag, "src");
  if (!src) return null;

  const inline = attr(tag, "style") || "";
  const width = parseCssSize(styleDecl(inline, "width") || attr(tag, "width"));
  const height = parseCssSize(styleDecl(inline, "height") || attr(tag, "height"));

  return {
    src,
    title: attr(tag, "title") || "",
    allow: attr(tag, "allow") || "",
    allowFullScreen: /\ballowfullscreen\b/i.test(tag),
    ...embedLayout(src, width, height),
  };
}
