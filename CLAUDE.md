# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Developer documentation site for the Tolka medical translation API, live at `https://docs.tolka.health`. Built with Astro 5 + Starlight 0.32, hosted on Cloudflare Pages. The backend/core API lives in a separate private repo (`tolka`); this repo is docs only.

## Commands

```bash
pnpm install              # install deps (Node >=20, pnpm >=9 required)
pnpm dev                  # dev server at http://localhost:4321
pnpm build                # production build → ./dist
pnpm preview              # preview production build locally
pnpm check                # Astro TypeScript check
pnpm lint:prose           # Vale prose lint (TolkaStyle rules)
pnpm lint:links           # lychee offline link check on MDX files
```

Set `PUBLIC_REPO=true` before `pnpm build` to enable "Edit on GitHub" links.

## Architecture

- **Content**: all MDX pages live under `src/content/docs/` and mirror URL paths. Content schema is the default Starlight `docsSchema()` defined in `src/content/config.ts`.
- **Sidebar**: declared manually in `astro.config.mjs`. Starlight does not auto-discover pages — every new page must be registered in the sidebar array under the correct group.
- **OpenAPI spec**: `public/openapi/tolka-v1.yaml` is synced automatically from the private `tolka` repo via `openapi-sync.yml` workflow on `repository_dispatch`. **Never edit this file manually.**
- **Redirects**: `public/_redirects` (Cloudflare Pages format). Always add a 301 here before deleting any page.
- **Custom components**: `src/components/` — `ScalarApiReference.astro` (interactive API playground), `ApiResponse.astro` (annotated JSON response figure), `PipelineDiagram.astro` (static HTML/CSS pipeline diagram).
- **Styling**: `src/styles/custom.css` overrides Starlight CSS variables. Brand palette is teal primary / amber accent. Fonts: Plus Jakarta Sans (body), JetBrains Mono (code).
- **TypeScript aliases**: `@components/*` → `src/components/*`, `@assets/*` → `src/assets/*` (in `tsconfig.json`).

## CI pipeline (runs on PRs to main)

Build → type check → Redocly OpenAPI lint → internal link check → PHI content lint → API key detection. All must pass before merge. `main` is branch-protected: requires passing CI + maintainer review.

## Pre-commit hook

A git pre-commit hook at `.hooks/pre-commit` mirrors CI checks locally. It scans staged content files for PHI patterns, PII (fødselsnummer, date formats), production API keys, business IP (scoring function names, prompt internals, calibration thresholds), and local filesystem paths. Activated automatically via `pnpm install` (the `prepare` script sets `core.hooksPath`). To manually activate: `git config core.hooksPath .hooks`.

## Privacy & IP protection (non-negotiable)

These constraints are enforced by the pre-commit hook and CI, and must never be violated:

- **No real patient scenarios**: medical examples must use clearly synthetic phrases (e.g., `"Har du smerter?"`), never realistic scenarios with age/location/clinical history.
- **PHI patterns rejected by CI**: `patient reports`, `history of`, `chief complaint`, `pasient rapporterer`, date strings matching `\d{2}\.\d{2}\.\d{4}`.
- **Never publish**: prompt text/suffixes, scoring weights/formulas, sub-score function names, fallback formulas, per-language thresholds, full disambiguation rule sets, glossary/phrase library content.
- **API keys**: always use placeholders `sk_test_...` or `sk_sandbox_public_tolka_eval2026`. CI rejects `sk_live_*` patterns.
- **OpenAPI spec**: must only contain sandbox server URL (`https://sandbox.tolka-api.fly.dev`). Production URLs are blocked by CI.

## Content authoring conventions

- Code examples must cover **cURL + TypeScript + Python** in tabbed panels (`<Tabs>`, `<TabItem>` from `@astrojs/starlight/components`).
- End pages with a "What's next" section linking to related pages.
- Vale prose lint enforces terminology: "Tolka" (capitalized), "back-translation" (hyphenated), "safe-translate" (hyphenated).
- At most 2-3 disambiguation examples per concept; full rule sets are proprietary.
- Limit to conceptual/public-safe information — implementation details stay in the private repo.

## Engineering Skills

| Command | Domain | Description |
|---------|--------|-------------|
| `/docs-architect` | Site infrastructure | Astro/Starlight config, custom components, styling, CI/CD, deployment |
| `/content-author` | Content authoring | Creating/editing MDX pages, privacy rules, code examples, sidebar registration |

## Key Documents

- [AGENTS.md](./AGENTS.md) — Detailed agent guidance, content checklist, integration points
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Contribution workflow, content guidelines, review process
- `public/openapi/tolka-v1.yaml` — API contract (synced from private `tolka` repo, do not edit)