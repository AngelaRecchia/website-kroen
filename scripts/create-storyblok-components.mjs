/**
 * Crea/aggiorna i componenti Storyblok nello space Kroen.
 *
 * Layout globale (pattern newpharm):
 * - `layout_sito` (display «Layout sito», root): story singleton header + footer (max 1)
 * - alias legacy `settings` resta registrato in app finché non migri lo space
 * - `header` / `footer`: solo nestable, non root page
 * - Seed story: npm run storyblok:layout → slug `layout-components`
 *
 * Uso: npm run storyblok:components
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(filename) {
  const envPath = resolve(process.cwd(), filename);
  if (!existsSync(envPath)) return false;
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    process.env[key] = rest.join("=");
  }
  return true;
}

function loadEnv() {
  if (!loadEnvFile(".env.local")) {
    loadEnvFile(".env");
  }
}

loadEnv();

const token = process.env.STORYBLOK_MANAGEMENT_API_ACCESS_TOKEN;
const spaceId = process.env.STORYBLOK_SPACE_ID || "330419";

if (!token) {
  console.error(
    "Manca STORYBLOK_MANAGEMENT_API_ACCESS_TOKEN in .env.local o .env",
  );
  process.exit(1);
}

const baseUrl = `https://mapi.storyblok.com/v1/spaces/${spaceId}/components`;

const pageBodyBloks = [
  "Banner",
  "events",
  "kroen_image",
  "rich_text",
  "step_list",
  "note",
  "form",
  "map_embed",
  "social_links",
  "revenue_table",
  "document_list",
];

const components = [
  {
    name: "settings",
    display_name: "Layout sito",
    schema: {
      header: {
        type: "bloks",
        pos: 0,
        restrict_components: true,
        component_whitelist: ["header"],
        maximum: 1,
        description: "Un solo header globale (singleton)",
      },
      footer: {
        type: "bloks",
        pos: 1,
        restrict_components: true,
        component_whitelist: ["footer"],
        maximum: 1,
        description: "Un solo footer globale (singleton)",
      },
    },
    is_root: true,
    is_nestable: false,
  },
  {
    name: "link",
    display_name: "Link",
    schema: {
      title: { type: "text", pos: 0, required: true },
      link: { type: "multilink", pos: 1 },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "header",
    display_name: "Header",
    schema: {
      links: {
        type: "bloks",
        pos: 0,
        restrict_components: true,
        component_whitelist: ["link"],
        description:
          "Ordine: 1° link colonna sinistra, 2° destra, dal 3° in menu (desktop e mobile). Logo e titolo sito sono fissi in codice.",
      },
    },
    is_root: false,
    is_nestable: true,
  },

  {
    name: "page",
    display_name: "Page",
    schema: {
      body: {
        type: "bloks",
        pos: 0,
        restrict_components: true,
        component_whitelist: pageBodyBloks,
      },
    },
    is_root: true,
    is_nestable: false,
  },
  {
    name: "Banner",
    display_name: "Banner / Hero",
    schema: {
      title: { type: "text", pos: 0 },
      image: { type: "asset", pos: 1, filetypes: ["images"] },
      caption: { type: "text", pos: 2 },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "kroen_image",
    display_name: "Immagine",
    schema: {
      image: { type: "asset", pos: 0, required: true, filetypes: ["images"] },
      caption: { type: "text", pos: 1 },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "rich_text",
    display_name: "Testo",
    schema: {
      title: { type: "text", pos: 0 },
      text: { type: "richtext", pos: 1 },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "event",
    display_name: "Event",
    schema: {
      title: { type: "text", pos: 0, required: true },
      secondary_title: {
        type: "text",
        pos: 1,
        display_name: "Secondary title",
        description: "Sottotitolo sotto al titolo (pagina evento e lista in homepage)",
      },
      date: { type: "datetime", pos: 2, disable_time: true },
      open_time: {
        type: "text",
        pos: 3,
        display_name: "Open time",
        description: "Apertura porte, es. 21:00",
      },
      start_time: {
        type: "text",
        pos: 4,
        display_name: "Start time",
        description: "Inizio concerti, es. 22:00",
      },
      end_time: {
        type: "text",
        pos: 5,
        display_name: "End time",
        description: "Es. 01:00",
      },
      contributo: {
        type: "text",
        pos: 6,
        display_name: "Contributo",
        description: "Es. 5 €, ingresso libero",
      },
      prevendita_link: {
        type: "multilink",
        pos: 7,
        display_name: "Prevendita link",
        description:
          "Link biglietti: bottone «Prevendita» in pagina e accordion. Con «Sold out» attivo non compare il bottone; in info evento compare il tag Sold out.",
      },
      description: {
        type: "richtext",
        pos: 8,
        display_name: "Descrizione",
        description:
          "Testo dell’evento (accordion e pagina dettaglio). Se migrato da event_description, copia il testo qui.",
      },
      event_description: {
        type: "textarea",
        pos: 12,
        display_name: "Descrizione (legacy)",
        description:
          "Deprecato: usa «Descrizione». Il sito legge ancora questo campo se Descrizione è vuota.",
      },
      image: { type: "asset", pos: 9, filetypes: ["images"] },
      sold_out: {
        type: "boolean",
        pos: 10,
        display_name: "Sold out",
        description:
          "Chip in lista eventi; in dettaglio/accordion riga Prevendita con tag nero al posto del bottone",
        default_value: false,
      },
      artist_details: {
        type: "bloks",
        pos: 11,
        display_name: "Artisti",
        restrict_components: true,
        component_whitelist: ["artist_detail"],
        description: "Scheda per ogni artista: nome, foto, bio, link/embed multipli",
      },
    },
    is_root: true,
    is_nestable: false,
  },
  {
    name: "artist_link",
    display_name: "Link artista",
    schema: {
      link_mode: {
        type: "option",
        pos: 0,
        display_name: "Tipo",
        options: [
          { name: "Link esterno", value: "link" },
          { name: "Embed (iframe)", value: "embed" },
        ],
        default_value: "link",
      },
      link_label: {
        type: "text",
        pos: 1,
        display_name: "Etichetta",
        description: "Es. Sito, Instagram, Bandcamp (solo link esterno)",
      },
      link: {
        type: "multilink",
        pos: 2,
        display_name: "URL",
        description: "Destinazione del link (solo tipo link)",
      },
      embed_iframe: {
        type: "textarea",
        pos: 3,
        display_name: "Iframe",
        description:
          "Incolla l’iframe intero (Bandcamp, YouTube, …). Solo tipo embed.",
      },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "artist_detail",
    display_name: "Artista",
    schema: {
      name: { type: "text", pos: 0, required: true, display_name: "Nome" },
      photo: {
        type: "asset",
        pos: 1,
        display_name: "Foto",
        filetypes: ["images"],
      },
      bio: { type: "textarea", pos: 2, display_name: "Bio" },
      links: {
        type: "bloks",
        pos: 3,
        display_name: "Link e embed",
        restrict_components: true,
        component_whitelist: ["artist_link"],
        description: "Aggiungi uno o più link esterni o player embed",
      },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "events",
    display_name: "Events",
    schema: {
      show_upcoming: {
        type: "boolean",
        pos: 0,
        default_value: true,
      },
      past_display: {
        type: "option",
        pos: 1,
        options: [
          { name: "link", value: "link" },
          { name: "grid", value: "grid" },
          { name: "none", value: "none" },
        ],
        default_value: "link",
      },
      past_link_label: {
        type: "text",
        pos: 2,
        default_value: "Eventi passati",
      },
      past_link: { type: "multilink", pos: 3 },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "step_list",
    display_name: "Step list",
    schema: {
      steps: {
        type: "bloks",
        pos: 0,
        restrict_components: true,
        component_whitelist: ["step_item"],
      },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "step_item",
    display_name: "Step",
    schema: {
      title: { type: "text", pos: 0, required: true },
      text: { type: "textarea", pos: 1 },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "note",
    display_name: "Nota",
    schema: {
      text: { type: "textarea", pos: 0, required: true },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "form",
    display_name: "Form",
    schema: {
      form_type: {
        type: "option",
        display_name: "Tipo form",
        pos: 0,
        description:
          "Testi e campi sono definiti in app/lib/kroen-labels.json (form.tessera / form.contatti).",
        options: [
          { name: "Tesseramento", value: "tessera" },
          { name: "Contatti", value: "contatti" },
        ],
        default_value: "tessera",
      },
      titolo: {
        type: "text",
        display_name: "Titolo",
        pos: 1,
        description:
          "Titolo del form in pagina. Se vuoto, usa il default in kroen-labels.json.",
      },
      text: {
        type: "richtext",
        display_name: "Testo introduttivo",
        pos: 2,
        description: "Opzionale. Compare sotto al titolo del form.",
      },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "map_embed",
    display_name: "Mappa",
    schema: {
      address: { type: "text", pos: 0 },
      embed_url: { type: "text", pos: 1 },
      consent_text: { type: "textarea", pos: 2 },
      button_label: { type: "text", pos: 3 },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "social_links",
    display_name: "Social / contatti",
    schema: {
      links: {
        type: "bloks",
        pos: 0,
        restrict_components: true,
        component_whitelist: ["social_link"],
      },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "social_link",
    display_name: "Link social",
    schema: {
      label: { type: "text", pos: 0, required: true },
      link: { type: "multilink", pos: 1, required: true },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "revenue_table",
    display_name: "Tabella entrate",
    schema: {
      title: { type: "text", pos: 0, default_value: "Entrate" },
      data_json: {
        type: "textarea",
        pos: 1,
        description:
          'JSON per anno, es. {"2025":{"Tessere":6300,"Bar":21700}}',
      },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "document_list",
    display_name: "Documenti",
    schema: {
      title: { type: "text", pos: 0 },
      documents: {
        type: "bloks",
        pos: 1,
        restrict_components: true,
        component_whitelist: ["document_item"],
      },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "document_item",
    display_name: "Documento",
    schema: {
      label: { type: "text", pos: 0, required: true },
      link: { type: "multilink", pos: 1 },
      file: { type: "asset", pos: 2 },
    },
    is_root: false,
    is_nestable: true,
  },
  {
    name: "footer",
    display_name: "Footer",
    schema: {
      copyright_text: { type: "text", pos: 0 },
      privacy_link: { type: "multilink", pos: 1 },
    },
    is_root: false,
    is_nestable: true,
  },
];

async function upsertComponent(definition) {
  const getRes = await fetch(`${baseUrl}/${definition.name}`, {
    headers: { Authorization: token },
  });

  const method = getRes.ok ? "PUT" : "POST";
  let url = baseUrl;
  if (getRes.ok) {
    const existing = await getRes.json();
    url = `${baseUrl}/${existing.component.id}`;
  }

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (const definition of components) {
  await upsertComponent(definition);
  await sleep(250);
}

console.log("Componenti Storyblok pronti.");
