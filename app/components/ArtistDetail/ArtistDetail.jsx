"use client";

import { storyblokEditable } from "@storyblok/react";
import Image from "next/image";
import { resolveArtistLinks } from "../../lib/artist-links";
import { storyblokImageUrl } from "../../lib/storyblok-utils";
import ArtistLinkItem from "../ArtistLinkItem/ArtistLinkItem";
import "./ArtistDetail.scss";

export default function ArtistDetail({ blok }) {
  const { name, photo, bio } = blok;
  const links = resolveArtistLinks(blok);

  const imageSrc = photo?.filename ? storyblokImageUrl(photo.filename) : null;

  return (
    <article {...storyblokEditable(blok)} className="artist">
      {imageSrc && (
        <figure className="photo m-0">
          <Image
            src={imageSrc}
            alt={photo?.alt || name || ""}
            fill
            className="object-cover"
            sizes="(min-width: 400px) 280px, 100vw"
            unoptimized
          />
          {name && <figcaption>{name}</figcaption>}
        </figure>
      )}

      <div className="artist__info">
        {name && <h3 className="display t-h3 artist__name">{name}</h3>}

        {bio && <p className="artist__bio whitespace-pre-line">{bio}</p>}

        {links.map((linkBlok) => (
          <ArtistLinkItem
            key={linkBlok._uid}
            blok={linkBlok}
            artistName={name}
          />
        ))}
      </div>
    </article>
  );
}
