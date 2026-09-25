import { storyblokRichTextToHtml } from "../lib/storyblok-richtext";
import KroenForm from "./KroenForm/KroenForm";

/** Form tessera/contatti: intro richtext renderizzata lato server. */
export default function KroenFormBlock({ blok }) {
  const introHtml = storyblokRichTextToHtml(blok.text);

  return <KroenForm blok={blok} introHtml={introHtml ?? undefined} />;
}
