import { StoryblokStory } from "@storyblok/react/rsc";
import { getStoryblokApi } from "../../storyblok";


export default async function HeaderPage() {
  const { data } = await fetchData();

  return (
    <div className="relative min-h-screen bg-kroen-red text-white">
      <StoryblokStory story={data.story} />
    </div>
  );
}

async function fetchData() {
  const storyblokApi = getStoryblokApi();
  const story = await storyblokApi.getStory("header", {
    version: "draft",
  });
  return story;
}