/**
 * Regenerates src/data/projects.json from GitHub.
 *
 *   GH_TOKEN=<pat> node scripts/sync-github-projects.mjs
 *
 * Design notes
 * ------------
 * - Opt-in by topic: only repos tagged `portfolio` are included, so the list is
 *   controlled from the GitHub UI with no code change.
 * - Overrides win: anything in src/data/projects.overrides.json beats the API,
 *   so hand-written prose is never clobbered by a generated description.
 * - Pinned repos become `featured`; topics map to `category`. Both fields are
 *   required by scripts/validate-content.mjs.
 *
 * The PAT needs `public_repo` + `read:user` (pinned items are a user-level
 * GraphQL field that the repo-scoped GITHUB_TOKEN cannot see).
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";

const USER = "i-m-alive";
const TOKEN = process.env.GH_TOKEN;
const OUT = "src/data/projects.json";
const OVERRIDES = "src/data/projects.overrides.json";

if (!TOKEN) {
  console.error("GH_TOKEN is required (public_repo + read:user)");
  process.exit(1);
}

const H = {
  Authorization: `Bearer ${TOKEN}`,
  "User-Agent": "portfolio-sync",
  Accept: "application/vnd.github+json",
};

const CATEGORY_RULES = [
  [/^(llm|rag|langchain|langgraph|genai|chatbot)$/, "LLM / RAG"],
  [/^(mlops|docker|kubernetes|ci-cd|devops)$/, "MLOps"],
  [/^(data-engineering|etl|pipeline|spark|sql)$/, "Data Engineering"],
];

const categoryFor = (topics = []) => {
  for (const t of topics)
    for (const [re, cat] of CATEGORY_RULES) if (re.test(t)) return cat;
  return "AI/ML";
};

async function gh(path) {
  const r = await fetch(`https://api.github.com${path}`, { headers: H });
  if (!r.ok) throw new Error(`${path} -> ${r.status} ${r.statusText}`);
  return r.json();
}

async function pinnedAndImages() {
  const query = `{
    user(login:"${USER}") {
      pinnedItems(first:6, types:REPOSITORY){ nodes{ ... on Repository { name } } }
      repositories(first:100, ownerAffiliations:OWNER){ nodes{ name openGraphImageUrl } }
    }
  }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...H, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  }).then((r) => r.json());

  if (res.errors) throw new Error(JSON.stringify(res.errors));
  const u = res.data.user;
  return {
    pinned: new Set(u.pinnedItems.nodes.map((n) => n.name)),
    ogImage: Object.fromEntries(
      u.repositories.nodes.map((n) => [n.name, n.openGraphImageUrl])
    ),
  };
}

async function readmeExcerpt(name) {
  try {
    const raw = await fetch(
      `https://api.github.com/repos/${USER}/${name}/readme`,
      { headers: { ...H, Accept: "application/vnd.github.raw" } }
    ).then((r) => (r.ok ? r.text() : ""));
    return (
      raw
        .replace(/^---[\s\S]*?---/, "")
        .replace(/!?\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/^#{1,6}.*$/gm, "")
        .replace(/[`*_>|]/g, "")
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .find((s) => s.length > 40)
        ?.slice(0, 320) ?? ""
    );
  } catch {
    return "";
  }
}

const overrides = existsSync(OVERRIDES)
  ? JSON.parse(readFileSync(OVERRIDES, "utf8"))
  : {};

const repos = (await gh(`/users/${USER}/repos?per_page=100&sort=pushed`)).filter(
  (r) => !r.fork && !r.archived && (r.topics ?? []).includes("portfolio")
);

if (repos.length === 0) {
  console.error(
    "No repos carry the `portfolio` topic — refusing to write an empty file."
  );
  process.exit(1);
}

const { pinned, ogImage } = await pinnedAndImages();
const warnings = [];
const projects = [];

for (const r of repos) {
  const ov = overrides[r.name] ?? {};
  const excerpt = await readmeExcerpt(r.name);
  if (!r.description && !ov.short && !excerpt) warnings.push(r.name);

  const slug =
    ov.slug ?? r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  projects.push({
    slug,
    title:
      ov.title ??
      r.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    short:
      ov.short ??
      r.description ??
      excerpt.split(". ")[0] ??
      `${r.language ?? "Code"} project`,
    excerpt: ov.excerpt ?? excerpt || undefined,
    desc: ov.desc,
    architecture: ov.architecture,
    metric: ov.metric,
    ops: ov.ops,
    tech: ov.tech ?? (r.topics ?? []).filter((t) => t !== "portfolio"),
    cover: ov.cover ?? ogImage[r.name] ?? undefined,
    github: r.html_url,
    homepage: r.homepage || undefined,
    status: r.homepage ? "deployed" : "code-only",
    stars: r.stargazers_count,
    language: r.language ?? undefined,
    featured: ov.featured ?? pinned.has(r.name),
    category: ov.category ?? categoryFor(r.topics),
    last_updated: r.pushed_at.slice(0, 10),
    related: ov.related ?? [],
  });
}

projects.sort(
  (a, b) =>
    Number(b.featured) - Number(a.featured) ||
    b.last_updated.localeCompare(a.last_updated)
);

writeFileSync(OUT, JSON.stringify(projects, null, 2) + "\n");
console.log(`wrote ${projects.length} projects to ${OUT}`);
if (warnings.length)
  console.warn(`no description available for: ${warnings.join(", ")}`);
