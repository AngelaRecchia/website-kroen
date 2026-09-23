import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';
import Page from './components/Page';
import Banner from './components/Banner';
import Header from './components/Header';
import Link from './components/Link';
import Events from './components/Events';
import Event from './components/Event';
import Footer from './components/Footer';
import StepList from './components/StepList';
import CalloutNote from './components/CalloutNote';
import KroenForm from './components/KroenForm';
import MapEmbed from './components/MapEmbed';
import SocialLinks from './components/SocialLinks';
import RevenueTable from './components/RevenueTable';
import DocumentList from './components/DocumentList';
import KroenRichText from './components/KroenRichText';
import KroenImage from './components/KroenImage';
import LayoutSito from './components/Settings';

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
    step_list: StepList,
    note: CalloutNote,
    form: KroenForm,
    map_embed: MapEmbed,
    social_links: SocialLinks,
    revenue_table: RevenueTable,
    document_list: DocumentList,
    rich_text: KroenRichText,
    kroen_image: KroenImage,
    settings: LayoutSito,
    layout_sito: LayoutSito,

    page: Page,
  },
  apiOptions: {
    region: 'eu',
  },
});
