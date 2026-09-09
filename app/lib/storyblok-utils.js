/** CDN Storyblok per WebGL/CORS (sempre a2, mai a.). */
export function storyblokCdnMirror(url) {
  if (!url) return "";
  return url
    .replace(/\/\/a\.storyblok\.com/gi, "//a2.storyblok.com")
    .replace(/https:\/\/a\.storyblok\.com/gi, "https://a2.storyblok.com")
    .replace(/http:\/\/a\.storyblok\.com/gi, "https://a2.storyblok.com");
}

export function storyblokImageUrl(filename) {
  if (!filename) return "";

  const url = filename.startsWith("//") ? `https:${filename}` : filename;
  return storyblokCdnMirror(url);
}

export function storyblokLinkUrl(link) {
  if (!link) return "#";
  if (typeof link === "string") return link;

  const url = link.cached_url || link.url || link.href || "";
  if (!url) return "#";
  if (url.startsWith("http") || url.startsWith("//")) {
    return url.startsWith("//") ? `https:${url}` : url;
  }
  return url.startsWith("/") ? url : `/${url}`;
}
