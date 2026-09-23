import { storyblokEditable } from "@storyblok/react/rsc";
import { storyblokLinkUrl } from "../lib/storyblok-utils";

export default function Footer({ blok }) {
  const {
    copyright_text = "Copyright © Colorificio Kroen. Tutti i diritti riservati.",
    privacy_link,
  } = blok;

  return (
    <footer
      {...storyblokEditable(blok)}
      className="pb-16 pt-24 text-center text-sm sm:text-base leading-relaxed tracking-wide text-white"
    >
      <p>
        {copyright_text}{" "}
        {privacy_link && (
          <>
            <a href={storyblokLinkUrl(privacy_link)} className="underline">
              Privacy
            </a>
            .
          </>
        )}
      </p>
    </footer>
  );
}
