/** @param {Record<string, unknown>} blok */
export function resolveArtistLinks(blok) {
  const nested = blok.links;
  if (Array.isArray(nested) && nested.length > 0) {
    return nested.filter((item) => item && typeof item === "object");
  }

  const mode = blok.link_mode;
  if (mode !== "link" && mode !== "embed") return [];

  const hasLink = mode === "link" && blok.link;
  const hasEmbed = mode === "embed" && (blok.embed_iframe || blok.embed_url);
  if (!hasLink && !hasEmbed) return [];

  return [
    {
      _uid: "legacy-link",
      component: "artist_link",
      link_mode: mode,
      link_label: blok.link_label,
      link: blok.link,
      embed_iframe: blok.embed_iframe,
      embed_url: blok.embed_url,
    },
  ];
}
