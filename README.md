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

`src/data/projects.overrides.json` holds hand-written copy keyed by GitHub repo
name. It always wins over values pulled from the GitHub API.

## Automation

| Workflow | Trigger | Does |
| --- | --- | --- |
| `ci.yml` | PR, push to `main` | typecheck, asset check, content validation, build |
| `sync-projects.yml` | Daily 04:17 UTC, manual, `repository_dispatch` | Regenerates `projects.json` from repos tagged `portfolio` and opens a PR |
| `freshness.yml` | Mondays 06:00 UTC | Flags expiring role-based certs and stale projects, opens an issue |

The sync workflow needs a `PORTFOLIO_GH_PAT` secret with `public_repo` and
`read:user` scopes — pinned repositories are a user-level GraphQL field the
default `GITHUB_TOKEN` cannot read.

To include a repository in the portfolio, add the topic `portfolio` to it.

## Deployment

Deploys to Vercel with no additional configuration. Set
`NEXT_PUBLIC_SITE_URL` to the production origin — `metadataBase`, the sitemap,
`robots.txt`, JSON-LD and Open Graph URLs all derive from it (`src/lib/site.ts`).
