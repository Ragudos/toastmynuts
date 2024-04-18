import { defineConfig } from "astro/config";
import react from "@astrojs/react";
export const defaultLocale = "en";


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