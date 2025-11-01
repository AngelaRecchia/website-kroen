import { StoryblokStory } from "@storyblok/react/rsc";
import { getStoryblokApi } from "../storyblok";


export default async function Home() {
  const { data } = await fetchData();

  return (
    <div className="page">
      <StoryblokStory story={data.story} />
    </div>
  );
}

async function fetchData() {
  const storyblokApi = getStoryblokApi();
  const story = await storyblokApi.getStory('home', {
    version: 'draft',
  });
  return story;
}