/**
 * Crea/aggiorna le 4 page stories Kroen (home, tesseramento, contatti, associazione).
 * Uso: node scripts/seed-kroen-pages.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(filename) {
  const envPath = resolve(process.cwd(), filename);
  if (!existsSync(envPath)) return false;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    process.env[key] = rest.join("=");
  }
  return true;
}

if (!loadEnvFile(".env.local")) {
  loadEnvFile(".env");
}

const token = process.env.STORYBLOK_MANAGEMENT_API_ACCESS_TOKEN;
const spaceId = process.env.STORYBLOK_SPACE_ID || "330419";

if (!token) {
  console.error("Manca STORYBLOK_MANAGEMENT_API_ACCESS_TOKEN");
  process.exit(1);
}

const baseUrl = `https://mapi.storyblok.com/v1/spaces/${spaceId}`;

/** @param {string} value */
function richTextParagraph(value) {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: value }],
      },
    ],
  };
}

const defaultRevenueJson = JSON.stringify({
  2023: {
    Tessere: 4200,
    "Ingressi ai concerti": 9800,
    Bar: 15400,
    "Contributi e bandi": 5000,
    Altro: 1200,
  },
  2024: {
    Tessere: 5100,
    "Ingressi ai concerti": 12600,
    Bar: 18900,
    "Contributi e bandi": 6500,
    Altro: 1500,
  },
  2025: {
    Tessere: 6300,
    "Ingressi ai concerti": 15100,
    Bar: 21700,
    "Contributi e bandi": 7200,
    Altro: 1900,
  },
});

const pages = [
  {
    slug: "home",
    name: "Home",
    body: [
      {
        component: "events",
        show_upcoming: true,
        past_display: "link",
        past_link_label: "Eventi passati",
        past_link: {
          url: "/eventi-passati",
          linktype: "url",
          fieldtype: "multilink",
        },
      },
    ],
  },
  {
    slug: "eventi-passati",
    name: "Eventi passati",
    body: [
      {
        component: "events",
        show_upcoming: false,
        past_display: "grid",
      },
    ],
  },
  {
    slug: "gallery",
    name: "Gallery",
    body: [
      {
        component: "rich_text",
        title: "Gallery",
        text: richTextParagraph(
          "Archivio foto e poster — contenuto in arrivo.",
        ),
      },
    ],
  },
  {
    slug: "tesseramento",
    name: "Tesseramento",
    body: [
      {
        component: "rich_text",
        title: "Tesseramento",
        text: richTextParagraph(
          "Per entrare serve la tessera, e non si può fare all'ingresso. Ci vogliono due minuti, da telefono.",
        ),
      },
      {
        component: "step_list",
        steps: [
          {
            component: "step_item",
            title: "Compila la richiesta",
            text: "Entro le 17:00 del giorno del concerto, con il modulo qui sotto.",
          },
          {
            component: "step_item",
            title: "Ritira la tessera",
            text: "Ti aspetta al Colorificio Kroen, all'ingresso.",
          },
        ],
      },
      {
        component: "note",
        text: "Eri già socio? Se avevi la tessera tra dicembre 2023 e maggio 2025, non devi compilare nulla: basta dire nome e cognome all'ingresso. Per verificare scrivi a segreteria.kroen@gmail.com.",
      },
      {
        component: "form",
        form_type: "tessera",
        titolo: "Richiedi la tessera",
      },
    ],
  },
  {
    slug: "contatti",
    name: "Contatti",
    body: [
      {
        component: "rich_text",
        title: "Contatti",
        text: richTextParagraph(
          "Scrivici o vieni a trovarci al Colorificio Kroen, Rovereto.",
        ),
      },
      {
        component: "form",
        form_type: "contatti",
        titolo: "Scrivici",
      },
      {
        component: "map_embed",
        address: "Via della Terra 7, Rovereto",
        embed_url:
          "https://www.openstreetmap.org/export/embed.html?bbox=10.93%2C45.38%2C11.05%2C45.45&layer=mapnik",
      },
      {
        component: "social_links",
        links: [
          {
            component: "social_link",
            label: "Instagram",
            link: { url: "https://instagram.com/", linktype: "url", fieldtype: "multilink" },
          },
          {
            component: "social_link",
            label: "Facebook",
            link: { url: "https://facebook.com/", linktype: "url", fieldtype: "multilink" },
          },
          {
            component: "social_link",
            label: "Email",
            link: {
              url: "mailto:segreteria.kroen@gmail.com",
              linktype: "url",
              fieldtype: "multilink",
            },
          },
        ],
      },
    ],
  },
  {
    slug: "associazione",
    name: "Associazione",
    body: [
      {
        component: "rich_text",
        title: "Associazione",
        text: richTextParagraph(
          "Il Colorificio Kroen è un'associazione culturale. Qui trovi trasparenza su entrate e documenti.",
        ),
      },
      {
        component: "revenue_table",
        title: "Entrate",
        data_json: defaultRevenueJson,
      },
      {
        component: "document_list",
        title: "Documenti",
        documents: [
          {
            component: "document_item",
            label: "Statuto associativo",
            link: { url: "#", linktype: "url", fieldtype: "multilink" },
          },
        ],
      },
    ],
  },
];

async function findStoryBySlug(slug) {
  const res = await fetch(`${baseUrl}/stories/?with_slug=${encodeURIComponent(slug)}`, {
    headers: { Authorization: token },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }
  return data.stories?.[0] ?? null;
}

async function upsertPage({ slug, name, body }) {
  const existing = await findStoryBySlug(slug);
  const content = { component: "page", body };
  const payload = {
    story: {
      name,
      slug,
      content,
    },
  };

  if (existing) {
    const res = await fetch(`${baseUrl}/stories/${existing.id}`, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`${slug} PUT: ${JSON.stringify(data)}`);
    console.log(`PUT ${slug}`);
    return;
  }

  const res = await fetch(`${baseUrl}/stories/`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${slug} POST: ${JSON.stringify(data)}`);
  console.log(`POST ${slug}`);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (const page of pages) {
  await upsertPage(page);
  await sleep(300);
}

console.log("Page stories Kroen pronte (home, eventi-passati, gallery, …).");
