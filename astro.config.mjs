import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const publicSiteUrl = process.env.PUBLIC_SITE_URL;

export default defineConfig({
  ...(publicSiteUrl ? { site: publicSiteUrl } : {}),
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: publicSiteUrl
    ? [
        sitemap({
          filter: (page) =>
            !/\/(privacy-policy|terms|refund-policy|digital-product-policy|pattern-license|disclaimer)\/?$/.test(
              new URL(page).pathname,
            ),
        }),
      ]
    : [],
  vite: {
    plugins: [tailwindcss()],
  },
});