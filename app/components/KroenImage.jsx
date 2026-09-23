import { storyblokEditable } from "@storyblok/react/rsc";
import Image from "next/image";
import { storyblokImageUrl } from "../lib/storyblok-utils";

export default function KroenImage({ blok }) {
  const { image, caption } = blok;
  if (!image?.filename) return null;

  return (
    <figure {...storyblokEditable(blok)} className="photo block">
      <Image
        src={storyblokImageUrl(image.filename)}
        alt={image.alt || caption || ""}
        fill
        className="object-cover"
        sizes="(max-width: 1040px) 100vw, 1040px"
        unoptimized
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
