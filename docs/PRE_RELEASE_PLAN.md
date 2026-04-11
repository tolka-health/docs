# Pre-Release Plan — Tolka Developer Documentation

**Created:** 2026-04-12
**Target:** Complete before docs.tolka.health goes live

This plan covers broken links, missing assets, config issues, and content updates
discovered during a full-site audit. Items are grouped by priority.

---

## Priority 1: Blockers (will break the live site)

### 1.1 Missing OG image — `public/og-image.png`

**File:** `astro.config.mjs:32`
**Issue:** The `og:image` meta tag references `https://docs.tolka.health/og-image.png`
but no `og-image.png` exists in `public/`. Every social share (Slack, LinkedIn,
Twitter, procurement emails) will show a broken image or no preview.

**Fix:** Create a 1200x630px OG image with the Tolka logo, tagline
("Developer Documentation — Medical Translation API"), and teal brand color.
Place it at `public/og-image.png`.

---

### 1.2 Unverified Tolka domain URLs (18 instances)

These URLs appear across docs but the domains may not be live yet. Each must
resolve correctly before launch or be replaced with a fallback.

| URL | Used in | Instances | Action |
|-----|---------|-----------|--------|
| `tolka.health/contact` | android.mdx, ios.mdx, compliance.mdx, pricing.mdx | 5 | Verify marketing site is live |
| `tolka.health/pricing` | pricing.mdx | 3 | Verify pricing page exists |
| `tolka.health/pilot` | pricing.mdx | 1 | Verify pilot page exists |
| `tolka.health/legal/terms` | status.mdx, open-source.mdx | 2 | Verify terms page exists |
| `tolka.health/compliance/tolka-dpa-template.pdf` | compliance.mdx | 2 | Verify PDF is hosted |
| `tolka.health/compliance/tolka-architecture.pdf` | compliance.mdx | 1 | Verify PDF is hosted |
| `docs.tolka.health/signup` | authentication.mdx, first-integration.mdx, changelog | 3 | Verify signup page exists (Phase 1 feature) |
| `docs.tolka.health/dashboard/keys` | authentication.mdx | 1 | Verify dashboard exists (Phase 1 feature) |
| `status.tolka.health` | 10+ pages | 10 | Verify status page is live |
| `cdn.tolka.health/sdk/web/...` | quickstart.mdx, installation.mdx, telehealth.mdx | 5 | Verify CDN is serving SDK files |

**Decision needed:** If `docs.tolka.health/signup` and `/dashboard/keys` are Phase 1
features not available at launch, replace those links with "Contact us for a test key"
pointing to `tolka.health/contact` or `mailto:support@tolka.health`.

---

### 1.3 GitHub Discussions links (repo is private)

**Files:** `about/support.mdx:12,52`
**Issue:** Two links point to `github.com/tolka-health/docs/discussions` and
`/discussions/categories/ideas`. GitHub Discussions must be enabled on the repo
before these work. If the repo stays private at launch, these will 404 for everyone.

**Fix (if repo stays private at launch):** Replace with
`mailto:support@tolka.health` and a note: "Community discussions will open when
the repo goes public."

**Fix (if repo goes public at launch):** Enable GitHub Discussions on the repo
and create the "Ideas" category.

---

## Priority 2: Quality issues (won't break but looks unprofessional)

### 2.1 CI TypeScript validation is a stub

**File:** `.github/workflows/ci.yml:45-51`
**Issue:** The "Validate code examples (TypeScript)" step finds files containing
TypeScript code blocks but only echoes their names — no actual compilation or
type-checking occurs. Broken TypeScript examples can ship.

```yaml
# Current (stub — does nothing)
find src/content/docs -name '*.mdx' | xargs grep -l '```typescript' | while read f; do
  echo "Checking $f"
done
echo "Code example check complete"
```

**Fix:** Either implement real validation (extract fenced blocks, run `tsc --noEmit`)
or remove the step and rename it to a comment noting it's planned. A stub that
pretends to check gives false confidence.

---

### 2.2 `src/content.config.ts` is staged but deleted

**Issue:** Git status shows `AD src/content.config.ts` — the file was added then
deleted. The actual config is at `src/content/config.ts`. The staged deletion
should be committed to clean up the index.

**Fix:** Ensure `src/content.config.ts` is not in the final commit.

---

## Priority 3: Content updates (polish before launch)

### 3.1 Add "What's next" to reference pages that would benefit

Currently 10 pages lack "What's next" sections. Most are intentionally reference
pages (pricing, compliance, status, changelog, index pages). However these two
would benefit from navigation:

| Page | Suggested "What's next" links |
|------|-------------------------------|
| `about/compliance.mdx` | Support & SLAs, Privacy Architecture |
| `about/support.mdx` | Status page, Going to Production |

---

### 3.2 Verify API endpoint path in code teaser

**File:** `src/content/docs/index.mdx:23`
**Issue:** The homepage code teaser uses `/v1/translate` but all other docs use
`/v1/medical/translate`. Verify which is the correct production path.

```
curl https://sandbox.tolka-api.fly.dev/v1/translate \
```

**Fix:** If the correct path is `/v1/medical/translate`, update the code teaser.

---

### 3.3 Changelog "Coming Next" references

**File:** `src/content/docs/changelog/index.mdx`
**Issue:** The changelog likely references future features. Verify dates and items
are still accurate before launch.

---

## Priority 4: Pre-go-public checklist (before repo visibility change)

These items are from the plan's Public Transition Checklist and should be completed
before the repo is made public (separate from the site going live):

- [ ] Run `git log --all --diff-filter=A -- '*.env' '*.key' '*.pem' '*.secret'` — confirm no secrets in history
- [ ] Run a secret scanner (`trufflehog` or `gitleaks`) against full history
- [ ] Search history for PHI patterns
- [ ] Verify no internal URLs, Slack links, or employee PII in committed content
- [ ] Enable GitHub security features: Dependabot, secret scanning, code scanning
- [ ] Enable GitHub Discussions and create categories
- [ ] Set `PUBLIC_REPO=true` in Cloudflare Pages variables to enable "Edit on GitHub" links
- [ ] Verify `.gitignore` excludes `WEBSITE_AND_DOCS_PLAN.md` and `SKILL_AND_DOCS_PLAYBOOK.md`
  (currently excluded — confirm they are NOT in git history)

---

## Execution order

```
Week -2 (two weeks before launch):
  1.1  Create OG image
  1.2  Inventory which Tolka domain URLs are live, fix any that aren't
  2.1  Fix or remove the CI TypeScript validation stub
  2.2  Clean up staged file deletions
  3.2  Verify API endpoint path in code teaser

Week -1 (one week before launch):
  1.3  Decide GitHub Discussions strategy, update support.mdx
  3.1  Add "What's next" to compliance and support pages
  3.3  Verify changelog dates

Day -1 (day before launch):
  1.2  Final URL verification pass (all tolka.health, cdn, status URLs)
  4.*  Run full pre-go-public checklist if repo is going public simultaneously
```
