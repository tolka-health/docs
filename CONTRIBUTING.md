# Contributing to Tolka Docs

Thank you for helping improve the Tolka developer documentation. This guide covers everything you need to make a contribution.

## Quick edits

Every docs page has a **"Suggest an edit"** link at the bottom (once the repo is public, this becomes "Edit this page on GitHub"). Use it for typo fixes and small content changes — no local setup needed.

## Local development

**Requirements:** Node.js ≥ 20, pnpm ≥ 9

```bash
# Clone and install
git clone https://github.com/tolka-health/docs.git
cd docs
pnpm install

# Start the dev server
pnpm dev
# → http://localhost:4321

# Build and preview
pnpm build
pnpm preview
```

## Content guidelines

### Tone and style
- **Direct and precise** — avoid filler phrases ("In order to...", "Please note that...")
- **Example-driven** — every concept should have a code example
- **Developer-first** — the audience is healthcare IT integrators, not patients
- Code examples must cover **cURL + TypeScript + Python** in tabbed panels

### Adding a new page

1. Create an MDX file in the relevant `src/content/docs/` subdirectory
2. Add frontmatter: `title`, `description`, and optionally `sidebar.order`
3. Register it in the `sidebar` array in `astro.config.mjs`
4. End the page with a "What's next" section linking to related pages
5. Update `public/_redirects` if this page replaces an existing URL

### Code examples
- All code examples must use placeholder keys: `sk_test_...` or `sk_sandbox_public_tolka_eval2026`
- TypeScript examples must be syntactically valid (CI validates them)
- Python examples use `requests` library (no additional deps required)

## Privacy & IP protection rules

These rules are **non-negotiable**. PRs violating them will not be merged.

### 1. No real patient scenarios
All medical examples must use clearly synthetic phrases. ✅ OK: `"Har du smerter?"` ❌ Not OK: any realistic patient scenario with age, location, or specific clinical history.

### 2. No LLM prompt text or domain prompt suffixes
Never copy system prompts, prompt templates, or domain-specific prompt suffixes from the private `tolka` repo into documentation. Document *what* a domain prioritises (e.g., "emergency prioritises clarity over nuance"), never the actual prompt wording.

### 3. No scoring algorithm details
Never publish confidence formula weights, internal sub-score function names, fallback scoring formulas, per-language-pair adjustment values, or exact confidence threshold numbers.

### 4. No glossary or phrase library reproduction
You may reference that "95+ clinically validated phrases exist across 4 domains." Do not name specific validators, institutions, or reproduce phrase content.

### 5. No full disambiguation rule sets
Use at most **2–3 disambiguation examples** (e.g., "pressure" in emergency vs mental health). The full rule set is proprietary.

### 6. No API keys or secrets
All code examples must use placeholder keys. Never commit real keys — even test keys.

### 7. No PHI in screenshots
All product screenshots must use synthetic data. Verify no real patient text is visible before committing.

## Review process

All PRs are reviewed by a Tolka maintainer before merging. Expect:
- **Content PRs:** 1–2 business days
- **Site/code PRs:** 1 business day

CI must pass before review. The CI pipeline checks: site build, TypeScript validation, OpenAPI spec validity, PHI content lint, and real API key detection.

## Branch protection

- `main` is protected: PRs require a passing CI and at least one maintainer review
- Cloudflare Pages creates a preview deployment for every PR automatically

## License

By contributing, you agree your contributions are licensed under [Apache 2.0](./LICENSE).

