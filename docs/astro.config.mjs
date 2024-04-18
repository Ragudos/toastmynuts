import react from "@astrojs/react";
import { defineConfig } from "astro/config";

const defaultLocale = "en";

// https://astro.build/config
export default defineConfig({
  site: "https://Ragudos.github.io/toastmynuts",
  base: "toastmynuts",
  i18n: {
    locales: ["en"],
    defaultLocale
  },
  integrations: [react()]
});