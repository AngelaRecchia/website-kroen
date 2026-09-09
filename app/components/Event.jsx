import { storyblokEditable } from "@storyblok/react/rsc";
import EventBanner from "./EventBanner";

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
  const { title, date, description, image } = blok;

  return (
    <article
      {...storyblokEditable(blok)}
      className="relative mx-auto min-h-screen w-full max-w-[900px] bg-kroen-red px-4 pb-16 text-white"
    >
      <EventBanner image={image} title={title} priority className="mb-8" />

      {title && <h1 className="heading-text mb-4 text-left">{title}</h1>}

      {date && (
        <p className="mb-6 text-lg">{formatEventDate(date)}</p>
      )}

      {description && (
        <p className="max-w-none text-left text-lg leading-relaxed whitespace-pre-line">
          {description}
        </p>
      )}
    </article>
  );
}
