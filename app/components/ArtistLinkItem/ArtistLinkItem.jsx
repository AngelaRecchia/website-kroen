import { parseEmbedIframe } from "../../lib/embed-iframe";
import { storyblokLinkUrl } from "../../lib/storyblok-utils";
import "./ArtistLinkItem.scss";

export default function ArtistLinkItem({ blok, artistName }) {
  const { link_mode = "link", link_label, link, embed_iframe, embed_url } =
    blok;

  const isEmbed = link_mode === "embed";
  const embed = isEmbed
    ? parseEmbedIframe(embed_iframe || embed_url)
    : null;
  const externalUrl = !isEmbed ? storyblokLinkUrl(link) : null;
  const hasExternalLink = Boolean(externalUrl) && externalUrl !== "#";

  if (isEmbed) {
    if (!embed) return null;
    return (
      <div className="embed">
        <iframe
          title={embed.title || (artistName ? `${artistName} – player` : "Player")}
          src={embed.src}
          loading="lazy"
          allow={embed.allow || "autoplay; encrypted-media"}
          allowFullScreen={embed.allowFullScreen}
        />
      </div>
    );
  }

  if (!hasExternalLink) return null;

  return (
    <ul className="contact-list">
      <li>
        <a
          href={externalUrl}
          className="display t-h4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{link_label || "Sito"}</span>
          <span aria-hidden="true">→</span>
        </a>
      </li>
    </ul>
  );
}
