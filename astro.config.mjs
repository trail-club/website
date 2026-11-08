// @ts-check
import { defineConfig } from "astro/config";

// The site is served from the custom domain via GitHub Pages.
export default defineConfig({
  site: "https://trail-club.jp",
  base: "/",
  trailingSlash: "ignore",
});
