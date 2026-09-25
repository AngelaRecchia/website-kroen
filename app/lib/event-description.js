function isEmptyRichText(value) {
  if (!value || typeof value !== "object") return false;
  if (value.type !== "doc") return false;
  const content = value.content;
  return !Array.isArray(content) || content.length === 0;
}

/** Descrizione evento: `description` (richtext) o legacy `event_description`. */
export function resolveEventDescription(content) {
  if (!content || typeof content !== "object") return null;

  for (const key of ["description", "event_description"]) {
    const value = content[key];
    if (value == null || value === "") continue;
    if (typeof value === "string" && !value.trim()) continue;
    if (isEmptyRichText(value)) continue;
    return value;
  }

  return null;
}
