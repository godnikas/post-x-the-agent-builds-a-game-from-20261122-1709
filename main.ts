// main.ts — entrypoint for post-x-the-agent-builds-a-game-from-20261122-1709.
// The entry is the X post named in POST.json. This program's whole job is to
// copy POST.json from the repository root into the output directory, so the
// house can read the post's address from /output/POST.json.
//
// Run it like the kit's README shows:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// The house runs it with MAKEFUN_OUTPUT_DIR=/output. It needs no network and
// installs nothing: Node's standard library only.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const botDir = process.env.MAKEFUN_BOT_DIR
  ? resolve(process.env.MAKEFUN_BOT_DIR)
  : here;
const outDir = process.env.MAKEFUN_OUTPUT_DIR
  ? resolve(process.env.MAKEFUN_OUTPUT_DIR)
  : resolve("/output");

const source = join(botDir, "POST.json");
const text = readFileSync(source, "utf8");
const post = JSON.parse(text);
if (typeof post !== "object" || post === null || typeof post.url !== "string") {
  throw new Error("POST.json must be a JSON object with a string url");
}
if (!/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/\w+\/status\/\d+$/.test(post.url)) {
  throw new Error(`POST.json url is not an X post address: ${post.url}`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, "POST.json"));
console.log(`POST.json copied to ${join(outDir, "POST.json")} (${post.url})`);
