/** Legge src e attributi da un iframe incollato, o da un URL nudo (legacy). */
export function parseEmbedIframe(value) {
  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed) && !trimmed.includes("<")) {
    return { src: trimmed, title: "", allow: "", allowFullScreen: true };
  }

  const tag = trimmed.match(
    /<iframe\b[^>]*(?:\/>|>[\s\S]*?<\/iframe>)/i,
  )?.[0];
  if (!tag) return null;

  const src = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
  if (!src) return null;

  return {
    src,
    title: tag.match(/\btitle\s*=\s*["']([^"']+)["']/i)?.[1] || "",
    allow: tag.match(/\ballow\s*=\s*["']([^"']+)["']/i)?.[1] || "",
    allowFullScreen: /\ballowfullscreen\b/i.test(tag),
  };
}
