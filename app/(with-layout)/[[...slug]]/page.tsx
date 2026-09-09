import { StoryblokStory } from "@storyblok/react/rsc";
import { notFound } from "next/navigation";
import { getStoryblokApi } from "../../storyblok";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

function resolveStorySlug(slug?: string[]) {
  return slug?.length ? slug.join("/") : "home";
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const storySlug = resolveStorySlug(slug);

  const storyblokApi = getStoryblokApi();

  try {
    const { data } = await storyblokApi.getStory(storySlug, {
      version: "draft",
    });

    if (!data?.story) {
      notFound();
    }

    return <StoryblokStory story={data.story} />;
  } catch {
    notFound();
  }
}
