# Tolka Developer Documentation

[![CI](https://github.com/tolka-health/docs/actions/workflows/ci.yml/badge.svg)](https://github.com/tolka-health/docs/actions/workflows/ci.yml)
[![Deploy](https://github.com/tolka-health/docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/tolka-health/docs/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-teal.svg)](./LICENSE)

Source for **[docs.tolka.health](https://docs.tolka.health)** — developer documentation for the [Tolka medical translation API](https://tolka.health).

Built with [Starlight](https://starlight.astro.build) (Astro 5) · Hosted on [Cloudflare Pages](https://pages.cloudflare.com)

---

## Local development

**Requirements:** Node.js >= 20, pnpm >= 9

```bash
pnpm install        # install deps + activate pre-commit hook
pnpm dev            # dev server → http://localhost:4321
pnpm build          # production build → ./dist
pnpm preview        # serve production build locally
pnpm check          # TypeScript type check
pnpm lint:prose     # Vale prose lint
pnpm lint:links     # lychee offline link check
```

## Project structure

```
src/content/docs/          MDX content (mirrors URL paths)
├── getting-started/       Quickstart, auth, environments, rate limits
├── concepts/              Pipeline, confidence, domains, sessions, privacy
├── api-reference/         Endpoint guides, error catalog, interactive reference
├── sdks/web/              Web SDK docs
├── guides/                Integration guides, clinical scenarios
├── about/                 Pricing, compliance, support, status
└── changelog/             Release changelog
src/components/            Custom Astro components
src/styles/custom.css      Brand overrides (teal/amber palette)
public/openapi/            Synced OpenAPI spec (do not edit manually)
public/_redirects          Cloudflare Pages redirect rules
.github/workflows/         CI, deploy, OpenAPI sync
.hooks/                    Pre-commit PHI/PII/IP guard
```

## CI / CD

| Event | Workflow | What happens |
|-------|----------|-------------|
| Pull request | `ci.yml` | Build, type check, OpenAPI lint, link check, PHI lint, API key scan |
| Push to `main` | `deploy.yml` | Build + deploy to Cloudflare Pages |
| API release | `openapi-sync.yml` | Validate + open PR with updated spec |

Preview deployments are created automatically for every PR.

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for full deployment details, secrets setup, and rollback procedures.

## Pre-commit hook

A git pre-commit hook scans staged files for PHI, PII, production API keys, business IP leakage, and local filesystem paths. It activates automatically on `pnpm install`. See [.hooks/pre-commit](./.hooks/pre-commit).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Read the Privacy & IP Protection rules before submitting a PR.

## Documentation

| Document | Purpose |
|----------|---------|
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guide, content conventions, privacy rules |
| [CLAUDE.md](./CLAUDE.md) | Claude Code guidance for AI-assisted development |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Deployment architecture, CI/CD, rollback |
| [docs/PRE_RELEASE_PLAN.md](./docs/PRE_RELEASE_PLAN.md) | Pre-release checklist and open items |

## License

Apache 2.0 — see [LICENSE](./LICENSE).
The Tolka API and core platform are proprietary. See [tolka.health/legal/terms](https://tolka.health/legal/terms).
