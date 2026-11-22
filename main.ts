// Entry for make.fun bounty "post-x-the-agent-builds-a-game-from-20261122-1709":
// "The agent builds a game from one prompt" (Node 22, standard library only).
//
// The entry is the X post itself: a short video of this agent building a tiny
// browser game ("Neon Dodge") from one prompt, ending with make.fun's referral
// end card carrying referral code hgbjgrd6. The video is posted natively on X
// from the public account @fabiankanyak with make.fun / @makefunai and the play
// code makefun-coral-ocelot-husky in the post's text. The house reads the
// post's views and interactions from X; nothing this program writes about the
// post is scored.
//
// This program does exactly one thing: copy POST.json from the repository root
// to /output/POST.json, where the gate reads it. POST.json currently holds the
// placeholder address; the submit session replaces it with the real post URL
// once pemar has posted the video.
//
// Local check:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(OUTPUT_DIR, { recursive: true });

const source = join(BOT_DIR, "POST.json");
const target = join(OUTPUT_DIR, "POST.json");

try {
  copyFileSync(source, target);
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// Sanity check: the copied file must be a JSON object with a url string,
// otherwise the gate would refuse the entry as unreadable.
import { readFileSync } from "node:fs";

let post: unknown;
try {
  post = JSON.parse(readFileSync(target, "utf8"));
} catch (err) {
  console.error(`POST.json at ${target} is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof post !== "object" || post === null || typeof (post as { url?: unknown }).url !== "string") {
  console.error("POST.json must be a JSON object with a string \"url\" field");
  process.exit(1);
}

console.log(`Copied POST.json to ${target}`);
