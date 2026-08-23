# Portfolio — Kumar Shivraj Bhakat

Personal portfolio of Kumar Shivraj Bhakat, AI/ML Engineer. An interactive
orbital hero routes into nine sections covering experience, projects, skills,
certifications and education.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript ·
Tailwind CSS v4 · Framer Motion · Lottie

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Node `>=20.9` (see `.nvmrc`), pnpm 10 (pinned via `packageManager`).

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `lint:fix` | ESLint |
| `pnpm check:assets` | Fail if any referenced `public/` asset is missing |
| `pnpm check:content` | Validate `src/data/projects.json` against its schema |
| `pnpm verify` | typecheck → assets → content → build (what CI runs) |

## Routes

| Route | Contents |
| --- | --- |
| `/` | Orbital hero and site entry |
| `/professional` | Professional summary, skills, timeline |
| `/professional-ai` | AI/ML deep dive, model cards, infrastructure |
| `/work-experience` | Role history |
| `/skills` | Interactive skills HUD |
| `/projects` | Project catalogue, filtering and case studies |
| `/certificates` | Certification deck |
| `/education` | Education, presented as a flip book |
| `/contact` | Contact channels and résumé download |

## Content

Project data lives in `src/data/projects.json` and is schema-validated by
`pnpm check:content`. `featured` and `category` are **required** — both were
optional once, and their absence silently blanked four sections of `/projects`
with no error anywhere.

`projects.json` is the source of truth for everything written by hand.

## Automation

| Workflow | Trigger | Does |
| --- | --- | --- |
| `ci.yml` | PR, push to `main` | typecheck, asset check, content validation, build |
| `sync-projects.yml` | Mondays 04:17 UTC, manual, `repository_dispatch` | Refreshes GitHub-managed fields and opens a PR |
| `freshness.yml` | Mondays 06:00 UTC | Flags expiring role-based certs and stale projects, opens an issue |

### How the GitHub sync works

It **enriches, it does not replace.** Only these fields are written:

```
last_updated  stars  language  homepage  status
```

Everything else — `title`, `short`, `desc`, `architecture`, `metric`, `ops`,
`tech`, `cover`, `category`, `featured` — is yours and is never modified.

```bash
pnpm sync:check      # report drift, write nothing
pnpm sync:projects   # apply
```

Full README-driven card generation is deliberately **not** used. Measured
against the real repos: 25 of 34 had no description, 0 of 34 had topics, two of
the four flagship projects had no README at all, and MindDocs' README was 18
bytes. Generating from that would replace good copy with nothing.

The sync run reports which repos have grown a real description plus three or
more topics; those are ready to switch from curated to generated whenever you
want. Adding a description and topics to a repo is the upgrade path.

`GH_TOKEN` / the `PORTFOLIO_GH_PAT` secret is optional — unauthenticated is
60 requests/hour, ample for six repos once a week — but a token avoids
shared-runner rate limits.

## Deployment

Deploys to Vercel with no additional configuration. Set
`NEXT_PUBLIC_SITE_URL` to the production origin — `metadataBase`, the sitemap,
`robots.txt`, JSON-LD and Open Graph URLs all derive from it (`src/lib/site.ts`).
