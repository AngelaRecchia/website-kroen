import { storyblokLinkUrl } from "./storyblok-utils";

/** Campo `links` o legacy left/right/menu (Storyblok). */
export function resolveHeaderLinksFromBlok(blok) {
  if (!blok) return [];
  if (Array.isArray(blok.links) && blok.links.length > 0) {
    return blok.links;
  }
  return [
    ...(blok.left_links ?? []),
    ...(blok.right_links ?? []),
    ...(blok.menu_links ?? []),
  ];
}

export function navItemsFromBloks(links = []) {
  const seen = new Set();
  return links
    .map((item) => ({
      key: item._uid,
      title: item.title,
      href: storyblokLinkUrl(item.link),
      blok: item,
    }))
    .filter((item) => {
      if (!item.title || !item.href || item.href === "#") return false;
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    });
}

/** 1° sinistra, 2° destra, dal 3° menu collassabile */
export function splitHeaderLinks(links = []) {
  const items = navItemsFromBloks(links);
  return {
    left: items[0] ?? null,
    right: items[1] ?? null,
    extra: items.slice(2),
    all: items,
  };
}
