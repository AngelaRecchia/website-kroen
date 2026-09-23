import { storyblokEditable } from "@storyblok/react/rsc";
import EventBanner from "./EventBanner";
import EventFacts from "./EventFacts";

function formatEventDate(date) {
  if (!date || typeof date !== "string") return null;

  const normalized = date.includes("T") ? date : date.replace(" ", "T");
  const parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export default function Event({ blok }) {
  const {
    title,
    date,
    start_time,
    end_time,
    event_description,
    description,
    contributo,
    image,
  } = blok;

  const bodyText = event_description || description;

  return (
    <article {...storyblokEditable(blok)} className="kroen-page pb-16">
      <EventBanner image={image} title={title} priority className="mb-8" />

      {title && <h1 className="display t-h3 mb-4 text-left">{title}</h1>}

      {date && (
        <p className="mb-6 text-xs sm:text-sm md:text-lg">
          {formatEventDate(date)}
        </p>
      )}

      <EventFacts
        startTime={start_time}
        endTime={end_time}
        contributo={contributo}
        className="mb-8"
      />

      {bodyText && (
        <p className="max-w-none text-left text-xs sm:text-sm md:text-lg leading-relaxed whitespace-pre-line">
          {bodyText}
        </p>
      )}
    </article>
  );
}
