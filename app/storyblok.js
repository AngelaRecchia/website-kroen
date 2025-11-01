import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';
import Page from './components/Page';
import Banner from './components/Banner';

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN,
  use: [apiPlugin],
  components: {
    Banner: Banner,

    // Layout
    page: Page,
  },
  apiOptions: {
    region: 'eu',
  },
});