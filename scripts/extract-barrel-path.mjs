import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const transcript =
  "C:/Users/angel/.cursor/projects/c-Users-angel-Documents-projects-website-kroen/agent-transcripts/91d23ebf-700f-4d11-bbc8-1558e06aa9fa/91d23ebf-700f-4d11-bbc8-1558e06aa9fa.jsonl";
const out = path.join(root, "../app/lib/kroen-mascot/barrel-path.js");

const t = fs.readFileSync(transcript, "utf8");
const m = t.match(/clipPath id=\\"barrelClip\\"><path d=\\"([^\\"]+)\\"/);
if (!m) {
  console.error("barrel path not found");
  process.exit(1);
}
fs.writeFileSync(
  out,
  `/** Path del cilindro rullo (estratto dal prototipo mascotte). */\nexport const BARREL_PATH = ${JSON.stringify(m[1])};\n`,
);
console.log("wrote", out, "len", m[1].length);
