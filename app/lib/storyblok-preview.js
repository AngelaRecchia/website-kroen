import { getStoryblokVersion } from "./storyblok-version";

/** Draft in Visual Editor (`_storyblok` / iframe). */
export function resolveStoryblokVersion(searchParams) {
  if (!searchParams) return getStoryblokVersion();

  const hasPreview =
    "_storyblok" in searchParams ||
    "_storyblok_tk" in searchParams ||
    "_storyblok_c" in searchParams;

  if (hasPreview) return "draft";

  return getStoryblokVersion();
}

export function isStoryblokPreviewSearchParams(searchParams) {
  if (!searchParams) return false;
  return (
    "_storyblok" in searchParams ||
    "_storyblok_tk" in searchParams ||
    "_storyblok_c" in searchParams
  );
}
