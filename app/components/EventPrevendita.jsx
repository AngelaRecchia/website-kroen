import { kroenLabel } from "../lib/kroen-labels";
import { storyblokLinkUrl } from "../lib/storyblok-utils";

function hasPrevenditaLink(link) {
  if (!link) return false;
  const href = storyblokLinkUrl(link);
  return Boolean(href) && href !== "#";
}

export default function EventPrevendita({ link, soldOut = false, className = "" }) {
  if (soldOut || !hasPrevenditaLink(link)) return null;

  const href = storyblokLinkUrl(link);

  return (
    <a
      href={href}
      className={`btn event__prevendita ${className}`.trim()}
      target="_blank"
      rel="noopener noreferrer"
    >
      {kroenLabel("event.prevendita")}
    </a>
  );
}
