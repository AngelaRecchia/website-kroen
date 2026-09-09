import { storyblokEditable } from "@storyblok/react/rsc";
import Image from "next/image";
import Link from "./Link";
import ScrollWaveGroup from "./ScrollWaveGroup";
import { storyblokImageUrl } from "../lib/storyblok-utils";

export default function Header({ blok }) {
  const { left_links = [], logo, right_links = [], title } = blok;

  const logoSrc = logo?.filename ? storyblokImageUrl(logo.filename) : null;

  return (
    <header
      {...storyblokEditable(blok)}
      className="relative mx-auto w-full max-w-[900px] px-4 pb-4"
    >
      {logoSrc && (
        <div className="flex justify-center">
          <Image
            src={logoSrc}
            alt={logo?.alt || "Kroen"}
            width={150}
            height={150}
            className="h-[150px] w-[150px]"
            priority
            unoptimized
          />
        </div>
      )}

      <div className="mt-3 grid grid-cols-3 items-start gap-4">
        <ScrollWaveGroup
          waveNumber={6}
          waveSpeed={1}
          direction={1}
          rangeMode="align-start"
          maxShift={56}
          className="flex flex-col items-start gap-5"
        >
          <nav aria-label="Navigazione sinistra" className="contents">
            {left_links.map((item) => (
              <Link key={item._uid} item={item} variant="nav" />
            ))}
          </nav>
        </ScrollWaveGroup>

        <div aria-hidden="true" />

        <ScrollWaveGroup
          waveNumber={6}
          waveSpeed={1}
          direction={-1}
          rangeMode="align-end"
          maxShift={56}
          className="flex flex-col items-end gap-5"
        >
          <nav aria-label="Navigazione destra" className="contents">
            {right_links.map((item) => (
              <Link key={item._uid} item={item} variant="nav" />
            ))}
          </nav>
        </ScrollWaveGroup>
      </div>

      {title && (
        <ScrollWaveGroup
          waveNumber={2}
          waveSpeed={0.8}
          direction={1}
          rangeMode="align-start"
          maxShift={96}
          className="mt-4 text-left"
        >
          <Link variant="title" title={title} />
        </ScrollWaveGroup>
      )}
    </header>
  );
}
