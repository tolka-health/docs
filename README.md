# Tolka Developer Documentation

[![Deploy](https://github.com/tolka-health/docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/tolka-health/docs/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-teal.svg)](./LICENSE)

Source for **[docs.tolka.health](https://docs.tolka.health)** — developer documentation for the [Tolka medical translation API](https://tolka.health).

Built with [Starlight](https://starlight.astro.build) · Hosted on [Cloudflare Pages](https://pages.cloudflare.com)

---

## Local development

**Requirements:** Node.js ≥ 20, pnpm ≥ 9

```bash
pnpm install
pnpm dev        # → http://localhost:4321
pnpm build      # production build → ./dist
pnpm preview    # preview production build
```

## Structure

```
src/content/docs/          # All MDX content (mirrors URL paths)
├── getting-started/
├── concepts/
├── api-reference/
├── sdks/web/
├── guides/
├── about/
└── changelog/
src/components/            # Custom Astro components
src/styles/custom.css      # Brand overrides
public/openapi/            # Synced OpenAPI spec (do not edit manually)
public/_redirects          # Cloudflare Pages redirect rules
.github/workflows/         # CI, deploy, OpenAPI sync
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Read the Privacy & IP Protection rules before submitting a PR.

## License

Apache 2.0 — see [LICENSE](./LICENSE).  
The Tolka API and core platform are proprietary. See [tolka.health/legal/terms](https://tolka.health/legal/terms).
