import Image from "next/image";
import {
  storyblokAssetDimensions,
  storyblokImageUrl,
} from "../../lib/storyblok-utils";
import "./EventHeroImage.scss";

export default function EventHeroImage({
  image,
  title = "",
  priority = false,
  className = "",
}) {
  if (!image?.filename) return null;

  const src = storyblokImageUrl(image.filename);
  const { width, height } = storyblokAssetDimensions(image);

  return (
    <figure className={`event-hero ${className}`.trim()}>
      <Image
        src={src}
        alt={image.alt || title || ""}
        width={width}
        height={height}
        className="event-hero__img"
        priority={priority}
        sizes="(min-width: 760px) 38vw, 100vw"
        unoptimized
      />
    </figure>
  );
}
