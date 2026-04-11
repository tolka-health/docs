# AGENTS Guide for `tolka-health-docs`

## What this repo currently is
- This repository is a fully scaffolded **Astro Starlight** docs site (Astro 5, Starlight 0.32, pnpm 10, Node ≥ 20). Architecture decisions live in `WEBSITE_AND_DOCS_PLAN.md`; `README.md` is the entry-point summary.
- The site is live at `https://docs.tolka.health` and deployed to Cloudflare Pages via `.github/workflows/deploy.yml` on every push to `main`.
- The backend and core API implementation live in a separate private repository (outside this repo).
- All MDX content is under `src/content/docs/` and mirrors URL paths. The sidebar is declared in `astro.config.mjs` and must be kept in sync with the file tree.

## Big picture architecture to preserve
- The plan defines a 3-repo boundary (`tolka`, `docs`, `website`) in `WEBSITE_AND_DOCS_PLAN.md` Section 2.
- `tolka` stays private; `docs` is private at launch then public; `website` visibility is deferred.
- Core flow is: private API/spec in `tolka` -> synced OpenAPI into docs (`public/openapi/tolka-v1.yaml`) -> docs + website consume that public contract.
- Keep docs and website independent deploy surfaces; do not collapse into a monorepo unless explicitly requested.

## Critical workflows (current-state truth)
- **Local dev:** `pnpm install` then `pnpm dev` → http://localhost:4321. Requires Node ≥ 20 and pnpm ≥ 9.
- **Build:** `pnpm build` → `./dist`. Set `PUBLIC_REPO=true` to enable "Edit on GitHub" links (off by default until repo is public).
- **Type check:** `pnpm check` (Astro's built-in TypeScript check). CI runs this on every PR.
- **Prose lint:** `pnpm lint:prose` runs Vale with `TolkaStyle` rules (config: `.vale.ini`). Warnings are non-blocking; errors fail CI.
- **Link check:** `pnpm lint:links` (lychee, offline mode). Full broken-link check runs in CI post-build.
- **CI pipeline** (`.github/workflows/ci.yml`, runs on PRs): build → type check → Redocly OpenAPI lint → internal link check → PHI content lint.
- **Deploy** (`.github/workflows/deploy.yml`, runs on push to `main`): builds with `PUBLIC_REPO=${{ vars.PUBLIC_REPO }}` and deploys to Cloudflare Pages.
- For planning updates, edit `WEBSITE_AND_DOCS_PLAN.md` with section-level consistency (architecture, sequence, deployment, IP boundaries).
- If asked to implement new site features, ensure they fit within the existing Astro Starlight constraints before adding content.

## Project-specific conventions from the plan
- Privacy-first and IP-protection constraints are explicit and non-optional (Section 3, "IP Protection Boundary").
- Never publish: prompt text/suffixes, scoring weights, fallback formulas, per-language thresholds, full disambiguation rule sets.
- Docs language policy is English-only; marketing site is EN first with `/no/` Norwegian routing (Sections 3 and 4).
- API docs pattern is Scalar-generated reference + narrative endpoint pages that add context (Section 8 "API reference deduplication").

### Content authoring
- **New page checklist:** create MDX in `src/content/docs/<section>/`, add frontmatter (`title`, `description`, optional `sidebar.order`), register in the matching `sidebar` group in `astro.config.mjs`, end page with a "What's next" section.
- **Removing a page:** always add a `301` redirect to `public/_redirects` before deleting the file.
- **Code examples** must cover cURL + TypeScript + Python in tabbed panels (`<Tabs>`, `<TabItem>` from `@astrojs/starlight/components`). All keys must use placeholders: `sk_test_...` or `sk_sandbox_public_tolka_eval2026`.
- **Medical examples** must use clearly synthetic phrases (e.g., `"Har du smerter?"`) — never realistic patient scenarios with age, location, or clinical history.
- **PHI lint** (`ci.yml`) rejects the patterns `patient reports`, `history of`, `chief complaint`, `pasient rapporterer`, and date strings matching `\d{2}\.\d{2}\.\d{4}`.

### TypeScript path aliases (`tsconfig.json`)
- `@components/*` → `src/components/*`
- `@assets/*` → `src/assets/*`

## Integration points agents should know
- **OpenAPI sync is live:** `.github/workflows/openapi-sync.yml` is triggered automatically from the core API repo on tagged releases. It validates (PHI lint + Redocly lint + sandbox-URL check) then opens a PR updating `public/openapi/tolka-v1.yaml`. **Never edit `public/openapi/tolka-v1.yaml` manually.**
- The public spec must only contain the sandbox server URL (`https://sandbox.tolka-api.fly.dev`). A CI check blocks syncs that expose any non-sandbox production URL.
- For implementation details referenced by this plan, check the private core API repository and keep public-doc outputs conceptual/public-safe.
- Planned content mapping comes from private core API files (errors, pipeline, safety, domain rules, SDK README), but only conceptual/public-safe output belongs in docs.
- Planned hosting/deploy target is Cloudflare Pages for both docs and website (Section 8).

## Site structure and custom components

```
src/content/docs/          # All MDX content (mirrors URL paths)
src/components/            # Custom Astro components (imported in MDX or layouts)
src/styles/custom.css      # Teal/amber brand overrides for Starlight CSS vars
src/assets/                # Static assets (tolka-logo.svg etc.)
public/openapi/            # Synced OpenAPI spec — do NOT edit manually
public/_redirects          # Cloudflare Pages redirect rules (301s go here)
.github/workflows/         # ci.yml · deploy.yml · openapi-sync.yml
astro.config.mjs           # Starlight config + complete sidebar declaration
tsconfig.json              # Extends astro/tsconfigs/strict; defines @components/* and @assets/* aliases
.vale.ini / .vale/styles/TolkaStyle/  # Prose linting rules
```

### Custom Astro components
- **`ScalarApiReference.astro`** — renders the Scalar interactive API playground via CDN (`@scalar/api-reference@latest`). Loaded client-side so Pagefind skips it. Displays a non-dismissible PHI disclaimer banner; hard-codes sandbox server URL only. Disable autocomplete via `MutationObserver`.
- **`ApiResponse.astro`** — displays an annotated JSON response in a `<figure>`. Props: `json: Record<string, unknown>`, `title?: string`. Wraps field values in `<span class="field" data-field="...">` for potential callout overlays.
- **`PipelineDiagram.astro`** — static HTML/CSS (no JS) diagram of the 5-step pipeline. Fully accessible via `role="list"` / `role="listitem"`.

### Sidebar management
The sidebar is declared in full inside `astro.config.mjs`. Every new MDX page **must** be added to the correct group in that array — Starlight does not auto-discover pages. Groups: Getting Started · Concepts · API Reference · Web SDK · Mobile SDKs · Guides · About · Changelog.

## Editing guidance for AI agents in this repo
- Use `WEBSITE_AND_DOCS_PLAN.md` as canonical; cite exact sections when proposing changes.
- Prefer additive edits that keep existing review history readable (CTO pass summaries are part of decision context).
- Flag conflicts immediately if a requested change violates privacy/IP constraints documented in Section 3.
- When creating implementation tasks, preserve phased sequencing (A-F) from Section 7 instead of ad-hoc task lists.
