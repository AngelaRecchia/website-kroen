import { storyblokEditable } from "@storyblok/react/rsc";
import { resolveStoryblokTextField } from "../lib/storyblok-richtext";
import KroenRichTextContent from "./KroenRichTextContent";

export default function KroenRichText({ blok }) {
  const { title } = blok;
  const body = resolveStoryblokTextField(blok);

  if (!body && !title) return null;

  return (
    <div {...storyblokEditable(blok)} className="block prose">
      {typeof title === "string" && title.trim() && (
        <h2 className="display t-h2">{title}</h2>
      )}
      <KroenRichTextContent value={body} />
    </div>
  );
}
