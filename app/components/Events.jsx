import { storyblokEditable } from "@storyblok/react/rsc";
import {
  fetchEventStories,
  partitionEventsByDate,
} from "../lib/storyblok-events";
import { getStoryblokVersion } from "../lib/storyblok-version";
import EventsClient from "./EventsClient/EventsClient";
import { storyblokLinkUrl } from "../lib/storyblok-utils";

export default async function Events({ blok }) {
  const version = getStoryblokVersion();
  const stories = await fetchEventStories(version);
  const { upcoming, past } = partitionEventsByDate(stories);

  const showUpcoming = blok.show_upcoming !== false;
  const pastDisplay = blok.past_display || "link";
  const pastLinkHref =
    storyblokLinkUrl(blok.past_link) || "/eventi-passati";
  const pastLinkLabel = blok.past_link_label || "Eventi passati";

  return (
    <div {...storyblokEditable(blok)} className="events-block">
      <EventsClient
        upcoming={upcoming}
        past={past}
        showUpcoming={showUpcoming}
        pastDisplay={pastDisplay}
        pastLinkHref={pastLinkHref}
        pastLinkLabel={pastLinkLabel}
      />
    </div>
  );
}
