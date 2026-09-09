"use client";

import { getStoryblokApi } from "@/app/storyblok";

export default function StoryblokProvider({ children }) {
  getStoryblokApi();
  return children;
}