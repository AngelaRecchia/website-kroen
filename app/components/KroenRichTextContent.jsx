import { storyblokRichTextToHtml } from "../lib/storyblok-richtext";

/** Corpo richtext / testo plain → HTML sicuro (server o client). */
export default function KroenRichTextContent({ value, className }) {
  const html = storyblokRichTextToHtml(value);
  if (!html) return null;

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
