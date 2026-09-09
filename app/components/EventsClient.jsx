"use client";

import { useEffect, useState } from "react";
import EventBanner from "./EventBanner";
import ScrollWaveGroup from "./ScrollWaveGroup";

function EventsSectionTitle({ children }) {
  return (
    <h2 className="wave-item heading-text mb-6 w-max text-left text-[32px] uppercase leading-none">
      {children}
    </h2>
  );
}

export default function EventsClient({ upcoming, past }) {
  const [webglEnabled, setWebglEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setWebglEnabled(!reducedMotion);
  }, []);

  if (upcoming.length === 0 && past.length === 0) {
    return null;
  }

  return (
    <section className="relative mx-auto w-full max-w-[900px] px-4 pt-2 pb-8">
      {upcoming.length > 0 && (
        <div className="flex flex-col gap-6">
          {upcoming.map((story, index) => (
            <EventBanner
              key={story.uuid}
              image={story.content?.image}
              title={story.content?.title || ""}
              priority={index === 0}
              webglEnabled={webglEnabled}
            />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className={upcoming.length > 0 ? "mt-12" : undefined}>
          <ScrollWaveGroup
            waveNumber={10}
            waveSpeed={1}
            direction={-1}
            rangeMode="align-start"
            maxShift={40}
          >
            <EventsSectionTitle>Eventi passati</EventsSectionTitle>
          </ScrollWaveGroup>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {past.map((story) => (
              <EventBanner
                key={story.uuid}
                image={story.content?.image}
                title={story.content?.title || ""}
                className="opacity-90"
                webglEnabled={webglEnabled}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
