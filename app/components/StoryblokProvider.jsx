"use client";

import { getStoryblokApi } from "@/app/storyblok";

/** Registra componenti lato client (bridge / hydration). */
export default function StoryblokProvider({ children }) {
  getStoryblokApi();
  return children;
}
