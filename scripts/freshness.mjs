/**
 * Content freshness audit. Prints a markdown report; exits non-zero if
 * anything needs attention so CI can open an issue.
 *
 *   node scripts/freshness.mjs            # local
 *   GH_TOKEN=<pat> node scripts/freshness.mjs   # also checks repo pushed_at
 */
import { readFileSync } from "node:fs";

const today = new Date();
const monthsSince = (d) => (today - new Date(d)) / 2.628e9;
const out = [];

/* ---------------------------------------------------------------- certs --
 * Microsoft ROLE-BASED certifications (AI-102, AZ-###, DP-###, MS-###)
 * expire 12 months after issue and must be renewed annually.
 * FUNDAMENTALS certifications (AI-900, AZ-900, DP-900) never expire —
 * deliberately not matched here.
 */
const ROLE_BASED = /AI-102|AZ-[1-9]\d{2}|DP-[1-9]\d{2}|MS-[1-9]\d{2}/;

const certsSrc = readFileSync("src/app/certificates/page.tsx", "utf8");
const certRe =
  /title:\s*"([^"]+)"[\s\S]{0,400}?issued:\s*"([^"]+)"/g;
let m;
while ((m = certRe.exec(certsSrc)) !== null) {
  const [, title, issued] = m;
  if (!ROLE_BASED.test(title)) continue;
  const age = monthsSince(issued);
  if (age >= 12) {
    out.push(
      `**${title}** — issued ${issued}, now **${Math.floor(age)} months old**. ` +
        `Role-based Microsoft certs expire after 12 months. Renew, or mark it as expired on /certificates.`
    );
  } else if (age >= 10) {
    out.push(
      `**${title}** — renewal window opens in ${(12 - age).toFixed(1)} months.`
    );
  }
}

/* ------------------------------------------------------------- projects -- */
const projects = JSON.parse(readFileSync("src/data/projects.json", "utf8"));

for (const p of projects) {
  if (p.last_updated && monthsSince(p.last_updated) > 18) {
    out.push(
      `**${p.title}** — last updated ${p.last_updated} ` +
        `(${Math.floor(monthsSince(p.last_updated))} months ago). Consider retiring or refreshing it.`
    );
  }
}

if (process.env.GH_TOKEN) {
  for (const p of projects) {
    if (!p.github) continue;
    const repo = p.github.split("/").slice(-1)[0];
    try {
      const r = await fetch(
        `https://api.github.com/repos/i-m-alive/${repo}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GH_TOKEN}`,
            "User-Agent": "portfolio-freshness",
          },
        }
      );
      if (!r.ok) {
        out.push(`**${p.title}** — ${p.github} returns ${r.status}.`);
        continue;
      }
      const live = await r.json();
      const real = live.pushed_at.slice(0, 10);
      if (p.last_updated && real !== p.last_updated) {
        out.push(
          `**${p.title}** — last_updated is \`${p.last_updated}\` but GitHub reports \`${real}\`.`
        );
      }
    } catch (e) {
      out.push(`**${p.title}** — could not reach GitHub (${e.message}).`);
    }
  }
}

if (out.length === 0) {
  console.log("## Content freshness\n\nAll fresh.");
  process.exit(0);
}

console.log("## Content freshness — action needed\n");
out.forEach((s) => console.log(`- ${s}`));
process.exit(1);
