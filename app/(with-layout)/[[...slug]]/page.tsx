import { StoryblokStory } from "@storyblok/react/rsc";
import { notFound } from "next/navigation";
import { getStoryblokApi } from "../../storyblok";
import { LAYOUT_STORY_SLUG } from "../../lib/storyblok-layout";
import { getStoryblokVersion } from "../../lib/storyblok-version";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

function resolveStorySlug(slug?: string[]) {
  return slug?.length ? slug.join("/") : "home";
}

export async function generateStaticParams() {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN;
  if (!token) return [];

  try {
    const storyblokApi = getStoryblokApi();
    const version = getStoryblokVersion();
    const { data } = await storyblokApi.getStories({
      version,
      content_type: "page",
      per_page: 100,
    });
    const stories = data?.stories ?? [];
    return stories.map((story: { full_slug: string }) => {
      if (story.full_slug === "home") return { slug: [] as string[] };
      return { slug: story.full_slug.split("/") };
    });
  } catch {
    return [{ slug: [] as string[] }];
  }
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const storySlug = resolveStorySlug(slug);

  if (storySlug === LAYOUT_STORY_SLUG || storySlug === "header") {
    notFound();
  }

  const storyblokApi = getStoryblokApi();
  const version = getStoryblokVersion();

  try {
    const { data } = await storyblokApi.getStory(storySlug, {
      version,
    });

    if (!data?.story) {
      notFound();
    }

    return <StoryblokStory story={data.story} />;
  } catch {
    notFound();
  }
}
