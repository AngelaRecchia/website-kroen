import {
  storyblokEditable,
  StoryblokServerComponent,
} from "@storyblok/react/rsc";

/** Content type «Layout sito» — header/footer come blok annidati (editable + bridge). */
export default function LayoutSito({ blok }) {
  return (
    <div {...storyblokEditable(blok)} className="kroen-page min-h-screen">
      {blok.header?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
      {blok.footer?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}
