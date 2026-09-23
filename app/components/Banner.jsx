import { storyblokEditable } from "@storyblok/react/rsc";
import Image from "next/image";
import { storyblokImageUrl } from "../lib/storyblok-utils";

function HeroTitle({ title }) {
  const words = String(title || "")
    .trim()
    .split(/\s+/);
  if (words.length < 2) {
    return <h2 className="display t-h2">{title}</h2>;
  }
  return (
    <h2 className="display t-h2">
      <span>{words[0]}</span>
      <span>{words.slice(1).join(" ")}</span>
    </h2>
  );
}

export default function Banner({ blok }) {
  const { title, image, caption } = blok;

  return (
    <div {...storyblokEditable(blok)} className="block">
      {title && (
        <div className="hero">
          <HeroTitle title={title} />
        </div>
      )}

      {image?.filename && (
        <figure className="photo">
          <Image
            src={storyblokImageUrl(image.filename)}
            alt={image.alt || title || ""}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1040px) 100vw, 1040px"
            unoptimized
          />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      )}
    </div>
  );
}
