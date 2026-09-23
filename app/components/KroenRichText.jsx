import { storyblokEditable } from "@storyblok/react/rsc";

export default function KroenRichText({ blok }) {
  const { text, title, lede } = blok;

  if (!text && !title && !lede) return null;

  return (
    <div {...storyblokEditable(blok)} className="block prose">
      {title && <h2 className="display t-h2">{title}</h2>}
      {lede && <p className="text-lg opacity-95 mb-6">{lede}</p>}
      {text && (
        <div className="whitespace-pre-line">{text}</div>
      )}
    </div>
  );
}
