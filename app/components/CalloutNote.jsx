import { storyblokEditable } from "@storyblok/react/rsc";

export default function CalloutNote({ blok }) {
  const { text } = blok;
  if (!text) return null;

  return (
    <aside {...storyblokEditable(blok)} className="note">
      <p>{text}</p>
    </aside>
  );
}
