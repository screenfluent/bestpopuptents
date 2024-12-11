import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  integrations: [tailwind()],
  output: "server",
  adapter: cloudflare(),
  trailingSlash: "never",
  build: {
    format: "directory",
  },
  server: {
    headers: {
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  },
});
