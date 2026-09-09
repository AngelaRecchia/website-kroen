import EventBannerSlot from "./scroll-rig/EventBannerSlot";
import { storyblokImageUrl } from "../lib/storyblok-utils";

export default function EventBanner({
  image,
  title = "",
  priority = false,
  className = "",
  webglEnabled,
}) {
  const imageSrc = image?.filename ? storyblokImageUrl(image.filename) : null;

  return (
    <EventBannerSlot
      src={imageSrc}
      alt={image?.alt || title}
      title={title}
      className={className}
      loading={priority ? "eager" : "lazy"}
      webglEnabled={webglEnabled}
    />
  );
}
