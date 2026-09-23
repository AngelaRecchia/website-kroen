import { cache } from "react";
import { getStoryblokApi } from "../storyblok";
import { getStoryblokVersion } from "./storyblok-version";

/** Story singleton «Layout sito» (slug layout-components). */
export const LAYOUT_STORY_SLUG = "layout-components";

const LAYOUT_ROOT_COMPONENTS = new Set(["settings", "layout_sito"]);

function pickBlok(bloks) {
  if (!Array.isArray(bloks) || bloks.length === 0) return null;
  return bloks[0];
}

function layoutFromContent(content) {
  if (!content || !LAYOUT_ROOT_COMPONENTS.has(content.component)) {
    return null;
  }
  return {
    header: pickBlok(content.header),
    footer: pickBlok(content.footer),
  };
}

async function fetchLayout(storyblokApi, version) {
  const { data } = await storyblokApi.getStory(LAYOUT_STORY_SLUG, { version });
  return layoutFromContent(data?.story?.content);
}

/**
 * Header + footer globali da Storyblok. Usato in `(with-layout)/layout.tsx`.
 */
export const getGlobalLayout = cache(async function getGlobalLayout() {
  const storyblokApi = getStoryblokApi();
  const version = getStoryblokVersion();

  try {
    let layout = await fetchLayout(storyblokApi, version);

    if (!layout?.header && version === "published") {
      layout = await fetchLayout(storyblokApi, "draft");
    }

    return layout ?? { header: null, footer: null };
  } catch {
    if (version === "published") {
      try {
        const layout = await fetchLayout(storyblokApi, "draft");
        return layout ?? { header: null, footer: null };
      } catch {
        /* ignore */
      }
    }
    return { header: null, footer: null };
  }
});
