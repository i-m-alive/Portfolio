/**
 * Fails if any "/foo.png"-shaped string in the source tree has no matching
 * file under public/.
 *
 * Reads .json as well as .ts/.tsx on purpose: project cover images are
 * referenced indirectly through src/data/projects.json, and a scan that only
 * looked at components would both miss broken paths there and wrongly report
 * live assets as unused.
 */
import { readFileSync, existsSync, globSync } from "node:fs";
import path from "node:path";

const ASSET_EXT =
  /\.(png|jpe?g|svg|webp|avif|gif|mp4|webm|json|pdf|docx|pptx|ico|cur)$/i;

// Paths that are routes or Next internals, not files in public/
const IGNORE = [
  /^\/_next\//,
  /^\/api\//,
  /^\/favicon\.ico$/, // served by src/app/favicon.ico convention
];

const files = globSync("{src,components}/**/*.{ts,tsx,json}", {
  cwd: process.cwd(),
});

const missing = new Map();

for (const rel of files) {
  const text = readFileSync(path.join(process.cwd(), rel), "utf8");
  for (const m of text.matchAll(/["'`](\/[A-Za-z0-9_@.\-/]+)["'`]/g)) {
    const p = m[1];
    if (!ASSET_EXT.test(p)) continue;
    if (IGNORE.some((re) => re.test(p))) continue;
    if (existsSync(path.join(process.cwd(), "public", p))) continue;
    if (!missing.has(p)) missing.set(p, new Set());
    missing.get(p).add(rel);
  }
}

if (missing.size > 0) {
  console.error(`\n${missing.size} referenced asset(s) missing from public/:\n`);
  for (const [p, refs] of [...missing].sort()) {
    console.error(`  ${p}`);
    for (const r of refs) console.error(`      referenced by ${r}`);
  }
  console.error("");
  process.exit(1);
}

console.log(`check-assets: all referenced public/ assets exist (${files.length} files scanned)`);
