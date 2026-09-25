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

function loadEnv() {
  if (!loadEnvFile(".env.local")) loadEnvFile(".env");
}

loadEnv();

const token = process.env.STORYBLOK_MANAGEMENT_API_ACCESS_TOKEN;
const spaceId = process.env.STORYBLOK_SPACE_ID || "330419";
const eventsFolderId = 181388637481913;

const dummyEvents = [
  ["dummy-blaster-1", "Blaster – Season of the Witch", "2026-06-15 00:00", "Serata metal con Karg e Shuller."],
  ["dummy-gentilesky-2", "Gentilesky", "2026-07-04 00:00", "Garage funk e psichedelia dal vivo."],
  ["dummy-stuntmen-3", "Sant'Antonio Stuntmen", "2026-08-12 00:00", "Rock alternativo e improvvisazione."],
  ["dummy-bizarre-4", "Bizarre", "2026-09-20 00:00", "Line-up eclettico per una notte speciale."],
  ["dummy-karg-5", "Karg", "2026-10-11 00:00", "Black metal europeo al Kroen."],
  ["dummy-shuller-6", "Shuller", "2026-11-02 00:00", "Hard rock e riff pesanti."],
  ["dummy-witch-7", "Season of the Witch", "2026-11-28 00:00", "Tributo alle sonorità oscure anni '70."],
  ["dummy-garage-8", "Garage Night", "2026-12-13 00:00", "Tre band garage per chiudere l'anno."],
  ["dummy-newyear-9", "New Year Noise", "2027-01-10 00:00", "Primo evento del nuovo anno."],
  ["dummy-winter-10", "Winter Riot", "2027-02-21 00:00", "Concerto invernale indoor."],
];

const baseUrl = `https://mapi.storyblok.com/v1/spaces/${spaceId}`;

function richTextDoc(text) {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }],
      },
    ],
  };
}

async function createEvent([slug, name, date, description]) {
  const res = await fetch(`${baseUrl}/stories/`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      story: {
        name,
        slug,
        parent_id: eventsFolderId,
        content: {
          component: "event",
          title: name,
          date,
          description: richTextDoc(description),
          open_time: "21:00",
          start_time: "22:00",
          end_time: "01:00",
          contributo: "5 €",
        },
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const message = JSON.stringify(data);
    if (message.includes("already taken")) {
      console.log(`skip events/${slug} (esiste già)`);
      return;
    }
    throw new Error(`${slug}: ${message}`);
  }

  console.log(`created events/${slug}`);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (const event of dummyEvents) {
  await createEvent(event);
  await sleep(250);
}

console.log("10 eventi dummy pronti.");
