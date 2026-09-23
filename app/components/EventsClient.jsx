"use client";

import EventAccordionItem from "./EventAccordionItem";
import EventBanner from "./EventBanner";
import { useEffect, useState } from "react";

export default function EventsClient({
  upcoming,
  past,
  showUpcoming = true,
  pastDisplay = "link",
  pastLinkHref = "/eventi-passati",
  pastLinkLabel = "Eventi passati",
}) {
  const [webglEnabled, setWebglEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setWebglEnabled(!reducedMotion);
  }, []);

  const showPastGrid = pastDisplay === "grid" && past.length > 0;
  const showPastLink = pastDisplay === "link";
  const hasUpcomingList = showUpcoming && upcoming.length > 0;

  if (!hasUpcomingList && !showPastGrid && !showPastLink) {
    return null;
  }

  return (
    <section className="block">
      {hasUpcomingList && (
        <>
          <h2 className="sr-only">Prossimi eventi</h2>
          <ul className="events">
            {upcoming.map((story) => (
              <EventAccordionItem
                key={story.uuid}
                title={story.content?.title || ""}
                date={story.content?.date}
                description={story.content?.description}
                eventDescription={story.content?.event_description}
                startTime={story.content?.start_time}
                endTime={story.content?.end_time}
                contributo={story.content?.contributo}
                image={story.content?.image}
                slug={story.full_slug}
                soldOut={Boolean(story.content?.sold_out)}
              />
            ))}
          </ul>
        </>
      )}

      {showPastLink && (
        <div className={hasUpcomingList ? "mt-12" : undefined}>
          <a href={pastLinkHref} className="btn btn--line">
            {pastLinkLabel}
          </a>
        </div>
      )}

      {showPastGrid && (
        <div className={hasUpcomingList ? "mt-12" : undefined}>
          <h2 className="display t-h2">Eventi passati</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {past.map((story) => (
              <EventBanner
                key={story.uuid}
                image={story.content?.image}
                title={story.content?.title || ""}
                className="m-0 opacity-90"
                webglEnabled={webglEnabled}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
