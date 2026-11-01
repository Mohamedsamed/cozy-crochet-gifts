/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_PINTEREST_TAG_ID?: string;
  readonly PUBLIC_GSC_VERIFICATION?: string;
  readonly PUBLIC_PINTEREST_PROFILE?: string;
  readonly PUBLIC_INSTAGRAM_PROFILE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}