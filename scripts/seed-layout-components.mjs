/**

 * Crea la story singleton `layout-components` (content type `settings`).

 *

 * Header e footer non vanno nelle page: sono nestable, max 1 ciascuno dentro `settings`.

 * L’app li carica in `(with-layout)/layout.tsx` via `getGlobalLayout()`.

 *

 * Uso: npm run storyblok:layout

 * Idempotente: se la story esiste già, non la sovrascrive (salvo STORYBLOK_LAYOUT_FORCE=1).

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



if (!loadEnvFile(".env.local")) loadEnvFile(".env");



const token = process.env.STORYBLOK_MANAGEMENT_API_ACCESS_TOKEN;

const spaceId = process.env.STORYBLOK_SPACE_ID || "330419";

const force = process.env.STORYBLOK_LAYOUT_FORCE === "1";



if (!token) {

  console.error("Manca STORYBLOK_MANAGEMENT_API_ACCESS_TOKEN");

  process.exit(1);

}



const storiesUrl = `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories`;

const slug = "layout-components";



const defaultFooter = {

  component: "footer",

  copyright_text: "Copyright © Colorificio Kroen. Tutti i diritti riservati.",

};



const defaultHeader = {

  component: "header",

  links: [

    {

      component: "link",

      title: "Tesseramento",

      link: { url: "/tesseramento", linktype: "url", fieldtype: "multilink" },

    },

    {

      component: "link",

      title: "Contatti",

      link: { url: "/contatti", linktype: "url", fieldtype: "multilink" },

    },

    {

      component: "link",

      title: "Eventi passati",

      link: {

        url: "/eventi-passati",

        linktype: "url",

        fieldtype: "multilink",

      },

    },

    {

      component: "link",

      title: "Gallery",

      link: { url: "/gallery", linktype: "url", fieldtype: "multilink" },

    },

  ],

};



async function findStoryBySlug(storySlug) {

  const res = await fetch(

    `${storiesUrl}/?with_slug=${encodeURIComponent(storySlug)}`,

    { headers: { Authorization: token } },

  );

  const data = await res.json();

  if (!res.ok) throw new Error(JSON.stringify(data));

  const stub = data.stories?.[0];

  if (!stub?.id) return null;

  const fullRes = await fetch(`${storiesUrl}/${stub.id}`, {

    headers: { Authorization: token },

  });

  const fullData = await fullRes.json();

  if (!fullRes.ok) throw new Error(JSON.stringify(fullData));

  return fullData.story ?? null;

}



function headerBlokFromLegacyContent(content) {

  if (!content || content.component !== "header") return defaultHeader;

  if (Array.isArray(content.links) && content.links.length > 0) {

    return { component: "header", links: content.links };

  }

  const links = [

    ...(content.left_links ?? []),

    ...(content.right_links ?? []),

    ...(content.menu_links ?? []),

  ];

  if (links.length > 0) {

    return { component: "header", links };

  }

  return defaultHeader;

}



function headerNeedsMigration(headerBlok) {

  if (!headerBlok || headerBlok.component !== "header") return false;

  if (Array.isArray(headerBlok.links) && headerBlok.links.length > 0) {

    return false;

  }

  return (

    (headerBlok.left_links?.length ?? 0) > 0 ||

    (headerBlok.right_links?.length ?? 0) > 0 ||

    (headerBlok.menu_links?.length ?? 0) > 0 ||

    Boolean(headerBlok.title) ||

    Boolean(headerBlok.logo?.filename)

  );

}



async function upsertLayoutStory() {

  const existing = await findStoryBySlug(slug);



  if (existing && !force) {

    const settings = existing.content;

    const headerBlok = settings?.header?.[0];

    if (headerNeedsMigration(headerBlok)) {

      const migratedHeader = headerBlokFromLegacyContent(headerBlok);

      const content = {

        ...settings,

        header: [migratedHeader],

      };

      const res = await fetch(`${storiesUrl}/${existing.id}`, {

        method: "PUT",

        headers: {

          Authorization: token,

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          story: {

            name: existing.name,

            slug: existing.slug,

            content,

          },

        }),

      });

      const data = await res.json();

      if (!res.ok) throw new Error(JSON.stringify(data));

      console.log(

        "Header migrato → campo `links` (footer e resto invariati).",

      );

      return;

    }

    console.log(

      "layout-components già presente — skip (STORYBLOK_LAYOUT_FORCE=1 per riscrivere).",

    );

    return;

  }



  let headerBlok = defaultHeader;

  if (!existing) {

    const legacyHeaderStory = await findStoryBySlug("header");

    if (legacyHeaderStory?.content) {

      headerBlok = headerBlokFromLegacyContent(legacyHeaderStory.content);

      console.log("Migrato contenuto dalla story legacy `header` (solo in creazione).");

    }

  }



  const content = {

    component: "settings",

    header: [headerBlok],

    footer: [defaultFooter],

  };



  const payload = {

    story: {

      name: "Layout components",

      slug,

      content,

    },

  };



  if (existing) {

    const res = await fetch(`${storiesUrl}/${existing.id}`, {

      method: "PUT",

      headers: {

        Authorization: token,

        "Content-Type": "application/json",

      },

      body: JSON.stringify(payload),

    });

    const data = await res.json();

    if (!res.ok) throw new Error(JSON.stringify(data));

    console.log("PUT layout-components (force)");

    return;

  }



  const res = await fetch(`${storiesUrl}/`, {

    method: "POST",

    headers: {

      Authorization: token,

      "Content-Type": "application/json",

    },

    body: JSON.stringify(payload),

  });

  const data = await res.json();

  if (!res.ok) throw new Error(JSON.stringify(data));

  console.log("POST layout-components");

}



await upsertLayoutStory();

console.log(

  "Modifica header/footer in Storyblok → story «Layout components» (slug layout-components).",

);

console.log("Anteprima locale: /layout-components");


