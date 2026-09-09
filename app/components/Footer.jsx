import { storyblokEditable } from "@storyblok/react/rsc";
import Image from "next/image";
import { storyblokImageUrl, storyblokLinkUrl } from "../lib/storyblok-utils";

export default function Footer({ blok }) {
  const {
    copyright_text = "Copyright © Colorificio Kroen. Tutti i diritti riservati.",
    privacy_link,
    designer_link,
    designer_logo,
  } = blok;

  return (
    <footer
      {...storyblokEditable(blok)}
      className="mx-auto w-full max-w-[800px] px-4 pb-16 pt-24 text-center font-[Helvetica,Arial,sans-serif] text-lg leading-[18px] tracking-[2px] text-white"
    >
      <p>
        {copyright_text}{" "}
        {privacy_link && (
          <>
            <a
              href={storyblokLinkUrl(privacy_link)}
              className="underline"
            >
              Privacy
            </a>
            .
          </>
        )}
      </p>

      {designer_logo?.filename && (
        <div className="mt-8">
          <a href={storyblokLinkUrl(designer_link)}>
            <Image
              src={storyblokImageUrl(designer_logo.filename)}
              alt={designer_logo.alt || "Web design"}
              width={60}
              height={60}
              className="mx-auto inline h-[60px] w-[60px]"
              unoptimized
            />
          </a>
        </div>
      )}
    </footer>
  );
}
