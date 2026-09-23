import fs from "fs";
const p = new URL("../app/lib/kroen-mascot/rig-data.js", import.meta.url);
let s = fs.readFileSync(p, "utf8");
s = s.replace(/\\"/g, '"');
fs.writeFileSync(p, s);
const { RIG } = await import("../app/lib/kroen-mascot/rig-data.js");
console.log("RIG ok", RIG.n, RIG.segs.length);
