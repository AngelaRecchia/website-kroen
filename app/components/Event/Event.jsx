import { storyblokEditable } from "@storyblok/react/rsc";

import EventHeroImage from "../EventHeroImage/EventHeroImage";

import EventFacts from "../EventFacts/EventFacts";

import ArtistDetail from "../ArtistDetail/ArtistDetail";

import { formatEventDateText } from "../../lib/event-date";

import { resolveEventDescription } from "../../lib/event-description";

import KroenRichTextContent from "../KroenRichTextContent";

import { kroenLabel } from "../../lib/kroen-labels";
import "./Event.scss";

export default function Event({ blok }) {
  const {
    title,

    secondary_title,

    date,

    open_time,

    start_time,

    end_time,

    contributo,

    prevendita_link,

    sold_out,

    image,

    artist_details = [],
  } = blok;

  const bodyCopy = resolveEventDescription(blok);

  const dateLabel = formatEventDateText(date);

  const isSoldOut = Boolean(sold_out);

  return (
    <article
      {...storyblokEditable(blok)}
      className="kroen-page event-page pb-16"
    >
      {dateLabel && <p className="date event-page__date">{dateLabel}</p>}

      <div className="event-page__mast">
        {title && (
          <header className="event-page__head">
            <h1 className="display hero__title t-h1 event-page__title text-left">
              {title}
            </h1>

            {secondary_title && (
              <h2 className="display t-h3 event-page__subtitle text-left">
                {secondary_title}
              </h2>
            )}
          </header>
        )}

        <div className="event-page__body">
          <div className="event-page__poster-wrap">
            <EventHeroImage
              image={image}
              title={title}
              priority
              className="event-page__poster"
            />
            {isSoldOut && (
              <span className="event__tag event-page__soldout">
                {kroenLabel("event.sold_out")}
              </span>
            )}
          </div>

          <div className="event-page__content">
            <EventFacts
              openTime={open_time}
              startTime={start_time}
              endTime={end_time}
              contributo={contributo}
              prevenditaLink={prevendita_link}
              soldOut={isSoldOut}
              className="facts--row event-page__facts"
            />
            <KroenRichTextContent
              value={bodyCopy}
              className="prose event-page__copy max-w-none text-left text-xs sm:text-sm md:text-lg leading-relaxed"
            />
          </div>
        </div>
      </div>

      {artist_details.length > 0 && (
        <section className="block event-page__artists">
          <h2 className="display t-h2">Artisti</h2>

          <div className="artists">
            {artist_details.map((artist) => (
              <ArtistDetail key={artist._uid} blok={artist} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
