import { storyblokLinkUrl } from "../lib/storyblok-utils";

const variantStyles = {
  nav: "t-h4 kroen-nav__link kroen-reveal text-white transition-opacity hover:opacity-90",
  title: "hero__title t-h1",
};

/** Sempre due righe: prima parola / resto (NBSP, niente break dentro le parole). */
function TitleLines({ title }) {
  const words = String(title).trim().split(/\s+/).filter(Boolean);

  if (words.length < 2) {
    return (
      <span className="hero__title-line">{words[0] ?? title}</span>
    );
  }

  const line2 = words.slice(1).join("\u00A0");

  return (
    <>
      <span className="hero__title-line">{words[0]}</span>
      <span className="hero__title-line">{line2}</span>
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

  const className =
    variant === "title"
      ? variantStyles.title
      : `w-max max-w-full ${variantStyles[variant] ?? variantStyles.nav}`;
  const href = storyblokLinkUrl(link);
  const hasLink = href && href !== "#";
  const content =
    variant === "title" ? <TitleLines title={title} /> : title;

  if (variant === "title" && !hasLink) {
    return <h1 className={className}>{content}</h1>;
  }

  if (variant === "nav") {
    return (
      <h4 className={className}>
        <a href={href}>{content}</a>
      </h4>
    );
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  );
}
