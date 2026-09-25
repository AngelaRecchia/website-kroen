"use client";

import EventAccordionItem from "../EventAccordionItem/EventAccordionItem";
import EventBanner from "../EventBanner";
import { resolveEventDescription } from "../../lib/event-description";
import { useEffect, useState } from "react";
import "./EventsClient.scss";

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
            {upcoming.map((story) => {
              const content = story.content ?? {};
              return (
                <EventAccordionItem
                  key={story.uuid}
                  title={content.title || ""}
                  secondaryTitle={content.secondary_title}
                  date={content.date}
                  description={resolveEventDescription(content)}
                  openTime={content.open_time}
                  startTime={content.start_time}
                  endTime={content.end_time}
                  contributo={content.contributo}
                  prevenditaLink={content.prevendita_link}
                  slug={story.full_slug}
                  soldOut={Boolean(content.sold_out)}
                />
              );
            })}
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
