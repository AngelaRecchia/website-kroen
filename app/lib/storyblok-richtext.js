import { renderRichText } from "@storyblok/js";

/**
 * Normalizza valori richtext Storyblok (doc, nodo singolo o array di blocchi).
 * @param {unknown} value
 * @returns {object | string | null}
 */
export function normalizeStoryblokRichText(value) {
  if (value == null || value === "") return null;
  if (typeof value === "string") return value;
  if (typeof value !== "object") return null;

  if (Array.isArray(value)) {
    if (value.every((node) => node && node.type === "text")) {
      return {
        type: "doc",
        content: [{ type: "paragraph", content: value }],
      };
    }
    return { type: "doc", content: value };
  }

  const node = /** @type {{ type?: string; content?: unknown[] }} */ (value);
  if (node.type === "doc" && Array.isArray(node.content)) {
    return node;
  }
  if (node.type && Array.isArray(node.content)) {
    return {
      type: "doc",
      content: [node],
    };
  }

  return null;
}

/**
 * @param {unknown} value
 * @returns {string | null}
 */
export function storyblokRichTextToHtml(value) {
  const normalized = normalizeStoryblokRichText(value);
  if (!normalized) return null;
  if (typeof normalized === "string") {
    return normalized
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${escapeHtml(line)}</p>`)
      .join("");
  }

  try {
    const html = renderRichText(normalized);
    return typeof html === "string" && html.length > 0 ? html : null;
  } catch {
    return null;
  }
}

/** @param {string} value */
function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** @param {Record<string, unknown>} blok */
export function resolveStoryblokTextField(blok) {
  const { text, lede } = blok;
  if (text != null && text !== "") return text;
  if (lede != null && lede !== "") return lede;
  return null;
}
