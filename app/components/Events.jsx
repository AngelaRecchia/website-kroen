import { storyblokEditable } from "@storyblok/react/rsc";
import {
  fetchEventStories,
  partitionEventsByDate,
} from "../lib/storyblok-events";
import EventsClient from "./EventsClient";

export default async function Events({ blok }) {
  const stories = await fetchEventStories("draft");
  const { upcoming, past } = partitionEventsByDate(stories);

  return (
    <div {...storyblokEditable(blok)}>
      <EventsClient upcoming={upcoming} past={past} />
    </div>
  );
}
