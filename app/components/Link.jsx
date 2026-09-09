import { storyblokLinkUrl } from "../lib/storyblok-utils";

const variantStyles = {
  nav: "heading-text block uppercase text-[32px] leading-none transition-opacity hover:opacity-80",
  title: "heading-text block w-full uppercase text-[7.75rem] leading-[0.7] text-left",
};

function TitleLines({ title }) {
  const words = String(title).trim().split(/\s+/);

  if (words.length < 2) {
    return title;
  }

  return (
    <>
      {words[0]}
      <br />
      {words.slice(1).join(" ")}
    </>
  );
}

export default function Link({
  item,
  blok,
  variant = "nav",
  title: titleProp,
  link: linkProp,
  children,
}) {
  const data = item ?? blok ?? {};
  const title = titleProp ?? data.title ?? children;
  const link = linkProp ?? data.link;

  if (!title) return null;

  const className = `wave-item w-max max-w-full text-white ${variantStyles[variant] ?? variantStyles.nav}`;
  const href = storyblokLinkUrl(link);
  const hasLink = href && href !== "#";
  const content =
    variant === "title" ? <TitleLines title={title} /> : title;

  if (variant === "title" && !hasLink) {
    return <h1 className={className}>{content}</h1>;
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  );
}
