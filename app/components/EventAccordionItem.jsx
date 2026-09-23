"use client";

import { useId, useState } from "react";
import Image from "next/image";
import EventFacts from "./EventFacts";
import { storyblokImageUrl } from "../lib/storyblok-utils";

function formatEventDate(date) {
  if (!date || typeof date !== "string") return null;
  const normalized = date.includes("T") ? date : date.replace(" ", "T");
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
  });
}

export default function EventAccordionItem({
  title,
  date,
  description,
  eventDescription,
  startTime,
  endTime,
  contributo,
  image,
  soldOut = false,
  slug,
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const dateLabel = formatEventDate(date);
  const imageSrc = image?.filename ? storyblokImageUrl(image.filename) : null;
  const previewText = description || eventDescription;

  return (
    <li className="event">
      <button
        type="button"
        className="event__head"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {dateLabel && <span className="event__date">{dateLabel}</span>}
        {soldOut && <span className="event__tag">Sold out</span>}
        <span className="event__plus" aria-hidden="true" />
        <span className="event__title">{title}</span>
      </button>
      <div id={panelId} className={`event__panel${open ? " is-open" : ""}`}>
        <div className="event__inner">
          <div className="event__body">
            <div>
              <EventFacts
                startTime={startTime}
                endTime={endTime}
                contributo={contributo}
                className="mb-4"
              />
              {previewText && <p>{previewText}</p>}
              {slug && (
                <a href={`/${slug}`} className="btn btn--line">
                  Dettagli
                </a>
              )}
            </div>
            {imageSrc && (
              <figure className="photo m-0">
                <Image
                  src={imageSrc}
                  alt={image?.alt || title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 760px) 40vw, 100vw"
                  unoptimized
                />
              </figure>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
