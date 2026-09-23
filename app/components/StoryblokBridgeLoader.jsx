"use client";

import { loadStoryblokBridge } from "@storyblok/react/rsc";
import { useEffect } from "react";

function isStoryblokVisualEditor() {
  if (typeof window === "undefined") return false;
  try {
    return (
      window.location !== window.parent.location ||
      window.location.search.includes("_storyblok")
    );
  } catch {
    return true;
  }
}

/** Carica il bridge per live preview nel Visual Editor. */
export default function StoryblokBridgeLoader() {
  useEffect(() => {
    if (!isStoryblokVisualEditor()) return;
    loadStoryblokBridge();
  }, []);

  return null;
}
