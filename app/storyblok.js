import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';
import Page from './components/Page';
import Banner from './components/Banner';
import Header from './components/Header';
import Link from './components/Link';
import Events from './components/Events';
import Event from './components/Event';
import Footer from './components/Footer';

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN,
  use: [apiPlugin],
  components: {
    Banner: Banner,
    header: Header,
    link: Link,
    events: Events,
    event: Event,
    footer: Footer,

    // Layout
    page: Page,
  },
  apiOptions: {
    region: 'eu',
  },
});