/**
 * Crea/aggiorna i componenti Storyblok nello space Kroen.
 * Uso: node scripts/create-storyblok-components.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    process.env[key] = rest.join("=");
  }
}

loadEnv();

const token = process.env.STORYBLOK_MANAGEMENT_API_ACCESS_TOKEN;
const spaceId = process.env.STORYBLOK_SPACE_ID || "330419";

if (!token) {
  console.error("Manca STORYBLOK_MANAGEMENT_API_ACCESS_TOKEN in .env.local");
  process.exit(1);
}

const baseUrl = `https://mapi.storyblok.com/v1/spaces/${spaceId}/components`;

const components = [
  {
    name: "event",
    display_name: "Event",
    schema: {
      title: { type: "text", pos: 0, required: true },
      date: { type: "datetime", pos: 1, disable_time: true },
      description: { type: "textarea", pos: 2 },
      image: { type: "asset", pos: 3, filetypes: ["images"] },
    },
    is_root: true,
    is_nestable: false,
  },
  {
    name: "events",
    display_name: "Events",
    schema: {},
    is_root: false,
    is_nestable: true,
  },
];

async function upsertComponent(definition) {
  const getRes = await fetch(`${baseUrl}/${definition.name}`, {
    headers: { Authorization: token },
  });

  const method = getRes.ok ? "PUT" : "POST";
  const url = getRes.ok ? `${baseUrl}/${definition.name}` : baseUrl;

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ component: definition }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`${definition.name}: ${JSON.stringify(data)}`);
  }

  console.log(`${method} ${definition.name}`);
}

for (const definition of components) {
  await upsertComponent(definition);
}

console.log("Componenti Storyblok pronti.");
