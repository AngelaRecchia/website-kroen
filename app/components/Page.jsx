import {
  storyblokEditable,
  StoryblokServerComponent,
} from "@storyblok/react/rsc";

export default function Page({ blok }) {
  return (
    <main
      {...storyblokEditable(blok)}
      className="relative min-h-screen bg-kroen-red text-white"
    >
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
}