/**
 * Structural validation for src/data/projects.json.
 *
 * Exists because `featured` and `category` were both optional and both absent
 * on every entry, which silently blanked four UI sections on /projects with no
 * error anywhere. These are now required and CI fails without them.
 *
 * Dependency-free on purpose — no zod, so `pnpm install` stays lean.
 */
import { readFileSync, existsSync } from "node:fs";

const CATEGORIES = ["AI/ML", "MLOps", "Data Engineering", "LLM / RAG"];
const projects = JSON.parse(readFileSync("src/data/projects.json", "utf8"));
const errors = [];

const fail = (i, msg) => errors.push(`projects[${i}] ${msg}`);

if (!Array.isArray(projects) || projects.length === 0) {
  errors.push("projects.json must be a non-empty array");
}

const seenSlugs = new Set();

projects.forEach((p, i) => {
  const id = p?.slug ? `"${p.slug}"` : `#${i}`;

  if (typeof p.slug !== "string" || !/^[a-z0-9-]+$/.test(p.slug))
    fail(i, `${id}: slug must be lowercase-kebab`);
  else if (seenSlugs.has(p.slug)) fail(i, `${id}: duplicate slug`);
  else seenSlugs.add(p.slug);

  if (typeof p.title !== "string" || !p.title.trim())
    fail(i, `${id}: title is required`);

  if (typeof p.short !== "string" || p.short.trim().length < 20)
    fail(i, `${id}: short must be at least 20 characters`);

  if (typeof p.github !== "string" || !/^https?:\/\//.test(p.github))
    fail(i, `${id}: github must be an absolute URL`);

  if (!Array.isArray(p.tech) || p.tech.length === 0)
    fail(i, `${id}: tech must be a non-empty array`);

  // The two fields whose absence caused the silent blank-out.
  if (typeof p.featured !== "boolean")
    fail(i, `${id}: featured is required (boolean)`);

  if (!CATEGORIES.includes(p.category))
    fail(i, `${id}: category must be one of ${CATEGORIES.join(" | ")}`);

  if (typeof p.cover !== "string" || !p.cover.startsWith(`/projects/${p.slug}/`))
    fail(i, `${id}: cover must live under /projects/${p.slug}/`);
  else if (!existsSync(`public${p.cover}`))
    fail(i, `${id}: cover file missing — public${p.cover}`);

  if (p.last_updated && !/^\d{4}-\d{2}-\d{2}$/.test(p.last_updated))
    fail(i, `${id}: last_updated must be YYYY-MM-DD`);
});

if (errors.length) {
  console.error(`\ncontent validation failed (${errors.length}):\n`);
  errors.forEach((e) => console.error(`  ${e}`));
  console.error("");
  process.exit(1);
}

const featured = projects.filter((p) => p.featured).length;
console.log(
  `validate-content: ${projects.length} projects OK (${featured} featured, ` +
    `${new Set(projects.map((p) => p.category)).size} categories)`
);
