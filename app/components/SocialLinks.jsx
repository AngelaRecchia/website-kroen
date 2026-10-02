import { storyblokEditable } from "@storyblok/react/rsc";
import { storyblokLinkUrl } from "../lib/storyblok-utils";
import "./SocialLinks.scss";

export default function SocialLinks({ blok }) {
  const { links = [] } = blok;

  if (!links.length) return null;

  return (
    <ul {...storyblokEditable(blok)} className="contact-list social-links">
      {links.map((item) => (
        <li key={item._uid}>
          <a href={storyblokLinkUrl(item.link)} target="_blank" rel="noopener noreferrer">
            <span>{item.label || item.title}</span>
            <span aria-hidden="true">→</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
