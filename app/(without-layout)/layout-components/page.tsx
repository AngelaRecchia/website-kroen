import { StoryblokStory } from "@storyblok/react/rsc";
import { notFound } from "next/navigation";
import StoryblokBridgeLoader from "../../components/StoryblokBridgeLoader";
import { LAYOUT_STORY_SLUG } from "../../lib/storyblok-layout";
import { resolveStoryblokVersion } from "../../lib/storyblok-preview";
import { getStoryblokApi } from "../../storyblok";

/** Live preview Storyblok: no cache statica, sempre draft in iframe editor. */
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LayoutComponentsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const storyblokApi = getStoryblokApi();
  const version = resolveStoryblokVersion(sp);

  try {
    const { data } = await storyblokApi.getStory(LAYOUT_STORY_SLUG, {
      version,
    });
    const story = data?.story;
    if (!story?.content) notFound();

    return (
      <>
        <StoryblokBridgeLoader />
        <StoryblokStory story={story} />
      </>
    );
  } catch {
    notFound();
  }
}
