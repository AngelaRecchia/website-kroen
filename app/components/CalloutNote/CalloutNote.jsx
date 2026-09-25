import { storyblokEditable } from "@storyblok/react/rsc";
import KroenRichTextContent from "../KroenRichTextContent";
import "./CalloutNote.scss";

export default function CalloutNote({ blok }) {
  const { text } = blok;
  if (!text) return null;

  return (
    <aside {...storyblokEditable(blok)} className="note">
      {typeof text === "string" ? <p>{text}</p> : <KroenRichTextContent value={text} />}
    </aside>
  );
}
