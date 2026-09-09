import Header from "../components/Header";
import { getStoryblokApi } from "../storyblok";

function resolveHeaderBlok(content: {
  component: string;
  body?: { component: string }[];
}) {
  if (content.component === "header") {
    return content;
  }

  const headerBlok = content.body?.find((blok) => blok.component === "header");
  return headerBlok ?? content;
}

async function fetchHeaderBlok() {
  const storyblokApi = getStoryblokApi();
  const { data } = await storyblokApi.getStory("header", {
    version: "draft",
  });

  return resolveHeaderBlok(data.story.content);
}

export default async function WithLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerBlok = await fetchHeaderBlok();

  return (
    <>
      <Header blok={headerBlok} />
      {children}
    </>
  );
}
