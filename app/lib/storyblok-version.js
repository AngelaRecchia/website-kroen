/** draft in dev/preview; published in production build unless overridden */
export function getStoryblokVersion() {
  const forced = process.env.STORYBLOK_VERSION;
  if (forced === "draft" || forced === "published") {
    return forced;
  }
  return process.env.NODE_ENV === "production" ? "published" : "draft";
}
