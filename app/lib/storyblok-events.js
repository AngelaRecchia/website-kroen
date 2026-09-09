import { getStoryblokApi } from "../storyblok";

/** Converte il campo date Storyblok (datetime) in timestamp per ordinamento. */
export function parseEventDate(value) {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  if (typeof value !== "string") {
    return Number.POSITIVE_INFINITY;
  }

  const trimmed = value.trim();

  // Legacy: DD.MM.YY
  const legacyMatch = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{2,4})$/);
  if (legacyMatch) {
    const [, day, month, yearPart] = legacyMatch;
    const year =
      Number(yearPart) < 100 ? 2000 + Number(yearPart) : Number(yearPart);
    return new Date(year, Number(month) - 1, Number(day)).getTime();
  }

  // Storyblok datetime: "2026-03-27 00:00" o ISO
  const normalized = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  const parsed = Date.parse(normalized);

  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

export function isEventPast(dateValue) {
  const timestamp = parseEventDate(dateValue);
  if (timestamp === Number.POSITIVE_INFINITY) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return timestamp < today.getTime();
}

export function partitionEventsByDate(stories) {
  const upcoming = [];
  const past = [];

  for (const story of stories) {
    if (isEventPast(story.content?.date)) {
      past.push(story);
    } else {
      upcoming.push(story);
    }
  }

  past.sort(
    (a, b) => parseEventDate(b.content?.date) - parseEventDate(a.content?.date),
  );

  return { upcoming, past };
}

export async function fetchEventStories(version = "draft") {
  const storyblokApi = getStoryblokApi();
  const { data } = await storyblokApi.getStories({
    version,
    content_type: "event",
    per_page: 100,
  });

  const stories = data?.stories ?? [];

  return [...stories].sort(
    (a, b) =>
      parseEventDate(a.content?.date) - parseEventDate(b.content?.date),
  );
}
