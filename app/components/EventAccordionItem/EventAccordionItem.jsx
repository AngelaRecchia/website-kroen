"use client";

import { useId, useState } from "react";
import EventFacts from "../EventFacts/EventFacts";
import { formatEventDateHeadline } from "../../lib/event-date";
import KroenRichTextContent from "../KroenRichTextContent";
import "./EventAccordionItem.scss";

export default function EventAccordionItem({
  title,
  secondaryTitle,
  date,
  description,
  openTime,
  startTime,
  endTime,
  contributo,
  prevenditaLink,
  soldOut = false,
  slug,
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const dateLabel = formatEventDateHeadline(date);

  return (
    <li className="event">
      <div className="event__hit">
        <span className="event__head-bg" aria-hidden="true" />
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
          <span className="event__titles">
            <span className="event__title">{title}</span>
            {secondaryTitle && (
              <span className="event__subtitle display t-h4">{secondaryTitle}</span>
            )}
          </span>
        </button>
      </div>
      <div id={panelId} className={`event__panel${open ? " is-open" : ""}`}>
        <div className="event__inner">
          <div className="event__body">
            <EventFacts
              openTime={openTime}
              startTime={startTime}
              endTime={endTime}
              contributo={contributo}
              prevenditaLink={prevenditaLink}
              soldOut={soldOut}
              className="event__facts"
            />
            <div className="event__main">
              <KroenRichTextContent
                value={description}
                className="prose event__description"
              />
              {slug && (
                <a href={`/${slug}`} className="btn btn--line event__detail-link">
                  Dettagli
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
