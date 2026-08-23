/**
 * Enrich src/data/projects.json from the GitHub API.
 *
 *   node scripts/sync-github-projects.mjs           # write changes
 *   node scripts/sync-github-projects.mjs --check   # report drift, exit 1, write nothing
 *   GH_TOKEN=<pat> node scripts/sync-github-projects.mjs   # 5000 req/hr instead of 60
 *
 * MODE: enrich, don't replace.
 * -------------------------------------------------------------------------
 * projects.json is the source of truth for everything a human wrote. This
 * script only refreshes fields that GitHub is authoritative about and that go
 * stale on their own. It will never touch your prose.
 *
 * Why not generate the whole card from the README? Measured against the real
 * repos on 2026-08-23: 25 of 34 had no description, 0 of 34 had topics, two of
 * the four flagship projects had no README at all, and MindDocs' README was 18
 * bytes. Generating from that source would replace good hand-written copy with
 * nothing. Once a repo has a real description + topics it can graduate — this
 * script reports which ones are ready.
 */
import { readFileSync, writeFileSync } from "node:fs";

const OWNER = "i-m-alive";
const FILE = "src/data/projects.json";
const CHECK_ONLY = process.argv.includes("--check");
const TOKEN = process.env.GH_TOKEN;

/** GitHub owns these. Everything else is yours and is never written. */
const MANAGED = ["last_updated", "stars", "language", "homepage", "status"];

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "portfolio-sync",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

const projects = JSON.parse(readFileSync(FILE, "utf8"));
const changes = [];
const problems = [];
const graduates = [];

for (const p of projects) {
  if (!p.github) {
    problems.push(`${p.slug}: no github URL`);
    continue;
  }
  const repo = p.github.replace(/\/+$/, "").split("/").pop();

  let data;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${repo}`,
      { headers }
    );
    if (res.status === 404) {
      problems.push(`${p.slug}: ${p.github} -> 404 (renamed, deleted or private)`);
      continue;
    }
    if (res.status === 403) {
      problems.push(
        `${p.slug}: rate limited (403). Set GH_TOKEN for 5000 req/hr.`
      );
      continue;
    }
    if (!res.ok) {
      problems.push(`${p.slug}: ${res.status} ${res.statusText}`);
      continue;
    }
    data = await res.json();
  } catch (e) {
    problems.push(`${p.slug}: ${e.message}`);
    continue;
  }

  if (data.archived) problems.push(`${p.slug}: repository is archived on GitHub`);

  const incoming = {
    last_updated: data.pushed_at.slice(0, 10),
    stars: data.stargazers_count,
    language: data.language ?? undefined,
    homepage: data.homepage || undefined,
    status: data.homepage ? "deployed" : "code-only",
  };

  for (const key of MANAGED) {
    const before = p[key];
    const after = incoming[key];
    if (after === undefined && before === undefined) continue;
    if (before === after) continue;
    changes.push({
      slug: p.slug,
      key,
      before: before ?? "(unset)",
      after: after ?? "(unset)",
    });
    if (after === undefined) delete p[key];
    else p[key] = after;
  }

  // Repos that now carry enough metadata to be generated rather than curated.
  const topics = data.topics ?? [];
  if (data.description && topics.length >= 3) {
    graduates.push(`${p.slug} (${repo}) — has description + ${topics.length} topics`);
  }
}

/* ------------------------------------------------------------- reporting -- */

if (changes.length === 0) {
  console.log("sync: no drift — all GitHub-managed fields are current.");
} else {
  console.log(`sync: ${changes.length} field(s) drifted\n`);
  const w = Math.max(...changes.map((c) => c.slug.length));
  for (const c of changes) {
    console.log(
      `  ${c.slug.padEnd(w)}  ${c.key.padEnd(13)} ${String(c.before)}  ->  ${c.after}`
    );
  }
}

if (problems.length) {
  console.log(`\nneeds attention (${problems.length}):`);
  problems.forEach((p) => console.log(`  ${p}`));
}

if (graduates.length) {
  console.log(`\nready to switch from curated to generated (${graduates.length}):`);
  graduates.forEach((g) => console.log(`  ${g}`));
  console.log(
    "  These repos now have a real description and topics on GitHub, so their\n" +
      "  short/tech fields could be sourced from the API instead of by hand."
  );
}

if (CHECK_ONLY) {
  if (changes.length || problems.length) {
    console.log("\n--check: drift detected, nothing written.");
    process.exit(1);
  }
  process.exit(0);
}

if (changes.length) {
  writeFileSync(FILE, JSON.stringify(projects, null, 2) + "\n");
  console.log(`\nwrote ${FILE}`);
}

if (problems.length) process.exit(1);
