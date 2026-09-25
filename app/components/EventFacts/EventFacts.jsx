import { kroenLabel } from "../../lib/kroen-labels";
import { storyblokLinkUrl } from "../../lib/storyblok-utils";
import "./EventFacts.scss";

function hasPrevenditaLink(link) {
  if (!link) return false;
  const href = storyblokLinkUrl(link);
  return Boolean(href) && href !== "#";
}

const FIELDS = [
  { key: "open_time", labelKey: "event.open_time" },
  { key: "start_time", labelKey: "event.start_time" },
  { key: "end_time", labelKey: "event.end_time" },
  { key: "contributo", labelKey: "event.contributo" },
];

export default function EventFacts({
  openTime,
  startTime,
  endTime,
  contributo,
  prevenditaLink,
  soldOut = false,
  className = "",
}) {
  const values = {
    open_time: openTime,
    start_time: startTime,
    end_time: endTime,
    contributo,
  };

  const items = FIELDS.map(({ key, labelKey }) => {
    const value = values[key];
    if (!value) return null;
    return { key, label: kroenLabel(labelKey), value };
  }).filter(Boolean);

  if (soldOut) {
    items.push({
      key: "prevendita",
      label: kroenLabel("event.prevendita"),
      soldOut: true,
    });
  } else if (hasPrevenditaLink(prevenditaLink)) {
    items.push({
      key: "prevendita",
      label: kroenLabel("event.prevendita"),
      href: storyblokLinkUrl(prevenditaLink),
    });
  }

  if (!items.length) return null;

  return (
    <dl className={`facts ${className}`.trim()}>
      {items.map(({ key, label, value, href, soldOut: isSoldOut }) => (
        <div key={key}>
          <dt>{label}</dt>
          <dd>
            {isSoldOut ? (
              <span className="event__tag event__tag--fact">
                {kroenLabel("event.sold_out")}
              </span>
            ) : href ? (
              <a
                href={href}
                className="facts__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {kroenLabel("event.prevendita")}
              </a>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
