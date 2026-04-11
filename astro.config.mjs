import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const PUBLIC_REPO = process.env.PUBLIC_REPO === 'true';

export default defineConfig({
  site: 'https://docs.tolka.health',
  integrations: [
    starlight({
      title: 'Tolka Docs',
      description:
        'Developer documentation for the Tolka medical translation API. Zero PHI storage · EU-only deployment · Back-translation verified.',
      logo: {
        src: './src/assets/tolka-logo.svg',
        replacesTitle: false,
      },
      social: {
        github: 'https://github.com/tolka-health/docs',
      },
      ...(PUBLIC_REPO && {
        editLink: {
          baseUrl: 'https://github.com/tolka-health/docs/edit/main/',
        },
      }),
      lastUpdated: true,
      customCss: ['./src/styles/custom.css'],
      head: [
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://docs.tolka.health/og-image.png',
          },
        },
        {
          tag: 'meta',
          attrs: { name: 'theme-color', content: '#0D9488' },
        },
        // ── Fonts ──
        {
          tag: 'link',
          attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: 'anonymous',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=JetBrains+Mono:wght@400;500&display=swap',
          },
        },
        // ── TOC drawer toggle ──
        {
          tag: 'script',
          content: `
            document.addEventListener('DOMContentLoaded', () => {
              var html = document.documentElement;
              if (!html.hasAttribute('data-has-toc')) return;

              var tocBtn = document.createElement('button');
              tocBtn.className = 'toc-toggle';
              tocBtn.setAttribute('aria-label', 'Toggle table of contents');
              tocBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>';
              document.body.appendChild(tocBtn);

              var tocBackdrop = document.createElement('div');
              tocBackdrop.className = 'toc-backdrop';
              document.body.appendChild(tocBackdrop);

              function toggleToc() {
                html.classList.toggle('toc-open');
              }
              tocBtn.addEventListener('click', toggleToc);
              tocBackdrop.addEventListener('click', toggleToc);
            });
          `,
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          collapsed: false,
          items: [
            { label: 'Quickstart', slug: 'getting-started/quickstart' },
            {
              label: 'Understanding the Response',
              slug: 'getting-started/understanding-the-response',
            },
            { label: 'Authentication', slug: 'getting-started/authentication' },
            { label: 'Environments', slug: 'getting-started/environments' },
            { label: 'Rate Limits', slug: 'getting-started/rate-limits' },
            {
              label: 'Going to Production',
              slug: 'getting-started/going-to-production',
            },
          ],
        },
        {
          label: 'Concepts',
          collapsed: true,
          items: [
            {
              label: 'Translation Pipeline',
              slug: 'concepts/translation-pipeline',
            },
            {
              label: 'Confidence & Risk',
              slug: 'concepts/confidence-and-risk',
            },
            { label: 'Clinical Domains', slug: 'concepts/clinical-domains' },
            { label: 'Safe Mode', slug: 'concepts/safe-mode' },
            { label: 'Sessions', slug: 'concepts/sessions' },
            {
              label: 'Privacy Architecture',
              slug: 'concepts/privacy-architecture',
            },
          ],
        },
        {
          label: 'API Reference',
          collapsed: true,
          items: [
            {
              label: 'Interactive Reference',
              slug: 'api-reference',
              attrs: { class: 'api-reference-link' },
            },
            {
              label: 'POST /translate',
              slug: 'api-reference/translate',
            },
            {
              label: 'POST /safe-translate',
              slug: 'api-reference/safe-translate',
            },
            { label: 'POST /session', slug: 'api-reference/sessions' },
            { label: 'Admin: Keys', slug: 'api-reference/admin-keys' },
            { label: 'Admin: Usage', slug: 'api-reference/usage' },
            { label: 'Error Catalog', slug: 'api-reference/errors' },
            { label: 'Headers', slug: 'api-reference/headers' },
          ],
        },
        {
          label: 'Web SDK',
          collapsed: true,
          items: [
            { label: 'Installation', slug: 'sdks/web/installation' },
            { label: 'TolkaClient', slug: 'sdks/web/tolka-client' },
            { label: 'Web Components', slug: 'sdks/web/web-components' },
            { label: 'Styling', slug: 'sdks/web/styling' },
            { label: 'Localization', slug: 'sdks/web/localization' },
            { label: 'Error Handling', slug: 'sdks/web/error-handling' },
          ],
        },
        {
          label: 'Mobile SDKs',
          collapsed: true,
          items: [
            { label: 'Android (Coming Soon)', slug: 'sdks/android' },
            { label: 'iOS (Coming Soon)', slug: 'sdks/ios' },
          ],
        },
        {
          label: 'Guides',
          collapsed: true,
          items: [
            { label: 'First Integration', slug: 'guides/first-integration' },
            {
              label: 'Migrate from Google Translate',
              slug: 'guides/migrating-from-google-translate',
            },
            {
              label: 'Emergency Department',
              slug: 'guides/emergency-department',
            },
            { label: 'GP Consultation', slug: 'guides/gp-consultation' },
            {
              label: 'Telehealth Integration',
              slug: 'guides/telehealth-integration',
            },
            { label: 'Handling Refusals', slug: 'guides/handling-refusals' },
            { label: 'Key Rotation', slug: 'guides/key-rotation' },
            { label: 'Monitoring Quality', slug: 'guides/monitoring-quality' },
          ],
        },
        {
          label: 'About',
          collapsed: true,
          items: [
            { label: 'Pricing', slug: 'about/pricing' },
            { label: 'Compliance', slug: 'about/compliance' },
            { label: 'Support', slug: 'about/support' },
            { label: 'Status', slug: 'about/status' },
            { label: 'Open Source', slug: 'about/open-source' },
          ],
        },
        {
          label: 'Changelog',
          slug: 'changelog',
        },
      ],
    }),
  ],
});

