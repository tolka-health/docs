import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  return rss({
    title: 'Tolka Changelog',
    description: 'API and SDK release history for the Tolka medical translation platform.',
    site: context.site!,
    items: [
      {
        title: '1.0.0 — Initial public release',
        pubDate: new Date('2026-04-11'),
        description:
          'Initial public release of the Tolka medical translation API and Web SDK. Includes POST /translate, POST /safe-translate, POST /session, admin endpoints, five clinical domains, ten language pairs, and the @tolka/web-sdk with TolkaClient and web components.',
        link: '/changelog/',
      },
    ],
    customData: '<language>en</language>',
  });
}
