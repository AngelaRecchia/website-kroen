/** Storyblok datetime → Date locale (solo giorno, senza shift UTC). */
export function parseEventDate(value) {
  if (value == null || value === "") return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  const isoDay = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (isoDay) {
    const y = Number(isoDay[1]);
    const m = Number(isoDay[2]);
    const d = Number(isoDay[3]);
    const local = new Date(y, m - 1, d);
    return Number.isNaN(local.getTime()) ? null : local;
  }

  const normalized = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Pagina evento: testo leggibile, es. «3 ottobre 2026». */
export function formatEventDateText(value) {
  const parsed = parseEventDate(value);
  if (!parsed) return typeof value === "string" && value.trim() ? value.trim() : null;

  return parsed.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Accordion: giorno + mese lungo. */
export function formatEventDateHeadline(value) {
  const parsed = parseEventDate(value);
  if (!parsed) return typeof value === "string" && value.trim() ? value.trim() : null;

  return parsed.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
  });
}
