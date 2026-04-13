import { defineConfig, envField, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";
import mermaid from "astro-mermaid";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
    mermaid({
      theme: "base",
      autoTheme: false,
      mermaidConfig: {
        // Align mermaid colors with site theme in src/styles/global.css
        themeVariables: {
          // Typography
          fontFamily: "var(--font-app), ui-sans-serif, system-ui, sans-serif",
          fontSize: "16px",
          clusterLabelFontSize: "20px",

          // Base palette (dark theme)
          mainBkg: "#353640", // --background
          textColor: "#e9edf1", // --foreground
          titleColor: "#e9edf1", // --foreground

          // Nodes
          primaryColor: "#4b4c59", // slightly lighter than --background for contrast
          primaryTextColor: "#e9edf1", // --foreground
          primaryBorderColor: "#86436b", // --border

          secondaryColor: "#353640", // --background
          secondaryTextColor: "#e9edf1",
          secondaryBorderColor: "#715566", // --muted

          tertiaryColor: "#2b2c35", // darker accent of background
          tertiaryTextColor: "#e9edf1",
          tertiaryBorderColor: "#715566",

          nodeTextColor: "#e9edf1",
          nodeBorder: "#86436b", // --border

          // Edges & labels
          lineColor: "#715566", // --muted
          edgeLabelBackground: "#4b4c59", // card-like bg

          // Clusters
          clusterBkg: "#353640",
          clusterBorder: "#86436b", // --border
        },
      },
    }),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      theme: "one-dark-pro",
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    // eslint-disable-next-line
    // @ts-ignore
    // This will be fixed in Astro 6 with Vite 7 support
    // See: https://github.com/withastro/astro/issues/14030
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    preserveScriptOrder: true,
    fonts: [
      {
        name: "Google Sans Code",
        cssVariable: "--font-google-sans-code",
        provider: fontProviders.google(),
        fallbacks: ["monospace"],
        weights: [300, 400, 500, 600, 700],
        styles: ["normal", "italic"],
      },
    ],
  },
});
