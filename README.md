# Cozy Crochet Gifts

An editorial storefront for downloadable crochet PDF patterns, amigurumi inspiration, handmade gift guides, and curated bundles. Built with Astro, TypeScript, Tailwind CSS 4, Lucide icons, and static JSON/Markdown content.

The project contains no demo products, invented reviews, fake checkout, payment fields, or fabricated customer support details. The public catalog and product routes are generated from published records in the local data files.

## Start locally

Use Node.js 22.23.4 or newer. From this project folder:

    npm install
    npm run dev

For a production build:

    npm run check
    npm run build
    npm run preview

## Business setup before launch

1. Set the real production origin in PUBLIC_SITE_URL. Use the HTTPS site origin only, such as the final pages.dev address or custom domain. Without it, canonical links and the sitemap are omitted, and pages carry noindex metadata.
2. Add the real support email to contactEmail in src/config/site.ts.
3. Add genuine product records and verified Gumroad links to src/data/products.json. The starter file is empty on purpose.
4. Complete and review each legal page. Legal pages are marked as editable drafts and noindex by default.
5. Add real social profile URLs, optional GA4 or Pinterest Tag IDs, and a Search Console verification token only when those accounts and integrations exist.
6. Review the article content, product photography, license terms, and business policies before accepting orders.

## Product management

One record in src/data/products.json creates its product page, shop card, and category placement. Only records with published set to true appear on the site.

Every published product needs:

- A unique id and lowercase slug.
- A real price in USD and a product description.
- A category slug defined in src/data/categories.json.
- At least one genuine product image with accurate alt text and pixel dimensions.
- A real HTTPS Gumroad product URL on gumroad.com or a Gumroad subdomain.
- The exact file format and a list of the files the buyer receives.
- Its publication date.

Skill level, language, materials, finished size, required knowledge, and license summary are optional. They appear only when supplied. A missing value is not presented as a product fact.

An optional compareAtPrice is shown as an original price. Use it only when it reflects a genuine comparison. An optional badge can be new or bestseller; set it only while factually justified and remove it when that claim no longer holds.

Categories are generated only when at least one published product uses that category. Category pages inherit a product image unless a verified category image is supplied in the category record.

## Bundles

Add bundle records to src/data/bundles.json. A published bundle needs a real Gumroad URL, price, cover image, and at least one product id that refers to a published product. The bundle detail page lists the included patterns from those records. No savings claim is calculated or displayed. Product and bundle calls to action use Gumroad's documented checkout overlay with the official product URL as the direct-link fallback: https://gumroad.com/help/article/44-build-gumroad-into-your-website

## Editorial content

Articles live in src/content/blog as Markdown files. Frontmatter is validated by the Astro content collection. Use a real publication date, original useful copy, a relevant category, and an accurate image description. Draft articles are excluded from public pages.

## Store policies and contact

The pages under privacy-policy, terms, refund-policy, digital-product-policy, pattern-license, and disclaimer are editable templates. They intentionally make no unsupported claims about actual data practices, refunds, or usage rights. Replace the prompts with verified terms, review them for the business, and set reviewed=true in each page's LegalPage props before enabling indexing.

The Contact page does not include a non-working form. Add the real support email in src/config/site.ts before making the page indexable.

## Analytics and privacy

No analytics identifier is included. If PUBLIC_GA4_ID or PUBLIC_PINTEREST_TAG_ID is configured, a small consent notice appears. Those tags do not load until the visitor opts in. The Privacy choices button reopens the choice. Outbound Gumroad clicks emit a local browser event and, after consent, a GA4 event and Pinterest InitiateCheckout event without order or payment details. This records a click to checkout, not a completed purchase. PUBLIC_GSC_VERIFICATION adds the Search Console HTML verification meta tag.

Review the real privacy policy and any regional consent requirements before enabling analytics. Pinterest profile links are configured separately and no Pins are published automatically.

## Search, metadata, and images

The shop search, category filtering, and price/newest sorting use a small browser script over statically rendered product cards. The blog has a similarly lightweight search and category filter.

Set PUBLIC_SITE_URL to enable absolute canonical URLs, Open Graph image URLs, the sitemap integration, and a sitemap reference in robots.txt. Product and article structured data is emitted only from supplied product or article data. No ratings, review counts, sales volume, or inventory claims are generated.

The homepage uses responsive 768, 1200, and 1536 pixel JPEG versions of a custom editorial crochet still life. It is a brand illustration, not a photograph of a product for sale. Real pattern photography belongs in product records.

## Cloudflare Pages deployment

This site is statically generated. It does not use the Cloudflare adapter, server functions, a database, or a paid service.

1. Create a GitHub repository and push this project.
2. In Cloudflare, open Workers & Pages, create a Pages project, and connect the GitHub repository.
3. Set the production branch to main.
4. Use the build command npm run build and output directory dist.
5. Set the Node.js version to 22.23.4 or newer in the Cloudflare build environment.
6. Add PUBLIC_SITE_URL using the final HTTPS origin. Add optional analytics, Pinterest Tag, Search Console, and profile variables only after the corresponding accounts and privacy terms are ready.
7. Save and deploy. Cloudflare Pages rebuilds on later pushes to the connected branch.
8. Add a custom domain in Cloudflare after the Pages project has a deployment URL, then update PUBLIC_SITE_URL to that final origin.

Cloudflare's Astro Pages guide documents the Git connection, npm run build command, and dist output folder: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/

Astro's current Tailwind guide uses the Tailwind Vite plugin: https://tailwindcss.com/docs/installation/framework-guides/astro

## Project map

    src/components/       Reusable header, footer, cards, galleries, and policy templates
    src/config/           Site identity and editable contact / integration settings
    src/content/blog/     Markdown articles
    src/data/             Product, category, and bundle JSON
    src/layouts/          Base, product, and editorial layouts
    src/lib/              Product and bundle validation and helpers
    src/pages/             Static routes and data-driven route templates
    src/scripts/           Small catalog and analytics enhancements
    src/styles/            Design tokens and responsive global styles
    public/images/        Optimized brand imagery and editorial illustrations
