import { env } from 'node:process'

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWebFonts,
  presetWind3,
} from 'unocss'

/**
 * Whether the docs are being built with the VoidZero theme.
 * `docs/scripts/run-vitepress-theme.mjs` sets `NOLEBASE_DOCS_THEME` before VitePress loads this config.
 */
const isVoidZeroDocsTheme = env.NOLEBASE_DOCS_THEME === 'voidzero'

export default defineConfig({
  // NOTICE:
  // VoidZero compiles its own Tailwind v4 utilities into `@layer utilities`, while UnoCSS emits unlayered CSS by default.
  // Unlayered rules always beat layered ones, so UnoCSS copies of common classes broke VoidZero in light/dark mode:
  // - `.bg-white` from UnoCSS overrode VoidZero `dark:bg-primary`, leaving a white header with white text in dark mode.
  // - `.hidden` from UnoCSS overrode VoidZero `lg:flex`, hiding the header navigation once VoidZero sources were no longer scanned.
  // For the VoidZero build, UnoCSS output goes into the same layers as Tailwind (`preflights` -> `base`, others -> `utilities`).
  // `virtual:uno.css` is imported before the VoidZero styles, so VoidZero wins on equal-specificity conflicts by source order.
  // Layer order is pinned in `docs/.vitepress/theme/styles/voidzero-layers.css`.
  // Source: `@voidzero-dev/vitepress-theme/src/styles/tokens.css` (`@import "tailwindcss"`), `@unocss/core` `outputToCssLayers`.
  // Removal condition: UnoCSS is no longer loaded alongside the VoidZero theme.
  ...(isVoidZeroDocsTheme
    ? {
        outputToCssLayers: {
          cssLayerName: (layer: string) => layer === 'preflights' ? 'base' : 'utilities',
        },
      }
    : {}),
  content: {
    pipeline: {
      // VoidZero ships the utilities its components use, so UnoCSS does not need to generate them again.
      // `@unocss/vite` `defaultPipelineInclude` matches every `.vue` file, including ones under `node_modules`.
      // Setting `exclude` replaces `defaultPipelineExclude`, so its CSS file pattern is kept here.
      exclude: [/\.(css|postcss|sass|scss|less|stylus|styl)($|\?)/, /@voidzero-dev[\\/]vitepress-theme/],
    },
  },
  shortcuts: [],
  presets: [
    presetWind3({
      dark: 'class',
    }),
    presetAttributify(),
    presetIcons({
      prefix: 'i-',
      scale: 1.2, // size: 1.2 rem
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
        'min-width': '1.2rem',
      },
    }),
    presetWebFonts({
      fonts: {
        'chakra-petch': ['Chakra Petch'],
        'baloo-2': [
          {
            name: 'Baloo 2',
          },
          {
            name: 'Noto Sans',
          },
          {
            name: 'Roboto',
          },
          {
            name: 'sans-serif',
            provider: 'none',
          },
        ],
        'jura': ['Jura'],
      },
      timeouts: {
        failure: 10000,
        warning: 10000,
      },
    }),
  ],
})
